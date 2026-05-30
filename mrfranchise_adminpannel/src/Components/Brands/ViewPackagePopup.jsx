import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
  TextField,
  Switch,
  FormControlLabel,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Grid,
  IconButton,
  Tooltip,
  Badge,
  Popover,
  Avatar,
  LinearProgress,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SettingsIcon from "@mui/icons-material/Settings";
import axios from "axios";
import { toast } from "react-toastify";

// ═══════════════════════════════════════════════════════════
// 🏢 CORPORATE DESIGN SYSTEM
// ═══════════════════════════════════════════════════════════

const CORPORATE_COLORS = {
  primary: "#0f172a",      // Slate 900
  primaryLight: "#1e293b", // Slate 800
  accent: "#2563eb",       // Blue 600
  accentHover: "#1d4ed8",  // Blue 700
  border: "#e2e8f0",       // Slate 200
  bg: "#f8fafc",           // Slate 50
  text: "#334155",         // Slate 700
  textLight: "#64748b",    // Slate 500
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
};

const CorporateCard = styled(Card)(({ theme }) => ({
  background: "#ffffff",
  borderRadius: 8,
  border: `1px solid ${CORPORATE_COLORS.border}`,
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  overflow: "hidden",
  transition: "box-shadow 0.2s ease",
  "&:hover": {
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
}));

const CorporateHeader = styled(Box)(({ theme }) => ({
  background: CORPORATE_COLORS.primary,
  color: "#fff",
  padding: theme.spacing(2.5, 3),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: `1px solid ${alpha("#fff", 0.1)}`,
}));

const CorporateTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 6,
    backgroundColor: "#fff",
    fontSize: 13,
    "& fieldset": {
      borderColor: CORPORATE_COLORS.border,
    },
    "&:hover fieldset": {
      borderColor: CORPORATE_COLORS.textLight,
    },
    "&.Mui-focused fieldset": {
      borderColor: CORPORATE_COLORS.accent,
      borderWidth: 1,
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: 12,
    fontWeight: 600,
    color: CORPORATE_COLORS.textLight,
    "&.Mui-focused": {
      color: CORPORATE_COLORS.accent,
    },
  },
  "& .MuiInputBase-input": {
    padding: "10px 12px",
    color: CORPORATE_COLORS.text,
  },
}));

const CorporateChip = styled(Chip)(({ theme, chipcolor }) => ({
  borderRadius: 4,
  height: 24,
  fontSize: 11,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: 0.3,
  backgroundColor: chipcolor ? alpha(chipcolor, 0.1) : "#f1f5f9",
  color: chipcolor || CORPORATE_COLORS.text,
  border: `1px solid ${chipcolor ? alpha(chipcolor, 0.2) : CORPORATE_COLORS.border}`,
  "& .MuiChip-icon": {
    color: chipcolor || CORPORATE_COLORS.text,
    fontSize: 14,
    marginLeft: 4,
  },
}));

const CorporateButton = styled(Button)(({ theme, variant = "contained" }) => ({
  borderRadius: 6,
  textTransform: "none",
  fontWeight: 600,
  fontSize: 13,
  padding: "8px 20px",
  boxShadow: "none",
  ...(variant === "contained" && {
    backgroundColor: CORPORATE_COLORS.accent,
    color: "#fff",
    "&:hover": {
      backgroundColor: CORPORATE_COLORS.accentHover,
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    },
  }),
  ...(variant === "outlined" && {
    borderColor: CORPORATE_COLORS.border,
    color: CORPORATE_COLORS.text,
    "&:hover": {
      borderColor: CORPORATE_COLORS.textLight,
      backgroundColor: "#f8fafc",
    },
  }),
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 16,
  paddingBottom: 8,
  borderBottom: `1px solid ${CORPORATE_COLORS.border}`,
}));

const SectionLabel = styled(Typography)(({ theme }) => ({
  fontSize: 11,
  fontWeight: 700,
  color: CORPORATE_COLORS.textLight,
  textTransform: "uppercase",
  letterSpacing: 0.8,
}));

// ═══════════════════════════════════════════════════════════
// CONSTANTS & HELPERS
// ═══════════════════════════════════════════════════════════

const STATUS_CONFIG = [
  { field: "isActive", label: "Active", color: CORPORATE_COLORS.success },
  { field: "isPending", label: "Pending", color: CORPORATE_COLORS.warning },
  { field: "isExperied", label: "Expired", color: CORPORATE_COLORS.error },
  { field: "isPaused", label: "Paused", color: CORPORATE_COLORS.textLight },
];

