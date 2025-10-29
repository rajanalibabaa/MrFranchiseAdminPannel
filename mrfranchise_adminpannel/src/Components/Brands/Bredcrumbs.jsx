import React, { useState, useEffect } from "react";
import { Badge, Box, Tabs, Tab, styled } from "@mui/material";
import GetAllBrand from "./GetAllBrands";
import NewIncomingBrand from "./NewIncomingBrands";
import socket from "../../utils/socket";
import { fetchNewIncomingBrands } from "../../Redux/Slices/newIncomingSlice";
import { useDispatch, useSelector } from "react-redux";
import PauseBrands from "./PauseBrands";

// ✅ Styled Tabs
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

const Breadcrumbs = () => {

  const activeTabValue = useSelector((state)=>state.brands.goToNewIncoming) || 0
  
  const [activeTab, setActiveTab] = useState(activeTabValue);
  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(fetchNewIncomingBrands(1));
    }, [dispatch]);

    // 🔔 Socket connection
  useEffect(() => {
    socket.on("recevie", (count) => {
      console.log("📥 Updated brand count:", count);
      // setBrandCount(count);
      const audio = new Audio("/ting.mp3");
      audio.play();
    });

    return () => {
      socket.off("recevie");
    };
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
const total = useSelector((state) => state.brands.totalBrands);
  const renderComponent = () => {
    switch (activeTab) {
      case 0:
        return <GetAllBrand />;
      case 1:
        return <NewIncomingBrand />;
      case 2:
        return <PauseBrands />;
      default:
        return <GetAllBrand />;
    }
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <StyledTabs value={activeTab} onChange={handleTabChange}>
          <StyledTab label="All Brands" />
          <StyledTab
            label={
              <Badge
                badgeContent={total}
                color="error"
                overlap="circular"
                invisible={total === 0}
                sx={{ "& .MuiBadge-badge": { right: -3, top: -3 } }}
              >
                New Incoming Brands
              </Badge>
            }
          />
          <StyledTab label="All Pause Brands" />
        </StyledTabs>
        
      </Box>

      {renderComponent()}
    </Box>
  );
};

export default Breadcrumbs; // ✅ Corrected typo from Bredcrumbs to Breadcrumbs
