#!/usr/bin/env python3
"""
Setup helper script for RAG Chatbot
Provides interactive environment variable configuration
"""
import os
import sys
from pathlib import Path

def check_env_file():
    """Check if .env file exists"""
    env_path = Path(".env")
    if env_path.exists():
        print("✓ .env file already exists")
        return True
    else:
        print("✗ .env file not found")
        return False

def create_env_from_template():
    """Create .env from .env.example"""
    template_path = Path(".env.example")
    env_path = Path(".env")

    if not template_path.exists():
        print("✗ .env.example not found")
        return False

    if env_path.exists():
        print("✓ .env already exists, skipping")
        return True

    try:
        env_path.write_text(template_path.read_text())
        print(f"✓ Created .env from .env.example")
        return True
    except Exception as e:
        print(f"✗ Failed to create .env: {e}")
        return False

def check_dependencies():
    """Check if required dependencies are installed"""
    print("\n[Checking Python Dependencies]")

    required = ["fastapi", "uvicorn", "qdrant_client", "openai", "psycopg2", "asyncpg", "dotenv"]
    missing = []

    for package in required:
        try:
            __import__(package.replace("-", "_"))
            print(f"  ✓ {package}")
        except ImportError:
            print(f"  ✗ {package} - MISSING")
            missing.append(package)

    if missing:
        print(f"\n⚠️  Run: pip install -r requirements.txt")
        return False

    print("\n✓ All dependencies installed")
    return True

def check_nodejs():
    """Check if Node.js and npm are installed"""
    print("\n[Checking Node.js]")

    try:
        import subprocess
        result = subprocess.run(["node", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"  ✓ Node.js: {result.stdout.strip()}")
        else:
            print("  ✗ Node.js not found")
            return False

        result = subprocess.run(["npm", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"  ✓ npm: {result.stdout.strip()}")
        else:
            print("  ✗ npm not found")
            return False

        return True
    except Exception as e:
        print(f"  ✗ Error checking Node.js: {e}")
        return False

def validate_env_vars():
    """Check if required environment variables are set"""
    print("\n[Checking Environment Variables]")

    required_vars = {
        "OPENAI_API_KEY": "OpenAI API key",
        "QDRANT_URL": "Qdrant Cloud URL",
        "QDRANT_API_KEY": "Qdrant API key",
        "NEON_DATABASE_URL": "Neon Postgres connection string",
    }

    from dotenv import load_dotenv
    load_dotenv()

    missing = []
    for var, description in required_vars.items():
        value = os.getenv(var)
        if value and value != "..." and not value.startswith("sk_test_"):
            print(f"  ✓ {var} (set)")
        else:
            print(f"  ✗ {var} - MISSING or invalid")
            missing.append(var)

    if missing:
        print(f"\n⚠️  Please set these in .env:")
        for var in missing:
            print(f"   - {var}")
        return False

    print("\n✓ All required variables set")
    return True

def check_folder_structure():
    """Check if required folders exist"""
    print("\n[Checking Folder Structure]")

    required_folders = [
        "physical-ai-book",
        "physical-ai-book/docs",
        "physical-ai-book/src",
        "backend",
    ]

    all_exist = True
    for folder in required_folders:
        if Path(folder).exists():
            print(f"  ✓ {folder}")
        else:
            print(f"  ✗ {folder} - MISSING")
            all_exist = False

    return all_exist

def run_health_check():
    """Test connection to external services"""
    print("\n[Testing External Services]")

    from dotenv import load_dotenv
    load_dotenv()

    # Test OpenAI
    try:
        from openai import OpenAI
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        client.models.list()
        print("  ✓ OpenAI API connection")
    except Exception as e:
        print(f"  ✗ OpenAI API: {str(e)[:50]}...")

    # Test Qdrant
    try:
        from qdrant_client import QdrantClient
        client = QdrantClient(
            url=os.getenv("QDRANT_URL"),
            api_key=os.getenv("QDRANT_API_KEY"),
        )
        client.get_collections()
        print("  ✓ Qdrant Cloud connection")
    except Exception as e:
        print(f"  ✗ Qdrant: {str(e)[:50]}...")

    # Test Neon
    try:
        import asyncpg
        import asyncio

        async def test_neon():
            try:
                conn = await asyncpg.connect(os.getenv("NEON_DATABASE_URL"))
                await conn.close()
                return True
            except:
                return False

        if asyncio.run(test_neon()):
            print("  ✓ Neon Postgres connection")
        else:
            print("  ✗ Neon Postgres connection failed")
    except Exception as e:
        print(f"  ✗ Neon: {str(e)[:50]}...")

def main():
    """Run setup checks"""
    print("=" * 60)
    print("RAG Chatbot - Setup Verification")
    print("=" * 60)

    # Check folder structure
    if not check_folder_structure():
        print("\n✗ Missing required folders. Please ensure you're in the right directory.")
        sys.exit(1)

    # Create .env if needed
    if not check_env_file():
        if create_env_from_template():
            print("\n⚠️  Please edit .env with your API credentials")
        else:
            sys.exit(1)

    # Check Node.js
    check_nodejs()

    # Check Python dependencies
    if not check_dependencies():
        print("\n✗ Install Python dependencies first: pip install -r requirements.txt")
        sys.exit(1)

    # Validate environment variables
    try:
        if not validate_env_vars():
            print("\n✗ Please configure your API keys in .env before proceeding")
            sys.exit(1)
    except Exception as e:
        print(f"\n✗ Error validating environment: {e}")
        sys.exit(1)

    # Test external services
    run_health_check()

    print("\n" + "=" * 60)
    print("✓ Setup verification complete!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Run: python ingest.py")
    print("2. Run: cd backend && python -m uvicorn main:app --reload")
    print("3. Run: cd physical-ai-book && npm start")
    print("\nSee RAG_CHATBOT_SETUP.md for detailed instructions.")

if __name__ == "__main__":
    main()
