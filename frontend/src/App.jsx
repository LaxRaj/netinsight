import React, { useEffect, useState } from "react";
import { fetchZscore, fetchClusters } from "./services/api.js";
import AnomalyChart from "./components/AnomalyChart";
import ClusterScatter from "./components/ClusterScatter";

export default function App() {
  const [anomalies, setAnomalies] = useState([]);
  const [clusters, setClusters] = useState({ data: [], centers: [] });

  useEffect(() => {
    // Fetch anomalies (z-score threshold 1.5)
    fetchZscore(1.5)
      .then((data) => setAnomalies(data))
      .catch(() => setAnomalies([]));

    // Fetch clusters (4 clusters)
    fetchClusters(4)
      .then((data) => setClusters(data))
      .catch(() => setClusters({ data: [], centers: [] }));
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ marginBottom: "1rem" }}>NetInsight Dashboard</h1>

      <section style={{ marginBottom: "2rem" }}>
        <h2>Anomalies (Z-Score)</h2>
        <AnomalyChart data={anomalies} />
      </section>

      <section>
        <h2>Traffic Clusters (KMeans)</h2>
        <ClusterScatter data={clusters.data} centers={clusters.centers} />
      </section>
    </div>
  );
}

