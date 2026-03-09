import React from "react";
import { Box, Typography, Container } from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  const { adminData } = useSelector((state) => state.admin);

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

        {!(adminData?.adminData?.uuid) && (
          <Link to="/" style={{ marginTop: "1rem", color: "blue" }}>
            Please login
          </Link>
        )}
      </Box>
    </Container>
  );
};

export default ErrorPage;
