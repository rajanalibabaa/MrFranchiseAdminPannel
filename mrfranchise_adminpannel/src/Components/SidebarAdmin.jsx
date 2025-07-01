import React, {  useState ,useEffect} from 'react';
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
   const navigate = useNavigate(); 
  const [openBrandHandling, setOpenBrandHandling] = useState(false);
  const [openInvestorHandling, setOpenInvestorHandling] = useState(false);
const [adminContact, setAdminContact] = useState(localStorage.getItem('adminContact') || 'Admin');
  const handleBrandClick = () => {
    setOpenBrandHandling((prev) => !prev);
  };
  const handleInvestorClick =() =>{
    setOpenInvestorHandling((prev) => !prev);
  };

 useEffect(() => {
    // Listen for changes to localStorage (e.g., after login)
    const handleStorage = () => {
      setAdminContact(localStorage.getItem('adminContact') || 'Admin');
    };
    window.addEventListener('storage', handleStorage);
    // Also update on mount in case login just happened
    handleStorage();
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

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
        <Avatar alt={adminContact} src="/path/to/avatar.jpg" />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {adminContact}
        </Typography>
      </Stack>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />


      <List>
 
        <ListItem button="true" onClick={() => navigate('/dashboard')}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

       
        <ListItem button="true" onClick={handleBrandClick} sx={{cursor: 'pointer'}}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <People />
          </ListItemIcon>
          <ListItemText primary="Brand Handling" />
        </ListItem>

      
        <Collapse in={openBrandHandling} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
           <ListItem
              button="true"
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

         <ListItem button="true" onClick={handleInvestorClick} sx={{cursor: 'pointer'}}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <People />
          </ListItemIcon>
          <ListItemText primary="Investor Handling" />
        </ListItem>
        <Collapse in={openInvestorHandling} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
           <ListItem
              button="true"
              onClick={() => navigate('/investormanage') }
              sx={{
                pl: 6,
                cursor: 'pointer',
                color: '#cbd5e1',
                '&:hover': { bgcolor: '#334155' },
              }}
            >
              <ListItemText primary="View All Investors" />
            </ListItem>
          </List>
        </Collapse>

      
        <ListItem button="true" onClick={() => console.log('Logout clicked')}>
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
