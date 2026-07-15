import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  IconButton,
  Button,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Add, Remove } from "@mui/icons-material";
import { GetApiCall } from "../../api/default/GetApi";
import { Api } from "../../api/apiurl";
import { useDispatch } from "react-redux";
import { goToNewIncoming } from "../../Redux/Slices/newIncomingSlice";
import socket from "../../Utils/socket";
import FbCount from "./FoodandBevaragesCount";
import LeadToggleControl from "./AutomationLeadPause";
import LeadPlansCountManage from "./LeadPlanCountManagement";

const Count = () => {
  const [brandsData, setBrandsData] = useState(null);
  const [emailConfig, setEmailConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [configLoading, setConfigLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [localConfig, setLocalConfig] = useState(null);
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

  const fetchEmailConfig = async () => {
    try {
      const response = await GetApiCall(Api.admin.get.instantApply.emailconfig);
      setEmailConfig(response.data?.data || {});
      setLocalConfig(response.data?.data || {});
      setConfigLoading(false);
    } catch (err) {
      console.error("Failed to fetch email config:", err);
      setConfigLoading(false);
    }
  };

  const updateEmailConfig = async () => {
    setUpdating(true);
    try {
      // const updateUrl = "http://localhost:5000/api/v1/admin/batch-email-config";
      const response = await fetch(Api.admin.get.instantApply.updateEmailConfig, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth if needed
        },
        body: JSON.stringify(localConfig)
      });
      
      const data = await response.json();
      if (data.success) {
        setEmailConfig(data.data);
        setLocalConfig(data.data);
      }
    } catch (err) {
      console.error("Failed to update email config:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleBatchSizeChange = (increment) => {
    if (!localConfig) return;
    
    const newBatchSize = increment 
      ? localConfig.batchSize + 1 
      : Math.max(1, localConfig.batchSize - 1);
    
    setLocalConfig({
      ...localConfig,
      batchSize: newBatchSize
    });
  };

  const handleMaxEmailsChange = (increment) => {
    if (!localConfig) return;
    
    const newMaxEmails = increment 
      ? localConfig.maxEmailsPerMonth + 1 
      : Math.max(1, localConfig.maxEmailsPerMonth - 1);
    
    setLocalConfig({
      ...localConfig,
      maxEmailsPerMonth: newMaxEmails
    });
  };

  const hasChanges = () => {
    return localConfig && emailConfig && (
      localConfig.batchSize !== emailConfig.batchSize ||
      localConfig.maxEmailsPerMonth !== emailConfig.maxEmailsPerMonth
    );
  };

  useEffect(() => {
    fetchBrands();
    fetchEmailConfig();
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
    console.log("==ppp== :",path)
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
    if (path === "paid") {
      dispatch(goToNewIncoming(3));
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
      {/* Top Row - Main Stats */}
      <Grid
        container
        spacing={2}
        sx={{
          flexWrap: "nowrap",
          "&::-webkit-scrollbar": { display: "none" },
          fontSize: { xs: "1rem", sm: ".25rem", md: "2rem" },
          p: "10px",
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
        <Grid item xs={3} sx={{ flex: "0 0 auto" }}>
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
                <FbCount />
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Paid Brands */}
    <Grid item xs={3} sx={{ flex: "0 0 auto" }}>
      <Card
        onClick={() => handleNavigate("paid")}
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
            Paid Brands 
          </Typography>
          <Typography
            variant="h5"
            color="warning.main"
            sx={{ fontSize: { xs: "1.5rem", md: "2rem" }, fontWeight: 600 }}
          >
            {brandsData.paidBrandsCount}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
      </Grid>

      <Grid item xs={12} sx={{ mt: 2,mb: 2 }}>
        <LeadPlansCountManage />
      </Grid>

      {/* Bottom Row - Controls */}
      <Grid
        container
        spacing={2}
        sx={{
          p: "10px",
          flexWrap: "nowrap",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {/* Lead Pause/Run Control */}
        <Grid item xs={6} sx={{ flex: "0 0 auto" }}>
          <Card
            sx={{
              transition: "all 0.3s ease",
              "&:hover": { boxShadow: 4 },
              height: "100%",
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="subtitle1" fontWeight="bold"
                sx={{ fontSize: { xs: ".6rem", md: "1.5rem" }, fontWeight: 600, mb: 1 }}
              >
                Lead - Pause / Run
              </Typography>
              <LeadToggleControl />
            </CardContent>
          </Card>
        </Grid>

        {/* Batch Email Configuration */}
        <Grid item xs={6} sx={{ flex: "0 0 auto" }}>
          <Card
            sx={{
              transition: "all 0.3s ease",
              "&:hover": { boxShadow: 4 },
              height: "100%",
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="subtitle1" fontWeight="bold"
                sx={{ fontSize: { xs: ".6rem", md: "1.5rem" }, fontWeight: 600, mb: 2 }}
              >
                Email Configuration
              </Typography>
              {configLoading ? (
                <CircularProgress size={24} />
              ) : localConfig ? (
                <Stack spacing={2} alignItems="center">
                  {/* Batch Size Control */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ minWidth: '100px', fontSize: { xs: "0.6rem", md: "0.9rem" } }}
                    >
                      Batch Size:
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleBatchSizeChange(false)}
                        disabled={updating}
                        color="primary"
                      >
                        <Remove />
                      </IconButton>
                      <Typography
                        variant="h6"
                        color="info.main"
                        sx={{ minWidth: '30px', textAlign: 'center', fontSize: { xs: "1rem", md: "1.5rem" }, fontWeight: 600 }}
                      >
                        {localConfig.batchSize}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => handleBatchSizeChange(true)}
                        disabled={updating}
                        color="primary"
                      >
                        <Add />
                      </IconButton>
                    </Stack>
                  </Box>

                  {/* Max Emails Control */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ minWidth: '100px', fontSize: { xs: "0.6rem", md: "0.9rem" } }}
                    >
                      Max Emails:
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleMaxEmailsChange(false)}
                        disabled={updating}
                        color="secondary"
                      >
                        <Remove />
                      </IconButton>
                      <Typography
                        variant="h6"
                        color="secondary.main"
                        sx={{ minWidth: '30px', textAlign: 'center', fontSize: { xs: "1rem", md: "1.5rem" }, fontWeight: 600 }}
                      >
                        {localConfig.maxEmailsPerMonth}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => handleMaxEmailsChange(true)}
                        disabled={updating}
                        color="secondary"
                      >
                        <Add />
                      </IconButton>
                    </Stack>
                  </Box>

                  {/* Update Button */}
                  {hasChanges() && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={updateEmailConfig}
                      disabled={updating}
                      size="small"
                    >
                      {updating ? <CircularProgress size={20} /> : 'Update'}
                    </Button>
                  )}

                </Stack>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.6rem", md: "0.9rem" } }}
                >
                  No configuration found
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>


    </Box>
  );
};

export default Count;