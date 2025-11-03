// components/StatisticsCards.jsx
import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';

const StatCard = ({ title, value, icon: Icon,  }) => (
 
  <>                 

      <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' ,flexDirection:'row', pl: 2,pt:1,pr:1 }}>
<Icon sx={{ fontSize: 15, mr: 1, opacity: 0.9 }} />
        <Typography variant="body"  sx={{ fontWeight: 'bold',padding: 0 }}>
 {title} - {value?.toLocaleString() || 0}
        </Typography>
      </Box>
     
   </>
);

const StatisticsCards = ({ totalCount, stats, activeFiltersCount }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Leads"
          value={totalCount}
          icon={PeopleIcon}
          color="primary"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Brands Sent"
          value={stats.totalBrandsSent}
          icon={BusinessIcon}
          color="success"
        />
      </Grid>

    </Grid>
  );
};

export default StatisticsCards;
