import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const ErrorPage = () => {
  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        textAlign="center"
      >
        <Typography variant="h1" color="error" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1">
          The page you're looking for doesn't exist or you don't have access.
        </Typography>
      </Box>
    </Container>
  );
};

export default ErrorPage;
