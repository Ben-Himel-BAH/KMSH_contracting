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
  const [currentPage, setCurrentPage] = useState<string>('Home');

  // State for chart data
  const [barData, setBarData] = useState<ChartData[]>([]);
  const [pieData, setPieData] = useState<ChartData[]>([]);
  const [pieValueData, setPieValueData] = useState<ChartData[]>([]);
  const [lineData, setLineData] = useState<LineChartData[]>([]);
  const [radarData, setRadarData] = useState<RadarData[]>([]);
  const [riskData, setRiskData] = useState<RadarData[]>([]);

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
        name: company.legal_name.length > 12 ? company.legal_name.substring(0, 12) + '...' : company.legal_name,
        value: contractCount
      };
    }).sort((a, b) => b.value - a.value).slice(0, 10);

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

    // Radar chart: Contract Performance Metrics
    const currentDate = new Date();
    const lastYearDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());
    const last6MonthsDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, currentDate.getDate());
    
    // Calculate meaningful contract metrics
    const activeContracts = contractsData.filter(contract => {
      const endDate = contract.end_date ? new Date(contract.end_date) : new Date();
      const startDate = new Date(contract.start_date || contract.date_awarded);
      return startDate <= currentDate && endDate >= currentDate;
    }).length;

    const recentContracts = contractsData.filter(contract => {
      const awardedDate = new Date(contract.date_awarded);
      return awardedDate >= last6MonthsDate;
    }).length;

    const totalValue = contractsData.reduce((sum, contract) => sum + Number(contract.total_value || 0), 0);
    const avgContractValue = contractsData.length > 0 ? totalValue / contractsData.length : 0;

    const largeContracts = contractsData.filter(contract => Number(contract.total_value || 0) > avgContractValue).length;
    const contractsWithEndDates = contractsData.filter(contract => contract.end_date).length;
    const completionRate = contractsData.length > 0 ? (contractsWithEndDates / contractsData.length) * 100 : 0;

    // Geographic diversity (unique states)
    const uniqueStates = new Set(
      contractsData
        .map(contract => {
          const location = locationsData.find(loc => loc.location_id === contract.place_of_performance_location_id);
          return location?.state_province;
        })
        .filter(Boolean)
    ).size;

    // Vendor diversity (active companies with contracts)
    const activeVendors = new Set(contractsData.map(contract => contract.company_id)).size;

    // Current performance metrics (scaled 0-100)
    const currentMetrics = [
      { 
        subject: "Contract Volume", 
        A: Math.min((activeContracts / Math.max(contractsData.length, 1)) * 100, 100),
        B: 85 // Target: 85% of contracts should be active
      },
      { 
        subject: "Recent Activity", 
        A: Math.min((recentContracts / Math.max(contractsData.length, 1)) * 100, 100),
        B: 30 // Target: 30% new contracts in last 6 months
      },
      { 
        subject: "Value Distribution", 
        A: Math.min((largeContracts / Math.max(contractsData.length, 1)) * 100, 100),
        B: 40 // Target: 40% high-value contracts
      },
      { 
        subject: "Geographic Reach", 
        A: Math.min(uniqueStates * 2, 100), // Scale states (max ~50 states)
        B: 60 // Target: presence in 30+ states
      },
      { 
        subject: "Vendor Diversity", 
        A: Math.min((activeVendors / Math.max(companiesData.length, 1)) * 100, 100),
        B: 70 // Target: 70% of registered vendors have active contracts
      },
      { 
        subject: "Data Completeness", 
        A: completionRate,
        B: 95 // Target: 95% contracts have complete data
      }
    ];

    // Risk assessment metrics for second radar
    const overdueTasks = contractsData.filter(contract => {
      const endDate = contract.end_date ? new Date(contract.end_date) : null;
      return endDate && endDate < currentDate;
    }).length;

    const riskMetrics = [
      { 
        subject: "Contract Health", 
        A: Math.max(100 - (overdueTasks / Math.max(contractsData.length, 1)) * 100, 0),
        B: 90 // Target: 90% healthy contracts
      },
      { 
        subject: "Financial Health", 
        A: avgContractValue > 100000 ? 85 : 60, // Higher score for valuable contracts
        B: 80 // Target financial health score
      },
      { 
        subject: "Compliance Rate", 
        A: Math.min((contractsWithEndDates / Math.max(contractsData.length, 1)) * 100, 100),
        B: 95 // Target: 95% compliance
      },
      { 
        subject: "Performance Trend", 
        A: recentContracts > activeContracts * 0.1 ? 80 : 50, // Good if recent activity
        B: 75 // Target performance trend
      },
      { 
        subject: "Risk Mitigation", 
        A: uniqueStates > 5 ? 85 : 60, // Geographic diversity reduces risk
        B: 80 // Target risk mitigation score
      }
    ];

    setRadarData(currentMetrics);
    setRiskData(riskMetrics);
  };

  // DataGrid columns for companies
  const columns: GridColDef[] = [
    { field: "company_id", headerName: "ID", width: 70 },
    { field: "legal_name", headerName: "Company Name", width: 200 },
    { field: "duns_number", headerName: "DUNS Number", width: 120 },
    { field: "cage_code", headerName: "CAGE Code", width: 100 },
    { field: "founded_date", headerName: "Founded", width: 100 },
    { field: "headquarters", headerName: "Headquarters", width: 150 },
    { field: "contract_count", headerName: "Total Contracts", width: 120 },
    { field: "total_value", headerName: "Total Value", width: 130 },
    { field: "avg_value", headerName: "Avg Value", width: 120 },
    { field: "first_contract", headerName: "First Contract", width: 120 },
    { field: "last_contract", headerName: "Last Contract", width: 120 },
    { field: "website_url", headerName: "Website", flex: 1, minWidth: 200 },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box sx={{ width: drawerWidth, bgcolor: "#3f51b5", color: "#fff", height: "100%" }}>
      <Toolbar />
      <Divider sx={{ bgcolor: "#fff" }} />
      <List>
        <ListItemButton selected={currentPage === 'Home'} onClick={() => setCurrentPage('Home')}>
          <ListItemIcon sx={{ color: "#fff" }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>

        <ListItemButton selected={currentPage === 'Reports'} onClick={() => setCurrentPage('Reports')}>
          <ListItemIcon sx={{ color: "#fff" }}>
            <AssessmentIcon />
          </ListItemIcon>
          <ListItemText primary="Reports" />
        </ListItemButton>

        <ListItemButton selected={currentPage === 'Analytics'} onClick={() => setCurrentPage('Analytics')}>
          <ListItemIcon sx={{ color: "#fff" }}>
            <AnalyticsIcon />
          </ListItemIcon>
          <ListItemText primary="Analytics" />
        </ListItemButton>
      </List>
    </Box>
  );

  // Render functions for different pages
  const renderHomePage = () => (
    <>
      {/* Home Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Contract Analytics Dashboard - Home
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of companies, contract statistics, and key financial metrics.
        </Typography>
      </Box>

      {/* Top Row: Summary Cards and Bar Chart */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, width: '100%' }}>
        {/* Summary Cards - Adequate width for content */}
        <Box sx={{ flexShrink: 0, width: '400px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Card sx={{ p: 3, height: 230 }}>
              <Typography variant="h6" gutterBottom>
                System Overview
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Key metrics showing the number of contracts, companies, and locations.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Total Contracts:</strong> {contracts.length}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Total Companies:</strong> {companies.length}
                </Typography>
                <Typography variant="body1">
                  <strong>Total Locations:</strong> {locations.length}
                </Typography>
              </Box>
            </Card>

            <Card sx={{ p: 3, height: 230 }}>
              <Typography variant="h6" gutterBottom>
                Financial Summary
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Contract value analysis and financial metrics.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" sx={{ mb: 1, fontSize: '0.9rem' }}>
                  <strong>Total Value:</strong> ${contracts.reduce((sum, contract) => sum + Number(contract.total_value), 0).toLocaleString()}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1, fontSize: '0.9rem' }}>
                  <strong>Average Contract:</strong> ${contracts.length > 0 ? (contracts.reduce((sum, contract) => sum + Number(contract.total_value), 0) / contracts.length).toLocaleString() : '0'}
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>
                  <strong>Largest Contract:</strong> ${contracts.length > 0 ? Math.max(...contracts.map(c => Number(c.total_value))).toLocaleString() : '0'}
                </Typography>
              </Box>
            </Card>
          </Box>
        </Box>

        {/* Bar Chart - Take remaining space */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Card sx={{ p: 3, height: 480, width: '100%' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5" gutterBottom>
                Top Companies by Contract Count
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ranking of companies based on the total number of active contracts.
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Box>
      </Box>

      {/* Bottom Row: Companies Database (Full Width) */}
      <Box sx={{ width: '100%' }}>
        <Card sx={{ height: 500, width: '100%' }}>
          <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h5" gutterBottom>
              Companies Database
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Complete database of registered companies with detailed information.
            </Typography>
            <Typography variant="subtitle2" sx={{ mt: 1 }}>
              Total Companies: {companies.length}
            </Typography>
          </Box>
          <Box sx={{ height: 400 }}>
            <DataGrid 
              rows={companies.map(company => {
                  // Calculate contract metrics for each company
                  const companyContracts = contracts.filter(contract => contract.company_id === company.company_id);
                  const contractCount = companyContracts.length;
                  const totalValue = companyContracts.reduce((sum, contract) => sum + Number(contract.total_value || 0), 0);
                  const avgValue = contractCount > 0 ? totalValue / contractCount : 0;
                  
                  // Find headquarters location
                  const headquartersLocation = locations.find(loc => loc.location_id === company.primary_location_id);
                  const headquarters = headquartersLocation ? `${headquartersLocation.city}, ${headquartersLocation.state_province}` : 'N/A';
                  
                  // Find first and last contract dates
                  const contractDates = companyContracts.map(contract => new Date(contract.date_awarded)).sort((a, b) => a.getTime() - b.getTime());
                  const firstContract = contractDates.length > 0 ? contractDates[0].toLocaleDateString() : 'N/A';
                  const lastContract = contractDates.length > 0 ? contractDates[contractDates.length - 1].toLocaleDateString() : 'N/A';
                  
                  return {
                    ...company,
                    id: company.company_id,
                    contract_count: contractCount,
                    total_value: totalValue > 0 ? `$${totalValue.toLocaleString()}` : '$0',
                    avg_value: avgValue > 0 ? `$${Math.round(avgValue).toLocaleString()}` : '$0',
                    headquarters: headquarters,
                    first_contract: firstContract,
                    last_contract: lastContract,
                    founded_date: company.founded_date ? new Date(company.founded_date).toLocaleDateString() : 'N/A'
                  };
                })} 
                columns={columns}
                pageSizeOptions={[10, 25, 50, 100]}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 50, page: 0 },
                  },
                }}
              />
            </Box>
          </Card>
        </Box>
    </>
  );

  const renderReportsPage = () => (
    <>
      {/* Reports Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Contract Analytics Dashboard - Reports
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Geographic analysis of contract awards and values by state.
        </Typography>
      </Box>

      {/* Pie Charts Row */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 4, height: 550 }}>
            <Box sx={{ mb: 3 }}>
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
                height: 430,
                overflow: 'visible',
                padding: '30px',
                margin: '-15px'
              }}
            >
              <Box sx={{ 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                justifyContent: 'center',
                overflow: 'visible'
              }}>
                <PieChart width={500} height={400} margin={{ top: 30, right: 80, bottom: 80, left: 80 }}>
                  <Pie 
                    data={pieData} 
                    dataKey="value" 
                    nameKey="name"
                    cx="50%" 
                    cy="45%" 
                    outerRadius={90} 
                    fill="#8884d8" 
                    label={({ name, value, percent }) => 
                      `${name}: ${value} (${((percent as number) * 100).toFixed(1)}%)`
                    }
                    labelLine={true}
                  >
                    {pieData.map((_, index) => (
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
                    height={60}
                    formatter={(value) => `${value}`}
                    wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }}
                  />
                </PieChart>
              </Box>
              {pieData.length > 0 && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Top State: {pieData[0]?.name} ({pieData[0]?.value} contracts)
                  </Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 4, height: 550 }}>
            <Box sx={{ mb: 3 }}>
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
                height: 430,
                overflow: 'visible',
                padding: '30px',
                margin: '-15px'
              }}
            >
              <Box sx={{ 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                justifyContent: 'center',
                overflow: 'visible'
              }}>
                <PieChart width={500} height={400} margin={{ top: 30, right: 80, bottom: 80, left: 80 }}>
                  <Pie 
                    data={pieValueData} 
                    dataKey="value" 
                    nameKey="name"
                    cx="50%" 
                    cy="45%" 
                    outerRadius={90} 
                    fill="#82ca9d" 
                    label={({ name, value, percent }) => 
                      `${name}: $${value}M (${((percent as number) * 100).toFixed(1)}%)`
                    }
                    labelLine={true}
                  >
                    {pieValueData.map((_, index) => (
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
                    height={60}
                    formatter={(value) => `${value}`}
                    wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }}
                  />
                </PieChart>
              </Box>
              {pieValueData.length > 0 && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Highest Value: {pieValueData[0]?.name} (${pieValueData[0]?.value}M)
                  </Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  );

  const renderAnalyticsPage = () => (
    <>
      {/* Analytics Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Contract Analytics Dashboard - Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Advanced performance metrics and risk assessment analytics.
        </Typography>
      </Box>

      {/* Radar Charts Row */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Contract Performance Metrics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current performance across key contracting dimensions including volume, activity, value distribution, and geographic reach.
              </Typography>
            </Box>
            <Box display="flex" justifyContent="center">
              <RadarChart
                width={300}
                height={250}
                series={[
                  { label: "Current", data: radarData.map((d) => d.A), color: "#1976d2" },
                  { label: "Target", data: radarData.map((d) => d.B), color: "#ff9800" },
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
                Risk Assessment Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Risk analysis across contract health, financial stability, compliance rates, and performance trends.
              </Typography>
            </Box>
            <Box display="flex" justifyContent="center">
              <RadarChart
                width={300}
                height={250}
                series={[
                  { label: "Current", data: riskData.map((d) => d.A), color: "#4caf50" },
                  { label: "Target", data: riskData.map((d) => d.B), color: "#e91e63" },
                ]}
                radar={{ metrics: riskData.map((d) => d.subject) }}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Timeline Chart */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5" gutterBottom>
                Contract Awards Timeline
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Historical trend of contract awards by year, showing the volume of government contracting activity over time.
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
    </>
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
        p: 2,
        ml: { sm: `${drawerWidth}px` },
        width: `calc(100vw - ${drawerWidth}px)`,
        maxWidth: '100%',
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
          width: '100%',
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
              {/* Conditional Page Rendering */}
              {currentPage === 'Home' && renderHomePage()}
              {currentPage === 'Reports' && renderReportsPage()}
              {currentPage === 'Analytics' && renderAnalyticsPage()}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