const SECTION_ICONS = {
  basic: <BusinessCenterIcon sx={{ fontSize: 14, color: CORPORATE_COLORS.accent }} />,
  financial: <LeaderboardIcon sx={{ fontSize: 14, color: CORPORATE_COLORS.accent }} />,
  calendar: <CalendarMonthIcon sx={{ fontSize: 14, color: CORPORATE_COLORS.accent }} />,
  settings: <SettingsIcon sx={{ fontSize: 14, color: CORPORATE_COLORS.accent }} />,
  location: <LocationOnIcon sx={{ fontSize: 14, color: CORPORATE_COLORS.accent }} />,
};

const toDateInput = (iso) => (iso ? iso.split("T")[0] : "");

// ═══════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════

const AddDistrictField = ({ onAdd }) => {
  const [val, setVal] = useState("");

  const submit = () => {
    if (!val.trim()) return;
    onAdd(val.trim());
    setVal("");
  };

  return (
    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
      <CorporateTextField
        size="small"
        placeholder="Add district..."
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        sx={{ flex: 1 }}
      />
      <CorporateButton size="small" onClick={submit} startIcon={<AddCircleOutlineIcon sx={{ fontSize: 16 }} />}>
        Add
      </CorporateButton>
    </Box>
  );
};

const LocationEditor = ({ investmentranges, onChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [localRanges, setLocalRanges] = useState([]);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => {
    setLocalRanges(JSON.parse(JSON.stringify(investmentranges || [])));
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);
  const handleApply = () => {
    onChange(localRanges);
    handleClose();
  };

  const totalSelected = (investmentranges || []).reduce(
    (acc, r) => acc + (r.selectedPlanStateAndDistrict || []).reduce((a, s) => a + (s.district?.length || 0), 0),
    0
  );

  const toggleDistrict = (rIdx, sIdx, district) => {
    setLocalRanges((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const dists = next[rIdx].selectedPlanStateAndDistrict[sIdx].district;
      const pos = dists.indexOf(district);
      if (pos === -1) dists.push(district);
      else dists.splice(pos, 1);
      return next;
    });
  };

  const addDistrict = (rIdx, sIdx, dist) => {
    setLocalRanges((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const arr = next[rIdx].selectedPlanStateAndDistrict[sIdx].district;
      if (!arr.includes(dist)) arr.push(dist);
      return next;
    });
  };

  const clearAllDistricts = (rIdx, sIdx) => {
    setLocalRanges((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next[rIdx].selectedPlanStateAndDistrict[sIdx].district = [];
      return next;
    });
  };

  const handleStateNameChange = (rIdx, sIdx, val) => {
    setLocalRanges((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next[rIdx].selectedPlanStateAndDistrict[sIdx].state = val;
      return next;
    });
  };

  const handleRangeLabelChange = (rIdx, val) => {
    setLocalRanges((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next[rIdx].selectedPlanInvestmetrange = val;
      return next;
    });
  };

  return (
    <>
      <Tooltip title="Edit Locations" placement="top">
        <Badge badgeContent={totalSelected} color="primary" max={999} sx={{ "& .MuiBadge-badge": { fontSize: 10, height: 18, minWidth: 18 } }}>
          <IconButton
            size="small"
            onClick={handleOpen}
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              bgcolor: alpha(CORPORATE_COLORS.accent, 0.1),
              color: CORPORATE_COLORS.accent,
              border: `1px solid ${alpha(CORPORATE_COLORS.accent, 0.2)}`,
              "&:hover": { bgcolor: alpha(CORPORATE_COLORS.accent, 0.15) },
            }}
          >
            <EditLocationAltIcon fontSize="small" />
          </IconButton>
        </Badge>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            width: 520,
            maxHeight: 600,
            borderRadius: 2,
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            border: `1px solid ${CORPORATE_COLORS.border}`,
          },
        }}
      >
        <Box sx={{ bgcolor: CORPORATE_COLORS.primary, p: 2, color: "#fff" }}>
          <Typography fontWeight={700} fontSize={14}>
            Location Manager
          </Typography>
          <Typography fontSize={11} sx={{ opacity: 0.7, mt: 0.5 }}>
            Configure investment ranges and districts
          </Typography>
        </Box>

        <Box sx={{ overflowY: "auto", maxHeight: 480, p: 2, bgcolor: "#fff" }}>
          {localRanges.length === 0 ? (
            <Typography fontSize={13} color="text.secondary" textAlign="center" py={4}>
              No ranges configured
            </Typography>
          ) : (
            localRanges.map((range, rIdx) => (
              <Box key={rIdx} sx={{ mb: 2, border: `1px solid ${CORPORATE_COLORS.border}`, borderRadius: 2, p: 1.5 }}>
                <CorporateTextField
                  size="small"
                  fullWidth
                  value={range.selectedPlanInvestmetrange || ""}
                  onChange={(e) => handleRangeLabelChange(rIdx, e.target.value)}
                  InputProps={{
                    startAdornment: <TrendingUpIcon sx={{ mr: 1, fontSize: 16, color: CORPORATE_COLORS.accent }} />,
                  }}
                  sx={{ mb: 1.5 }}
                />

                {(range.selectedPlanStateAndDistrict || []).map((s, sIdx) => (
                  <Accordion key={sIdx} disableGutters sx={{ mb: 1, border: `1px solid ${CORPORATE_COLORS.border}`, "&:before": { display: "none" } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: 40, bgcolor: "#f8fafc" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
                        <Typography fontSize={12} fontWeight={600} sx={{ flex: 1 }}>
                          {s.state}
                        </Typography>
                        <CorporateChip label={`${s.district?.length || 0} districts`} chipcolor={s.district?.length > 0 ? CORPORATE_COLORS.success : null} />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 1.5 }}>
                      <CorporateTextField
                        size="small"
                        label="State Name"
                        fullWidth
                        value={s.state}
                        onChange={(e) => handleStateNameChange(rIdx, sIdx, e.target.value)}
                        sx={{ mb: 1 }}
                      />
                      {s.district?.length > 0 && (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>
                          {s.district.map((d, dIdx) => (
                            <Chip
                              key={dIdx}
                              label={d}
                              size="small"
                              onDelete={() => toggleDistrict(rIdx, sIdx, d)}
                              sx={{ fontSize: 10, borderRadius: 1, height: 20 }}
                            />
                          ))}
                        </Box>
                      )}
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ flex: 1 }}>
                          <AddDistrictField onAdd={(dist) => addDistrict(rIdx, sIdx, dist)} />
                        </Box>
                        {s.district?.length > 0 && (
                          <Tooltip title="Clear all">
                            <IconButton size="small" color="error" onClick={() => clearAllDistricts(rIdx, sIdx)}>
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            ))
          )}
        </Box>

        <Box sx={{ p: 1.5, borderTop: `1px solid ${CORPORATE_COLORS.border}`, display: "flex", justifyContent: "flex-end", gap: 1, bgcolor: "#f8fafc" }}>
          <CorporateButton variant="outlined" size="small" onClick={handleClose}>
            Cancel
          </CorporateButton>
          <CorporateButton size="small" onClick={handleApply} startIcon={<CheckCircleRoundedIcon sx={{ fontSize: 16 }} />}>
            Apply
          </CorporateButton>
        </Box>
      </Popover>
    </>
  );
};

const LocationViewPopover = ({ investmentranges }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <>
      <Tooltip title="View Locations" placement="top">
        <IconButton
          size="small"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            bgcolor: alpha(CORPORATE_COLORS.textLight, 0.1),
            color: CORPORATE_COLORS.textLight,
            border: `1px solid ${CORPORATE_COLORS.border}`,
            "&:hover": { bgcolor: alpha(CORPORATE_COLORS.textLight, 0.15) },
          }}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        PaperProps={{ sx: { borderRadius: 2, maxWidth: 360, maxHeight: 400, border: `1px solid ${CORPORATE_COLORS.border}` } }}
      >
        <Box sx={{ p: 1.5, bgcolor: CORPORATE_COLORS.primaryLight, color: "#fff" }}>
          <Typography fontSize={13} fontWeight={700}>
            Location Overview
          </Typography>
        </Box>
        <Box sx={{ overflow: "auto", maxHeight: 340, p: 1.5 }}>
          {investmentranges?.map((range, i) => (
            <Box key={i} sx={{ mb: 1.5 }}>
              <Typography fontSize={11} fontWeight={700} color={CORPORATE_COLORS.accent} sx={{ mb: 0.5 }}>
                {range.selectedPlanInvestmetrange}
              </Typography>
              {range.selectedPlanStateAndDistrict?.map((s, j) => (
                <Box key={j} sx={{ display: "flex", justifyContent: "space-between", py: 0.4, px: 1, bgcolor: j % 2 ? "#f8fafc" : "#fff", borderRadius: 1, mb: 0.3 }}>
                  <Typography fontSize={11}>{s.state}</Typography>
                  <Typography fontSize={11} color="text.secondary">
                    {s.district?.length || 0} districts
                    
                  </Typography>
                </Box>
              ))}
              {i < investmentranges.length - 1 && <Divider sx={{ my: 1 }} />}
            </Box>
          ))}
        </Box>
      </Popover>
    </>
  );
};

