import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Grid,
  Alert,
  CircularProgress
} from "@mui/material";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/admin/leadsFreeAndPaidStopAndStart";

const LeadToggleControl = () => {
  const [leadStatus, setLeadStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeadStatus = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      if (res.data.success) setLeadStatus(res.data.data?.brandBatch || {});
    } catch {
      setError("Failed to fetch status");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (field, newValue) => {
    try {
      await axios.put(API_URL, { [field]: newValue });
      setLeadStatus((prev) => ({ ...prev, [field]: newValue }));
    } catch {
      setError(`Failed to update ${field}`);
    }
  };

  useEffect(() => {
    fetchLeadStatus();
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress size={22} />
      </Box>
    );

  const fieldLabels = {
    isFreeLeadsBrandPaused: "Free Leads",
    // isDistrictMatchPaused: "Paid Leads",
    isPaidCategoryInvestmentrangeLocationLeadsPaused: "Cat+Inv+Loc",
    isPaidCategoryInvestmentrangePaused: "Cat+Inv",
    isPaidCategoryLocationPaused: "Cat+Loc",
    isPaidLocationInvestmentRangeLeadsPaused: "Loc+Inv",
    isDistrictMatchPaused: "District Match",
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography
        variant="subtitle1"
        sx={{ mb: 1, fontSize: 13, fontWeight: 600 }}
      >
        Lead Management Control
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 1, fontSize: 11, p: 0.5 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={1}>
        {Object.entries(fieldLabels).map(([field, label]) => (
          <Grid item xs={12} sm={6} md={4} key={field}>
            <Paper
              sx={{
                p: 1,
                borderRadius: 1,
                boxShadow: 0,
                border: "1px solid #eee",
                "&:hover": { boxShadow: 1 },
              }}
            >
              <Typography sx={{ fontSize: 12, fontWeight: 600, mb: 0.5 }}>
                {label}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mb: 0.3 }}>
                <Typography sx={{ fontSize: 10, color: "text.secondary" }}>
                  {leadStatus[field] ? "PAUSED" : "ACTIVE"}
                </Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={!leadStatus[field]}
                    onChange={(e) => handleToggle(field, !e.target.checked)}
                    color="success"
                  />
                }
                label={
                  <Typography sx={{ fontSize: 10 }}>
                    {leadStatus[field] ? "Paused" : "Active"}
                  </Typography>
                }
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LeadToggleControl;
