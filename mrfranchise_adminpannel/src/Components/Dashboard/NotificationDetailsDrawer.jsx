import React from "react";
import {
  Drawer,
  Box,
  Typography,
  Button,
  Stack,
  Avatar,
  Chip,
  Grid,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade,
  LinearProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  AccountCircle as AccountCircleIcon,
  VerifiedUser as VerifiedUserIcon,
} from "@mui/icons-material";

const NotificationDetailsDrawer = ({
  open,
  onClose,
  notification,
  onMarkSolved,
  solving,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!notification) return null;

  console.log("notif", notification);

  const getStatusColor = (isActive) => {
    return isActive ? "success" : "default";
  };

  const getStatusIcon = (isActive) => {
    return isActive ? (
      <VerifiedUserIcon fontSize="small" />
    ) : (
      <CheckCircleIcon fontSize="small" />
    );
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: isMobile ? "100%" : "800px",
          maxWidth: "100vw",
          background: "linear-gradient(135deg, #f5f7faff 0%, #f2f2f3ff 100%)",
          borderRadius: isMobile ? 0 : "16px 0 0 16px",
          boxShadow: theme.shadows[24],
        },
      }}
    >
      {solving && (
        <LinearProgress
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            borderRadius: "16px 0 0 0",
          }}
        />
      )}

      {/* Header */}
      <Box
        sx={{
          background: "#ff9800",
          color: "white",
          p: 3,
          position: "relative",
          borderRadius: isMobile ? 0 : "16px 0 0 0",
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h5" fontWeight={700}>
              Request Details
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: "error.main",
              bgcolor: "rgba(255, 255, 255, 0.67)",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.78)",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s",
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3, height: "100%", overflow: "auto" }}>
        <Fade in timeout={300}>
          <Stack spacing={3}>
            {/* Brand Information Card */}

            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Typography variant="h6" fontWeight={600} color="black">
                Brand Information
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={3} mb={3}>
              <Avatar
                src={notification.brandLogo || "/default-logo.png"}
                alt={notification.brandName}
                variant="square"
                objectFit="contain"
                sx={{
                  width: 150,
                  height: 100,
                  boxShadow: theme.shadows[4],
                }}
              >
                <BusinessIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {notification.brandName}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  BrandOriginalID : {notification.brandOriginalId}
                </Typography>
                <Chip
                  icon={getStatusIcon(notification.isActive)}
                  label={notification.isActive ? "Active" : "Inactive"}
                  color={getStatusColor(notification.isActive)}
                  variant={notification.isActive ? "filled" : "outlined"}
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Box>

            {/* Request Details Card */}

            <Box display="flex" alignItems="center" gap={2} mb={2}>
              {/* <AssignmentIcon color="n" /> */}
              <Typography variant="h6" fontWeight={600} color="black">
                Request Details
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="black" gutterBottom>
                  Request Type
                </Typography>
                <Chip
                  label={notification.type}
                  color="black"
                  variant="filled"
                  sx={{ fontWeight: 600 }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="black" gutterBottom>
                  Message
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                  {notification.message}
                </Typography>
              </Grid>
            </Grid>

            {/* Contact Information Card */}

            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <AccountCircleIcon color="black" />
              <Typography variant="h6" fontWeight={600} color="black">
                Contact Information
              </Typography>
            </Box>

            <Stack spacing={2}>
              {notification.brandEmail && (
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                    bgcolor: "rgba(25, 118, 210, 0.04)",
                    transition: "all 0.2s",
                    "&:hover": {
                      boxShadow: theme.shadows[4],
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      sx={{ bgcolor: "primary.main", width: 40, height: 40 }}
                    >
                      <EmailIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="primary"
                        gutterBottom
                      >
                        Email Address
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {notification.brandEmail}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              )}

              {notification.mobileNumber && (
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                    bgcolor: "rgba(46, 125, 50, 0.04)",
                    transition: "all 0.2s",
                    "&:hover": {
                      boxShadow: theme.shadows[4],
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      sx={{ bgcolor: "success.main", width: 40, height: 40 }}
                    >
                      <PhoneIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="success.main"
                        gutterBottom
                      >
                        Mobile Number
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {notification.mobileNumber}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              )}

              {notification.whatsappNumber && (
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                    bgcolor: "rgba(76, 175, 80, 0.04)",
                    transition: "all 0.2s",
                    "&:hover": {
                      boxShadow: theme.shadows[4],
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: "#25D366", width: 40, height: 40 }}>
                      <WhatsAppIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "#25D366" }}
                        gutterBottom
                      >
                        WhatsApp Number
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {notification.whatsappNumber}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              )}
            </Stack>

            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  Created At
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight={500}>
                {new Date(notification.createdAt).toLocaleString()}
              </Typography>
            </Grid>
          </Stack>
        </Fade>
      </Box>

      {/* Action Buttons */}
      <Box
        sx={{
          p: 3,
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          borderTop: "1px solid rgba(0, 0, 0, 0.1)",
          mt: "auto",
        }}
      >
        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={2}
          justifyContent="space-between"
        >
          <Button
            variant="outlined"
            color="error"
            onClick={onClose}
            sx={{
              py: 1.5,
              px: 3,
              borderRadius: 3,
              fontWeight: 600,
              borderWidth: 2,
              "&:hover": {
                borderWidth: 2,
                transform: "translateY(-2px)",
                boxShadow: theme.shadows[4],
              },
              transition: "all 0.2s",
              order: isMobile ? 2 : 1,
            }}
          >
            Close
          </Button>

          <Button
            variant="contained"
            onClick={() => onMarkSolved(notification)}
            disabled={!notification.isActive || solving}
            startIcon={
              solving ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LinearProgress
                    sx={{ width: 20, height: 2, borderRadius: 1 }}
                  />
                </Box>
              ) : (
                <CheckCircleIcon />
              )
            }
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 3,
              fontWeight: 600,
              background: notification.isActive
                ? "linear-gradient(135deg, #de8f27ff 0%, #de8724ff 100%)"
                : "rgba(0, 0, 0, 0.12)",
              boxShadow: notification.isActive ? theme.shadows[8] : "none",
              "&:hover": {
                transform: notification.isActive ? "translateY(-2px)" : "none",
                boxShadow: notification.isActive ? theme.shadows[12] : "none",
              },
              "&:disabled": {
                background: "rgba(0, 0, 0, 0.12)",
                color: "rgba(0, 0, 0, 0.26)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              minWidth: isMobile ? "100%" : "160px",
              order: isMobile ? 1 : 2,
            }}
          >
            {solving
              ? "Processing..."
              : notification.isActive
              ? "Mark as Solved"
              : "Already Resolved"}
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default NotificationDetailsDrawer;
