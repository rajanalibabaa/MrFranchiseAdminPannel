import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Collapse,
  Avatar,
  Stack
} from '@mui/material';
import {
  Dashboard,
  People,
  Logout,
} from '@mui/icons-material';
import ViewAllBrands  from './ViewAll Brands/ViewAllBrands';

const SidebarAdmin = () => {
  const [openBrandHandling, setOpenBrandHandling] = useState(false);
  const navigate = useNavigate(); 

  const handleBrandClick = () => {
    setOpenBrandHandling((prev) => !prev);
  };

  return (
    <Box
      sx={{
        width: 250,
        height: '100vh',
        bgcolor: '#1e293b',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
        p: 2,
      }}
    >
      {/* User Profile */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="center"
        sx={{ mb: 2 }}
      >
        <Avatar alt="John Doe" src="/path/to/avatar.jpg" />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          John Doe
        </Typography>
      </Stack>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />


      <List>
 
        <ListItem button onClick={() => navigate('/dashboard')}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

       
        <ListItem button onClick={handleBrandClick} sx={{cursor: 'pointer'}}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <People />
          </ListItemIcon>
          <ListItemText primary="Manage Brand" />
        </ListItem>

      
        <Collapse in={openBrandHandling} timeout="auto" unmountOnExit>
        <List>
            <ListItem
              button
              onClick={() => navigate('/createbrand') }
              sx={{
                pl: 6,
                cursor: 'pointer',
                color: '#cbd5e1',
                '&:hover': { bgcolor: '#334155' },
              }}
            >
              <ListItemText primary="Create New Brand" />
            </ListItem>
          </List>
          <List component="div" disablePadding>
           <ListItem
              button
              onClick={() => navigate('/ViewAllBrands') }
              sx={{
                pl: 6,
                cursor: 'pointer',
                color: '#cbd5e1',
                '&:hover': { bgcolor: '#334155' },
              }}
            >
              <ListItemText primary="View All Brands" />
            </ListItem>
          </List>

          
        </Collapse>

      
        <ListItem button onClick={() => console.log('Logout clicked')}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );
};

export default SidebarAdmin;
