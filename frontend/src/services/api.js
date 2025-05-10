import axios from "axios";

// Vite proxy will forward /api to your FastAPI backend
const API = axios.create({ baseURL: "/" });

export function fetchZscore(threshold = 3.0) {
  return API.get(`/api/anomalies/zscore?threshold=${threshold}`)
    .then(res => res.data);
}

export function fetchIForest(contamination = 0.01) {
  return API.get(`/api/anomalies/isolation-forest?contamination=${contamination}`)
    .then(res => res.data);
}

export function fetchClusters(n = 3) {
  return API.get(`/api/clusters/kmeans?n_clusters=${n}`)
    .then(res => res.data);
}
