import React from "react";
import {
  ListItem,
  ListItemText,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  Box,
  Badge,
  Stack,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const NotificationItem = ({ item, onView, onOpen }) => {
  const { isViewed, isOpened, isActive, message, type, brandName, createdAt } =
    item;

  return (
    <ListItem
    onClick={(e) => {
              e.stopPropagation();
              onOpen(item);
            }}
      sx={{
        borderRadius: 2,
        mb: 1,
        px: 2,
        py: 1.5,
        backgroundColor: !isViewed ? "#8ed0abff" : "#ffffffff",
        // border: !isViewed ? "1px solid #64f670ff" : "1px solid #e0e0e0",
        // boxShadow: !isViewed
        //   ? "0 2px 6px rgba(100, 181, 246, 0.3)"
        //   : "0 1px 3px rgba(0,0,0,0.05)",
        transition: "all 0.3s",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          backgroundColor: "#f8f9fa",
          cursor: "pointer",
        },
        alignItems: "flex-start",
        position: "relative",
      }}
    >
      {/* Avatar */}
      <Avatar
        src={item.brandLogo || ""}
        alt={brandName}
        sx={{
            
            bgcolor: !isViewed ? "primary.main" : "grey.400",
            mr: 2,
            mt: 0.5,
            width: 40, height: 40
            }}
      >
        {brandName?.[0]?.toUpperCase() || "N"}
      </Avatar>

      {/* Notification Content */}
      <ListItemText
     
        primary={
          <Stack direction="row" alignItems="center" spacing={1} >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: !isViewed ? 700 : 500 }}
              noWrap
            >
              {brandName}:
            </Typography>
            <Typography
              variant="body2"
              color="text.primary"
              sx={{ flex: 1 }}
              noWrap
            >
              {message}
            </Typography>
          </Stack>
        }
        secondary={
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" color="text.secondary">
              {type}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              • {new Date(createdAt).toLocaleString()}
            </Typography>
          </Stack>
        }
      />

      {/* Status & Actions */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Active / Solved Badge */}
        {/* <Badge
          variant="dot"
          color={isActive ? "warning" : "error"}
          sx={{ mb: 1 }}
        /> */}
        {/* View Details */}
        <Tooltip title="View Details">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onOpen(item);
            }}
            size="small"
          >
            <VisibilityIcon color={isOpened ? "warning" : "disabled"} />
          </IconButton>
        </Tooltip>
        {/* Seen Indicator */}
        {isOpened && <DoneAllIcon color="info" fontSize="small" sx={{ mt: 0.5 }} />}
      </Box>
    </ListItem>
  );
};

export default React.memo(NotificationItem);
