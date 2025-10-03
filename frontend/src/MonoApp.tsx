import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { Gauge } from '@mui/x-charts/Gauge';

import { Container, Box, TextField, CircularProgress } from '@mui/material';
import { debounce } from 'lodash';
import 'tailwindcss/tailwind.css';
import { myCompaniesData } from './data/myCompaiesData';


const Dashboard: React.FC = () => {
  const [biggestCompanies, setBiggestCompanies] = useState(() => myCompaniesData);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchBiggestCompanies = useCallback(async () => {
  setLoading(true);
  try {
    const response = await axios.get('/biggest-companies');
    const data = response.data;
    // Ensure it's always an array
    setBiggestCompanies(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error(error);
    setBiggestCompanies([]); // fallback to empty array on error
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
    <Container className="p-6 bg-gray-100">
      <Box className="flex justify-between items-center p-4 bg-white rounded shadow">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <TextField
          id="search"
          label="Search Companies"
          variant="outlined"
          onChange={handleSearch}
          className="w-1/4"
        />
      </Box>

      {loading ? (
        <Box className="flex justify-center items-center h-64">
          <CircularProgress />
        </Box>
      ) : (
        <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <Box className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-bold mb-2">Bar Graph</h2>
            <BarChart
              xAxis={[
                {
                  data: filteredCompanies.map((c) => c.company.legal_name),
                  scaleType: 'band',
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


          <Box className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-bold mb-2">Line Chart</h2>
            <LineChart
              xAxis={[
                {
                  data: filteredCompanies.map((c) => c.company.legal_name),
                  scaleType: 'band',
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

            <Box className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold mb-2">Scatter Plot</h2>
              <ScatterChart
                xAxis={[
                  {
                    label: 'Total Contract Value',
                  },
                ]}
                yAxis={[
                  {
                    label: 'Contract Count',
                  },
                ]}
                series={[
                  {
                    label: 'Companies',
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

          </Box>


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

        </Box>
      )}
    </Container>
  );
};

export default Dashboard;


// This is a simplified illustrative component:

// - **State Management:** Implements `useState` and `useEffect` for data fetching.
// - **Performance Optimizations:** Uses `debounce` from lodash to handle search input efficiently.
// - **Loading State:** Uses MUI `CircularProgress` for loading indication.
// - **Responsive Layout:** Utilizes Tailwind CSS for styling and CSS Grid for layout.
// - **MUIX Charts:** Displays various chart types from MUIX.
// - **Search Feature:** Includes a search bar to filter and display relevant company data.
// - **Data Fetching:** Demonstrates how to fetch and process data using `axios`.

// Make sure to adjust REST API endpoint and data transformations according to your actual API specifications.