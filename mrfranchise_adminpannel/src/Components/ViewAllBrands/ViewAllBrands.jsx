// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   Box,
//   Grid,
//   Typography,
//   Card,
//   CardContent,
//   CardMedia,
//   CircularProgress,
//   Alert,
// } from '@mui/material';
// import SidebarAdmin from '../../Pages/dashboardOutlet/SidebarAdmin';

// const ViewAllBrands = () => {
//     const [brands, setBrands] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchBrands = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/v1/brandlisting/getAllBrandListing');

//       console.log('API Response:', response.data);
//       setBrands(response.data?.data || []); 
//       setLoading(false);
//     } catch (err) {
//       setError('Failed to fetch brands');
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBrands();
//   }, []);

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" mt={5}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box display="flex" justifyContent="center" mt={5}>
//         <Alert severity="error">{error}</Alert>
//       </Box>
//     );
//   }

//   return (
//     <Box display="flex">
//       {/* Sidebar */}
//       <SidebarAdmin />

     
//     <Box p={4}>
//       <Typography variant="h4" gutterBottom>
//         All Brands
//       </Typography>

//       {/* <Grid container spacing={3}>
//         {brands.map((brand) => (
//           <Grid item xs={12} sm={6} md={4} lg={3} key={brand._id}>
//             <Card sx={{ height: '100%' }}>
//               {brand.logo && (
//                 <CardMedia
//                   component="img"
//                   height="160"
//                   image={brand.logo}
//                   alt={brand.name}
//                 />
//               )}
//               <CardContent>
//                 <Typography variant="h6" gutterBottom>
//                   {brand.name}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   {brand.description || 'No description available.'}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid> */}
//     </Box>
//     </Box>
//   );
// };
// export default ViewAllBrands

import React from 'react'

const ViewAllBrands = () => {
  console.log("ViewAllBrands component rendered");
  return (
    <div>ViewAllBrands</div>
  )
}

export default ViewAllBrands