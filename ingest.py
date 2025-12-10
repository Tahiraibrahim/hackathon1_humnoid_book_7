"""
Ingest script for loading Markdown documents and storing embeddings in Qdrant.
"""
import os
import sys
from pathlib import Path
from typing import List
import hashlib
from dotenv import load_dotenv

from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from openai import OpenAI

# Load environment variables
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
DOCS_PATH = os.getenv("DOCS_PATH", "physical-ai-book/docs")
COLLECTION_NAME = "book-embeddings"


def load_markdown_files(docs_path: str) -> List[dict]:
    """Load all markdown files from the docs directory."""
    documents = []
    docs_dir = Path(docs_path)

    if not docs_dir.exists():
        print(f"Error: Docs path does not exist: {docs_path}")
        sys.exit(1)

    for file_path in docs_dir.rglob("*.md*"):
        if file_path.is_file():
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                    # Extract filename and relative path for metadata
                    rel_path = file_path.relative_to(docs_dir)
                    documents.append({
                        "filename": str(rel_path),
                        "path": str(file_path),
                        "content": content,
                    })
                    print(f"✓ Loaded: {rel_path}")
            except Exception as e:
                print(f"✗ Failed to load {file_path}: {e}")

    print(f"\nTotal documents loaded: {len(documents)}")
    return documents


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    """Split text into overlapping chunks."""
    words = text.split()
    chunks = []

    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i : i + chunk_size])
        if chunk.strip():
            chunks.append(chunk)

    return chunks


def generate_embeddings(client: OpenAI, texts: List[str]) -> List[List[float]]:
    """Generate embeddings using OpenAI API."""
    try:
        response = client.embeddings.create(
            model="text-embedding-3-small",
            input=texts,
        )
        return [item.embedding for item in response.data]
    except Exception as e:
        print(f"Error generating embeddings: {e}")
        raise


def create_qdrant_collection(client: QdrantClient):
    """Create or recreate the Qdrant collection."""
    try:
        # Try to delete existing collection
        try:
            client.delete_collection(COLLECTION_NAME)
            print(f"Deleted existing collection: {COLLECTION_NAME}")
        except:
            pass

        # Create new collection
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
        )
        print(f"✓ Created collection: {COLLECTION_NAME}")
    except Exception as e:
        print(f"Error creating collection: {e}")
        raise


def upsert_embeddings(client: QdrantClient, points: List[PointStruct]):
    """Upsert vectors and metadata to Qdrant."""
    try:
        client.upsert(
            collection_name=COLLECTION_NAME,
            points=points,
        )
        print(f"✓ Upserted {len(points)} vectors to Qdrant")
    except Exception as e:
        print(f"Error upserting vectors: {e}")
        raise


def ingest():
    """Main ingestion pipeline."""
    print("=" * 60)
    print("RAG Document Ingestion Pipeline")
    print("=" * 60)

    # Initialize clients
    openai_client = OpenAI(api_key=OPENAI_API_KEY)
    qdrant_client = QdrantClient(
        url=QDRANT_URL,
        api_key=QDRANT_API_KEY,
    )

    print("\n[1/4] Loading documents...")
    documents = load_markdown_files(DOCS_PATH)

    if not documents:
        print("No documents found. Exiting.")
        sys.exit(1)

    print("\n[2/4] Chunking documents...")
    chunks = []
    chunk_metadata = []

    for doc in documents:
        doc_chunks = chunk_text(doc["content"], chunk_size=500, overlap=50)
        for i, chunk in enumerate(doc_chunks):
            chunks.append(chunk)
            chunk_metadata.append({
                "filename": doc["filename"],
                "chunk_index": i,
                "total_chunks": len(doc_chunks),
            })

    print(f"Total chunks created: {len(chunks)}")

    print("\n[3/4] Generating embeddings...")
    # Batch process embeddings (OpenAI recommends batching for efficiency)
    batch_size = 10
    embeddings = []

    for i in range(0, len(chunks), batch_size):
        batch = chunks[i : i + batch_size]
        batch_embeddings = generate_embeddings(openai_client, batch)
        embeddings.extend(batch_embeddings)
        print(f"Processed batch {i // batch_size + 1}/{(len(chunks) + batch_size - 1) // batch_size}")

    print(f"Total embeddings generated: {len(embeddings)}")

    print("\n[4/4] Upserting to Qdrant...")
    create_qdrant_collection(qdrant_client)

    # Create points for Qdrant
    points = []
    for idx, (chunk, embedding, metadata) in enumerate(zip(chunks, embeddings, chunk_metadata)):
        # Generate unique ID based on filename and chunk index
        unique_str = f"{metadata['filename']}_{metadata['chunk_index']}"
        point_id = int(hashlib.md5(unique_str.encode()).hexdigest(), 16) % (2**31)

        point = PointStruct(
            id=point_id,
            vector=embedding,
            payload={
                "chunk": chunk,
                "filename": metadata["filename"],
                "chunk_index": metadata["chunk_index"],
                "total_chunks": metadata["total_chunks"],
            },
        )
        points.append(point)

    upsert_embeddings(qdrant_client, points)

    print("\n" + "=" * 60)
    print("✓ Ingestion completed successfully!")
    print("=" * 60)


if __name__ == "__main__":
    ingest()
