# backend/app/main.py

import os
import pandas as pd
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

# Initialize DB connection
from .db import init_db
import app.db as db_module

# Ingestion, detection, clustering
from .ingestion import generate_mock_data, ingest_csv
from .detection import detect_zscore, detect_iforest
from .clustering import cluster_kmeans

# Helper to clean Mongo types
from datetime import datetime
from bson import ObjectId

def sanitize(records: list[dict]) -> list[dict]:
    for r in records:
        if "_id" in r:
            r["id"] = str(r.pop("_id"))
        if "timestamp" in r and isinstance(r["timestamp"], datetime):
            r["timestamp"] = r["timestamp"].isoformat()
    return records

app = FastAPI(title="NetInsight")

# Allow calls from frontend dev and anywhere (adjust in prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_PATH = "data/traffic_logs.csv"
MOCK_SIZE = 2000

@app.on_event("startup")
def startup_event():
    # 1) Connect & index
    init_db()

    # 2) Generate mock CSV if missing
    if not os.path.exists(DATA_PATH):
        generate_mock_data(DATA_PATH, n=MOCK_SIZE)

    # 3) Ingest into Mongo
    ingest_csv(DATA_PATH)

@app.get("/")
def root():
    return {"message": "NetInsight API up and running"}

@app.get("/api/anomalies/zscore")
def anomalies_zscore(threshold: float = Query(3.0, description="Z-score threshold")):
    df = pd.DataFrame(list(db_module.db.traffic.find()))
    out = detect_zscore(df, field="bytes", threshold=threshold)
    return sanitize(out.to_dict(orient="records"))

@app.get("/api/anomalies/isolation-forest")
def anomalies_iforest(contamination: float = Query(0.01, description="IsolationForest contamination")):
    df = pd.DataFrame(list(db_module.db.traffic.find()))
    features = ["bytes", "packets"]
    out = detect_iforest(df, features=features, contamination=contamination)
    return sanitize(out.to_dict(orient="records"))

@app.get("/api/clusters/kmeans")
def clusters_kmeans(n_clusters: int = Query(3, description="Number of clusters")):
    df = pd.DataFrame(list(db_module.db.traffic.find()))
    features = ["bytes", "packets"]
    clustered_df, centers = cluster_kmeans(df, features=features, n_clusters=n_clusters)
    return {
        "data": sanitize(clustered_df.to_dict(orient="records")),
        "centers": centers
    }