const StatusBadge = ({ inv }) => (
  <Stack direction="row" spacing={0.5} flexWrap="wrap">
    {STATUS_CONFIG.map(
      ({ field, label, color }) =>
        inv[field] && <CorporateChip key={field} label={label} chipcolor={color} size="small" />
    )}
  </Stack>
);

// const LeadProgress = ({ total, remaining }) => {
//   const used = total - remaining;
//   const pct = total > 0 ? Math.round((used / total) * 100) : 0;
//   const color = pct > 80 ? CORPORATE_COLORS.error : pct > 50 ? CORPORATE_COLORS.warning : CORPORATE_COLORS.success;

//   return (
//     <Box sx={{ mb: 2, p: 1.5, bgcolor: "#f8fafc", borderRadius: 2, border: `1px solid ${CORPORATE_COLORS.border}` }}>
//       <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
//         <Typography fontSize={10} fontWeight={700} color={CORPORATE_COLORS.textLight} textTransform="uppercase">
//           Lead Usage
//         </Typography>
//         <Typography fontSize={11} fontWeight={700} sx={{ color }}>
//           {pct}%
//         </Typography>
//       </Box>
//       <LinearProgress
//         variant="determinate"
//         value={pct}
//         sx={{
//           height: 6,
//           borderRadius: 3,
//           bgcolor: "#e2e8f0",
//           "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 3 },
//         }}
//       />
//       <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
//         <Typography fontSize={10} color="text.secondary">
//           {used} used
//         </Typography>
//         <Typography fontSize={10} color="text.secondary">
//           {remaining} remaining
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

