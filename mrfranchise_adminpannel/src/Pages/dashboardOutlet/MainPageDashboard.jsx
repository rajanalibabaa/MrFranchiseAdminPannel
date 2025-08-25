import { Box, CssBaseline, useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router-dom';
import SidebarAdmin from './SidebarAdmin';

function MainPageDashboard() {
  const isMobile = useMediaQuery('(max-width:900px)');  

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
     
      <SidebarAdmin isMobile={isMobile} />

    
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ...(isMobile
            ? { marginLeft: 0,marginTop: 6, width: '100%' } // mobile: full width
            : { marginLeft: '300px', width: 'calc(100% - 300px)' } // desktop: leave space for sidebar
          ),
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default MainPageDashboard;
