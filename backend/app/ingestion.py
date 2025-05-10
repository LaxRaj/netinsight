# backend/app/ingestion.py
import os
import csv
from datetime import datetime, timedelta
import random
import pandas as pd
import app.db as db_module

def generate_mock_data(path: str, n: int = 1000):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    start = datetime.now()
    rows = []
    for i in range(n):
        ts = (start + timedelta(seconds=60*i)).isoformat()
        # Inject a few outliers
        if random.random() < 0.02:
            b = random.randint(50000, 100000)
        else:
            b = random.randint(100, 10000)
        rows.append({
            "timestamp": ts,
            "bytes": b,
            "packets": random.randint(1,200),
            "src_ip": f"192.168.{random.randint(0,255)}.{random.randint(1,254)}",
            "dst_ip": f"10.0.{random.randint(0,255)}.{random.randint(1,254)}"
        })
    with open(path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)
    print(f"🗒️  Generated {n} mock records at {path}")

def ingest_csv(path: str):
    df = pd.read_csv(path)
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    records = df.to_dict(orient="records")
    result = db_module.db.traffic.insert_many(records)
    print(f"✅ Inserted {len(result.inserted_ids)} records into traffic")
