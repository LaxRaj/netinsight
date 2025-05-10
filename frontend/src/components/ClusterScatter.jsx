import React from "react";
import { Scatter } from "react-chartjs-2";
import "chart.js/auto";

export default function ClusterScatter({ data, centers }) {
  if (!Array.isArray(data) || !Array.isArray(centers)) {
    return <div>Loading clusters…</div>;
  }

  // Group points by cluster
  const grouped = data.reduce((acc, pt) => {
    const c = pt.cluster;
    (acc[c] = acc[c] || []).push(pt);
    return acc;
  }, {});

  // Build datasets for each cluster + centers
  const datasets = Object.entries(grouped).map(([cluster, pts]) => ({
    label: `Cluster ${cluster}`,
    data: pts.map(p => ({ x: p.bytes, y: p.packets })),
    pointRadius: 3,
  }));

  datasets.push({
    label: "Centers",
    data: centers.map(c => ({ x: c[0], y: c[1] })),
    pointRadius: 6,
    pointStyle: "cross",
  });

  const options = {
    scales: {
      x: {
        type: "logarithmic",
        title: { display: true, text: "Bytes (log scale)" },
      },
      y: {
        title: { display: true, text: "Packets" },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: context => `Bytes: ${context.parsed.x}, Packets: ${context.parsed.y}`
        }
      }
    }
  };

  return <Scatter data={{ datasets }} options={options} />;
}
