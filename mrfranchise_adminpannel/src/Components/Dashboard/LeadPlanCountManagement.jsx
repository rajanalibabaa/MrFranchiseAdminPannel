import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Paper,
  CircularProgress,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";



const LeadPlansCountManage = () => {
  const [counts, setCounts] = useState({
    leadPlan: 0,
    listingPlan: 0,
    free: 0,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL; // Replace with your actual API base URL
console.log("API_BASE_URL:", import.meta.env);
  const fetchCounts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_BASE_URL}/api/v1/leadPlanCountManage/get`
      );

      if (response.data?.success && response.data?.data) {
        setCounts({
          leadPlan: response.data.data.leadPlan || 0,
          listingPlan: response.data.data.listingPlan || 0,
          free: response.data.data.free || 0,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const increment = (field) => {
    setCounts((prev) => ({
      ...prev,
      [field]: prev[field] + 1,
    }));
  };

  const decrement = (field) => {
    setCounts((prev) => ({
      ...prev,
      [field]: Math.max(0, prev[field] - 1),
    }));
  };

  const handleInputChange = (field, value) => {
    const number = Number(value);

    setCounts((prev) => ({
      ...prev,
      [field]: number >= 0 ? number : 0,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await axios.put(
        `${API_BASE_URL}/api/v1/leadPlanCountManage/update`,
        counts
      );

      if (response.data?.success) {
        alert("Updated Successfully");
      }
    } catch (error) {
      console.error(error);
      alert("Update Failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        mt={5}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,ml: 5, mr: 2, mt: 2,
        borderRadius: 2,
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
        flexWrap="wrap"
      >
        {/* Lead Plan */}
        <Box display="flex" alignItems="center" gap={1}>
          <Typography fontWeight={600}>
            Lead Plan
          </Typography>

          <IconButton
            size="small"
            color="error"
            onClick={() => decrement("leadPlan")}
          >
            <RemoveIcon />
          </IconButton>

          <TextField
            size="small"
            value={counts.leadPlan}
            onChange={(e) =>
              handleInputChange(
                "leadPlan",
                e.target.value
              )
            }
            sx={{ width: 80 }}
          />

          <IconButton
            size="small"
            color="success"
            onClick={() => increment("leadPlan")}
          >
            <AddIcon />
          </IconButton>
        </Box>

        {/* Listing Plan */}
        <Box display="flex" alignItems="center" gap={1}>
          <Typography fontWeight={600}>
            Listing Plan
          </Typography>

          <IconButton
            size="small"
            color="error"
            onClick={() =>
              decrement("listingPlan")
            }
          >
            <RemoveIcon />
          </IconButton>

          <TextField
            size="small"
            value={counts.listingPlan}
            onChange={(e) =>
              handleInputChange(
                "listingPlan",
                e.target.value
              )
            }
            sx={{ width: 80 }}
          />

          <IconButton
            size="small"
            color="success"
            onClick={() =>
              increment("listingPlan")
            }
          >
            <AddIcon />
          </IconButton>
        </Box>

        {/* Free */}
        <Box display="flex" alignItems="center" gap={1}>
          <Typography fontWeight={600}>
            Free
          </Typography>

          <IconButton
            size="small"
            color="error"
            onClick={() => decrement("free")}
          >
            <RemoveIcon />
          </IconButton>

          <TextField
            size="small"
            value={counts.free}
            onChange={(e) =>
              handleInputChange(
                "free",
                e.target.value
              )
            }
            sx={{ width: 80 }}
          />

          <IconButton
            size="small"
            color="success"
            onClick={() => increment("free")}
          >
            <AddIcon />
          </IconButton>
        </Box>

        {/* Save Button */}
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </Box>
    </Paper>
  );
};

export default LeadPlansCountManage;