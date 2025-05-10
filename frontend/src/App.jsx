import React, { useEffect, useState } from "react";
import { fetchZscore, fetchClusters } from "./services/api.js";
import AnomalyChart from "./components/AnomalyChart";
import ClusterScatter from "./components/ClusterScatter";

export default function App() {
  // control states
  const [threshold, setThreshold] = useState(1.5);
  const [numClusters, setNumClusters] = useState(4);

  // data states
  const [anomalies, setAnomalies] = useState([]);
  const [clusters, setClusters] = useState({ data: [], centers: [] });

  // fetch anomalies when threshold changes
  useEffect(() => {
    fetchZscore(threshold)
      .then(setAnomalies)
      .catch(() => setAnomalies([]));
  }, [threshold]);

  // fetch clusters when numClusters changes
  useEffect(() => {
    fetchClusters(numClusters)
      .then(setClusters)
      .catch(() => setClusters({ data: [], centers: [] }));
  }, [numClusters]);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ marginBottom: "1rem" }}>NetInsight Dashboard</h1>

      {/* Controls */}
      <div style={{ marginBottom: "2rem", display: "flex", gap: "2rem" }}>
        <div>
          <label>
            Z-Score Threshold: <strong>{threshold.toFixed(1)}</strong>
          </label>
          <br />
          <input
            type="range"
            min="0.5"
            max="5.0"
            step="0.1"
            value={threshold}
            onChange={e => setThreshold(parseFloat(e.target.value))}
          />
        </div>

        <div>
          <label>
            Number of Clusters: <strong>{numClusters}</strong>
          </label>
          <br />
          <input
            type="number"
            min="1"
            max="10"
            step="1"
            value={numClusters}
            onChange={e => setNumClusters(parseInt(e.target.value) || 1)}
          />
        </div>
      </div>

      {/* Anomalies Chart */}
      <section style={{ marginBottom: "2rem" }}>
        <h2>Anomalies (Z-Score ≥ {threshold.toFixed(1)})</h2>
        <AnomalyChart data={anomalies} />
      </section>

      {/* Clusters Scatter */}
      <section>
        <h2>Traffic Clusters (KMeans: {numClusters} groups)</h2>
        <ClusterScatter data={clusters.data} centers={clusters.centers} />
      </section>
    </div>
  );
}
