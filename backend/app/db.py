import os
from dotenv import load_dotenv
from pymongo import MongoClient, errors
import certifi  # ← new import

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017")

client = None
db = None

def init_db():
    global client, db
    try:
        client = MongoClient(
            MONGO_URI,
            tls=True,                           # enable TLS
            tlsCAFile=certifi.where(),         # use certifi’s bundle
            serverSelectionTimeoutMS=2000
        )
        db = client.netinsight
        db.traffic.create_index("timestamp")
        print("✅ Connected to MongoDB with TLS")
    except errors.ServerSelectionTimeoutError as e:
        print(f"⚠️ Could not connect to MongoDB: {e}")

