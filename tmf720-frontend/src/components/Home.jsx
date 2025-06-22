import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Home = () => {
  const [stats, setStats] = useState({
    totalIdentities: 0,
    activeUsers: 0,
    pendingActions: 0,
  });

  useEffect(() => {
    // Fetch total identities
    axios.get("http://localhost:3000/tmf-api/digitalIdentityManagement/v4/digitalIdentity?fields=id")
      .then(response => {
        setStats(prev => ({ ...prev, totalIdentities: response.data.length }));
      })
      .catch(error => console.error("Error fetching total identities:", error));

    // Fetch active users (assuming status filter)
    axios.get("http://localhost:3000/tmf-api/digitalIdentityManagement/v4/digitalIdentity?fields=id,status")
      .then(response => {
        const active = response.data.filter(identity => identity.status === "active").length;
        setStats(prev => ({ ...prev, activeUsers: active }));
      })
      .catch(error => console.error("Error fetching active users:", error));

    // Fetch pending actions (assuming a custom endpoint or approximation)
    axios.get("http://localhost:3000/tmf-api/digitalIdentityManagement/v4/digitalIdentity?fields=id,status")
      .then(response => {
        const pending = response.data.filter(identity => identity.status === "pending").length;
        setStats(prev => ({ ...prev, pendingActions: pending }));
      })
      .catch(error => console.error("Error fetching pending actions:", error));
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div 
        className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 text-white p-10 rounded-lg shadow-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl font-extrabold">Welcome to TMF720 Dashboard</h1>
        <p className="mt-6 text-xl">Empower your digital identity management with precision and style.</p>
        <motion.button 
          className="mt-8 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Explore Now
        </motion.button>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
      >
        <motion.div 
          className="bg-gray-800 dark:bg-gray-200 p-8 rounded-lg shadow-lg border-l-4 border-purple-500 dark:border-purple-400 hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-2xl font-semibold dark:text-white text-gray-800">Total Identities</h3>
          <p className="mt-4 text-4xl font-bold dark:text-purple-400 text-purple-600">{stats.totalIdentities}</p>
        </motion.div>
        <motion.div 
          className="bg-gray-800 dark:bg-gray-200 p-8 rounded-lg shadow-lg border-l-4 border-purple-500 dark:border-purple-400 hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-2xl font-semibold dark:text-white text-gray-800">Active Users</h3>
          <p className="mt-4 text-4xl font-bold dark:text-purple-400 text-purple-600">{stats.activeUsers}</p>
        </motion.div>
        <motion.div 
          className="bg-gray-800 dark:bg-gray-200 p-8 rounded-lg shadow-lg border-l-4 border-purple-500 dark:border-purple-400 hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-2xl font-semibold dark:text-white text-gray-800">Pending Actions</h3>
          <p className="mt-4 text-4xl font-bold dark:text-purple-400 text-purple-600">{stats.pendingActions}</p>
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <motion.div 
        className="bg-gray-800 dark:bg-gray-200 p-8 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <h2 className="text-3xl font-bold dark:text-white text-gray-800 mb-6">Analytics Overview</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold dark:text-white text-gray-800 mb-4">Identity Status Distribution</h3>
            <canvas id="barChart" className="w-full h-64"></canvas>
          </div>
          {/* Pie Chart */}
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold dark:text-white text-gray-800 mb-4">Active vs Inactive</h3>
            <canvas id="pieChart" className="w-full h-64"></canvas>
          </div>
        </div>
      </motion.div>

      {/* Canvas Panel Script for Charts */}
      <div className="hidden">
        <canvas id="chartCanvas" />
      </div>
    </div>
  );
};

// Script to initialize charts (injected into the page)
const script = document.createElement("script");
script.innerHTML = `
  document.addEventListener("DOMContentLoaded", () => {
    // Bar Chart Data (fetching actual status counts)
    axios.get("http://localhost:3000/tmf-api/digitalIdentityManagement/v4/digitalIdentity?fields=id,status")
      .then(response => {
        const data = response.data;
        const statusCounts = {
          active: data.filter(d => d.status === "active").length,
          suspended: data.filter(d => d.status === "suspended").length,
          archived: data.filter(d => d.status === "archived").length,
          unknown: data.filter(d => d.status === "unknown").length,
          pending: data.filter(d => d.status === "pending").length
        };

        // Bar Chart
        new Chart(document.getElementById("barChart"), {
          type: "bar",
          data: {
            labels: Object.keys(statusCounts),
            datasets: [{
              label: "Number of Identities",
              data: Object.values(statusCounts),
              backgroundColor: "rgba(167, 139, 250, 0.7)",
              borderColor: "rgba(167, 139, 250, 1)",
              borderWidth: 1
            }]
          },
          options: {
            scales: { y: { beginAtZero: true } },
            plugins: { legend: { labels: { color: window.matchMedia("(prefers-color-scheme: dark)").matches ? "#fff" : "#000" } } }
          }
        });

        // Pie Chart
        const activeCount = statusCounts.active;
        const inactiveCount = Object.values(statusCounts).reduce((a, b) => a + b, 0) - activeCount;
        new Chart(document.getElementById("pieChart"), {
          type: "pie",
          data: {
            labels: ["Active", "Inactive"],
            datasets: [{
              data: [activeCount, inactiveCount],
              backgroundColor: ["rgba(167, 139, 250, 0.7)", "rgba(75, 85, 99, 0.7)"],
              borderWidth: 1
            }]
          },
          options: {
            plugins: { legend: { labels: { color: window.matchMedia("(prefers-color-scheme: dark)").matches ? "#fff" : "#000" } } }
          }
        });
      })
      .catch(error => console.error("Error fetching chart data:", error));
  });
`;
document.body.appendChild(script);

export default Home;