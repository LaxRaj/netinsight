import os
from dotenv import load_dotenv
from pymongo import MongoClient, errors

load_dotenv()  # reads MONGO_URI from .env

MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017")

client: MongoClient
db = None

def init_db():
    global client, db
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
        db = client.netinsight      # your database name
        db.traffic.create_index("timestamp")
        print("✅ Connected to MongoDB")
    except errors.ServerSelectionTimeoutError as e:
        print(f"⚠️  Could not connect to MongoDB: {e}")
