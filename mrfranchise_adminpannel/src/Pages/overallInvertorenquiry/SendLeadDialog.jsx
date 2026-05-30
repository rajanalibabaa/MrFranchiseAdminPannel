import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Checkbox,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";

const SendLeadDialog = ({ open, onClose, investorData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch brands on search
  useEffect(() => {
    const fetchBrands = async () => {
      if (!searchTerm.trim()) {
        setBrands([]);
        return;
      }

      try {
        setLoading(true);
        setError("");
        
        const response = await axios.get(
          `http://localhost:5000/api/v1/brand-packages-plans/get-all`,
          {
            params: {
              search: searchTerm,
              limit: 20,
              page: 1,
            },
          }
        );

        console.log("Brand search response:", response.data);

        if (response.data.success) {
          setBrands(response.data.data || []);
        } else {
          setBrands([]);
        }
      } catch (err) {
        console.error("Error fetching brands:", err);
        setError("Failed to fetch brands");
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };

    const delaySearch = setTimeout(fetchBrands, 500);
    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  const handleToggleBrand = (brand) => {
    const isSelected = selectedBrands.some((b) => b._id === brand._id);

    if (isSelected) {
      setSelectedBrands(selectedBrands.filter((b) => b._id !== brand._id));
    } else {
      if (selectedBrands.length >= 7) {
        setError("Maximum 7 brands can be selected");
        return;
      }
      setSelectedBrands([...selectedBrands, brand]);
      setError("");
    }
  };

  const handleRemoveBrand = (brandId) => {
    setSelectedBrands(selectedBrands.filter((b) => b._id !== brandId));
    setError("");
  };

  const handleSendLeads = async () => {
    if (selectedBrands.length === 0) {
      setError("Please select at least one brand");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        investorId: investorData.uuid,
        investorName: investorData.investorName,
        investorEmail: investorData.investorEmail,
        investorPhone: investorData.investorPhone,
        brandIds: selectedBrands.map((b) => b._id),
        brandDetails: selectedBrands.map((b) => ({
          brandId: b._id,
          brandName: b.brandName,
          industry: b.industry,
          category: b.category,
        })),
      };

      console.log("Sending leads payload:", payload);

      // Replace with your actual API endpoint
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/leads/send-to-brands`,
        payload
      );

      console.log("Send leads response:", response.data);

      alert("✅ Leads sent successfully to selected brands!");
      onClose();
      setSelectedBrands([]);
      setSearchTerm("");
    } catch (err) {
      console.error("Error sending leads:", err);
      setError(err.response?.data?.message || "Failed to send leads");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedBrands([]);
    setSearchTerm("");
    setBrands([]);
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={600}>
            Send Lead to Brands
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Search and select up to 7 brands to send this investor's details
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {/* Search Box */}
        <TextField
          fullWidth
          placeholder="Search by brand name, industry, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchTerm("")}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {/* Selected Brands Counter */}
        <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="body2" fontWeight={600}>
            Selected Brands ({selectedBrands.length}/7)
          </Typography>
          {selectedBrands.length > 0 && (
            <Button
              size="small"
              onClick={() => setSelectedBrands([])}
              startIcon={<ClearIcon />}
            >
              Clear All
            </Button>
          )}
        </Box>

        {/* Selected Brands Chips */}
        {selectedBrands.length > 0 && (
          <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {selectedBrands.map((brand) => (
              <Chip
                key={brand._id}
                label={brand.brandName}
                onDelete={() => handleRemoveBrand(brand._id)}
                avatar={
                  <Avatar src={brand.logo} sx={{ width: 24, height: 24 }}>
                    {brand.brandName?.[0]}
                  </Avatar>
                }
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        )}

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Search Results */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress size={32} />
          </Box>
        ) : brands.length > 0 ? (
          <List sx={{ maxHeight: 400, overflow: "auto" }}>
            {brands.map((brand) => {
              const isSelected = selectedBrands.some((b) => b._id === brand._id);

              return (
                <ListItem
                  key={brand._id}
                  button
                  onClick={() => handleToggleBrand(brand)}
                  sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    mb: 1,
                    bgcolor: isSelected ? "#e3f2fd" : "#fff",
                    "&:hover": {
                      bgcolor: isSelected ? "#bbdefb" : "#f5f5f5",
                    },
                  }}
                  secondaryAction={
                    <Checkbox
                      edge="end"
                      checked={isSelected}
                      onChange={() => handleToggleBrand(brand)}
                    />
                  }
                >
                  <ListItemAvatar>
                    <Avatar src={brand.logo} sx={{ width: 48, height: 48 }}>
                      {brand.brandName?.[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography fontWeight={600}>{brand.brandName}</Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" display="block">
                          Industry: {brand.industry || "N/A"}
                        </Typography>
                        <Typography variant="caption" display="block">
                          Category: {brand.category || "N/A"}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        ) : searchTerm.trim() ? (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">
              No brands found for "{searchTerm}"
            </Typography>
          </Box>
        ) : (
          <Box textAlign="center" py={4}>
            <SearchIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
            <Typography color="text.secondary">
              Start typing to search for brands
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSendLeads}
          variant="contained"
          disabled={selectedBrands.length === 0 || submitting}
          startIcon={submitting ? <CircularProgress size={16} /> : <SendIcon />}
        >
          {submitting ? "Sending..." : `Send to ${selectedBrands.length} Brand(s)`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SendLeadDialog;