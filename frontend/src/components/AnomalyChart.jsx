import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "chartjs-adapter-date-fns";

export default function AnomalyChart({ data }) {
if (!Array.isArray(data)) {
return <div>Loading anomalies…</div>;
}

const labels = data.map(d => new Date(d.timestamp));
const values = data.map(d => d.zscore);

const chartData = {
labels,
datasets: [
{
label: "Z-Score",
data: values,
fill: false,
tension: 0.2,
pointRadius: 3,
},
],
};

const options = {
scales: {
x: {
type: "time",
time: { unit: "minute" },
title: { display: true, text: "Time" },
},
y: {
title: { display: true, text: "Z Score" },
},
},
};

return <Line data={chartData} options={options} />;
}
