import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Card,
  CardContent,
  Button,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {/* Dashboard container */}
      <div className="min-w-[70vw] max-w-7xl p-4">
        {/* AppBar */}
        <AppBar position="static" color="primary" className="mb-6">
          <Toolbar className="flex justify-between">
            <div className="flex items-center gap-2">
              <IconButton edge="start" color="inherit">
                <MenuIcon />
              </IconButton>
              <Typography variant="h6">My Dashboard</Typography>
            </div>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Dashboard cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Counter Card */}
          <Card className="bg-white shadow-lg">
            <CardContent className="flex flex-col items-center">
              <Typography variant="h6">Counter</Typography>
              <Typography variant="h3" color="primary">{count}</Typography>
              <Button
                variant="contained"
                color="primary"
                className="mt-4 w-full sm:w-auto"
                onClick={() => setCount(count + 1)}
              >
                Increment
              </Button>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="bg-white shadow-lg">
            <CardContent>
              <Typography variant="h6">Welcome</Typography>
              <Typography>
                This is a responsive React + Vite + Tailwind + MUI dashboard.
                Cards stack on mobile and are side-by-side on larger screens.
              </Typography>
            </CardContent>
          </Card>

          {/* Quick Action Card */}
          <Card className="bg-white shadow-lg">
            <CardContent className="flex flex-col items-center">
              <Typography variant="h6">Quick Action</Typography>
              <Button
                variant="outlined"
                color="secondary"
                className="mt-2 w-full sm:w-auto"
              >
                Do Something
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-8 p-4 bg-gray-200 text-center rounded">
          Dashboard Footer - Info / Links
        </div>
      </div>
    </div>
  );
}
