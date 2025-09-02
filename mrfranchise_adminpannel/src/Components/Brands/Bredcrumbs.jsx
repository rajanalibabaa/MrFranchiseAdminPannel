import React, { useState, useEffect } from "react";
import { Badge, Box, Tabs, Tab, styled } from "@mui/material";
import GetAllBrand from "./GetAllBrands";
import NewIncomingBrand from "./NewIncomingBrands";
import socket from "../../Utils/Socket";

// ✅ Styled components
const StyledTabs = styled(Tabs)({
  borderBottom: "1px solid #e8e8e8",
  "& .MuiTabs-indicator": {
    backgroundColor: "#3f51b5",
    height: 3,
  },
});

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  minWidth: 0,
  fontWeight: theme.typography.fontWeightRegular,
  marginRight: theme.spacing(1),
  color: "rgba(0, 0, 0, 0.7)",
  "&:hover": {
    color: "#3f51b5",
    opacity: 1,
  },
  "&.Mui-selected": {
    color: "#3f51b5",
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

const Bredcrumbs = () => {
  const [brandCount, setBrandCount] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  // 🔔 Socket connection
  useEffect(() => {
    socket.on("recevie", (count) => {
      console.log("📥 Updated brand count:", count);
      setBrandCount(count);
      const audio = new Audio("/ting.mp3");
      audio.play();
    });

    return () => {
      socket.off("recevie");
    };
  }, []);
  
  const handleTabChange = (event, newValue) => {
    console.log("Tab changed to:", newValue);
    setActiveTab(newValue);
  };

  const renderComponent = () => {
    switch (activeTab) {
      case 0:
        return <GetAllBrand />;
      case 1:
        return <NewIncomingBrand brandCount={brandCount} />;
      default:
        return <GetAllBrand />;
    }
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <StyledTabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="brand tabs"
        >
          <StyledTab label="All Brands" />
          <StyledTab
            label={
              <Badge
                badgeContent={brandCount}
                color="error"
                overlap="circular"
                invisible={brandCount === 0}
                sx={{ "& .MuiBadge-badge": { right: -3, top: -3 } }}
              >
                New Incoming Brands({brandCount})
              </Badge>
            }
          />
        </StyledTabs>
      </Box>

      {/* Render content */}
      {renderComponent()}
    </Box>
  );
};

export default Bredcrumbs;
