import React from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Typography, 
  Avatar 
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Business as BrandIcon,
  People as UsersIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';

const AdminSidebar = ({ drawerWidth = 240 }) => {
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Brands', icon: <BrandIcon />, path: '/brands' },
    { text: 'Users', icon: <UsersIcon />, path: '/users' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          
        },
      }}
      variant="permanent"
      anchor="left"
    >
     <Box></Box>
      <Divider sx={{ backgroundColor: '#2D2D44', my: 1 }} />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text}
            
          >
            <ListItemIcon sx={{ color: '#E94560' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider sx={{ backgroundColor: '#2D2D44', my: 1 }} />
        <ListItem 
          button
          
        >
          <ListItemIcon sx={{ color: '#E94560' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;