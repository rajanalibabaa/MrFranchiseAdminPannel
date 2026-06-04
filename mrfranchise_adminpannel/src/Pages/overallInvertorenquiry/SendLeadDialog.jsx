import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
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
  Tabs,
  Tab,
  Badge,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import ClearIcon from "@mui/icons-material/Clear";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";

/* ============================================================
   TAB PANEL
============================================================ */
const TabPanel = ({ children, value, index }) => {
  if (value !== index) return null;
  return <Box sx={{ pt: 2 }}>{children}</Box>;
};

/* ============================================================
   BRAND LIST SECTION
============================================================ */
const BrandListSection = React.memo(({
  brands,
  searchTerm,
  selectedBrands,
  onToggle,
  emptyLabel,
  loading,
}) => {
  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return brands;
    const q = searchTerm.toLowerCase();
    return brands.filter(
      (b) =>
        b.brandName?.toLowerCase().includes(q) ||
        b.industry?.toLowerCase().includes(q) ||
        b.category?.toLowerCase().includes(q)
    );
  }, [brands, searchTerm]);

  /* ---- selected set for O(1) lookup ---- */
  const selectedIds = useMemo(
    () => new Set(selectedBrands.map((b) => b._id)),
    [selectedBrands]
  );

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" py={6} gap={2}>
        <CircularProgress size={36} />
        <Typography variant="body2" color="text.secondary">
          Finding matching brands...
        </Typography>
      </Box>
    );
  }

  if (brands.length === 0) {
    return (
      <Box textAlign="center" py={6}>
        <Typography color="text.secondary" fontSize={14}>
          {emptyLabel}
        </Typography>
      </Box>
    );
  }

  if (filtered.length === 0) {
    return (
      <Box textAlign="center" py={6}>
        <Typography color="text.secondary" fontSize={14}>
          No brands found for &quot;{searchTerm}&quot;
        </Typography>
      </Box>
    );
  }

  return (
    <List disablePadding sx={{ maxHeight: 360, overflow: "auto", pr: 0.5 }}>
      {filtered.map((brand) => {
        const isSelected = selectedIds.has(brand._id);

        return (
          <BrandRow
            key={brand._id}
            brand={brand}
            isSelected={isSelected}
            onToggle={onToggle}
          />
        );
      })}
    </List>
  );
});

BrandListSection.displayName = "BrandListSection";

/* ============================================================
   BRAND ROW  — isolated to prevent full-list re-renders
============================================================ */
const BrandRow = React.memo(({ brand, isSelected, onToggle }) => {
  /* 
    FIX: Use a single handler ONLY on the row click.
    The Checkbox uses `checked` only (no onChange) so it
    does NOT fire a second event.
  */
  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      onToggle(brand);
    },
    [brand, onToggle]
  );

  return (
    <ListItem
      button
      onClick={handleClick}
      sx={{
        border: "1px solid",
        borderColor: isSelected ? "primary.main" : "#e0e0e0",
        borderRadius: 2,
        mb: 1,
        bgcolor: isSelected ? "#e3f2fd" : "#fff",
        transition: "background-color 0.15s ease, border-color 0.15s ease",
        "&:hover": {
          bgcolor: isSelected ? "#bbdefb" : "#f5f5f5",
        },
        pr: 7,
        userSelect: "none",
      }}
      secondaryAction={
        /* 
          pointer-events: none → clicks pass through to ListItem.
          This stops the double-fire completely.
        */
        <Checkbox
          edge="end"
          checked={isSelected}
          tabIndex={-1}
          disableRipple
          color="primary"
          sx={{ pointerEvents: "none" }}
        />
      }
    >
      <ListItemAvatar>
        <Avatar
          src={brand.logo}
          sx={{
            width: 46,
            height: 46,
            bgcolor: "primary.light",
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          {brand.brandName?.[0]}
        </Avatar>
      </ListItemAvatar>

      <ListItemText
        primary={
          <Box display="flex" alignItems="center" gap={0.8}>
            <Typography fontWeight={600} fontSize={14} noWrap>
              {brand.brandName}
            </Typography>
            {isSelected && (
              <CheckCircleIcon sx={{ fontSize: 15, color: "primary.main", flexShrink: 0 }} />
            )}
          </Box>
        }
        secondary={
          <Box component="span">
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
              noWrap
            >
              {brand.industry || "N/A"} &bull; {brand.category || "N/A"}
            </Typography>
            <Box display="flex" gap={0.5} flexWrap="wrap" mt={0.3}>
              {brand.packagesName && (
                <Chip
                  label={brand.packagesName}
                  size="small"
                  variant="outlined"
                  sx={{ height: 18, fontSize: "0.62rem", pointerEvents: "none" }}
                />
              )}
              {brand.remainingLeads !== undefined && (
                <Chip
                  label={`Leads Left: ${brand.remainingLeads}`}
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ height: 18, fontSize: "0.62rem", pointerEvents: "none" }}
                />
              )}
            </Box>
          </Box>
        }
      />
    </ListItem>
  );
});

