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

const Dashboard: React.FC = () => {
  const [topCompanies, setTopCompanies] = useState<any[]>([]);
  const [valueByYear, setValueByYear] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Axios instance pointing to localhost:3000
  const api = axios.create({
    baseURL: "http://localhost:3000",
  });

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [companiesRes, yearsRes, contractsRes] = await Promise.all([
        api.get("/api/stats/top-companies"),
        api.get("/api/stats/value-by-year"),
        api.get("/api/contracts"),
      ]);

      const companies = companiesRes.data || [];
      const years = yearsRes.data || [];
      const contracts = contractsRes.data || [];

      setTopCompanies(companies);
      setValueByYear(years);
      setContracts(contracts);

      // Calculate total contract value for gauge
      const total = contracts.reduce(
        (acc: number, c: any) => acc + parseFloat(c.total_value || "0"),
        0
      );
      setTotalValue(total);
    } catch (error) {
      console.error("API error, using dummy data:", error);

      // ✅ Dummy data fallback
      const dummyCompanies = [
        { company: { legal_name: "Alpha Inc" }, total_contract_value: "500000", contract_count: 10 },
        { company: { legal_name: "Beta LLC" }, total_contract_value: "300000", contract_count: 6 },
        { company: { legal_name: "Gamma Corp" }, total_contract_value: "200000", contract_count: 4 },
      ];
      const dummyYears = [
        { year: 2021, total_value: "200000", contract_count: 5 },
        { year: 2022, total_value: "400000", contract_count: 7 },
        { year: 2023, total_value: "600000", contract_count: 9 },
      ];
      const dummyContracts = [
        { contract_id: 1, total_value: "150000", company: { legal_name: "Alpha Inc" } },
        { contract_id: 2, total_value: "200000", company: { legal_name: "Beta LLC" } },
        { contract_id: 3, total_value: "100000", company: { legal_name: "Gamma Corp" } },
      ];

      setTopCompanies(dummyCompanies);
      setValueByYear(dummyYears);
      setContracts(dummyContracts);
      setTotalValue(450000);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleSearch = useCallback(
    debounce((event) => {
      setSearch(event.target.value);
    }, 300),
    []
  );

  const filteredCompanies = topCompanies.filter((c) =>
    c.company.legal_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0b1b3b] text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          Dashboard
        </div>
        <nav className="flex-1 p-4 space-y-3">
          <div className="hover:bg-[#112255] p-2 rounded cursor-pointer">Home</div>
          <div className="hover:bg-[#112255] p-2 rounded cursor-pointer">Reports</div>
          <div className="hover:bg-[#112255] p-2 rounded cursor-pointer">Analytics</div>
          <div className="hover:bg-[#112255] p-2 rounded cursor-pointer">Users</div>
          <div className="hover:bg-[#112255] p-2 rounded cursor-pointer">Settings</div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
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

        {loading ? (
          <Box className="flex justify-center items-center h-64">
            <CircularProgress />
          </Box>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Bar Chart */}
            <Box className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold mb-2">Top Companies (Bar)</h2>
              <BarChart
                xAxis={[{ data: filteredCompanies.map((c) => c.company.legal_name), scaleType: "band" }]}
                series={[{ data: filteredCompanies.map((c) => parseFloat(c.total_contract_value)) }]}
                height={300}
              />
            </Box>

            {/* Pie Chart */}
            <Box className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold mb-2">Contract Share (Pie)</h2>
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

            {/* Line Chart */}
            <Box className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold mb-2">Value by Year</h2>
              <LineChart
                xAxis={[{ data: valueByYear.map((d) => d.year), scaleType: "band" }]}
                series={[{ data: valueByYear.map((d) => parseFloat(d.total_value)) }]}
                height={300}
              />
            </Box>

            {/* Scatter Chart */}
            <Box className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold mb-2">Contracts (Scatter)</h2>
              <ScatterChart
                xAxis={[{ label: "Contract ID" }]}
                yAxis={[{ label: "Value" }]}
                series={[
                  {
                    label: "Contracts",
                    data: contracts.map((c: any) => ({
                      x: c.contract_id,
                      y: parseFloat(c.total_value || "0"),
                      id: c.company.legal_name,
                    })),
                  },
                ]}
                height={300}
              />
            </Box>

            {/* Gauge */}
            <Box className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold mb-2">Total Contract Value</h2>
              <Gauge value={totalValue} valueMax={1000000} height={300} />
            </Box>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
