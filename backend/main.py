"""
FastAPI backend for RAG Chatbot with OpenAI Assistants API integration.
"""
import os
import json
from datetime import datetime
from typing import Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncpg
from qdrant_client import QdrantClient
from openai import OpenAI, AssistantEventHandler
import logging

from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
# ✅ FIX 1: Variable name updated to match Hugging Face Secret (DATABASE_URL)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
NEON_DATABASE_URL = os.getenv("DATABASE_URL") 
COLLECTION_NAME = "book-embeddings"
ASSISTANT_ID = os.getenv("ASSISTANT_ID")
# ✅ FIX 2: Auth Server URL ab Environment se aayega (Secure)
AUTH_SERVER_URL = os.getenv("BETTER_AUTH_URL", "http://localhost:4000")

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global clients
qdrant_client: Optional[QdrantClient] = None
openai_client: Optional[OpenAI] = None
db_pool: Optional[asyncpg.Pool] = None


# Pydantic Models
class ChatRequest(BaseModel):
    query: str
    conversation_id: Optional[str] = None
    user_id: Optional[str] = None


class SelectionRequest(BaseModel):
    selected_text: str
    conversation_id: Optional[str] = None
    user_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    sources: list
    conversation_id: str


class HealthResponse(BaseModel):
    status: str
    qdrant: bool
    database: bool
    openai: bool


