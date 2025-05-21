import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Chart.js registration
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MonthlySalesChart = ({ salesData }) => {
  const labels = Object.keys(salesData);
  const values = Object.values(salesData);

  const data = {
    labels,
    datasets: [
      {
        label: "Sales (₹)",
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        data: values,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="mt-4">
      <Bar data={data} options={options} />
    </div>
  );
};

export default MonthlySalesChart;
