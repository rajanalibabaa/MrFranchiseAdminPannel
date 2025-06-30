import React from 'react'
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import { Dashboard, People, Settings, Logout, BarChart, AccountCircle } from '@mui/icons-material';

const SidebarAdmin = () => {
  return (
    <>
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
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
        Admin Panel
      </Typography>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />
      <List>
        <ListItem button>
          <ListItemIcon sx={{ color: '#fff' }}>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button>
          <ListItemIcon sx={{ color: '#fff' }}>
            <People />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItem>
        <ListItem button>
          <ListItemIcon sx={{ color: '#fff' }}>
            <BarChart />
          </ListItemIcon>
          <ListItemText primary="Analytics" />
        </ListItem>
        <ListItem button>
          <ListItemIcon sx={{ color: '#fff' }}>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem button>
          <ListItemIcon sx={{ color: '#fff' }}>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem button>
          <ListItemIcon sx={{ color: '#fff' }}>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  
</>
  )
}

export default SidebarAdmin