BrandRow.displayName = "BrandRow";

/* ============================================================
   INITIAL STATES (defined outside to avoid recreation)
============================================================ */
const INITIAL_SEARCH = { LEAD: "", LISTING: "", FREE: "" };
const INITIAL_MATCHED = { LEAD: [], LISTING: [], FREE: [] };
const INITIAL_SUMMARY = { LEAD: 0, LISTING: 0, FREE: 0, TOTAL: 0 };

/* ============================================================
   MAIN DIALOG
============================================================ */
const SendLeadDialog = ({ open, onClose, investorData }) => {
  const [activeTab, setActiveTab]       = useState(0);
  const [searchTerms, setSearchTerms]   = useState(INITIAL_SEARCH);
  const [matchedData, setMatchedData]   = useState(INITIAL_MATCHED);
  const [summary, setSummary]           = useState(INITIAL_SUMMARY);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [loading, setLoading]           = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [error, setError]               = useState("");
  const [matchingCriteria, setMatchingCriteria] = useState(null);

  /* prevent stale fetch if dialog closes mid-request */
  const abortRef = useRef(null);

  /* ----------------------------------------------------------
     FETCH
  ---------------------------------------------------------- */
  useEffect(() => {
    if (!open || !investorData?.uuid) return;

    /* cancel previous request */
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    const fetchMatchedBrands = async () => {
      setLoading(true);
      setError("");
      setMatchedData(INITIAL_MATCHED);
      setSummary(INITIAL_SUMMARY);
      setMatchingCriteria(null);

      try {
        const response = await axios.post(
          "http://localhost:5000/api/v1/lead-match-enquiry",
          { investorUuid: investorData.uuid },
          { signal: abortRef.current.signal }
        );

        if (response.data.success) {
          const {
            data,
            summary: apiSummary,
            matchingCriteria: criteria,
          } = response.data;

          setMatchedData({
            LEAD:    data.LEAD    || [],
            LISTING: data.LISTING || [],
            FREE:    data.FREE    || [],
          });
          setSummary(apiSummary);
          setMatchingCriteria(criteria);
        } else {
          setError("Failed to fetch matching brands");
        }
      } catch (err) {
        if (axios.isCancel(err) || err.name === "CanceledError") return;
        console.error("Match fetch error:", err);
        setError(err.response?.data?.message || "Error fetching matching brands");
      } finally {
        setLoading(false);
      }
    };

    fetchMatchedBrands();

    return () => {
      /* cleanup on unmount or before next effect */
      if (abortRef.current) abortRef.current.abort();
    };
  }, [open, investorData?.uuid]); // ← only uuid, not whole object

  /* ----------------------------------------------------------
     RESET
  ---------------------------------------------------------- */
  const handleClose = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setSelectedBrands([]);
    setSearchTerms(INITIAL_SEARCH);
    setMatchedData(INITIAL_MATCHED);
    setSummary(INITIAL_SUMMARY);
    setError("");
    setActiveTab(0);
    setMatchingCriteria(null);
    onClose();
  }, [onClose]);

  /* ----------------------------------------------------------
     TOGGLE  — stable reference with useCallback
  ---------------------------------------------------------- */
  const handleToggleBrand = useCallback((brand) => {
    setSelectedBrands((prev) => {
      const exists = prev.some((b) => b._id === brand._id);

      if (exists) {
        /* deselect */
        setError("");
        return prev.filter((b) => b._id !== brand._id);
      }

      if (prev.length >= 7) {
        setError("Maximum 7 brands can be selected");
        return prev; // no change
      }

      setError("");
      return [...prev, brand];
    });
  }, []);

  const handleRemoveBrand = useCallback((brandId) => {
    setSelectedBrands((prev) => prev.filter((b) => b._id !== brandId));
    setError("");
  }, []);

  /* ----------------------------------------------------------
     SEND
  ---------------------------------------------------------- */
  const handleSendLeads = async () => {
    if (selectedBrands.length === 0) {
      setError("Please select at least one brand");
      return;
    }
console.log("Preparing to send leads with criteria:", {
  investorData
});
    try {
      setSubmitting(true);
      setError("");

      const payload = {
        investorId:    investorData.uuid,
        investorName:  investorData.investorName,
        investorEmail: investorData.investorEmail,
        investorPhone: investorData.investorPhone,
        readyToInvest: investorData.readyToInvest,        
planToInvest: investorData.planToInvest,
Industry: investorData.industry,
Category: investorData.category,
state: investorData.state,
district: investorData.district,
investmentRange: investorData.investmentRange,
        brandOwnerId: selectedBrands.map((b) => b.brandOwnerId), // send owner IDs for backend processing
        brandDetails: selectedBrands.map((b) => ({
          brandId:     b._id,
          brandOwnerId: b.brandOwnerId,
          brandName:   b.brandName,
          industry:    b.industry,
          category:    b.category,
          packageName: b.packagesName,
        })),
      };

      console.log("Sending Leads Payload:", payload);

     const response = await axios.post(
        "http://localhost:5000/api/v1/lead-match-send-to-brands",
        payload
      );

      alert(`✅ Leads sent to ${selectedBrands.length} brand(s) successfully!`);
      console.log("Send Leads Response:", response.data);
      handleClose();
    } catch (err) {
      console.error("Send leads error:", err);
      setError(err.response?.data?.message || "Failed to send leads");
    } finally {
      setSubmitting(false);
    }
  };

  /* ----------------------------------------------------------
     SEARCH HANDLER — stable
  ---------------------------------------------------------- */
  const handleSearchChange = useCallback((key, value) => {
    setSearchTerms((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSearchClear = useCallback((key) => {
    setSearchTerms((prev) => ({ ...prev, [key]: "" }));
  }, []);

  /* ----------------------------------------------------------
     TABS CONFIG
  ---------------------------------------------------------- */
  const tabs = useMemo(() => [
    {
      key: "LEAD",
      label: "LEAD",
      icon: <LeaderboardIcon sx={{ fontSize: 16 }} />,
      badgeColor: "primary",
      emptyLabel: "No LEAD package brands matched for this investor",
    },
    {
      key: "LISTING",
      label: "LISTING",
      icon: <ListAltIcon sx={{ fontSize: 16 }} />,
      badgeColor: "secondary",
      emptyLabel: "No LISTING package brands matched for this investor",
    },
    {
      key: "FREE",
      label: "FREE",
      icon: <FreeBreakfastIcon sx={{ fontSize: 16 }} />,
      badgeColor: "success",
      emptyLabel: "No FREE package brands matched for this investor",
    },
  ], []);

  /* ----------------------------------------------------------
     RENDER
  ---------------------------------------------------------- */
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, minHeight: 620 } }}
    >
      {/* ===== TITLE ===== */}
      <DialogTitle sx={{ pb: 1.5 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700}>
            📤 Send Lead to Brands
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Investor Info Chips */}
        {investorData && (
          <Box
            sx={{
              mt: 1.5,
              p: 1.5,
              bgcolor: "#f0f4ff",
              borderRadius: 2,
              display: "flex",
              flexWrap: "wrap",
              gap: 0.8,
            }}
          >
            <Chip
              label={`👤 ${investorData.investorName || "Investor"}`}
              size="small"
              variant="outlined"
              color="primary"
            />
            {matchingCriteria?.industry && (
              <Chip
                label={`🏭 ${matchingCriteria.industry}`}
                size="small"
                variant="outlined"
              />
            )}
            {matchingCriteria?.investmentRange && (
              <Chip
                label={`💰 ${matchingCriteria.investmentRange}`}
                size="small"
                variant="outlined"
                color="success"
              />
            )}
            {matchingCriteria?.state && (
              <Chip
                label={`📍 ${matchingCriteria.state}${
                  matchingCriteria.district ? ` – ${matchingCriteria.district}` : ""
                }`}
                size="small"
                variant="outlined"
                color="warning"
              />
            )}
          </Box>
        )}

        {/* Summary Chips */}
        {!loading && (
          <Box display="flex" gap={0.8} mt={1.5} flexWrap="wrap">
            <Chip
              icon={<LeaderboardIcon />}
              label={`LEAD: ${summary.LEAD}`}
              size="small"
              color="primary"
              variant={summary.LEAD > 0 ? "filled" : "outlined"}
            />
            <Chip
              icon={<ListAltIcon />}
              label={`LISTING: ${summary.LISTING}`}
              size="small"
              color="secondary"
              variant={summary.LISTING > 0 ? "filled" : "outlined"}
            />
            <Chip
              icon={<FreeBreakfastIcon />}
              label={`FREE: ${summary.FREE}`}
              size="small"
              color="success"
              variant={summary.FREE > 0 ? "filled" : "outlined"}
            />
            <Chip
              label={`TOTAL: ${summary.TOTAL}`}
              size="small"
              variant="outlined"
            />
          </Box>
        )}
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column" }}>

        {/* ===== SELECTED BRANDS AREA ===== */}
        {selectedBrands.length > 0 && (
          <Box
            sx={{
              px: 3, pt: 2, pb: 1.5,
              bgcolor: "#fafafa",
              borderBottom: "1px solid #eee",
              flexShrink: 0,
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography variant="body2" fontWeight={700} color="primary">
                ✅ Selected Brands ({selectedBrands.length}/7)
              </Typography>
              <Button
                size="small"
                color="error"
                onClick={() => { setSelectedBrands([]); setError(""); }}
                startIcon={<ClearIcon />}
              >
                Clear All
              </Button>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={0.8}>
              {selectedBrands.map((brand) => (
                <Chip
                  key={brand._id}
                  label={brand.brandName}
                  onDelete={() => handleRemoveBrand(brand._id)}
                  avatar={
                    <Avatar src={brand.logo}>
                      {brand.brandName?.[0]}
                    </Avatar>
                  }
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </Box>
        )}

        {/* ===== ERROR ===== */}
        {error && (
          <Box px={3} pt={2} flexShrink={0}>
            <Alert
              severity="error"
              onClose={() => setError("")}
              sx={{ borderRadius: 2 }}
            >
              {error}
            </Alert>
          </Box>
        )}

        {/* ===== TABS + SEARCH + LIST ===== */}
        <Box sx={{ px: 3, pt: 2, flex: 1, overflow: "hidden" }}>
          {/* Tab Headers */}
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            sx={{
              borderBottom: "1px solid #e0e0e0",
              "& .MuiTab-root": { minHeight: 44, fontWeight: 600, fontSize: 13 },
            }}
          >
            {tabs.map((tab, idx) => (
              <Tab
                key={tab.key}
                value={idx}
                label={
                  <Badge
                    badgeContent={matchedData[tab.key]?.length ?? 0}
                    color={tab.badgeColor}
                    showZero
                    sx={{ "& .MuiBadge-badge": { fontSize: 9, minWidth: 16, height: 16 } }}
                  >
                    <Box display="flex" alignItems="center" gap={0.5} pr={2}>
                      {tab.icon}
                      {tab.label}
                    </Box>
                  </Badge>
                }
              />
            ))}
          </Tabs>

          {/* Tab Panels */}
          {tabs.map((tab, idx) => (
            <TabPanel key={tab.key} value={activeTab} index={idx}>
              {/* Per-tab Search */}
              <TextField
                fullWidth
                size="small"
                placeholder={`Search in ${tab.label} brands...`}
                value={searchTerms[tab.key]}
                onChange={(e) => handleSearchChange(tab.key, e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerms[tab.key] ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => handleSearchClear(tab.key)}
                        edge="end"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
                sx={{ mb: 1.5 }}
              />

              {/* Brand List */}
              <BrandListSection
                brands={matchedData[tab.key] || []}
                searchTerm={searchTerms[tab.key]}
                selectedBrands={selectedBrands}
                onToggle={handleToggleBrand}
                emptyLabel={tab.emptyLabel}
                loading={loading}
              />
            </TabPanel>
          ))}
        </Box>
      </DialogContent>

      <Divider />

      {/* ===== ACTIONS ===== */}
      <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
        <Typography variant="body2" color="text.secondary">
          {selectedBrands.length > 0
            ? `${selectedBrands.length} brand(s) ready to send`
            : "Select brands from the tabs above"}
        </Typography>
        <Box display="flex" gap={1}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSendLeads}
            variant="contained"
            disabled={selectedBrands.length === 0 || submitting}
            startIcon={
              submitting
                ? <CircularProgress size={16} color="inherit" />
                : <SendIcon />
            }
            sx={{ minWidth: 170 }}
          >
            {submitting
              ? "Sending..."
              : `Send to ${selectedBrands.length} Brand(s)`}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default SendLeadDialog;