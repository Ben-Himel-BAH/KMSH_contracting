import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  BarChart,
  PieChart,
  LineChart,
  ScatterChart,
  Gauge,
} from "@mui/x-charts";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Box,
  TextField,
  CircularProgress,
} from "@mui/material";
import { debounce } from "lodash";
import "tailwindcss/tailwind.css";
import { myCompaniesData } from "./data/myCompaiesData";

const Dashboard: React.FC = () => {
  const [biggestCompanies, setBiggestCompanies] = useState(() => myCompaniesData);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchBiggestCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("/biggest-companies");
      const data = response.data;
      setBiggestCompanies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setBiggestCompanies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBiggestCompanies();
  }, [fetchBiggestCompanies]);

  const handleSearch = useCallback(
    debounce((event) => {
      setSearch(event.target.value);
    }, 300),
    []
  );

  const filteredCompanies = biggestCompanies.filter((company) =>
    company.company.legal_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0b1b3b] text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          Dashboard
        </div>
        <nav className="flex-1 p-4 space-y-3">
          <div className="hover:bg-[#112255] p-2 rounded cursor-pointer">
            Home
          </div>
          <div className="hover:bg-[#112255] p-2 rounded cursor-pointer">
            Reports
          </div>
          <div className="hover:bg-[#112255] p-2 rounded cursor-pointer">
            Analytics
          </div>
          <div className="hover:bg-[#112255] p-2 rounded cursor-pointer">
            Users
          </div>
          <div className="hover:bg-[#112255] p-2 rounded cursor-pointer">
            Settings
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Navbar */}
        <AppBar position="static" className="bg-[#0b1b3b] shadow-none">
          <Toolbar className="flex justify-between">
            <Typography variant="h6" className="font-bold">
              Product Overview
            </Typography>
            <div className="flex items-center space-x-4">
              <TextField
                id="search"
                label="Search Companies"
                variant="outlined"
                size="small"
                onChange={handleSearch}
                className="bg-white rounded"
              />
              <IconButton color="inherit">
                <Avatar alt="User" src="" />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>

        {/* Dashboard Cards */}
        {loading ? (
          <Box className="flex justify-center items-center h-64">
            <CircularProgress />
          </Box>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 - Bar Chart */}
            <Box className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold mb-2">Bar Graph</h2>
              <BarChart
                xAxis={[
                  {
                    data: filteredCompanies.map((c) => c.company.legal_name),
                    scaleType: "band",
                  },
                ]}
                series={[
                  {
                    data: filteredCompanies.map((c) =>
                      parseFloat(c.total_contract_value)
                    ),
                  },
                ]}
                height={300}
              />
            </Box>

            {/* Card 2 - Pie Chart */}
            <Box className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold mb-2">Pie Chart</h2>
              <PieChart
                series={[
                  {
                    data: filteredCompanies.map((c, i) => ({
                      id: i,
                      value: parseFloat(c.total_contract_value),
                      label: c.company.legal_name,
                    })),
                  },
                ]}
                height={300}
              />
            </Box>

            {/* Card 3 - Line Chart */}
            <Box className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold mb-2">Line Chart</h2>
              <LineChart
                xAxis={[
                  {
                    data: filteredCompanies.map((c) => c.company.legal_name),
                    scaleType: "band",
                  },
                ]}
                series={[
                  {
                    data: filteredCompanies.map((c) =>
                      parseFloat(c.total_contract_value)
                    ),
                  },
                ]}
                height={300}
              />
            </Box>

            {/* Card 4 - Scatter Chart */}
            <Box className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold mb-2">Scatter Plot</h2>
              <ScatterChart
                xAxis={[
                  {
                    label: "Total Contract Value",
                  },
                ]}
                yAxis={[
                  {
                    label: "Contract Count",
                  },
                ]}
                series={[
                  {
                    label: "Companies",
                    data: filteredCompanies.map((c) => ({
                      x: parseFloat(c.total_contract_value),
                      y: c.contract_count,
                      id: c.company.legal_name,
                    })),
                  },
                ]}
                height={300}
              />
            </Box>

            {/* Card 5 - Gauge */}
            <Box className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold mb-2">Gauge Chart</h2>
              <Gauge
                value={filteredCompanies.reduce(
                  (acc, c) => acc + parseFloat(c.total_contract_value),
                  0
                )}
                valueMax={10000000}
                height={300}
              />
            </Box>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