# Startup and Shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage app lifecycle."""
    # Startup
    try:
        global qdrant_client, openai_client, db_pool

        # Initialize Qdrant client
        qdrant_client = QdrantClient(
            url=QDRANT_URL,
            api_key=QDRANT_API_KEY,
        )
        logger.info("✓ Connected to Qdrant")

        # Initialize OpenAI client
        openai_client = OpenAI(api_key=OPENAI_API_KEY)
        logger.info("✓ Connected to OpenAI")

        # Initialize database pool
        # ✅ Added ssl="require" for Neon DB security
        db_pool = await asyncpg.create_pool(
            NEON_DATABASE_URL,
            min_size=5,
            max_size=20,
            ssl="require" 
        )
        logger.info("✓ Connected to Neon Postgres")

        # Create tables if they don't exist
        async with db_pool.acquire() as conn:
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS conversations (
                    id TEXT PRIMARY KEY,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS messages (
                    id SERIAL PRIMARY KEY,
                    conversation_id TEXT NOT NULL,
                    role TEXT NOT NULL,
                    content TEXT NOT NULL,
                    sources TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
                );
            """)
            logger.info("✓ Database tables ready")

    except Exception as e:
        logger.error(f"Failed to initialize app: {e}")
        raise

    yield

    # Shutdown
    if db_pool:
        await db_pool.close()
        logger.info("✓ Closed database pool")


# Create FastAPI app
app = FastAPI(title="RAG Chatbot API", lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Utility functions
async def get_or_create_conversation(conversation_id: Optional[str] = None) -> str:
    """Get or create a conversation."""
    if conversation_id:
        async with db_pool.acquire() as conn:
            exists = await conn.fetchval(
                "SELECT id FROM conversations WHERE id = $1",
                conversation_id,
            )
            if exists:
                return conversation_id

    # Create new conversation
    import uuid
    new_id = str(uuid.uuid4())
    async with db_pool.acquire() as conn:
        await conn.execute(
            "INSERT INTO conversations (id) VALUES ($1)",
            new_id,
        )
    return new_id


async def get_user_background(user_id: Optional[str]) -> dict:
    """Fetch user's software and hardware background."""
    if not user_id:
        return {"software": "", "hardware": ""}

    try:
        # ✅ FIX: Using Dynamic URL instead of Localhost
        # AUTH_SERVER_URL is now loaded from top config
        
        # Note: In a real microservice setup, you'd fetch from API, 
        # but since we share the DB, we can query directly:
        
        async with db_pool.acquire() as conn:
            result = await conn.fetchrow(
                'SELECT software_background, hardware_background FROM "user" WHERE id = $1',
                user_id
            )
            if result:
                return {
                    "software": result.get("software_background", ""),
                    "hardware": result.get("hardware_background", "")
                }
    except Exception as e:
        logger.error(f"Error fetching user background: {e}")

    return {"software": "", "hardware": ""}


async def search_qdrant(query: str, top_k: int = 5) -> list:
    """Search for relevant documents in Qdrant."""
    try:
        # Generate query embedding
        embedding_response = openai_client.embeddings.create(
            model="text-embedding-3-small",
            input=query,
        )
        query_embedding = embedding_response.data[0].embedding

        # Search Qdrant
        search_results = qdrant_client.search(
            collection_name=COLLECTION_NAME,
            query_vector=query_embedding,
            limit=top_k,
            score_threshold=0.5,
        )

        sources = []
        for result in search_results:
            sources.append({
                "filename": result.payload.get("filename"),
                "chunk_index": result.payload.get("chunk_index"),
                "score": result.score,
            })

        return sources, [result.payload.get("chunk") for result in search_results]

    except Exception as e:
        logger.error(f"Error searching Qdrant: {e}")
        return [], []


async def save_message(
    conversation_id: str,
    role: str,
    content: str,
    sources: Optional[list] = None,
):
    """Save message to database."""
    try:
        async with db_pool.acquire() as conn:
            await conn.execute(
                """
                INSERT INTO messages (conversation_id, role, content, sources)
                VALUES ($1, $2, $3, $4)
                """,
                conversation_id,
                role,
                content,
                json.dumps(sources) if sources else None,
            )
    except Exception as e:
        logger.error(f"Error saving message: {e}")


# Routes
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    qdrant_ok = False
    db_ok = False
    openai_ok = False

    try:
        qdrant_client.get_collection(COLLECTION_NAME)
        qdrant_ok = True
    except:
        pass

    try:
        async with db_pool.acquire() as conn:
            await conn.fetchval("SELECT 1")
            db_ok = True
    except:
        pass

    try:
        openai_client.models.list()
        openai_ok = True
    except:
        pass

    return HealthResponse(
        status="healthy" if all([qdrant_ok, db_ok, openai_ok]) else "degraded",
        qdrant=qdrant_ok,
        database=db_ok,
        openai=openai_ok,
    )


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Main chat endpoint with RAG."""
    try:
        # Validate input
        if not request.query or len(request.query.strip()) == 0:
            raise HTTPException(status_code=400, detail="Query cannot be empty")

        # Get or create conversation
        conversation_id = await get_or_create_conversation(request.conversation_id)

        # Search for relevant documents
        sources, context_chunks = await search_qdrant(request.query)

        if not context_chunks:
            return ChatResponse(
                response="I couldn't find relevant information in the book to answer your question. Please try rephrasing your question.",
                sources=[],
                conversation_id=conversation_id,
            )

        # Prepare context
        context = "\n\n".join(context_chunks)

        # Get user background for personalization
        user_background = await get_user_background(request.user_id)

        # Build personalized system message
        system_message = """You are a helpful assistant for a Physical AI robotics book.
        Use the provided book excerpts to answer questions accurately and helpfully.
        If the answer is not in the provided context, say so clearly.
        Keep responses concise and educational."""

        # Add personalization if user background is available
        if user_background["software"] or user_background["hardware"]:
            system_message += f"\n\nUser's Background:\n- Software: {user_background['software']}\n- Hardware: {user_background['hardware']}\nTailor explanations to match the user's experience level."

        user_message = f"""Based on this book excerpt:

{context}

Please answer this question: {request.query}"""

        # Call OpenAI API
        response = openai_client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message},
            ],
            max_tokens=1000,
            temperature=0.7,
        )

        assistant_response = response.choices[0].message.content

        # Save messages to database
        await save_message(conversation_id, "user", request.query, sources)
        await save_message(conversation_id, "assistant", assistant_response, sources)

        return ChatResponse(
            response=assistant_response,
            sources=sources,
            conversation_id=conversation_id,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ask-selection", response_model=ChatResponse)
async def ask_selection(request: SelectionRequest):
    """Endpoint for explaining selected text from the book."""
    try:
        # Validate input
        if not request.selected_text or len(request.selected_text.strip()) == 0:
            raise HTTPException(status_code=400, detail="Selected text cannot be empty")

        # Get or create conversation
        conversation_id = await get_or_create_conversation(request.conversation_id)

        # Get user background for personalization
        user_background = await get_user_background(request.user_id)

        # System message for explanation
        system_message = """You are a helpful assistant for a Physical AI robotics book.
        Your task is to explain the selected text from the book clearly and concisely.
        Provide educational context and examples where relevant.
        Keep the explanation accessible but thorough."""

        # Add personalization if user background is available
        if user_background["software"] or user_background["hardware"]:
            system_message += f"\n\nUser's Background:\n- Software: {user_background['software']}\n- Hardware: {user_background['hardware']}\nTailor your explanation to match the user's experience level."

        user_message = f"""Please explain this text from the Physical AI book:

"{request.selected_text}"

Provide a clear, educational explanation."""

        # Call OpenAI API
        response = openai_client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message},
            ],
            max_tokens=800,
            temperature=0.7,
        )

        explanation = response.choices[0].message.content

        # Save messages to database
        await save_message(
            conversation_id,
            "user",
            f"[Selected Text] {request.selected_text}",
            [],
        )
        await save_message(conversation_id, "assistant", explanation, [])

        return ChatResponse(
            response=explanation,
            sources=[],
            conversation_id=conversation_id,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in ask-selection endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/conversations/{conversation_id}")
async def get_conversation(conversation_id: str):
    """Get conversation history."""
    try:
        async with db_pool.acquire() as conn:
            messages = await conn.fetch(
                """
                SELECT role, content, sources, created_at
                FROM messages
                WHERE conversation_id = $1
                ORDER BY created_at ASC
                """,
                conversation_id,
            )

        if not messages:
            raise HTTPException(status_code=404, detail="Conversation not found")

        return {
            "conversation_id": conversation_id,
            "messages": [
                {
                    "role": record["role"],
                    "content": record["content"],
                    "sources": json.loads(record["sources"]) if record["sources"] else [],
                    "created_at": record["created_at"].isoformat(),
                }
                for record in messages
            ],
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching conversation: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "RAG Chatbot API is running",
        "docs": "/docs",
        "health": "/health",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
    )