"use client";
import React, { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Define types for the data
interface Location {
  Location_Name: string;
  Location_ID: string;
}

interface Category {
  Category_Name: string;
  Category_ID: string;
}

interface Ride {
  Ride_Id: string;
  Start_Location_ID: string;
  Stop_Location_ID: string;
  MILES: string;
  START_DATE: string;
  END_DATE: string;
  PURPOSE: string;
  Category_ID: string;
}

const Dashboard = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [rides, setRides] = useState<Ride[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/rides");
        const result = await response.json();
        setLocations(result.locations);
        setCategories(result.categories);
        setRides(result.rides);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!locations.length || !categories.length || !rides.length) {
    return <div>Loading...</div>;
  }

  // Stacked Bar Chart: Rides by Category and Purpose
  const purposes = [...new Set(rides.map((ride) => ride.PURPOSE))];
  const stackedBarData = {
    labels: categories.map((category) => category.Category_Name),
    datasets: purposes.map((purpose, index) => ({
      label: purpose,
      data: categories.map(
        (category) =>
          rides.filter(
            (ride) =>
              ride.Category_ID === category.Category_ID &&
              ride.PURPOSE === purpose
          ).length
      ),
      backgroundColor: `rgba(${54 + index * 20}, ${162 + index * 10}, ${
        235 - index * 15
      }, 0.5)`,
      borderColor: `rgba(${54 + index * 20}, ${162 + index * 10}, ${
        235 - index * 15
      }, 1)`,
      borderWidth: 1,
    })),
  };

  // Area Chart: Miles Traveled Over Time with Gradient Line
  const sortedRides = [...rides].sort(
    (a, b) =>
      new Date(a.START_DATE).getTime() - new Date(b.START_DATE).getTime()
  );
  const cumulativeMiles = sortedRides.reduce((acc, ride, index) => {
    const miles = parseFloat(ride.MILES) || 0;
    acc.push((acc[index - 1] || 0) + miles);
    return acc;
  }, [] as number[]);

  const areaChartData = {
    labels: sortedRides.map((ride) =>
      new Date(ride.START_DATE).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Cumulative Miles Traveled",
        data: cumulativeMiles,
        fill: false,
        borderColor: (context: { chart: any; }) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            // Chart is rendered in two phases, return fallback color
            return "rgba(75, 192, 192, 1)";
          }

          const gradient = ctx.createLinearGradient(
            chartArea.left,
            chartArea.bottom,
            chartArea.left,
            chartArea.top
          );
          gradient.addColorStop(0, "rgba(75, 192, 192, 1)");
          gradient.addColorStop(1, "rgba(255, 99, 132, 1)");
          return gradient;
        },
        tension: 0.2,
      },
    ],
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#121212",
        color: "#FFFFFF",
        minHeight: "100vh",
      }}
    >
      <div
        style={{ maxWidth: "800px", margin: "20px auto", textAlign: "center" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            backgroundColor: "#1E1E1E",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div>
            <h3 style={{ color: "#54A0FF", margin: 0 }}>Number of Locations</h3>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              {locations.length}
            </p>
          </div>
          <div>
            <h3 style={{ color: "#1DD1A1", margin: 0 }}>
              Number of Categories
            </h3>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              {categories.length}
            </p>
          </div>
          <div>
            <h3 style={{ color: "#FF6B6B", margin: 0 }}>Number of Rides</h3>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              {rides.length}
            </p>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div style={{ maxWidth: "800px", margin: "20px auto" }}>
        <h2>Number of Rides by Category</h2>
        <Bar
          data={{
            labels: categories.map((category) => category.Category_Name),
            datasets: [
              {
                label: "Number of Rides",
                data: categories.map(
                  (category) =>
                    rides.filter(
                      (ride) => ride.Category_ID === category.Category_ID
                    ).length
                ),
                backgroundColor: "rgba(54, 162, 235, 0.5)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
              },
            ],
          }}
          options={{ responsive: true }}
        />
      </div>

      {/* Stacked Bar Chart */}
      <div style={{ maxWidth: "800px", margin: "20px auto" }}>
        <h2>Rides by Category and Purpose</h2>
        <Bar
          data={stackedBarData}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
          }}
        />
      </div>

      {/* Line Chart */}
      <div style={{ maxWidth: "800px", margin: "20px auto" }}>
        <h2>Miles Traveled Over Rides</h2>
        <Line
          data={{
            labels: rides.map((ride, index) => `Ride ${index + 1}`),
            datasets: [
              {
                label: "Miles Traveled",
                data: rides.map((ride) => parseFloat(ride.MILES)),
                fill: false,
                borderColor: "rgba(75, 192, 192, 1)",
                tension: 0.1,
              },
            ],
          }}
          options={{ responsive: true }}
        />
      </div>

      {/* Area Chart */}
      <div style={{ maxWidth: "800px", margin: "20px auto" }}>
        <h2>Cumulative Miles Traveled Over Time</h2>
        <Line data={areaChartData} options={{ responsive: true }} />
      </div>

      {/* Pie Chart */}
      <div style={{ maxWidth: "800px", margin: "20px auto" }}>
        <h2>Proportion of Rides by Purpose</h2>
        <Pie
          data={{
            labels: purposes,
            datasets: [
              {
                label: "Proportion of Rides by Purpose",
                data: purposes.map(
                  (purpose) =>
                    rides.filter((ride) => ride.PURPOSE === purpose).length
                ),
                backgroundColor: [
                  "rgba(255, 99, 132, 0.5)",
                  "rgba(54, 162, 235, 0.5)",
                  "rgba(255, 206, 86, 0.5)",
                  "rgba(75, 192, 192, 0.5)",
                  "rgba(153, 102, 255, 0.5)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                ],
                borderWidth: 1,
              },
            ],
          }}
          options={{ responsive: true }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
