# backend/app/db.py
import os
from dotenv import load_dotenv
from pymongo import MongoClient, errors

# Load .env if present
load_dotenv()

# Default to local Mongo; override with MONGO_URI in your env
MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017")

client = None
db = None

def init_db():
    global client, db
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
        db = client.netinsight
        # Ensure an index on timestamp for faster queries
        db.traffic.create_index("timestamp")
        print("✅ Connected to MongoDB")
    except errors.ServerSelectionTimeoutError as e:
        print(f"⚠️ Could not connect to MongoDB: {e}")
