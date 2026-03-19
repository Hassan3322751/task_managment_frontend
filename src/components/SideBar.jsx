import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Button, Avatar } from "@mui/material";
import { Assignment, ExitToApp, Dashboard as DashIcon, Stars, Settings, HelpOutline } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useContext(AuthContext);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const menuItems = [
    { text: 'Dashboard', icon: <DashIcon />, path: '/dashboard' },
    { text: 'Vital Task', icon: <Stars />, path: '/vital-tasks' },
    { text: 'My Task', icon: <Assignment />, path: '/my-tasks' },
  ];

  return (
    <Box 
      sx={{ 
        width: 280, 
        bgcolor: '#FF5A5F', 
        color: 'white', 
        height: '100vh', 
        maxHeight: '100vh',
        position: 'fixed', 
        left: 0, 
        top: 0, 
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1200,
        mt: '60px',
        borderRadius: '0 40px 0 0',
      }}
    >
      <Box sx={{ position: 'relative', mt: '-50px', mb: 2, textAlign: 'center' }}>
        <Avatar 
          src="https://via.placeholder.com/80" 
          sx={{ 
            width: 90, height: 90, mx: 'auto', mb: 1, 
            border: '4px solid #F8F9FA',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)' 
          }} 
        />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>{user?.firstName + " " + user?.lastName}</Typography>
        <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }}>{user?.email}</Typography>
      </Box>

      {/* Navigation List */}
      <List sx={{ px: 2, flexGrow: 1, overflowY: 'auto' }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem
              key={item.text}
              disablePadding
              onClick={() => navigate(item.path)}
              sx={{ 
                borderRadius: '15px 0 0 15px', // Inset effect
                mb: 1, 
                bgcolor: isActive ? '#F8F9FA' : 'transparent',
                color: isActive ? '#FF5A5F' : 'white',
                '&:hover': { bgcolor: isActive ? '#F8F9FA' : 'rgba(255,255,255,0.1)' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', px: 3, py: 1.5, width: '100%' }}>
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 700 : 400 }} />
              </Box>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ px: 2, pb: 10 }}>
        <Button 
          fullWidth
          startIcon={<ExitToApp />} 
          onClick={handleLogout}
          sx={{ color: 'white', justifyContent: 'flex-start', px: 3, textTransform: 'none' }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default SideBar;