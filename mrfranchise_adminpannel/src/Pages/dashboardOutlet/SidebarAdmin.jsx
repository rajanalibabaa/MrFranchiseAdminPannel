import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // ✅ correct import
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
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Dashboard,
  Logout as LogoutIcon, // ✅ rename icon to avoid conflict
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore,
  Business,
  AccountBalance,
} from "@mui/icons-material";

import { Logout } from "../../Redux/Slices/admin/authSlice.jsx"; // ✅ redux action
import { PostApiCall } from "../../api/default/PostApi.jsx";
import { Api } from "../../api/apiurl.jsx";

const SidebarAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch(); // ✅ correct usage

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({
    brand: false,
    investor: false,
  });
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ loading state

  const { adminData } = useSelector((state) => state.admin);

  /** ---------- Handlers ---------- */
  const toggleMenu = (menu) =>
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));

  const handleLogoutConfirm = async () => {
    setLoading(true); // ✅ show loader
    setTimeout(async () => {
      const res = await PostApiCall(
        `${Api.admin.post.logout}/${adminData?.adminData?.uuid}`,
        adminData?.adminAccessToken,
        {},
      );

      if (res.data.success === true) {
        dispatch(Logout());
        navigate("/");
      }

      if (isMobile) setDrawerOpen(false);
      setLogoutDialogOpen(false);
      setLoading(false); // ✅ stop loader
    }, 1000); // 1 second delay
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
          { label: "All Brands", path: "/dashboard/getallbrands" },
          { label: "Instant Apply", path: "/dashboard/instantapply" },
          { label: "Leads Management", path: "/dashboard/freeleadlist" },
      
        ],
      },
         {
        label: "Manage CMS",
        icon: <Business />,
        toggleKey: "cms",
        submenu: [

          { label: "Package Management", path: "/dashboard/packagemanagement" },
          { label: "Lead Match Management", path: "/dashboard/leadmatchcms" },
          { label: "Lead Matching Rules Per Brand", path: "/dashboard/leadmatchingruleperbrand" },
          {
            label: "Industry Management",
            path: "/dashboard/industrymanagement",
          },
        ],
      },
      
      {
        label: "Manage Investor",
        icon: <AccountBalance />,
        toggleKey: "investor",
        submenu: [
          { label: "Create Investors", path: "/dashboard/newinvestors" },
          { label: "All Investors", path: "/dashboard/allinvestors" },
        ],
      },
    ],
    [],
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
              <Collapse
                in={openMenus[menu.toggleKey]}
                timeout="auto"
                unmountOnExit
              >
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
          <ListItemButton
            onClick={() => setLogoutDialogOpen(true)}
            sx={menuItemStyle}
          >
            <ListItemIcon sx={{ color: "#fff" }}>
              <LogoutIcon /> {/* ✅ fixed icon */}
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
              sx={{
                color: "#fff",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
              }}
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

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={() => (loading ? null : setLogoutDialogOpen(false))}
      >
        <DialogTitle>{"Confirm Logout"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout from the admin panel?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setLogoutDialogOpen(false)}
            color="inherit"
            disabled={loading} // disable when loading
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            color="error"
            variant="contained"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={18} color="inherit" /> : null
            }
          >
            {loading ? "Logging out..." : "Logout"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SidebarAdmin;
