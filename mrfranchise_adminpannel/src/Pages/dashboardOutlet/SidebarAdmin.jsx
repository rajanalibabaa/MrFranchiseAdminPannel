import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Collapse,
  Avatar,
  Stack,
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Dashboard,
  Logout,
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore,
  Business,
  AccountBalance,
} from "@mui/icons-material";

const SidebarAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({
    brand: false,
    investor: false,
  });

  const adminContact = localStorage.getItem("adminContact") || "Admin";

  /** ---------- Handlers ---------- */
  const toggleMenu = (menu) =>
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminContact");
    navigate("/admin/login");
    if (isMobile) setDrawerOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) setDrawerOpen(false);
  };

  /** ---------- Styles ---------- */
  const menuItemStyle = {
    borderRadius: 1,
    mb: 0.5,
    "&:hover": { bgcolor: "#334155" },
  };

  const submenuItemStyle = {
    pl: 4,
    borderRadius: 1,
    mb: 0.5,
    color: "#cbd5e1",
    "&.Mui-selected": { bgcolor: "#334155", color: "#fff" },
    "&:hover": { bgcolor: "#334155" },
  };

  /** ---------- Menu Config ---------- */
  const menuConfig = useMemo(
    () => [
      {
        label: "Dashboard",
        icon: <Dashboard />,
        path: "/dashboard",
      },
      {
        label: "Manage Brand",
        icon: <Business />,
        toggleKey: "brand",
        submenu: [
          { label: "Create Brand", path: "/dashboard/createbrand" },
          { label: "All Brands", path: "/dashboard/viewallbrands" },
        ],
      },
      {
        label: "Manage Investor",
        icon: <AccountBalance />,
        toggleKey: "investor",
        submenu: [
          { label: "New Investors", path: "/dashboard/newinvestors" },
          { label: "All Investors", path: "/dashboard/allinvestors" },
        ],
      },
    ],
    []
  );

  /** ---------- Sidebar Content ---------- */
  const SidebarContent = (
    <Box
      sx={{
        width: 300,
        height: "100%",
        bgcolor: "#1e293b",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      {/* User Profile */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Avatar alt={adminContact} sx={{ bgcolor: "#4f46e5" }}>
          {adminContact.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="h6" fontWeight="bold">
          {adminContact}
        </Typography>
      </Stack>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 2 }} />

      {/* Menu Items */}
      <List sx={{ flexGrow: 1 }}>
        {menuConfig.map((menu, idx) => (
          <React.Fragment key={idx}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() =>
                  menu.path
                    ? handleNavigation(menu.path)
                    : toggleMenu(menu.toggleKey)
                }
                selected={location.pathname === menu.path}
                sx={{
                  ...menuItemStyle,
                  ...(menu.path && {
                    "&.Mui-selected": { bgcolor: "#334155" },
                  }),
                }}
              >
                <ListItemIcon sx={{ color: "#fff" }}>{menu.icon}</ListItemIcon>
                <ListItemText primary={menu.label} />
                {menu.submenu &&
                  (openMenus[menu.toggleKey] ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </ListItem>

            {/* Submenu */}
            {menu.submenu && (
              <Collapse in={openMenus[menu.toggleKey]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {menu.submenu.map((sub, subIdx) => (
                    <ListItem disablePadding key={subIdx}>
                      <ListItemButton
                        onClick={() => handleNavigation(sub.path)}
                        selected={location.pathname === sub.path}
                        sx={submenuItemStyle}
                      >
                        <ListItemText primary={sub.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>

      {/* Logout */}
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={menuItemStyle}>
            <ListItemIcon sx={{ color: "#fff" }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <>
          {/* Mobile Header */}
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
              py: 1,
              bgcolor: "#1e293b",
              color: "#fff",
              zIndex: 1300,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Dashboard
            </Typography>
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ color: "#fff", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Space for header */}
          <Box sx={{ marginTop: "56px" }} />

          {/* Drawer */}
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              "& .MuiDrawer-paper": { width: 300, boxSizing: "border-box" },
            }}
          >
            {SidebarContent}
          </Drawer>
        </>
      ) : (
        <Box
          sx={{
            width: 300,
            height: "100vh",
            bgcolor: "#1e293b",
            color: "#fff",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 1200,
            boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
          }}
        >
          {SidebarContent}
        </Box>
      )}
    </>
  );
};

export default SidebarAdmin;
