import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  Stack,
  CircularProgress,
  ButtonGroup,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,

  Paper,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  updateNotificationStatus,
  deleteNotification
} from "../../Redux/Slices/NotificationsSlice/notificationsThunksUpdation";
import NotificationDetailsDrawer from "./NotificationDetailsDrawer";

const AllNotificationsPage = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.notifications);

  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState("all"); // all | active | solved
  const [selected, setSelected] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [solving, setSolving] = useState(false);
const [confirmOpen, setConfirmOpen] = useState(false);
const [confirmValue, setConfirmValue] = useState("");
const [notificationToDelete, setNotificationToDelete] = useState(null);


  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchNotifications());
  };

  const handleOpenDrawer = (item) => {
    setSelected(item);
    setDrawerOpen(true);
    if (!item.isOpened) {
      dispatch(updateNotificationStatus({ uuid: item.uuid, action: "open" }));
    }
  };

  // const handleMarkSolved = async (notification) => {
  //   setSolving(true);
  //   await dispatch(
  //     updateNotificationStatus({ uuid: notification.uuid, action: "solve" })
  //   );
  //   setSolving(false);
  //   setDrawerOpen(false);
  // };

  const handleMarkSolved = async (notification) => {
      setSolving(true);
      await dispatch(updateNotificationStatus({ uuid: notification.uuid, action: "deactivate" }));
      setSolving(false);
      setDrawerOpen(false);

    };

   const handleDelete = (notification) => {
  setNotificationToDelete(notification);
  setConfirmValue("");
  setConfirmOpen(true);
};

const confirmDelete = async () => {
  if (confirmValue !== "DELETE") return;
  setSolving(true);
  await dispatch(deleteNotification(notificationToDelete.uuid));
  setSolving(false);
  setConfirmOpen(false);
  setDrawerOpen(false);
  setNotificationToDelete(null);
};

  // Filter + Sort
  const filtered = useMemo(() => {
    let data = [...list];

    // Sorting: New/unread first, then by latest date
    data.sort((a, b) => {
      if (!a.isViewed && b.isViewed) return -1;
      if (a.isViewed && !b.isViewed) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Apply filters
    return data.filter((n) => {
      const matchesSearch = n.brandName
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const matchesDate = filterDate
        ? new Date(n.createdAt).toDateString() ===
          new Date(filterDate).toDateString()
        : true;

      const matchesType =
        filterType === "all"
          ? true
          : filterType === "active"
          ? n.isActive
          : !n.isActive;

      return matchesSearch && matchesDate && matchesType;
    });
  }, [list, search, filterDate, filterType]);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
      >
        <Typography variant="h5" fontWeight={600}>
         Request Notifications Center
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <Tooltip title="Refresh">
            <IconButton color="primary" onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Stack>

      {/* Filter Controls */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mt: 2, mb: 3 }}
        alignItems={{ xs: "stretch", sm: "center" }}
      >
        <TextField
          label="Search by Brand"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
        />
        <TextField
          type="date"
          label="Filter by Date"
          InputLabelProps={{ shrink: true }}
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          size="small"
        />
        <ButtonGroup variant="outlined" color="primary" sx={{ ml: "auto" }}>
          <Button
          color="inherit"
            variant={filterType === "all" ? "contained" : "outlined"}
            onClick={() => setFilterType("all")}
          >
            All
          </Button>
          <Button
          color="warning"
            variant={filterType === "active" ? "contained" : "outlined"}
            onClick={() => setFilterType("active")}
          >
            Active
          </Button>
          <Button
          color="success"
            variant={filterType === "solved" ? "contained" : "outlined"}
            onClick={() => setFilterType("solved")}
          >
            Solved
          </Button>
        </ButtonGroup>
      </Stack>

      {/* Table Section */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
            maxHeight: "70vh",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Brand</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Message</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.map((n, i) => (
                <TableRow
                  key={n.uuid}
                  sx={{
                   
                    transition: "all 0.2s",
                    "&:hover": { backgroundColor: "#f485161f" },
                  }}
                >
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>
                    <Typography fontWeight={!n.isViewed ? 600 : 400}>
                      {n.brandName}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {n.message}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(n.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        color: n.isActive ? "success.main" : "error.main",
                        fontWeight: 500,
                      }}
                    >
                      {n.isActive ? "Active" : "Solved"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDrawer(n)} // call parent function
  // disabled={solving || !notification?.isActive} // disable if already solved
                        size="small"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                   {n.isActive && (
    <Tooltip title="Mark as Solved">
      <IconButton
        color={n.isActive ? "success" : "default"}
        onClick={() => handleMarkSolved(n)}
        size="small"
        disabled={solving}
      >
        <CheckCircleIcon />
      </IconButton>
    </Tooltip>
  )}

  <Tooltip title="Delete Notification">
    <IconButton
      color="error"
      onClick={() => handleDelete(n)}
      size="small"
      disabled={solving}
    >
      <DeleteIcon />
    </IconButton>
  </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">
                      No notifications found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
<Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
  <Box sx={{ p: 3, width: 350 }}>
    <Typography variant="h6" gutterBottom>
      Confirm Deletion
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
      To confirm, please type <strong>DELETE</strong> below. This action cannot
      be undone.
    </Typography>

    <TextField
      fullWidth
      value={confirmValue}
      onChange={(e) => setConfirmValue(e.target.value)}
      placeholder="Type DELETE to confirm"
      variant="outlined"
      size="small"
    />

    <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: "flex-end" }}>
      <Button onClick={() => setConfirmOpen(false)} color="inherit">
        Cancel
      </Button>
      <Button
        variant="contained"
        color="error"
        disabled={confirmValue !== "DELETE" || solving}
        onClick={confirmDelete}
      >
        {solving ? "Deleting..." : "Delete"}
      </Button>
    </Stack>
  </Box>
</Dialog>

      {/* Drawer */}
      <NotificationDetailsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        notification={selected}
        onMarkSolved={handleMarkSolved}
        solving={solving}
      />
    </Box>
  );
};

export default AllNotificationsPage;