const SectionCard = ({ title, icon, children }) => (
  <Box sx={{ mb: 2 }}>
    <SectionHeader>
      {icon}
      <SectionLabel>{title}</SectionLabel>
    </SectionHeader>
    <Box sx={{ p: 2, bgcolor: "#fff", border: `1px solid ${CORPORATE_COLORS.border}`, borderRadius: 2 }}>{children}</Box>
  </Box>
);

const InvestmentPackageCard = ({ inv, pkgIndex, invIndex, onChange }) => {
  const update = useCallback((field, value) => onChange(pkgIndex, invIndex, field, value), [pkgIndex, invIndex, onChange]);
  const handleRangesChange = (newRanges) => update("investmentranges", newRanges);

  return (
    <CorporateCard sx={{ m: 2 }}>
      <Box sx={{ p: 2, bgcolor: "#f8fafc", borderBottom: `1px solid ${CORPORATE_COLORS.border}`, display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar sx={{ width: 36, height: 36, borderRadius: 1, bgcolor: CORPORATE_COLORS.primary, fontSize: 14, fontWeight: 700 }}>
          {(inv.packagesName || "P").charAt(0)}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography fontWeight={700} fontSize={14} color={CORPORATE_COLORS.text}>
            {inv.packagesName || "Package"}
          </Typography>
          <Typography fontSize={10} color={CORPORATE_COLORS.textLight} sx={{ fontFamily: "monospace" }}>
            ID: {inv.planUniqueId} • DB: {inv._id?.slice(-6)}
          </Typography>
        </Box>
        <StatusBadge inv={inv} />
      </Box>

      <CardContent sx={{ p: 2, bgcolor: "#fff" }}>
        {/* <LeadProgress total={inv.totalLeads ?? 0} remaining={inv.remainingLeads ?? 0} /> */}

        <SectionCard title="Basic Information" icon={SECTION_ICONS.basic}>
          <Grid container spacing={1.5}>
            {[
              { label: "Package Name", field: "packagesName", type: "text" },
              { label: "Plan ID", field: "planUniqueId", type: "text" },
              { label: "Investment Label", field: "investmetRageLabel", type: "text" },
              { label: "Validity (days)", field: "validity", type: "number" },
            ].map(({ label, field, type }) => (
              <Grid item xs={12} sm={6} md={3} key={field}>
                <CorporateTextField
                  label={label}
                  size="small"
                  fullWidth
                  type={type}
                  value={inv[field] ?? ""}
                  onChange={(e) => update(field, type === "number" ? Number(e.target.value) : e.target.value)}
                />
              </Grid>
            ))}
          </Grid>
        </SectionCard>

        <SectionCard title="Financials & Leads" icon={SECTION_ICONS.financial}>
          <Grid container spacing={1.5}>
            {[
              { label: "Total Amount", field: "totalAmount", type: "number" },
              { label: "Total Leads", field: "totalLeads", type: "number" },
              { label: "Remaining", field: "remainingLeads", type: "number" },
              { label: "Sending", field: "sendingLeads", type: "number" },
              { label: "Sending %", field: "sendingPercentage", type: "number" },
            ].map(({ label, field, type }) => (
              <Grid item xs={6} sm={4} md={2.4} key={field}>
                <CorporateTextField
                  label={label}
                  size="small"
                  fullWidth
                  type={type}
                  value={inv[field] ?? 0}
                  onChange={(e) => update(field, Number(e.target.value))}
                />
              </Grid>
            ))}
          </Grid>
        </SectionCard>

        <SectionCard title="Timeline" icon={SECTION_ICONS.calendar}>
          <Grid container spacing={1.5}>
            {[
              { label: "Start Date", field: "packageStartDate", readOnly: false },
              { label: "End Date", field: "packageEndDate", readOnly: false },
              { label: "Renewal Date", field: "renewalEndDate", readOnly: false },
              { label: "Current Date", field: "currentDate", readOnly: true },
            ].map(({ label, field, readOnly }) => (
              <Grid item xs={12} sm={6} md={3} key={field}>
                <CorporateTextField
                  label={label}
                  size="small"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={toDateInput(inv[field])}
                  onChange={readOnly ? undefined : (e) => update(field, e.target.value)}
                  InputProps={{ readOnly }}
                  sx={{ ...(readOnly && { bgcolor: "#f1f5f9" }) }}
                />
              </Grid>
            ))}
          </Grid>
        </SectionCard>

        <SectionCard title="Status Controls" icon={SECTION_ICONS.settings}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {STATUS_CONFIG.map(({ field, label, color }) => (
              <FormControlLabel
                key={field}
                control={
                  <Switch
                    size="small"
                    checked={!!inv[field]}
                    onChange={(e) => update(field, e.target.checked)}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": { color },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: color },
                    }}
                  />
                }
                label={<Typography fontSize={12} fontWeight={600}>{label}</Typography>}
              />
            ))}
          </Box>
        </SectionCard>

        <SectionCard title="Locations" icon={SECTION_ICONS.location}>
          {inv.investmentranges?.length > 0 ? (
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 2, alignItems: "start" }}>
              <Box>
                {inv.investmentranges.map((r, ri) => {
                  const totalDist = (r.selectedPlanStateAndDistrict || []).reduce((a, s) => a + (s.district?.length || 0), 0);
                  return (
                    <Box key={ri} sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1, mb: 0.5, bgcolor: "#f8fafc", borderRadius: 1, border: `1px solid ${CORPORATE_COLORS.border}` }}>
                      <TrendingUpIcon sx={{ fontSize: 16, color: CORPORATE_COLORS.accent }} />
                      <Typography fontSize={12} fontWeight={600} sx={{ flex: 1 }}>
                        {r.selectedPlanInvestmetrange}
                      </Typography>
                      <Typography fontSize={11} color="text.secondary">
                        {r.selectedPlanStateAndDistrict?.length || 0} states
                      </Typography>
                      <CorporateChip label={`${totalDist} districts`} chipcolor={CORPORATE_COLORS.success} size="small" />
                    </Box>
                  );
                })}
              </Box>
              <Stack direction="row" spacing={1}>
                <LocationViewPopover investmentranges={inv.investmentranges} />
                <LocationEditor investmentranges={inv.investmentranges} onChange={handleRangesChange} />
              </Stack>
            </Box>
          ) : (
            <Typography fontSize={12} color="text.secondary">
              No locations configured
            </Typography>
          )}
        </SectionCard>
      </CardContent>
    </CorporateCard>
  );
};

