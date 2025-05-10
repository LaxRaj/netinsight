# backend/app/detection.py
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest

def detect_zscore(df: pd.DataFrame, field: str="bytes", threshold: float=3.0) -> pd.DataFrame:
    df = df.copy()
    μ, σ = df[field].mean(), df[field].std(ddof=0)
    df["zscore"] = (df[field] - μ) / σ
    return df[np.abs(df["zscore"]) > threshold]

def detect_iforest(
    df: pd.DataFrame,
    features: list[str],
    contamination: float=0.01
) -> pd.DataFrame:
    df = df.copy()
    iso = IsolationForest(contamination=contamination, random_state=42)
    df["if_score"] = iso.fit_predict(df[features])
    return df[df["if_score"] == -1]
