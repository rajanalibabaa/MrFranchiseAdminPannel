import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SidebarAdmin from "../../Pages/dashboardOutlet/SidebarAdmin";
import { GetApiCall } from "../../api/default/GetApi";
import { Api } from "../../api/apiurl";
import { useDispatch } from "react-redux";
import socket from "../../Utils/socket";

const FbCount = () => {
  const [count, setCount] = useState(0);
console.log('courn',count);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    
const fetchCount = async () => {
      try {
        const schema = "FoodAndBeverageLeads";
        const response = await GetApiCall(`${Api.admin.get.instantApply.data}/${schema}`);
        
        // ✅ Check actual data structure
        console.log("API Response:", response.data);

        const totalCount = response.data?.data || 0;
        setCount(totalCount);
      } catch (err) {
        console.error("❌ Error fetching count:", err);
        setError("Failed to fetch Food & Beverage leads count.");
      } finally {
        setLoading(false);
      }
    };
    fetchCount();
  }, []);

  // ✅ Live count updates via socket
  useEffect(() => {
    socket.on("receive", (newCount) => {
      console.log("📥 Updated brand count via socket:", newCount);
      setCount(newCount);
    });

    // Clean up listener
    return () => {
      socket.off("receive");
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
   <Typography variant="h3" color="primary">
              {count?.pagination?.totalCount}
            </Typography>
  );
};

export default FbCount;
