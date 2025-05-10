# backend/app/clustering.py
import pandas as pd
from sklearn.cluster import KMeans

def cluster_kmeans(
    df: pd.DataFrame,
    features: list[str],
    n_clusters: int=3
) -> tuple[pd.DataFrame,list[list[float]]]:
    df = df.copy()
    km = KMeans(n_clusters=n_clusters, random_state=42)
    df["cluster"] = km.fit_predict(df[features])
    centers = km.cluster_centers_.tolist()
    return df, centers