const PACKAGE_TYPE_STYLES = {
  FREE: { border: CORPORATE_COLORS.success, bg: "#f0fdf4", label: "FREE" },
  LEAD: { border: CORPORATE_COLORS.accent, bg: "#eff6ff", label: "LEAD" },
  LISTING: { border: "#f59e0b", bg: "#fffbeb", label: "LISTING" },
};

const PackageTypeBlock = ({ pkg, pkgIndex, onInvestmentChange }) => {
  const style = PACKAGE_TYPE_STYLES[pkg.packagesType] || PACKAGE_TYPE_STYLES.LEAD;

  return (
    <CorporateCard sx={{ mb: 3, borderLeft: `4px solid ${style.border}` }}>
      <Box sx={{ p: 2, bgcolor: style.bg, borderBottom: `1px solid ${CORPORATE_COLORS.border}`, display: "flex", alignItems: "center", gap: 1.5 }}>
        <CorporateChip label={style.label} chipcolor={style.border} sx={{ fontWeight: 700 }} />
        <Typography variant="subtitle2" fontWeight={700} color={CORPORATE_COLORS.text}>
          Package Group
        </Typography>
        <Typography fontSize={11} color={CORPORATE_COLORS.textLight} sx={{ ml: "auto" }}>
          {pkg.investmetPackages?.length || 0} plan(s)
        </Typography>
      </Box>

      {pkg.investmetPackages?.length > 0 ? (
        pkg.investmetPackages.map((inv, invIndex) => (
          <InvestmentPackageCard key={inv._id || invIndex} inv={inv} pkgIndex={pkgIndex} invIndex={invIndex} onChange={onInvestmentChange} />
        ))
      ) : (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography fontSize={13} color="text.secondary">
            No investment packages in this group
          </Typography>
        </Box>
      )}
    </CorporateCard>
  );
};

