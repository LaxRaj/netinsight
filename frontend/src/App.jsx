import React, { useEffect, useState } from "react";
import { fetchZscore, fetchClusters } from "./services/api.js";
import AnomalyChart from "./components/AnomalyChart";
import ClusterScatter from "./components/ClusterScatter";
import "./App.css";

export default function App() {
  const [threshold, setThreshold] = useState(1.5);
  const [numClusters, setNumClusters] = useState(4);
  const [anomalies, setAnomalies] = useState([]);
  const [clusters, setClusters] = useState({ data: [], centers: [] });

  useEffect(() => {
    console.log("⏳ Fetching anomalies with threshold:", threshold);
    fetchZscore(threshold)
      .then(data => {
        console.log("✅ Received anomalies:", data);
        setAnomalies(data);
      })
      .catch(err => {
        console.error("❌ Error fetching anomalies:", err);
        setAnomalies([]);
      });
  }, [threshold]);

  useEffect(() => {
    fetchClusters(numClusters)
      .then(setClusters)
      .catch(() => setClusters({ data: [], centers: [] }));
  }, [numClusters]);

  return (
    <div className="container">
      <header className="header">
        <h1>NetInsight Dashboard</h1>
      </header>

      <div className="controls">
        <div className="control-card">
          <label>
            Z‐Score Threshold: <strong>{threshold.toFixed(1)}</strong>
          </label>
          <input
            type="range"
            min="0.5"
            max="5.0"
            step="0.1"
            value={threshold}
            onChange={e => setThreshold(parseFloat(e.target.value))}
          />
        </div>

        {/* Show how many anomalies we’ve got */}
        <p style={{ marginBottom: "1rem", color: "#555" }}>
          {anomalies.length > 0
            ? `${anomalies.length} anomaly${anomalies.length > 1 ? "ies" : ""} detected`
            : `No anomalies at threshold ≥ ${threshold.toFixed(1)}`}
        </p>

        <div className="control-card">
          <label>
            Number of Clusters: <strong>{numClusters}</strong>
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={numClusters}
            onChange={e => setNumClusters(parseInt(e.target.value) || 1)}
          />
        </div>
      </div>

      <div className="cards">
        <section className="card">
          <h2>Anomalies (Z ≥ {threshold.toFixed(1)})</h2>
          <AnomalyChart data={anomalies} />
        </section>

        <section className="card">
          <h2>Traffic Clusters ({numClusters} groups)</h2>
          <ClusterScatter data={clusters.data} centers={clusters.centers} />
        </section>
      </div>
    </div>
  );
}
