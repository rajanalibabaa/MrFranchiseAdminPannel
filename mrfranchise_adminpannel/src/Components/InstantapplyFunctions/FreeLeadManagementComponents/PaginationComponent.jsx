// components/PaginationComponent.jsx
import React from 'react';
import { Box, Pagination, Typography } from '@mui/material';

const PaginationComponent = ({ page, totalPages, onPageChange }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        mt: 4,
        gap: 2
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Page {page} of {totalPages}
      </Typography>
      <Pagination
        count={totalPages}
        page={page}
        onChange={onPageChange}
        color="primary"
        size="large"
        showFirstButton
        showLastButton
        sx={{
          '& .MuiPaginationItem-root': {
            borderRadius: 2,
            '&:hover': {
              transform: 'scale(1.1)'
            }
          }
        }}
      />
    </Box>
  );
};

export default PaginationComponent;