// ═══════════════════════════════════════════════════════════
// MAIN DIALOG
// ═══════════════════════════════════════════════════════════

const ViewPackagePopup = ({ open, onClose, data }) => {
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) setPackageData(JSON.parse(JSON.stringify(data)));
  }, [data]);

  const handleInvestmentChange = useCallback((pkgIndex, invIndex, field, value) => {
    setPackageData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated.packages[pkgIndex].investmetPackages[invIndex][field] = value;
      return updated;
    });
  }, []);

  const handleUpdatePackage = async () => {
    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:5000/api/v1/brand-packages-plans/update-cms/${packageData._id}`, packageData);
      toast.success(response.data.message || "Package updated successfully!");
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!packageData) return null;

  const packages = packageData.packages || [];
  const brandName = packageData.brandName || packageData.brandname || "Brand";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" } }}
    >
      <CorporateHeader>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: "rgba(255,255,255,0.15)" }}>
            <InventoryIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {brandName}
            </Typography>
            <Typography fontSize={11} sx={{ opacity: 0.7 }}>
              Package Manager • {packages.length} group(s)
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "rgba(255,255,255,0.7)", "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.1)" } }}>
          <CloseIcon />
        </IconButton>
      </CorporateHeader>

      <DialogContent sx={{ p: 3, bgcolor: CORPORATE_COLORS.bg }}>
        {packages.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <InventoryIcon sx={{ fontSize: 48, color: CORPORATE_COLORS.border, mb: 2 }} />
            <Typography fontWeight={600} color="text.secondary">
              No packages configured
            </Typography>
          </Box>
        ) : (
          packages.map((pkg, pkgIndex) => <PackageTypeBlock key={pkg._id || pkgIndex} pkg={pkg} pkgIndex={pkgIndex} onInvestmentChange={handleInvestmentChange} />)
        )}
      </DialogContent>

      <Box sx={{ p: 2, borderTop: `1px solid ${CORPORATE_COLORS.border}`, bgcolor: "#fff", display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
        <CorporateButton variant="outlined" onClick={onClose}>
          Cancel
        </CorporateButton>
        <CorporateButton onClick={handleUpdatePackage} disabled={loading} startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SaveRoundedIcon />}>
          {loading ? "Saving..." : "Save Changes"}
        </CorporateButton>
      </Box>
    </Dialog>
  );
};

export default ViewPackagePopup;