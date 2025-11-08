import React, { useEffect, useState, useMemo } from "react";
import {
  Badge,
  Drawer,
  IconButton,
  Typography,
  Box,
  Divider,
  List,
  CircularProgress,
  Button,
  Tooltip,
  Fade,
  Stack,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  updateNotificationStatus,
} from "../../Redux/Slices/NotificationsSlice/notificationsThunksUpdation";
import { initSocketListeners } from "../../Redux/Slices/NotificationsSlice/notificationsSliceget.jsx";
import NotificationItem from "./NotificationItem";
import NotificationDetailsDrawer from "./NotificationDetailsDrawer";

const NotificationDrawer = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.notifications);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [solving, setSolving] = useState(false);

  // Initial Fetch + Realtime Socket
  useEffect(() => {
    dispatch(fetchNotifications());
    initSocketListeners(dispatch);
  }, [dispatch]);

  // Active Notifications Memoized
  const activeNotifications = useMemo(() => list.filter((n) => n.isActive), [list]);
  const activeCount = activeNotifications.length;

  // Handlers
  const handleView = (uuid) => {
    dispatch(updateNotificationStatus({ uuid, action: "view" }));
  };

  const handleOpenDetails = (notification) => {
    dispatch(updateNotificationStatus({ uuid: notification.uuid, action: "open" }));
    setSelectedNotification(notification);
    setDetailsOpen(true);
  };

  const handleMarkAsSolved = async (notification) => {
    setSolving(true);
    await dispatch(updateNotificationStatus({ uuid: notification.uuid, action: "deactivate" }));
    setSolving(false);
    setDetailsOpen(false);
  };

  return (
    <Box>
      {/* Bell Icon */}
      <Tooltip title="Notifications">
        <IconButton
          color="inherit"
          onClick={() => setDrawerOpen(true)}
          sx={{
            position: "relative",
            "&:hover": { transform: "scale(1.05)" },
            transition: "0.3s",
          }}
        >
          <Badge
            badgeContent={activeCount}
            color="error"
            overlap="circular"
            sx={{
              "& .MuiBadge-badge": {
                fontSize: "0.7rem",
                minWidth: 18,
                height: 18,
                boxShadow: "0 0 6px rgba(255,0,0,0.4)",
              },
            }}
          >
            <NotificationsActiveIcon fontSize="medium" />
          </Badge>
        </IconButton>
      </Tooltip>

      {/* Main Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        transitionDuration={400}
        PaperProps={{
          sx: {
            width: { xs: "90vw", sm: 420 },
            backdropFilter: "blur(16px)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            borderLeft: "1px solid #000000ff",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(90deg,#fff7e6,#fff)",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Typography variant="h6" fontWeight={600} color="warning.dark">
            Notifications
          </Typography>
          <Tooltip title="Refresh Notifications">
            <IconButton
              size="small"
              onClick={() => dispatch(fetchNotifications())}
              sx={{
                background: "linear-gradient(135deg,#fdd835,#f57f17)",
                color: "#fff",
                "&:hover": { background: "linear-gradient(135deg,#fbc02d,#ef6c00)" },
              }}
            >
              <RefreshRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Content */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", maxHeight: "75vh" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <CircularProgress size={26} color="warning" />
            </Box>
          ) : (
            <Fade in={!loading}>
              <List>
                {activeNotifications.length === 0 ? (
                  <Typography
                    variant="body2"
                    sx={{ p: 3, textAlign: "center", color: "text.secondary" }}
                  >
                    🎉 All caught up! No active notifications.
                  </Typography>
                ) : (
                  activeNotifications.map((n) => (
                    <NotificationItem
                      key={n.uuid}
                      item={n}
                      onView={() => handleView(n.uuid)}
                      onOpen={() => handleOpenDetails(n)}
                    />
                  ))
                )}
              </List>
            </Fade>
          )}
        </Box>

        <Divider />

        {/* Footer */}
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{
            p: 2,
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Button
            onClick={() => (window.location.href = "/dashboard/notificationpage")}
            variant="contained"
            color="warning"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 0.8,
              boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(255,193,7,0.3)",
              },
            }}
          >
            View All Notifications
          </Button>
        </Stack>
      </Drawer>

      {/* Notification Details Drawer */}
      <NotificationDetailsDrawer
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        notification={selectedNotification}
        onMarkSolved={handleMarkAsSolved}
        solving={solving}
      />
    </Box>
  );
};

export default React.memo(NotificationDrawer);
