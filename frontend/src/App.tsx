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
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
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
    // Debug logging
    console.log('Companies data:', companiesData);
    console.log('Contracts data:', contractsData);
    console.log('Locations data:', locationsData);
    console.log('Users data:', usersData);

    // Bar chart: Top companies by contract count
    const companyContractCounts = companiesData.map(company => {
      const contractCount = contractsData.filter(contract => contract.company_id === company.company_id).length;
      console.log(`Company ${company.legal_name} (ID: ${company.company_id}) has ${contractCount} contracts`);
      return {
        name: company.legal_name.length > 15 ? company.legal_name.substring(0, 15) + '...' : company.legal_name,
        value: contractCount
      };
    }).sort((a, b) => b.value - a.value).slice(0, 5);

    console.log('Final bar chart data:', companyContractCounts);
    setBarData(companyContractCounts);

    // Pie chart: Contracts by state
    const stateContractCounts: { [key: string]: number } = {};
    contractsData.forEach(contract => {
      const location = locationsData.find(loc => loc.location_id === contract.place_of_performance_location_id);
      const state = location?.state_province || 'Unknown';
      stateContractCounts[state] = (stateContractCounts[state] || 0) + 1;
    });

    const pieChartData = Object.entries(stateContractCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    setPieData(pieChartData);

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
              {/* Top Row: Bar + Radar Charts */}
              <Grid container spacing={2} mb={2}>
                {/* Bar Graph - 2/3 width */}
                <Grid item xs={8}>
                  <Card sx={{ p: 2 }}>
                    <Typography variant="h6">Top Companies by Contract Count</Typography>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={barData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#1976d2" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </Grid>

                {/* Radar Charts - 1/3 width, split equally */}
                <Grid item xs={4}>
                  <Grid container spacing={2} direction="column">
                    <Grid item>
                      <Card sx={{ p: 2 }}>
                        <Typography variant="subtitle2" align="center">Metrics Overview</Typography>
                        <RadarChart
                          width={200}
                          height={200}
                          series={[
                            { label: "Current", data: radarData.map((d) => d.A), color: "blue" },
                          ]}
                          radar={{ metrics: radarData.map((d) => d.subject) }}
                        />
                      </Card>
                    </Grid>
                    <Grid item>
                      <Card sx={{ p: 2 }}>
                        <Typography variant="subtitle2" align="center">Benchmark</Typography>
                        <RadarChart
                          width={200}
                          height={200}
                          series={[
                            { label: "Target", data: radarData.map((d) => d.B), color: "green" },
                          ]}
                          radar={{ metrics: radarData.map((d) => d.subject) }}
                        />
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              {/* Second Row: Left + Right */}
              <Grid container spacing={2}>
                {/* Left Section */}
                <Grid item xs={8}>
                  <Grid container spacing={2} direction="column">
                    {/* Top Section: Pie Charts + Gauge */}
                    <Grid item>
                      <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={6} sm={4}>
                          <Card sx={{ p: 2 }}>
                            <Typography variant="subtitle2" align="center">Contracts by State</Typography>
                            <PieChart width={150} height={150}>
                              <Pie data={pieData} dataKey="value" outerRadius={60} fill="#8884d8" label>
                                {pieData.map((entry, index) => (
                                  <Cell
                                    key={`cell1-${index}`}
                                    fill={["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff00"][index % 5]}
                                  />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </Card>
                        </Grid>

                        <Grid item xs={6} sm={4}>
                          <Card sx={{ p: 2 }}>
                            <Typography variant="subtitle2" align="center">Contract Distribution</Typography>
                            <PieChart width={150} height={150}>
                              <Pie data={pieData} dataKey="value" outerRadius={60} fill="#82ca9d" label>
                                {pieData.map((entry, index) => (
                                  <Cell
                                    key={`cell2-${index}`}
                                    fill={["#ffc658", "#8884d8", "#82ca9d", "#ff7300", "#00ff00"][index % 5]}
                                  />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </Card>
                        </Grid>

                        <Grid item xs={6} sm={4}>
                          <Card sx={{ p: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <Typography variant="subtitle2" align="center" sx={{ mb: 1 }}>
                              System Health
                            </Typography>
                            <Gauge 
                              value={error ? 30 : 85} 
                              valueMin={0} 
                              valueMax={100}
                              text={({ value }) => `${value}%`}
                            />
                          </Card>
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* Bottom Section: Sparkline */}
                    <Grid item>
                      <Card sx={{ p: 2 }}>
                        <Typography variant="h6">Contracts Awarded by Year</Typography>
                        <ResponsiveContainer width="100%" height={120}>
                          <LineChart data={lineData}>
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={true} />
                          </LineChart>
                        </ResponsiveContainer>
                      </Card>
                    </Grid>

                    {/* Data Grid */}
                    <Grid item>
                      <Card sx={{ height: 400 }}>
                        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                          <Typography variant="h6">Companies Database</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total Companies: {companies.length}
                          </Typography>
                        </Box>
                        <Box sx={{ height: 350 }}>
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
                  </Grid>
                </Grid>

                {/* Right Section - Stats */}
                <Grid item xs={4}>
                  <Grid container spacing={2} direction="column">
                    <Grid item>
                      <Card sx={{ p: 2 }}>
                        <Typography variant="h6">Quick Stats</Typography>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body1">
                            <strong>Total Contracts:</strong> {contracts.length}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Total Companies:</strong> {companies.length}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Total Locations:</strong> {locations.length}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Active Users:</strong> {users.length}
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>

                    <Grid item>
                      <Card sx={{ p: 2 }}>
                        <Typography variant="h6">Contract Values</Typography>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body1">
                            <strong>Total Value:</strong> ${contracts.reduce((sum, contract) => sum + Number(contract.total_value), 0).toLocaleString()}
                          </Typography>
                          <Typography variant="body1">
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
