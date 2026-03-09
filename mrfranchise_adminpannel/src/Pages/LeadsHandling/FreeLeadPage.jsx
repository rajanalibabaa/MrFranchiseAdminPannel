import { Box, CssBaseline, useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router-dom';
import SidebarAdmin from '../dashboardOutlet/SidebarAdmin';
import axios from 'axios';
import { Api } from '../../api/apiurl';
import InvestorManagement from '../../Components/InstantapplyFunctions/InstaFreeLeadManagement';

function FreeLeadPage() {
  const isMobile = useMediaQuery('(max-width:900px)');  

    

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
     
      <SidebarAdmin isMobile={isMobile} />

    
      <Box
       
      >
        
        <InvestorManagement/>
      </Box>
    </Box>
  );
}

export default FreeLeadPage;
