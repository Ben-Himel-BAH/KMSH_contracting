// Dashboard.tsx
import React, { useState } from "react";
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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Gauge } from "@mui/x-charts/Gauge";
import { RadarChart } from "@mui/x-charts/RadarChart";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";

// Dummy Data
const barData = [
  { name: "Company A", value: 400 },
  { name: "Company B", value: 300 },
  { name: "Company C", value: 200 },
];

const pieData = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
];

const lineData = [
  { year: 2020, value: 100 },
  { year: 2021, value: 300 },
  { year: 2022, value: 500 },
  { year: 2023, value: 200 },
];

const radarData = [
  { subject: "R&D", A: 120, B: 110 },
  { subject: "Sales", A: 98, B: 130 },
  { subject: "Marketing", A: 86, B: 130 },
  { subject: "HR", A: 99, B: 100 },
  { subject: "Finance", A: 85, B: 90 },
];

const rows = [
  { id: 1, name: "Company A", duns: "123456", cage: "ABC1" },
  { id: 2, name: "Company B", duns: "654321", cage: "XYZ2" },
  { id: 3, name: "Company C", duns: "112233", cage: "LMN3" },
];

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Company Name", width: 200 },
  { field: "duns", headerName: "DUNS Number", width: 150 },
  { field: "cage", headerName: "CAGE Code", width: 150 },
];

const drawerWidth = 200;

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();

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
          // add left margin equal to drawer width on sm+ screens
        }}>
          {/* Top Row: Bar + Radar Charts */}
          <Grid container spacing={2} mb={2}>
            {/* Bar Graph - 2/3 width */}
            <Grid item xs={8}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6">Top Companies</Typography>
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
                    <RadarChart
                      width={200}
                      height={200}
                      series={[
                        { label: "Series A", data: radarData.map((d) => d.A), color: "blue" },
                      ]}
                      radar={{ metrics: radarData.map((d) => d.subject) }}
                    />
                  </Card>
                </Grid>
                <Grid item>
                  <Card sx={{ p: 2 }}>
                    <RadarChart
                      width={200}
                      height={200}
                      series={[
                        { label: "Series B", data: radarData.map((d) => d.B), color: "green" },
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
                        <PieChart width={150} height={150}>
                          <Pie data={pieData} dataKey="value" outerRadius={60} fill="#8884d8" label>
                            {pieData.map((entry, index) => (
                              <Cell
                                key={`cell1-${index}`}
                                fill={["#8884d8", "#82ca9d", "#ffc658"][index % 3]}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </Card>
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <Card sx={{ p: 2 }}>
                        <PieChart width={150} height={150}>
                          <Pie data={pieData} dataKey="value" outerRadius={60} fill="#82ca9d" label>
                            {pieData.map((entry, index) => (
                              <Cell
                                key={`cell2-${index}`}
                                fill={["#ffc658", "#8884d8", "#82ca9d"][index % 3]}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </Card>
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <Card sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                        <Gauge value={60} valueMin={0} valueMax={100} />
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Bottom Section: Sparkline */}
                <Grid item>
                  <Card sx={{ p: 2 }}>
                    <Typography variant="h6">Sparkline</Typography>
                    <ResponsiveContainer width="100%" height={80}>
                      <LineChart data={lineData}>
                        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                </Grid>

                {/* Data Grid */}
                <Grid item>
                  <Card sx={{ height: 300 }}>
                    <DataGrid rows={rows} columns={columns} />
                  </Card>
                </Grid>
              </Grid>
            </Grid>


          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
