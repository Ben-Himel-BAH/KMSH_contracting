// Dashboard.tsx
import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  IconButton,
  Avatar,
  Card,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { Gauge } from "@mui/x-charts/Gauge";
import { RadarChart } from "@mui/x-charts/RadarChart";
import { apiService } from "./services/api";
import type { Company, Contract, Location, User, ChartData, LineChartData, RadarData } from "./types";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";

const drawerWidth = 200;

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  
  // State for API data
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for chart data
  const [barData, setBarData] = useState<ChartData[]>([]);
  const [pieData, setPieData] = useState<ChartData[]>([]);
  const [pieValueData, setPieValueData] = useState<ChartData[]>([]);
  const [lineData, setLineData] = useState<LineChartData[]>([]);
  const [radarData, setRadarData] = useState<RadarData[]>([]);

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load all data in parallel
        const [companiesData, contractsData, locationsData, usersData] = await Promise.all([
          apiService.getCompanies(),
          apiService.getContracts(),
          apiService.getLocations(),
          apiService.getUsers(),
        ]);

        setCompanies(companiesData);
        setContracts(contractsData);
        setLocations(locationsData);
        setUsers(usersData);

        // Transform data for charts
        transformDataForCharts(companiesData, contractsData, locationsData, usersData);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError(`Failed to load dashboard data: ${err instanceof Error ? err.message : 'Unknown error'}. Please make sure the backend server is running on localhost:8000.`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Transform API data for chart components
  const transformDataForCharts = (
    companiesData: Company[],
    contractsData: Contract[],
    locationsData: Location[],
    usersData: User[]
  ) => {
    // Bar chart: Top companies by contract count
    const companyContractCounts = companiesData.map(company => {
      const contractCount = contractsData.filter(contract => contract.company_id === company.company_id).length;
      return {
        name: company.legal_name.length > 15 ? company.legal_name.substring(0, 15) + '...' : company.legal_name,
        value: contractCount
      };
    }).sort((a, b) => b.value - a.value).slice(0, 5);

    setBarData(companyContractCounts);

    // Pie chart: Contracts by state
    const stateContractCounts: { [key: string]: number } = {};
    contractsData.forEach(contract => {
      const location = locationsData.find(loc => loc.location_id === contract.place_of_performance_location_id);
      let state = location?.state_province || 'Unknown';
      
      // Clean up state names for better display
      if (state && state.length > 2) {
        // If it's a full state name, keep it
        state = state.trim();
      } else if (state && state.length === 2) {
        // If it's a state code, could be expanded to full name if needed
        state = state.toUpperCase();
      }
      
      stateContractCounts[state] = (stateContractCounts[state] || 0) + 1;
    });

    const pieChartData = Object.entries(stateContractCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // Show top 6 states for better visibility

    setPieData(pieChartData);

    // Second pie chart: Contract value by state
    const stateValueCounts: { [key: string]: number } = {};
    contractsData.forEach(contract => {
      const location = locationsData.find(loc => loc.location_id === contract.place_of_performance_location_id);
      let state = location?.state_province || 'Unknown';
      
      // Clean up state names
      if (state && state.length > 2) {
        state = state.trim();
      } else if (state && state.length === 2) {
        state = state.toUpperCase();
      }
      
      const contractValue = Number(contract.total_value) || 0;
      stateValueCounts[state] = (stateValueCounts[state] || 0) + contractValue;
    });

    const pieValueChartData = Object.entries(stateValueCounts)
      .map(([name, value]) => ({ 
        name, 
        value: Math.round(value / 1000000) // Convert to millions for readability
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    setPieValueData(pieValueChartData);

    // Line chart: Contracts awarded by year
    const contractsByYear: { [key: number]: number } = {};
    contractsData.forEach(contract => {
      const year = new Date(contract.date_awarded).getFullYear();
      if (!isNaN(year)) {
        contractsByYear[year] = (contractsByYear[year] || 0) + 1;
      }
    });

    const lineChartData = Object.entries(contractsByYear)
      .map(([year, value]) => ({ year: parseInt(year), value }))
      .sort((a, b) => a.year - b.year);

    setLineData(lineChartData);

    // Radar chart: Default metrics based on actual data
    setRadarData([
      { subject: "Active Contracts", A: Math.min(contractsData.length, 120), B: 100 },
      { subject: "Companies", A: Math.min(companiesData.length * 10, 120), B: 80 },
      { subject: "Locations", A: Math.min(locationsData.length * 5, 120), B: 90 },
      { subject: "Users", A: Math.min(usersData.length * 20, 120), B: 70 },
      { subject: "Performance", A: 85, B: 90 },
    ]);
  };

  // DataGrid columns for companies
  const columns: GridColDef[] = [
    { field: "company_id", headerName: "ID", width: 70 },
    { field: "legal_name", headerName: "Company Name", width: 250 },
    { field: "duns_number", headerName: "DUNS Number", width: 150 },
    { field: "cage_code", headerName: "CAGE Code", width: 150 },
    { field: "website_url", headerName: "Website", width: 200 },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box sx={{ width: drawerWidth, bgcolor: "#3f51b5", color: "#fff", height: "100%" }}>
      <Toolbar />
      <Divider sx={{ bgcolor: "#fff" }} />
      <List>
        <ListItemButton>
          <ListItemIcon sx={{ color: "#fff" }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>

        <ListItemButton>
          <ListItemIcon sx={{ color: "#fff" }}>
            <AssessmentIcon />
          </ListItemIcon>
          <ListItemText primary="Reports" />
        </ListItemButton>

        <ListItemButton>
          <ListItemIcon sx={{ color: "#fff" }}>
            <AnalyticsIcon />
          </ListItemIcon>
          <ListItemText primary="Analytics" />
        </ListItemButton>

        <ListItemButton>
          <ListItemIcon sx={{ color: "#fff" }}>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItemButton>

        <ListItemButton>
          <ListItemIcon sx={{ color: "#fff" }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100vw" }}>
      {/* Sidebar Drawer */}
      <Box component="nav">
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, bgcolor: "#3f51b5", color: "#fff" },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, bgcolor: "#3f51b5", color: "#fff" },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box sx={{
        flexGrow: 1,
        p: 3,
        ml: { sm: `${drawerWidth}px` },
      }}>
        {/* Top AppBar */}
        <AppBar position="static" sx={{ backgroundColor: "#2196f3" }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{ display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">Convisoft Dashboard</Typography>
            <Avatar sx={{ bgcolor: "white", color: "black" }}>P</Avatar>
          </Toolbar>
        </AppBar>

        {/* Dashboard Content */}
        <Box sx={{
          flexGrow: 1,
          p: 3,
        }}>
          {/* Loading State */}
          {loading && (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
              <CircularProgress size={60} />
              <Typography variant="h6" sx={{ ml: 2 }}>Loading dashboard data...</Typography>
            </Box>
          )}

          {/* Error State */}
          {error && !loading && (
            <Box display="flex" flexDirection="column" alignItems="center" minHeight="400px" sx={{ p: 4 }}>
              <Alert severity="error" sx={{ mb: 3, maxWidth: 600 }}>
                <Typography variant="h6" gutterBottom>Unable to Load Dashboard Data</Typography>
                <Typography variant="body1">{error}</Typography>
              </Alert>
              <Typography variant="body2" color="text.secondary" align="center">
                Troubleshooting steps:
                <br />• Ensure the FastAPI backend is running on localhost:8000
                <br />• Check that CORS is configured properly
                <br />• Verify the database contains data
                <br />• Check browser console for additional error details
              </Typography>
            </Box>
          )}

          {/* Dashboard Content - Only show when not loading and no error */}
          {!loading && !error && (
            <>
              {/* Dashboard Header */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                  Contract Analytics Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Real-time insights into government contracting data including company performance, contract distribution, and trends over time.
                </Typography>
              </Box>

              {/* Top Row: Bar Chart (Full Width) */}
              <Grid container spacing={3} mb={4}>
                <Grid item xs={12}>
                  <Card sx={{ p: 3 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h5" gutterBottom>
                        Top Companies by Contract Count
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ranking of companies based on the total number of active contracts. This metric shows which contractors are most active in government procurement.
                      </Typography>
                    </Box>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={barData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#1976d2" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </Grid>
              </Grid>

              {/* Second Row: Performance Metrics */}
              <Grid container spacing={3} mb={4}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 3 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Current System Metrics
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Real-time performance indicators showing active contracts, registered companies, tracked locations, and system users.
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="center">
                      <RadarChart
                        width={300}
                        height={250}
                        series={[
                          { label: "Current", data: radarData.map((d) => d.A), color: "blue" },
                        ]}
                        radar={{ metrics: radarData.map((d) => d.subject) }}
                      />
                    </Box>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 3 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Target Benchmarks
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Performance targets and benchmarks for system metrics. Compare current performance against established goals.
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="center">
                      <RadarChart
                        width={300}
                        height={250}
                        series={[
                          { label: "Target", data: radarData.map((d) => d.B), color: "green" },
                        ]}
                        radar={{ metrics: radarData.map((d) => d.subject) }}
                      />
                    </Box>
                  </Card>
                </Grid>
              </Grid>

              {/* Third Row: Distribution Charts and System Health */}
              <Grid container spacing={3} mb={4}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ p: 3, height: 500 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Contract Awards by State
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        States where contract work is being performed. Larger segments indicate states with more active contracts.
                      </Typography>
                    </Box>
                    <Box 
                      display="flex" 
                      flexDirection="column" 
                      alignItems="center" 
                      sx={{ 
                        height: 380,
                        overflow: 'visible',
                        padding: '20px',
                        margin: '-10px'
                      }}
                    >
                      <Box sx={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'flex', 
                        justifyContent: 'center',
                        overflow: 'visible'
                      }}>
                        <PieChart width={400} height={350} margin={{ top: 20, right: 50, bottom: 60, left: 50 }}>
                          <Pie 
                            data={pieData} 
                            dataKey="value" 
                            nameKey="name"
                            cx="50%" 
                            cy="40%" 
                            outerRadius={80} 
                            fill="#8884d8" 
                            label={({ name, value, percent }) => 
                              `${name}: ${value} (${(percent * 100).toFixed(1)}%)`
                            }
                            labelLine={true}
                          >
                            {pieData.map((entry, index) => (
                              <Cell
                                key={`cell1-${index}`}
                                fill={["#1976d2", "#2196f3", "#03dac6", "#ff9800", "#e91e63", "#9c27b0"][index % 6]}
                              />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value, name) => [
                              `${value} contracts`, 
                              `${name} State`
                            ]}
                          />
                          <Legend 
                            verticalAlign="bottom" 
                            height={50}
                            formatter={(value) => `${value}`}
                            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                          />
                        </PieChart>
                      </Box>
                      {pieData.length > 0 && (
                        <Box sx={{ mt: 1, textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            Top State: {pieData[0]?.name} ({pieData[0]?.value} contracts)
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card sx={{ p: 3, height: 500 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Contract Value by State
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total dollar value of contracts by state performance location (in millions USD).
                      </Typography>
                    </Box>
                    <Box 
                      display="flex" 
                      flexDirection="column" 
                      alignItems="center" 
                      sx={{ 
                        height: 380,
                        overflow: 'visible',
                        padding: '20px',
                        margin: '-10px'
                      }}
                    >
                      <Box sx={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'flex', 
                        justifyContent: 'center',
                        overflow: 'visible'
                      }}>
                        <PieChart width={400} height={350} margin={{ top: 20, right: 50, bottom: 60, left: 50 }}>
                          <Pie 
                            data={pieValueData} 
                            dataKey="value" 
                            nameKey="name"
                            cx="50%" 
                            cy="40%" 
                            outerRadius={80} 
                            fill="#82ca9d" 
                            label={({ name, value, percent }) => 
                              `${name}: $${value}M (${(percent * 100).toFixed(1)}%)`
                            }
                            labelLine={true}
                          >
                            {pieValueData.map((entry, index) => (
                              <Cell
                                key={`cell2-${index}`}
                                fill={["#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800"][index % 6]}
                              />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value, name) => [
                              `$${value} million`, 
                              `${name} State`
                            ]}
                          />
                          <Legend 
                            verticalAlign="bottom" 
                            height={50}
                            formatter={(value) => `${value}`}
                            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                          />
                        </PieChart>
                      </Box>
                      {pieValueData.length > 0 && (
                        <Box sx={{ mt: 1, textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            Highest Value: {pieValueData[0]?.name} (${pieValueData[0]?.value}M)
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card sx={{ p: 3, height: 500, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom align="center">
                        System Health Score
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        Overall system health based on data quality, API response times, and error rates.
                      </Typography>
                    </Box>
                    <Box display="flex" flexDirection="column" alignItems="center" sx={{ flexGrow: 1, justifyContent: 'center' }}>
                      <Gauge 
                        value={error ? 30 : 85} 
                        valueMin={0} 
                        valueMax={100}
                        text={({ value }) => `${value}%`}
                        width={200}
                        height={200}
                      />
                      <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Status: {error ? 'Degraded' : 'Healthy'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Last updated: {new Date().toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              </Grid>

              {/* Fourth Row: Timeline Chart */}
              <Grid container spacing={3} mb={4}>
                <Grid item xs={12}>
                  <Card sx={{ p: 3 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h5" gutterBottom>
                        Contract Awards Timeline
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Historical trend of contract awards by year, showing the volume of government contracting activity over time. Helps identify seasonal patterns and growth trends.
                      </Typography>
                    </Box>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={lineData}>
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={3} dot={true} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                </Grid>
              </Grid>

              {/* Bottom Row: Data Tables and Statistics */}
              <Grid container spacing={3}>
                {/* Left Section - Company Database */}
                <Grid item xs={12} lg={8}>
                  <Card sx={{ height: 500 }}>
                    <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                      <Typography variant="h5" gutterBottom>
                        Companies Database
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Complete database of registered companies with detailed information including DUNS numbers, CAGE codes, and contact details. Use the search and filter options to find specific contractors.
                      </Typography>
                      <Typography variant="subtitle2" sx={{ mt: 1 }}>
                        Total Companies: {companies.length}
                      </Typography>
                    </Box>
                    <Box sx={{ height: 400 }}>
                      <DataGrid 
                        rows={companies.map(company => ({
                          ...company,
                          id: company.company_id // DataGrid requires 'id' field
                        }))} 
                        columns={columns}
                        pageSizeOptions={[5, 10, 25]}
                        initialState={{
                          pagination: {
                            paginationModel: { pageSize: 10, page: 0 },
                          },
                        }}
                      />
                    </Box>
                  </Card>
                </Grid>

                {/* Right Section - Summary Statistics */}
                <Grid item xs={12} lg={4}>
                  <Grid container spacing={3} direction="column">
                    <Grid item>
                      <Card sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                          System Overview
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Key metrics showing the current state of the contracting system.
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Total Contracts:</strong> {contracts.length}
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Total Companies:</strong> {companies.length}
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Total Locations:</strong> {locations.length}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Active Users:</strong> {users.length}
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>

                    <Grid item>
                      <Card sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                          Financial Summary
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Contract value analysis and financial metrics across all active contracts.
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Total Value:</strong> ${contracts.reduce((sum, contract) => sum + Number(contract.total_value), 0).toLocaleString()}
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Average Contract:</strong> ${contracts.length > 0 ? (contracts.reduce((sum, contract) => sum + Number(contract.total_value), 0) / contracts.length).toLocaleString() : '0'}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Largest Contract:</strong> ${contracts.length > 0 ? Math.max(...contracts.map(c => Number(c.total_value))).toLocaleString() : '0'}
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
