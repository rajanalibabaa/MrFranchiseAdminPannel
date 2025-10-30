import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SidebarAdmin from "../../Pages/dashboardOutlet/SidebarAdmin";
import { GetApiCall } from "../../api/default/GetApi";
import { Api } from "../../api/apiurl";
import { useDispatch } from "react-redux";
import { goToNewIncoming } from "../../Redux/Slices/newIncomingSlice";
import socket from "../../utils/socket";

const Count = () => {
  const [brandsData, setBrandsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchBrands = async () => {
    try {
      const response = await GetApiCall(Api.admin.get.user.usersCount);
      setBrandsData(response.data?.data || {});
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    socket.on("recevie", (count) => {
      console.log("📥 Updated brand count:", count);
      setBrandsData((prevData) => ({
        ...prevData,
        newBrandsCount: count,
      }));
      const audio = new Audio("/ting.mp3");
      audio.play();
    });

    return () => {
      socket.off("recevie");
    };
  }, []);

  const handleNavigate = (path) => {
    if (path === "newIncoming") {
      dispatch(goToNewIncoming(1));
      navigate("/dashboard/getallbrands");
      return;
    }
    if (path === "brands") {
      dispatch(goToNewIncoming(0));
      navigate("/dashboard/getallbrands");
      return;
    }
    navigate(path);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
<Box m={0} flexGrow={1}>
  <Grid
    container
    spacing={2}
    sx={{
      flexWrap: "nowrap", // prevents wrapping
      // overflowX: "auto",  // enables horizontal scroll on small screens
      "&::-webkit-scrollbar": { display: "none" }, 
      fontSize: { xs: "1rem", sm: ".25rem", md: "2rem" },
      p:"10px",
      
    }}
  >
    {/* Total Brands */}
    <Grid item xs={3} sx={{ flex: "0 0 auto" }}>
      <Card
        onClick={() => handleNavigate("brands")}
        sx={{
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": { boxShadow: 6, transform: "scale(1.05)" },
          height: "100%",
        }}
      >
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="subtitle1" fontWeight="bold"
             sx={{ fontSize: { xs: ".6rem", md: "2rem" }, fontWeight: 600 }}
          >
            Total Brands
          </Typography>
          <Typography
            variant="h5"
            color="primary"
            sx={{ fontSize: { xs: "1rem", md: "2rem" }, fontWeight: 600 }}
          >
            {brandsData.brandsCount}
          </Typography>
        </CardContent>
      </Card>
    </Grid>

    {/* New Incoming Brands */}
    <Grid item xs={3} sx={{ flex: "0 0 auto" }}
    
    >
      <Card
        onClick={() => handleNavigate("newIncoming")}
        sx={{
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": { boxShadow: 6, transform: "scale(1.05)" },
          height: "100%",
        }}
      >
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="subtitle1" fontWeight="bold"
           sx={{ fontSize: { xs: ".6rem", md: "2rem" }, fontWeight: 600 }}
          >
            New Incoming Brands
          </Typography>
          <Typography
            variant="h5"
            color="secondary"
            sx={{ fontSize: { xs: "1rem", md: "2rem" }, fontWeight: 600 }}
          >
            {brandsData.newBrandsCount}
          </Typography>
        </CardContent>
      </Card>
    </Grid>

    {/* Investors */}
    <Grid item xs={3} sx={{ flex: "0 0 auto" }}>
      <Card
        onClick={() => handleNavigate("/dashboard/allinvestors")}
        sx={{
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": { boxShadow: 6, transform: "scale(1.05)" },
          height: "100%",
        }}
      >
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="subtitle1" fontWeight="bold"
           sx={{ fontSize: { xs: ".6rem", md: "2rem" }, fontWeight: 600 }}
          >
            Investors
          </Typography>
          <Typography
            variant="h5"
            color="warning.main"
            sx={{ fontSize: { xs: "1.5rem", md: "2rem" }, fontWeight: 600 }}
          >
            {brandsData.investorsCount}
          </Typography>
        </CardContent>
      </Card>
    </Grid>

    {/* Instant Apply */}
    <Grid item xs={3} sx={{ flex: "0 0 auto" }}>
      <Card
        onClick={() => handleNavigate("/dashboard/instantapply")}
        sx={{
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": { boxShadow: 6, transform: "scale(1.05)" },
          height: "100%",
        }}
      >
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="subtitle1" fontWeight="bold"
             sx={{ fontSize: { xs: ".6rem", md: "2rem" }, fontWeight: 600 }}
          >
            F&B Instant Apply
          </Typography>
          <Typography
            variant="h5"
            color="success.main"
            sx={{ fontSize: { xs: "1.5rem", md: "2rem" }, fontWeight: 600 }}
          >
            {brandsData.instantApplyCount}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
</Box>

  );
};

export default Count;
