import React, { useState, useEffect } from "react";
import {
  TextField,
  Collapse,
  Stack ,
  Chip ,
  Drawer ,
  AppBar ,
  Toolbar,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  InputAdornment,
  Grid,
  Typography,
  Box,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  Button,
  FormHelperText,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormGroup,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Delete as DeleteIcon, Edit as EditIcon, InfoOutlined , ExpandMore, ExpandLess} from "@mui/icons-material";
import categories from "../BrandLIstingRegister/BrandCategories";
const FranchiseDetailsEdit = ({
  data = {},
  errors = {},
  onChange = () => {},
  onNestedChange = () => {},
  onArrayChange = () => {},
  onObjectChange = () => {},
  isEditing = false,
}) => {
  // Define fee unit options
  const royaltyFeeUnits = [
    { value: "select", label: "Select" },
    { value: "%", label: "%" },
    { value: "Thousands", label: "Thousands" },
    { value: "Lakhs", label: "Lakhs" },
    { value: "No Fee", label: "No Fee" },
  ];
  const otherFeeUnits = [
    { value: "select", label: "Select" },
    { value: "Thousands", label: "Thousands" },
    { value: "Lakhs", label: "Lakhs" },
    { value: "No Fee", label: "No Fee" },
  ];
  const [currentFicoModel, setCurrentFicoModel] = useState({
    investmentRange: "",
    areaRequired: "",
    franchiseModel: "",
    franchiseType: "",
    franchiseFee: "",
    franchiseFeeUnit: "select",
    royaltyFee: "",
    royaltyFeeUnit: "select",
    interiorCost: "",
    interiorCostUnit: "select",
    stockInvestment: "",
    stockInvestmentUnit: "select",
    otherCost: "",
    otherCostUnit: "select",
    roi: "",
    payBackPeriod: "",
    breakEven: "",
    requireWorkingCapital: "",
    requireWorkingCapitalUnit: "select",
    marginOnSales: "",
    agreementPeriod: "",
  });
  
  const [noFees, setNoFees] = useState({
    franchiseFee: false,
    interiorCost: false,
    stockInvestment: false,
    otherCost: false,
    requireWorkingCapital: false,
    royaltyFee: false,
    roi: false,
  });
  const [currentUSP, setCurrentUSP] = useState("");
    const [showSelectedBar, setShowSelectedBar] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
const [showSelectedServiceTags, setShowSelectedServiceTags] = useState(false);
const [serviceTagDrawerOpen, setServiceTagDrawerOpen] = useState(false);
const [tempSelectedChild, setTempSelectedChild] = useState([]);
const [tempSelectedServiceTags, setTempSelectedServiceTags] = useState([]); 

 const [selectedServiceTags, setSelectedServiceTags] = useState(
    data.serviceTags ? ie(Array.isArray(data.serviceTags) ? data.serviceTags : data.serviceTags.split(" | ").filter(Boolean)) : []
  );

    const [editIndex, setEditIndex] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const franchiseTypes = [
    "Single Unit",
    "Multi Unit",
    "Master Franchise",
    "City Franchise",
    "Area Franchise",
    "District Franchise",
    "State Franchise",
  ];
  const franchiseModels = [
    "FOFO",
    "FOCO",
    "FICO",
    "COCO",
    "KIOSK",
    "SHOP IN SHOP",
    "CLOUD KITCHEN",
  ];
  const investmentRanges = [
    { label: "Below ₹50K", value: "Below - 50k" },
    { label: "₹50K - ₹2 Lakhs", value: "Rs. 50k - 2 Lakhs" },
    { label: "₹2 - ₹5 Lakhs", value: "Rs. 2 Lakhs - 5 Lakhs" },
    { label: "₹5 - ₹10 Lakhs", value: "Rs. 5 Lakhs - 10 Lakhs" },
    { label: "₹10 - ₹20 Lakhs", value: "Rs. 10 Lakhs - 20 Lakhs" },
    { label: "₹20 - ₹30 Lakhs", value: "Rs. 20 Lakhs - 30 Lakhs" },
    { label: "₹30 - ₹50 Lakhs", value: "Rs. 30 Lakhs - 50 Lakhs" },
    { label: "₹50 Lakhs - ₹1 Crore", value: "Rs. 50 Lakhs - 1 Crore" },
    { label: "₹1 - ₹2 Crores", value: "Rs. 1 Crore - 2 Crores" },
    { label: "₹2 - ₹5 Crores", value: "Rs. 2 Crore - 5 Crores" },
    { label: "Above ₹5 Crores", value: "Rs. 5 Crores - above" },
  ];

  const PrimaryClassifications = ["Pure Vegetarian","Pure Non-Vegetarian","Pure Vegan","Eggless","Jain Food","Mixed (Veg & Non-Veg)","Plant-Based","Organic","Gluten-Free","Dairy-Free","Nut-Free","Low-Carb","Keto-Friendly","Paleo-Friendly","Low-Calorie","High-Protein","Diabetic-Friendly","Halal","Kosher"]
const TargetAudience=["Family-Friendly","Kids Menu","Senior Citizen Discount","Student Discount","Women Only (e.g., women-only cafes)","Men Only (e.g., men-only bars)","Unisex","All Age Groups"]
const ServiceModel=["Dine-In","Takeaway","Home Delivery","Drive-Thru","Buffet","Self-Service","Counter Service","Table Service","Food Truck","Kiosk","Cloud Kitchen"]
const PricingValue=["Budget","Affordable","Mid-Range","Premium","Luxury","Value for Money",]
const AmbienceExperience=["Casual Dining","Fine Dining","Quick Bite","Romantic","Family","Business Meetings","Party Venue","Themed Restaurant","Outdoor Seating","Rooftop","Garden","Beachfront"]
const FeaturesAmenities=["Live Music","Sports Screening","Free Wi-Fi","Parking Available","Valet Parking","Kid's Play Area","Pet-Friendly","Wheelchair Accessible","Air Conditioning","Smoking Area","Non-Smoking"]
const TechnologyIntegration=["Online Ordering","Mobile App","QR Code Menu","Digital Payments","Self-Order Kiosks","Contactless Delivery"]
const SustainabilityEthics  =["Organic Ingredients","Locally Sourced","Sustainable Sourcing","Eco-Friendly Packaging","Waste Reduction","Energy Efficient","Social Responsibility"]
// const productServiceType = ["North Indian","South Indian","Punjab","Bengali","Gujarati","Italian","Chinese","Thai","Japanese","Korean","French","Mexican","Burgers","Sandwiches","Pizza","Tacos","Biryani","Wraps","Curry","Tandoori","Kebabs","Tea","Juices","Coffee","Smoothies",  ]
const BusinessOperation= ["Franchise Opportunity","Company-Owned","Chain","Single Unit","Multi-Unit","Area Development","Master Franchise"]

const serviceTagGroups = {
  "Primary Classification": PrimaryClassifications,
  // "Product / Service Types": productServiceType,
  "Target Audience": TargetAudience,
  "Service Model": ServiceModel,
  "Pricing Value": PricingValue,
  "Ambience & Experience": AmbienceExperience,
  "Features & Amenities": FeaturesAmenities,
  "Technology Integration": TechnologyIntegration,
  "Sustainability & Ethics": SustainabilityEthics,
  "Business Operations": BusinessOperation,
};

const [currentTags, setCurrentTags] = useState({
    PrimaryClassifications: [],
    productServiceTypes: [],
    TargetAudience: [],
    ServiceModel: [],
    PricingValue: [],
    AmbienceExperience: [],
    FeaturesAmenities: [],
    TechnologyIntegration: [],
    SustainabilityEthics: [],
    BusinessOperations: [],
  });


 useEffect(() => {
  if (data.franchiseTags) {
    console.log("🔍 DEBUG - Raw franchiseTags from props:", data.franchiseTags);
    
    setCurrentTags({
      PrimaryClassifications: Array.isArray(data.franchiseTags.PrimaryClassifications) 
        ? data.franchiseTags.PrimaryClassifications 
        : [],
      // ProductServiceTypes: Array.isArray(data.franchiseTags.ProductServiceTypes) 
      //   ? data.franchiseTags.ProductServiceTypes 
      //   : [],
      TargetAudience: Array.isArray(data.franchiseTags.TargetAudience) 
        ? data.franchiseTags.TargetAudience 
        : [],
      ServiceModel: Array.isArray(data.franchiseTags.ServiceModel) 
        ? data.franchiseTags.ServiceModel 
        : [],
      PricingValue: Array.isArray(data.franchiseTags.PricingValue) 
        ? data.franchiseTags.PricingValue 
        : [],
      AmbienceExperience: Array.isArray(data.franchiseTags.AmbienceExperience) 
        ? data.franchiseTags.AmbienceExperience 
        : [],
      FeaturesAmenities: Array.isArray(data.franchiseTags.FeaturesAmenities) 
        ? data.franchiseTags.FeaturesAmenities 
        : [],
      TechnologyIntegration: Array.isArray(data.franchiseTags.TechnologyIntegration) 
        ? data.franchiseTags.TechnologyIntegration 
        : [],
      SustainabilityEthics: Array.isArray(data.franchiseTags.SustainabilityEthics) 
        ? data.franchiseTags.SustainabilityEthics 
        : [],
      BusinessOperations: Array.isArray(data.franchiseTags.BusinessOperations) 
        ? data.franchiseTags.BusinessOperations 
        : [],
    });
  } else {
    console.log("❌ DEBUG - No franchiseTags in data:", data);
  }
}, [data.franchiseTags]);

const handleOpenDrawer = () => {
  console.log("✅ handleOpenDrawer triggered!");
  
  // Handle both array and string formats for child categories
  let currentChildTags = [];
  
  if (selectedCategory.child) {
    if (Array.isArray(selectedCategory.child)) {
      currentChildTags = [...selectedCategory.child];
    } else if (typeof selectedCategory.child === 'string') {
      // Split by " | " or " - " depending on your data format
      currentChildTags = selectedCategory.child.split(" | ").filter(Boolean);
    }
  }
  
  console.log("🔍 Current child tags:", currentChildTags);
  setTempSelectedChild(currentChildTags);
  setDrawerOpen(true);
};


const handleChildToggle = (child) => {
  setTempSelectedChild((prevSelected) =>
    prevSelected.includes(child)
      ? prevSelected.filter((item) => item !== child)
      : [...prevSelected, child]
  );
};

const handleDone = () => {
  const newCategory = {
    ...selectedCategory,
    child: tempSelectedChild,
  };
  setSelectedCategory(newCategory);
  
  // Send as string to backend to maintain consistency
  onObjectChange("brandCategories", {
    ...newCategory,
    child: tempSelectedChild.join(" | "), // Use consistent separator
  });
  
  setDrawerOpen(false);
};

  // Handle tag change (FIXED)
 const handleTagChange = (tagType) => (e) => {
  const { target: { value } } = e;
  console.log(`🔄 Updating ${tagType} with:`, value);
  console.log(`📊 Before update - currentTags:`, currentTags);
  
  // Update local state first
  const updatedTags = {
    ...currentTags,
    [tagType]: value,
  };
  
  console.log(`📈 After update - updatedTags:`, updatedTags);
  setCurrentTags(updatedTags);
  
  // Update the main form data - pass the ENTIRE updated franchiseTags object
  console.log("📤 Sending updated franchiseTags to parent:", updatedTags);
  onObjectChange("franchiseTags", updatedTags);
};

  const aidFinancingOptions = ["Yes", "No"];
  const agreementPeriods = [
    "1 Year",
    "3 Years",
    "5 Years",
    "7 Years",
    "10 Years",
  ];
  useEffect(() => {
    if (editIndex !== null && data.fico && data.fico[editIndex]) {
      const model = data.fico[editIndex];
      setCurrentFicoModel({
        investmentRange: model.investmentRange || "",
        areaRequired: model.areaRequired || "",
        franchiseModel: model.franchiseModel || "",
        franchiseType: model.franchiseType || "",
        franchiseFee: model.franchiseFee?.replace(/[^0-9.]/g, "") || "",
        franchiseFeeUnit: model.franchiseFee?.includes("No Fee")
          ? "No Fee"
          : model.franchiseFee?.match(/%|000|00000/)
          ? model.franchiseFee?.match(/%|000|00000/)[0]
          : "select",
        royaltyFee: model.royaltyFee?.replace(/[^0-9.]/g, "") || "",
        royaltyFeeUnit: model.royaltyFee?.includes("No Fee")
          ? "No Fee"
          : model.royaltyFee?.match(/%|000|00000/)
          ? model.royaltyFee?.match(/%|000|00000/)[0]
          : "select",
        interiorCost: model.interiorCost?.replace(/[^0-9.]/g, "") || "",
        interiorCostUnit: model.interiorCost?.includes("No Fee")
          ? "No Fee"
          : model.interiorCost?.match(/000|00000/)
          ? model.interiorCost?.match(/000|00000/)[0]
          : "select",
        stockInvestment: model.stockInvestment?.replace(/[^0-9.]/g, "") || "",
        stockInvestmentUnit: model.stockInvestment?.includes("No Fee")
          ? "No Fee"
          : model.stockInvestment?.match(/000|00000/)
          ? model.stockInvestment?.match(/000|00000/)[0]
          : "select",
        otherCost: model.otherCost?.replace(/[^0-9.]/g, "") || "",
        otherCostUnit: model.otherCost?.includes("No Fee")
          ? "No Fee"
          : model.otherCost?.match(/000|00000/)
          ? model.otherCost?.match(/000|00000/)[0]
          : "select",
        roi: model.roi?.replace(/[^0-9.]/g, "") || "",
        payBackPeriod: model.payBackPeriod || "",
        breakEven: model.breakEven || "",
        requireWorkingCapital:
          model.requireWorkingCapital?.replace(/[^0-9.]/g, "") || "",
        requireWorkingCapitalUnit: model.requireWorkingCapital?.includes("No Fee")
          ? "No Fee"
          : model.requireWorkingCapital?.match(/000|00000/)
          ? model.requireWorkingCapital?.match(/000|00000/)[0]
          : "select",
        marginOnSales: model.marginOnSales?.replace(/[^0-9.]/g, "") || "",
        agreementPeriod: model.agreementPeriod || "",
      });
      setNoFees({
        franchiseFee: model.franchiseFee?.includes("No Fee") || false,
        interiorCost: model.interiorCost?.includes("No Fee") || false,
        stockInvestment: model.stockInvestment?.includes("No Fee") || false,
        otherCost: model.otherCost?.includes("No Fee") || false,
        requireWorkingCapital:
          model.requireWorkingCapital?.includes("No Fee") || false,
        royaltyFee: model.royaltyFee?.includes("No Fee") || false,
        roi: model.roi?.includes("No Fee") || false,
      });
    }
  }, [editIndex, data.fico]);
  useEffect(() => {
  if (data.franchiseTags) {
    const allTags = Object.values(data.franchiseTags).flat().filter(Boolean);
    setSelectedServiceTags(allTags);
    setTempSelectedServiceTags(allTags);
  }
}, [data.franchiseTags]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "companyOwnedOutlets" || name === "franchiseOutlets") {
      const companyOwned =
        name === "companyOwnedOutlets"
          ? parseInt(value || 0)
          : parseInt(data.companyOwnedOutlets || 0);
      const franchise =
        name === "franchiseOutlets"
          ? parseInt(value || 0)
          : parseInt(data.franchiseOutlets || 0);
      const total = companyOwned + franchise;
      onChange(name, value);
      onChange("totalOutlets", total.toString());
    } else {
      onChange(name, value);
    }
  };
  const handleFicoChange = (e) => {
    const { name, value } = e.target;
    if (noFees[name]) {
      return;
    }
    setCurrentFicoModel((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };
      if (name === "roi" && !noFees.roi) {
        const roi = parseFloat(value);
        if (!isNaN(roi) && roi > 0) {
          const totalMonths = (100 / roi) * 12;
          const years = Math.floor(totalMonths / 12);
          const months = Math.round(totalMonths % 12);
          updated.payBackPeriod = `${years} year${
            years !== 1 ? "s" : ""
          } ${months} month${months !== 1 ? "s" : ""}`;
        } else {
          updated.payBackPeriod = "";
        }
      }
      return updated;
    });
  };
  const handleFeeUnitChange = (field) => (e) => {
    const { value } = e.target;
    if (value === "No Fee") {
      setNoFees((prev) => ({
        ...prev,
        [field]: true,
      }));
      setCurrentFicoModel((prev) => ({
        ...prev,
        [field]: "No Fee",
        [`${field}Unit`]: "No Fee",
      }));
    } else if (value === "select") {
      setNoFees((prev) => ({
        ...prev,
        [field]: false,
      }));
      setCurrentFicoModel((prev) => ({
        ...prev,
        [field]: "",
        [`${field}Unit`]: "select",
      }));
    } else {
      setNoFees((prev) => ({
        ...prev,
        [field]: false,
      }));
      setCurrentFicoModel((prev) => ({
        ...prev,
        [`${field}Unit`]: value,
      }));
    }
  };
  const handleNoFeeToggle = (field) => (event) => {
    const checked = event.target.checked;
    setNoFees((prev) => ({
      ...prev,
      [field]: checked,
    }));
    setCurrentFicoModel((prev) => {
      const newValue = checked ? "No Fee" : "";
      const newUnit = checked ? "No Fee" : "select";
      if (field === "roi") {
        let payBackPeriod = "";
        if (!checked && newValue && !isNaN(parseFloat(newValue))) {
          const roiValue = parseFloat(newValue);
          if (roiValue > 0) {
            const totalMonths = (100 / roiValue) * 12;
            const years = Math.floor(totalMonths / 12);
            const months = Math.round(totalMonths % 12);
            payBackPeriod = `${years} year${
              years !== 1 ? "s" : ""
            } ${months} Month${months !== 1 ? "s" : ""}`;
          }
        }
        return {
          ...prev,
          [field]: newValue,
          [`${field}Unit`]: newUnit,
          payBackPeriod: payBackPeriod,
        };
      }
      return {
        ...prev,
        [field]: newValue,
        [`${field}Unit`]: newUnit,
      };
    });
  };
  const validateFicoModel = () => {
    const requiredFields = [
      "investmentRange",
      "areaRequired",
      "franchiseModel",
      "franchiseType",
      "agreementPeriod",
      "breakEven",
      "marginOnSales",
    ];
    for (const field of requiredFields) {
      if (!currentFicoModel[field]) {
        return `Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`;
      }
    }
    const feeUnitsToCheck = [
      "franchiseFeeUnit",
      "royaltyFeeUnit",
      "interiorCostUnit",
      "stockInvestmentUnit",
      "otherCostUnit",
      "requireWorkingCapitalUnit",
    ];
    for (const unit of feeUnitsToCheck) {
      const fieldName = unit.replace("Unit", "");
      if (currentFicoModel[unit] === "select" && !noFees[fieldName]) {
        const displayName = fieldName.replace(/([A-Z])/g, " $1").toLowerCase();
        return `Please select a unit for ${displayName} or mark as "No Fee"`;
      }
    }
    const feeFields = [
      "franchiseFee",
      "royaltyFee",
      "interiorCost",
      "stockInvestment",
      "otherCost",
      "requireWorkingCapital",
      "roi",
      "payBackPeriod",
    ];
    for (const field of feeFields) {
      if (
        !currentFicoModel[field] &&
        !noFees[field] &&
        field !== "payBackPeriod"
      ) {
        return `Please fill in ${field
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()} or mark as "No Fee"`;
      }
    }
    return null;
  };
  const handleAddOrUpdateFicoModel = () => {
    const validationError = validateFicoModel();
    if (validationError) {
      alert(validationError);
      return;
    }
    const formattedFicoModel = {
      ...currentFicoModel,
      franchiseFee: noFees.franchiseFee
        ? "No Fee"
        : `${currentFicoModel.franchiseFee}${
            currentFicoModel.franchiseFeeUnit === "No Fee"
              ? ""
              : currentFicoModel.franchiseFeeUnit
          }`,
      royaltyFee: noFees.royaltyFee
        ? "No Fee"
        : `${currentFicoModel.royaltyFee}${
            currentFicoModel.royaltyFeeUnit === "No Fee"
              ? ""
              : currentFicoModel.royaltyFeeUnit
          }`,
      interiorCost: noFees.interiorCost
        ? "No Fee"
        : `${currentFicoModel.interiorCost}${
            currentFicoModel.interiorCostUnit === "No Fee"
              ? ""
              : currentFicoModel.interiorCostUnit
          }`,
      stockInvestment: noFees.stockInvestment
        ? "No Fee"
        : `${currentFicoModel.stockInvestment}${
            currentFicoModel.stockInvestmentUnit === "No Fee"
              ? ""
              : currentFicoModel.stockInvestmentUnit
          }`,
      otherCost: noFees.otherCost
        ? "No Fee"
        : `${currentFicoModel.otherCost}${
            currentFicoModel.otherCostUnit === "No Fee"
              ? ""
              : currentFicoModel.otherCostUnit
          }`,
      requireWorkingCapital: noFees.requireWorkingCapital
        ? "No Fee"
        : `${currentFicoModel.requireWorkingCapital}${
            currentFicoModel.requireWorkingCapitalUnit === "No Fee"
              ? ""
              : currentFicoModel.requireWorkingCapitalUnit
          }`,
      roi: noFees.roi ? "No Fee" : currentFicoModel.roi,
      payBackPeriod: noFees.roi ? "No Fee" : currentFicoModel.payBackPeriod,
    };
    let updatedFico;
    if (editIndex !== null) {
      updatedFico = [...(data.fico || [])];
      updatedFico[editIndex] = formattedFicoModel;
    } else {
      updatedFico = [...(data.fico || []), formattedFicoModel];
    }
    onArrayChange("fico", updatedFico);
    resetFicoForm();
  };
  const handleEditFicoModel = (index) => {
    setEditIndex(index);
  };
  const handleDeleteFicoModel = (index) => {
    setDeleteIndex(index);
    setConfirmDeleteOpen(true);
  };
  const confirmDelete = () => {
    const updatedFico = [...(data.fico || [])];
    updatedFico.splice(deleteIndex, 1);
    onArrayChange("fico", updatedFico);
    setConfirmDeleteOpen(false);
    setDeleteIndex(null);
  };
  const resetFicoForm = () => {
    setCurrentFicoModel({
      investmentRange: "",
      areaRequired: "",
      franchiseModel: "",
      franchiseType: "",
      franchiseFee: "",
      franchiseFeeUnit: "select",
      royaltyFee: "",
      royaltyFeeUnit: "select",
      interiorCost: "",
      interiorCostUnit: "select",
      stockInvestment: "",
      stockInvestmentUnit: "select",
      otherCost: "",
      otherCostUnit: "select",
      roi: "",
      payBackPeriod: "",
      breakEven: "",
      requireWorkingCapital: "",
      requireWorkingCapitalUnit: "select",
      marginOnSales: "",
      agreementPeriod: "",
    });
    setNoFees({
      franchiseFee: false,
      interiorCost: false,
      stockInvestment: false,
      otherCost: false,
      requireWorkingCapital: false,
      royaltyFee: false,
      roi: false,
    });
    setEditIndex(null);
  };
  const handleCancelEdit = () => {
    resetFicoForm();
  };
 // Update the selectedCategory initialization in your component
const [selectedCategory, setSelectedCategory] = useState({
  groupId: data.brandCategories?.groupId || "",
  main: data.brandCategories?.main || "",
  sub: data.brandCategories?.sub || "",
  child: data.brandCategories?.child
    ? (Array.isArray(data.brandCategories.child)
        ? data.brandCategories.child
        : data.brandCategories.child.split(" | ").filter(Boolean))
    : [],
});

// Add this useEffect to sync with props
useEffect(() => {
  if (data.brandCategories) {
    setSelectedCategory({
      groupId: data.brandCategories.groupId || "",
      main: data.brandCategories.main || "",
      sub: data.brandCategories.sub || "",
      child: data.brandCategories.child
        ? (Array.isArray(data.brandCategories.child)
            ? data.brandCategories.child
            : data.brandCategories.child.split(" | ").filter(Boolean))
        : [],
    });
  }
}, [data.brandCategories]);
const handleOpenServiceTagDrawer = () => {
  const tagsObj = data.franchiseTags || {};
  
  // Flatten all arrays into one list
  const allSelected = Object.values(tagsObj).flat().filter(Boolean);
  
  setTempSelectedServiceTags(allSelected);
  setServiceTagDrawerOpen(true);
};

const handleServiceTagToggle = (tag) => {
  setTempSelectedServiceTags((prev) =>
    prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]
  );
};

const handleServiceTagDone = () => {
  const updatedTags = {};

  // Group tags by which category they belong to
  Object.entries(serviceTagGroups).forEach(([groupLabel, options]) => {
    // Map group labels to property names correctly
    let propertyName;
    switch(groupLabel) {
      case "Primary Classification":
        propertyName = "PrimaryClassifications";
        break;
      // case "Product / Service Types":
      //   propertyName = "ProductServiceTypes";
      //   break;
      case "Target Audience":
        propertyName = "TargetAudience";
        break;
      case "Service Model":
        propertyName = "ServiceModel";
        break;
      case "Pricing Value":
        propertyName = "PricingValue";
        break;
      case "Ambience & Experience":
        propertyName = "AmbienceExperience";
        break;
      case "Features & Amenities":
        propertyName = "FeaturesAmenities";
        break;
      case "Technology Integration":
        propertyName = "TechnologyIntegration";
        break;
      case "Sustainability & Ethics":
        propertyName = "SustainabilityEthics";
        break;
      case "Business Operations":
        propertyName = "BusinessOperations";
        break;
      default:
        propertyName = groupLabel.replace(/[^a-zA-Z]/g, "");
    }
    
    updatedTags[propertyName] = options.filter((opt) => tempSelectedServiceTags.includes(opt));
  });

  // Save to parent
  onObjectChange("franchiseTags", updatedTags);

  // Update local state
  setCurrentTags(updatedTags);
  
  // Update selectedServiceTags for display
  setSelectedServiceTags(tempSelectedServiceTags);
  
  setServiceTagDrawerOpen(false);
};

  const handleMainCategoryChange = (e) => {
    const mainCategory = e.target.value;
    const newCategory = {
      groupId: "",
      main: mainCategory,
      sub: "",
      child: [],
    };
    setSelectedCategory(newCategory);
    onObjectChange("brandCategories", newCategory);
  };
  const handleSubCategoryChange = (e) => {
    const subCategory = e.target.value;
    const group = categories
      .find((cat) => cat.name === selectedCategory.main)
      ?.children?.find((sub) => sub.name === subCategory);
    const newCategory = {
      groupId: group?.groupId || "",
      main: selectedCategory.main,
      sub: subCategory,
      child: [],
    };
    setSelectedCategory(newCategory);
    onObjectChange("brandCategories", newCategory);
  };
  const handleChildCategoryChange = (e) => {
    const {
      target: { value },
    } = e;
    const newChild = typeof value === "string" ? value.split(" - ") : value;
    const newCategory = {
      ...selectedCategory,
      child: newChild,
    };
    setSelectedCategory(newCategory);
    // Send as string to backend
    const toSend = {
      ...newCategory,
      child: newChild.join(" | "),
    };
    onObjectChange("brandCategories", toSend);
  };
  const handleDescriptionChange = (e) => {
    onChange("brandDescription", e.target.value);
  };
  const handleAddUSP = () => {
    const trimmedUSP = currentUSP.trim();
    if (!trimmedUSP) return;
    const existingUSPs = (data.uniqueSellingPoints || []).map((usp) =>
      usp.toLowerCase().trim()
    );
    if (existingUSPs.includes(trimmedUSP.toLowerCase())) {
      return;
    }
    const updatedUSPs = [...(data.uniqueSellingPoints || []), trimmedUSP];
    onArrayChange("uniqueSellingPoints", updatedUSPs);
    setCurrentUSP("");
  };
  const handleRemoveUSP = (index) => {
    const updatedUSPs = [...(data.uniqueSellingPoints || [])];
    updatedUSPs.splice(index, 1);
    onArrayChange("uniqueSellingPoints", updatedUSPs);
  };
  const handleTrainingSupportChange = (option, checked) => {
    const newValue = checked
      ? [...(data.trainingSupport || []), option]
      : (data.trainingSupport || []).filter((v) => v !== option);
    onArrayChange("trainingSupport", newValue);
  };
  const formatCurrency = (value) => {
  if (!value || value === "No Fee" || value === "select") return value || "N/A";
  
  // If value already contains the unit, return as is
  if (typeof value === 'string' && (value.includes('Lakhs') || value.includes('Thousands') || value.includes('%'))) {
    return value;
  }
  
  // Otherwise, add .Rs suffix
  return `${value}.Rs`;
};

  return (
    <Box sx={{ pr: 1, mr: { sm: 0, md: 10 }, ml: { sm: 0, md: 10 } }}>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this franchise model?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Brand Categories Section */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: "#ff9800" }}>
        Brand Categories
      </Typography>
      <Grid
         container
  spacing={2}
  sx={{
    mb: 4,
    alignItems: "flex-start",
  }}
      >
         <Grid item xs={12} md={3}>
    <FormControl fullWidth size="medium">
      <InputLabel id="industries-label">Industries</InputLabel>
      <Select
        labelId="industries-label"
        id="industries-select"
        value={selectedCategory.main || ""}
        label="Industries"
        onChange={handleMainCategoryChange}
        disabled={!isEditing}
        sx={{ minHeight: 56 }}
        MenuProps={{
          PaperProps: { sx: { maxHeight: 320 } },
        }}
      >
        {categories.map((category) => (
          <MenuItem key={category.name} value={category.name}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
      {errors.mainCategory && (
        <FormHelperText error>{errors.mainCategory}</FormHelperText>
      )}
    </FormControl>
  </Grid>

       <Grid item xs={12} md={3}>
    <FormControl fullWidth size="medium">
      <InputLabel id="main-cat-label">Main Category</InputLabel>
      <Select
        labelId="main-cat-label"
        id="main-cat-select"
        value={selectedCategory.sub || ""}
        label="Main Category"
        onChange={handleSubCategoryChange}
        disabled={!isEditing || !selectedCategory.main}
        sx={{ minHeight: 56 }}
        MenuProps={{
          PaperProps: { sx: { maxHeight: 320 } },
        }}
      >
        {selectedCategory.main &&
          categories
            .find((cat) => cat.name === selectedCategory.main)
            ?.children?.map((subCategory) => (
              <MenuItem key={subCategory.name} value={subCategory.name}>
                {subCategory.name}
              </MenuItem>
            ))}
      </Select>
      {errors.subCategory && (
        <FormHelperText error>{errors.subCategory}</FormHelperText>
      )}
    </FormControl>
  </Grid>
  
   {/* <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="medium">
            <InputLabel>Main Category</InputLabel>
            <Select
              value={selectedCategory.sub || ""}
              label="Main Category"
              onChange={handleSubCategoryChange}
              error={!!errors.subCategory}
              disabled={!isEditing || !selectedCategory.main}
            >
              {selectedCategory.main &&
                categories
                  .find((cat) => cat.name === selectedCategory.main)
                  ?.children?.map((subCategory) => (
                    <MenuItem key={subCategory.name} value={subCategory.name}>
                      {subCategory.name}
                    </MenuItem>
                  ))}
            </Select>
            {errors.subCategory && (
              <FormHelperText error>{errors.subCategory}</FormHelperText>
            )}
          </FormControl>
        </Grid> */}

       {/* Product Tag */}
<Grid item xs={12} md={3}>
  <FormControl fullWidth size="medium">
    <InputLabel shrink htmlFor="sub-cat-field">Product Tag</InputLabel>
    <TextField
      id="sub-cat-field"
      variant="outlined"
      value={
        selectedCategory.child?.length
          ? `${selectedCategory.child.length} tag(s) selected`
          : 'Select Product Tags'
      }
      placeholder="Select Product Tags"
      onClick={handleOpenDrawer}
      InputProps={{ readOnly: true }}
      disabled={!isEditing} // Remove the !selectedCategory.sub condition
      sx={{
        minHeight: 56,
        '& .MuiInputBase-input': {
          cursor: isEditing ? 'pointer' : 'default',
          userSelect: 'none',
        },
      }}
    />
  </FormControl>
</Grid>

   {/* Service Tag */}
  <Grid item xs={12} md={3}>
    <FormControl fullWidth size="medium">
      <InputLabel shrink htmlFor="service-tag-field">Service Tag</InputLabel>
      <TextField
        id="service-tag-field"
        variant="outlined"
        value={
          selectedServiceTags.length
            ? `${selectedServiceTags.length} tag(s) selected`
            : "Select Service Tags"
        }
        placeholder="Select Service Tags"
        onClick={handleOpenServiceTagDrawer}
        InputProps={{ readOnly: true }}
        disabled={!isEditing || !selectedCategory.sub}
        sx={{
          minHeight: 56,
          '& .MuiInputBase-input': {
            cursor: isEditing ? 'pointer' : 'default',
            userSelect: 'none',
          },
        }}
      />
    </FormControl>
  </Grid>

      </Grid>
      
 {!!selectedCategory.child?.length &&(
      <Box sx={{ mt: 2, width: '100%' }}>
        <Box
          onClick={() => setShowSelectedBar((v) => !v)}
          sx={{
            px: 2,
            py: 1,
            mb:3,
            bgcolor: 'grey.100',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <Typography variant="subtitle1" fontWeight={700}>
            View Selected Product Tags 
          </Typography>
          {showSelectedBar ? <ExpandLess /> : <ExpandMore />}
        </Box>

        <Collapse in={showSelectedBar}>
          <Stack
            direction="row"
            flexWrap="wrap"
            gap={1}
            sx={{ px: 2, py: 2,  borderRadius: 1 }}
          >
            {selectedCategory.child.map((child) => (
              <Chip
                key={child}
                label={child}
                size="small"
                // onDelete={isEditing ? () => handleChildToggle(child) : undefined}
              />
            ))}
          </Stack>
        </Collapse>
      </Box>
    )}
    {/* View Selected Service Tags Section */}
{!!selectedServiceTags.length &&(
  <Box sx={{ mt: 2, width: '100%' }}>
    <Box
      onClick={() => setShowSelectedServiceTags((v) => !v)}
      sx={{
        px: 2,
        py: 1,
        mb: 3,
        bgcolor: 'grey.100',
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <Typography variant="subtitle1" fontWeight={700}>
        View Selected Service Tags 
      </Typography>
      {showSelectedServiceTags ? <ExpandLess /> : <ExpandMore />}
    </Box>

    <Collapse in={showSelectedServiceTags}>
      <Box sx={{ px: 2, py: 2 }}>
        {/* Group service tags by category */}
        {Object.entries(serviceTagGroups).map(([groupLabel, options]) => {
          const selectedInGroup = options.filter(opt => 
            tempSelectedServiceTags.includes(opt)
          );
          
          if (selectedInGroup.length === 0) return null;
          
          return (
            <Box key={groupLabel} sx={{ mb: 2 }}>
              <Typography 
                variant="subtitle2" 
                fontWeight={600} 
                sx={{ color: '#ff9800', mb: 1 }}
              >
                {groupLabel}:
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {selectedInGroup.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    // color="primary"
                    variant="outlined"
                    // onDelete={isEditing ? () => handleServiceTagToggle(tag) : undefined}
                  />
                ))}
              </Stack>
            </Box>
          );
        })}
      </Box>
    </Collapse>
  </Box>
)}

{/* Drawer for Service tags */}
<Drawer
  anchor="top"
  open={serviceTagDrawerOpen}
  onClose={() => setServiceTagDrawerOpen(false)}
  PaperProps={{ sx: { height: "95vh" } }}
>
  <AppBar position="sticky" color="default" elevation={1}>
    <Toolbar sx={{ justifyContent: "space-between" }}>
      <Typography variant="h6" sx={{ color: "#ff9800" }}>
        All Service Tags
      </Typography>
      <IconButton onClick={() => setServiceTagDrawerOpen(false)}>
        <CloseIcon />
      </IconButton>
    </Toolbar>
  </AppBar>

  <Box sx={{ p: 2, overflowY: "auto", height: "calc(80vh - 64px)" }}>
    {Object.entries(serviceTagGroups).map(([groupLabel, options]) => (
      <Box key={groupLabel} sx={{ mb: 3 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, mb: 1, color: "#ff9800" }}
        >
          {groupLabel}
        </Typography>

       <Grid container spacing={1}>
  {options.map((opt) => (
    <Grid item xs={12} sm={6} md={3} key={opt}>
      <FormControlLabel
        control={
          <Checkbox
            checked={tempSelectedServiceTags.includes(opt)}
            onChange={() => handleServiceTagToggle(opt)}
            color="primary"
          />
        }
        label={
          <Typography variant="body2">
            {opt}
          </Typography>
        }
        sx={{
          width: '100%',
          margin: 0,
          '& .MuiFormControlLabel-label': {
            width: '100%',
          }
        }}
      />
    </Grid>
  ))}
</Grid>
      </Box>
    ))}
  </Box>

  <Box
    sx={{
      position: "sticky",
      bottom: 0,
      p: 2,
      bgcolor: "background.paper",
      borderTop: "1px solid rgba(0,0,0,0.12)",
      display: "flex",
      justifyContent: "space-between",
    }}
  >
    <Typography>{tempSelectedServiceTags.length} tag(s) selected</Typography>
    <Box>
      <Button
        onClick={() => setServiceTagDrawerOpen(false)}
        sx={{ mr: 2 }}
        variant="outlined"
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        onClick={handleServiceTagDone}
        sx={{ backgroundColor: "#ff9800", color: "#fff" }}
      >
        Done
      </Button>
    </Box>
  </Box>
</Drawer>
{/* Drawer for Product Tags */}

<Drawer
  anchor="top"
  open={drawerOpen}
  onClose={() => setDrawerOpen(false)}
  PaperProps={{ sx: { height: "95vh" } }}
>
  <AppBar position="sticky" color="default" elevation={1}>
    <Toolbar sx={{ justifyContent: "space-between" }}>
      <Typography variant="h6" sx={{ color: "#ff9800" }}>
        Select Product Tags - All Categories
      </Typography>
      <IconButton onClick={() => setDrawerOpen(false)}>
        <CloseIcon />
      </IconButton>
    </Toolbar>
  </AppBar>

  <Box sx={{ p: 2, overflowY: "auto", height: "calc(80vh - 64px)" }}>
    {/* Show ALL categories and their children */}
    {categories.map((category) => (
      <Box key={category.name} sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{ 
            fontWeight: 700, 
            mb: 2, 
            color: "#ff9800",
            borderBottom: "2px solid #ff9800",
            pb: 1
          }}
        >
          {category.name}
        </Typography>
        
        {category.children?.map((subCategory) => (
          <Box key={subCategory.name} sx={{ mb: 3, ml: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, mb: 1, color: "text.primary" }}
            >
              {subCategory.name}
            </Typography>
            
            <Grid container spacing={1}>
              {subCategory.children?.map((child) => (
                <Grid item xs={12} sm={6} md={3} key={child}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={tempSelectedChild.includes(child)}
                        onChange={() => handleChildToggle(child)}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        {child}
                      </Typography>
                    }
                    sx={{
                      width: '100%',
                      margin: 0,
                      '& .MuiFormControlLabel-label': {
                        width: '100%',
                      }
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Box>
    ))}
  </Box>

  <Box
    sx={{
      position: "sticky",
      bottom: 0,
      p: 2,
      bgcolor: "background.paper",
      borderTop: "1px solid rgba(0,0,0,0.12)",
      display: "flex",
      justifyContent: "space-between",
    }}
  >
    <Typography>{tempSelectedChild.length} tag(s) selected</Typography>
    <Box>
      <Button
        onClick={() => setDrawerOpen(false)}
        sx={{ mr: 2 }}
        variant="outlined"
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        onClick={handleDone}
        sx={{ backgroundColor: "#ff9800", color: "#fff" }}
      >
        Done
      </Button>
    </Box>
  </Box>
</Drawer>

 {/* <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: "#ff9800" }}>
        Franchise Tags
      </Typography> */}

      {/* <Grid
        container
        spacing={2}
        sx={{
          display: "grid",
          gridTemplateColumns: { md: "repeat(3, 1fr)", xs: "1fr" },
          gap: 2,
          mb: 4,
          mt: 2,
        }}
      > */}

        {/* Primary Classification */}
        {/* <Grid item xs={12}>
          <FormControl
            fullWidth
            error={!!errors.PrimaryClassifications}
            required
            size="medium"
          >
            <InputLabel>Primary Classification</InputLabel>
            <Select
              multiple
              value={currentTags.PrimaryClassifications || []}
              onChange={handleTagChange('PrimaryClassifications')}
              name="PrimaryClassifications"
              label="Primary Classification"
              renderValue={(selected) => selected.join(', ')}
              disabled={!isEditing}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 400,
                    width: 500,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    columnGap: '10px',
                    padding: '10px',
                  },
                },
              }}
            >
              {PrimaryClassifications.map((classification) => (
                <MenuItem key={classification} value={classification}>
                  <Checkbox
                    checked={(currentTags.PrimaryClassifications || []).indexOf(classification) > -1}
                  />
                  <ListItemText primary={classification} />
                </MenuItem>
              ))}
            </Select>
            {errors.PrimaryClassifications && (
              <FormHelperText error>
                {errors.PrimaryClassifications}
              </FormHelperText>
            )}
          </FormControl>
        </Grid> */}

        {/* Product/Service Types */}
        {/* <Grid item>
          <FormControl
            fullWidth
            error={!!errors.productServiceTypes}
            required
            size="medium"
          >
            <InputLabel>Product/Service Types</InputLabel>
            <Select
              multiple
              value={currentTags.productServiceTypes || []}
              onChange={handleTagChange('productServiceTypes')}
              name="productServiceTypes"
              label="Product/Service Types"
              renderValue={(selected) => selected.join(', ')}
              disabled={!isEditing}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 400,
                    width: 400,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    columnGap: '8px',
                    padding: '8px',
                  },
                },
              }}
            >
              {productServiceType.map((type) => (
                <MenuItem key={type} value={type}>
                  <Checkbox
                    checked={(currentTags.productServiceTypes || []).indexOf(type) > -1}
                  />
                  <ListItemText primary={type} />
                </MenuItem>
              ))}
            </Select>
            {errors.productServiceTypes && (
              <FormHelperText error>{errors.productServiceTypes}</FormHelperText>
            )}
          </FormControl>
        </Grid> */}

        {/* Target Audience */}
        {/* <Grid item>
          <FormControl
            fullWidth
            error={!!errors.TargetAudience}
            required
            size="medium"
          >
            <InputLabel>Target Audience</InputLabel>
            <Select
              multiple
              value={currentTags.TargetAudience || []}
              onChange={handleTagChange('TargetAudience')}
              name="TargetAudience"
              label="Target Audience"
              renderValue={(selected) => selected.join(', ')}
              disabled={!isEditing}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 400,
                    width: 350,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    columnGap: '8px',
                    padding: '8px',
                  },
                },
              }}
            >
              {TargetAudience.map((audience) => (
                <MenuItem key={audience} value={audience}>
                  <Checkbox
                    checked={(currentTags.TargetAudience || []).indexOf(audience) > -1}
                  />
                  <ListItemText primary={audience} />
                </MenuItem>
              ))}
            </Select>
            {errors.TargetAudience && (
              <FormHelperText error>{errors.TargetAudience}</FormHelperText>
            )}
          </FormControl>
        </Grid> */}

        {/* Service Model */}
        {/* <Grid item>
          <FormControl
            fullWidth
            error={!!errors.ServiceModel}
            required
            size="medium"
          >
            <InputLabel>Service Model</InputLabel>
            <Select
              multiple
              value={currentTags.ServiceModel || []}
              onChange={handleTagChange('ServiceModel')}
              name="ServiceModel"
              label="Service Model"
              renderValue={(selected) => selected.join(', ')}
              disabled={!isEditing}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 400,
                    width: 350,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    columnGap: '8px',
                    padding: '8px',
                  },
                },
              }}
            >
              {ServiceModel.map((model) => (
                <MenuItem key={model} value={model}>
                  <Checkbox
                    checked={(currentTags.ServiceModel || []).indexOf(model) > -1}
                  />
                  <ListItemText primary={model} />
                </MenuItem>
              ))}
            </Select>
            {errors.ServiceModel && (
              <FormHelperText error>{errors.ServiceModel}</FormHelperText>
            )}
          </FormControl>
        </Grid> */}

        {/* Pricing Value */}
        {/* <Grid item>
          <FormControl
            fullWidth
            error={!!errors.PricingValue}
            required
            size="medium"
          >
            <InputLabel>Pricing Value</InputLabel>
            <Select
              multiple
              value={currentTags.PricingValue || []}
              onChange={handleTagChange('PricingValue')}
              name="PricingValue"
              label="Pricing Value"
              renderValue={(selected) => selected.join(', ')}
              disabled={!isEditing}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                    width: 250,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    columnGap: '8px',
                    padding: '8px',
                  },
                },
              }}
            >
              {PricingValue.map((price) => (
                <MenuItem key={price} value={price}>
                  <Checkbox
                    checked={(currentTags.PricingValue || []).indexOf(price) > -1}
                  />
                  <ListItemText primary={price} />
                </MenuItem>
              ))}
            </Select>
            {errors.PricingValue && (
              <FormHelperText error>{errors.PricingValue}</FormHelperText>
            )}
          </FormControl>
        </Grid> */}

        {/* Ambience Experience */}
        {/* <Grid item>
          <FormControl
            fullWidth
            error={!!errors.AmbienceExperience}
            required
            size="medium"
          >
            <InputLabel>Ambience & Experience</InputLabel>
            <Select
              multiple
              value={currentTags.AmbienceExperience || []}
              onChange={handleTagChange('AmbienceExperience')}
              name="AmbienceExperience"
              label="Ambience & Experience"
              renderValue={(selected) => selected.join(', ')}
              disabled={!isEditing}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 400,
                    width: 380,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    columnGap: '8px',
                    padding: '8px',
                  },
                },
              }}
            >
              {AmbienceExperience.map((ambience) => (
                <MenuItem key={ambience} value={ambience}>
                  <Checkbox
                    checked={(currentTags.AmbienceExperience || []).indexOf(ambience) > -1}
                  />
                  <ListItemText primary={ambience} />
                </MenuItem>
              ))}
            </Select>
            {errors.AmbienceExperience && (
              <FormHelperText error>{errors.AmbienceExperience}</FormHelperText>
            )}
          </FormControl>
        </Grid> */}

        {/* Features & Amenities */}
        {/* <Grid item>
          <FormControl
            fullWidth
            error={!!errors.FeaturesAmenities}
            required
            size="medium"
          >
            <InputLabel>Features & Amenities</InputLabel>
            <Select
              multiple
              value={currentTags.FeaturesAmenities || []}
              onChange={handleTagChange('FeaturesAmenities')}
              name="FeaturesAmenities"
              label="Features & Amenities"
              renderValue={(selected) => selected.join(', ')}
              disabled={!isEditing}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 400,
                    width: 350,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    columnGap: '8px',
                    padding: '8px',
                  },
                },
              }}
            >
              {FeaturesAmenities.map((feature) => (
                <MenuItem key={feature} value={feature}>
                  <Checkbox
                    checked={(currentTags.FeaturesAmenities || []).indexOf(feature) > -1}
                  />
                  <ListItemText primary={feature} />
                </MenuItem>
              ))}
            </Select>
            {errors.FeaturesAmenities && (
              <FormHelperText error>{errors.FeaturesAmenities}</FormHelperText>
            )}
          </FormControl>
        </Grid> */}

        {/* Technology Integration */}
        {/* <Grid item>
          <FormControl
            fullWidth
            error={!!errors.TechnologyIntegration}
            required
            size="medium"
          >
            <InputLabel>Technology Integration</InputLabel>
            <Select
              multiple
              value={currentTags.TechnologyIntegration || []}
              onChange={handleTagChange('TechnologyIntegration')}
              name="TechnologyIntegration"
              label="Technology Integration"
              renderValue={(selected) => selected.join(', ')}
              disabled={!isEditing}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                    width: 320,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    columnGap: '8px',
                    padding: '8px',
                  },
                },
              }}
            >
              {TechnologyIntegration.map((tech) => (
                <MenuItem key={tech} value={tech}>
                  <Checkbox
                    checked={(currentTags.TechnologyIntegration || []).indexOf(tech) > -1}
                  />
                  <ListItemText primary={tech} />
                </MenuItem>
              ))}
            </Select>
            {errors.TechnologyIntegration && (
              <FormHelperText error>{errors.TechnologyIntegration}</FormHelperText>
            )}
          </FormControl>
        </Grid> */}

        {/* Sustainability & Ethics */}
        {/* <Grid item>
          <FormControl
            fullWidth
            error={!!errors.SustainabilityEthics}
            required
            size="medium"
          >
            <InputLabel>Sustainability & Ethics</InputLabel>
            <Select
              multiple
              value={currentTags.SustainabilityEthics || []}
              onChange={handleTagChange('SustainabilityEthics')}
              name="SustainabilityEthics"
              label="Sustainability & Ethics"
              renderValue={(selected) => selected.join(', ')}
              disabled={!isEditing}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 350,
                    width: 320,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    columnGap: '8px',
                    padding: '8px',
                  },
                },
              }}
            >
              {SustainabilityEthics.map((sustainability) => (
                <MenuItem key={sustainability} value={sustainability}>
                  <Checkbox
                    checked={(currentTags.SustainabilityEthics || []).indexOf(sustainability) > -1}
                  />
                  <ListItemText primary={sustainability} />
                </MenuItem>
              ))}
            </Select>
            {errors.SustainabilityEthics && (
              <FormHelperText error>{errors.SustainabilityEthics}</FormHelperText>
            )}
          </FormControl>
        </Grid> */}

        {/* Business Operations */}
        {/* <Grid item>
          <FormControl
            fullWidth
            error={!!errors.BusinessOperations}
            required
            size="medium"
          >
            <InputLabel>Business Operations</InputLabel>
            <Select
              multiple
              value={currentTags.BusinessOperations || []}
              onChange={handleTagChange('BusinessOperations')}
              name="BusinessOperations"
              label="Business Operations"
              renderValue={(selected) => selected.join(', ')}
              disabled={!isEditing}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                    width: 280,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    columnGap: '8px',
                    padding: '8px',
                  },
                },
              }}
            >
              {BusinessOperation.map((operation) => (
                <MenuItem key={operation} value={operation}>
                  <Checkbox
                    checked={(currentTags.BusinessOperations || []).indexOf(operation) > -1}
                  />
                  <ListItemText primary={operation} />
                </MenuItem>
              ))}
            </Select>
            {errors.BusinessOperations && (
              <FormHelperText error>{errors.BusinessOperations}</FormHelperText>
            )}
          </FormControl>
        </Grid> */}
      {/* </Grid> */}


      <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: "#ff9800" }}>
        Establishment & Franchise year Details
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{
          display: "grid",
          gridTemplateColumns: { md: "repeat(4, 1fr)", xs: "1fr" },
        }}
      >
        <Grid item xs={12} sm={6} md={2.4}>
          <Autocomplete
            freeSolo
            options={Array.from({ length: 226 }, (_, i) =>
              String(new Date().getFullYear() - i)
            )}
            value={data.establishedYear ? String(data.establishedYear) : null}
            getOptionLabel={(option) => option}
            onChange={(event, newValue) => {
              onChange("establishedYear", newValue ? Number(newValue) : "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Year Commenced Operations"
                variant="outlined"
                size="medium"
                required
                error={!!errors.establishedYear}
                helperText={
                  errors.establishedYear && (
                    <Typography variant="caption" color="error">
                      {errors.establishedYear}
                    </Typography>
                  )
                }
                inputProps={{
                  ...params.inputProps,
                  type: "number",
                  min: new Date().getFullYear() - 225,
                  max: new Date().getFullYear(),
                  readOnly: !isEditing,
                }}
              />
            )}
            PaperComponent={({ children }) => (
              <Paper
                sx={{
                  width: 390,
                  maxHeight: 300,
                  "& .MuiAutocomplete-listbox": {
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: "4px",
                    padding: "4px",
                  },
                }}
              >
                {children}
              </Paper>
            )}
            renderOption={(props, option) => (
              <MenuItem
                {...props}
                key={option}
                sx={{
                  minWidth: 0,
                  padding: "6px 4px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {option}
              </MenuItem>
            )}
            disabled={!isEditing}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Autocomplete
            freeSolo
            options={Array.from({ length: 226 }, (_, i) =>
              String(new Date().getFullYear() - i)
            )}
            value={
              data.franchiseSinceYear ? String(data.franchiseSinceYear) : null
            }
            getOptionLabel={(option) => option}
            onChange={(event, newValue) => {
              onChange("franchiseSinceYear", newValue ? Number(newValue) : "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Year Commenced Franchising"
                variant="outlined"
                size="medium"
                required
                error={!!errors.franchiseSinceYear}
                helperText={
                  errors.franchiseSinceYear && (
                    <Typography variant="caption" color="error">
                      {errors.franchiseSinceYear}
                    </Typography>
                  )
                }
                inputProps={{
                  ...params.inputProps,
                  type: "number",
                  min: new Date().getFullYear() - 225,
                  max: new Date().getFullYear(),
                  readOnly: !isEditing,
                }}
              />
            )}
            PaperComponent={({ children }) => (
              <Paper
                sx={{
                  width: 390,
                  maxHeight: 300,
                  "& .MuiAutocomplete-listbox": {
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: "4px",
                    padding: "4px",
                  },
                }}
              >
                {children}
              </Paper>
            )}
            renderOption={(props, option) => (
              <MenuItem
                {...props}
                key={option}
                sx={{
                  minWidth: 0,
                  padding: "6px 4px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {option}
              </MenuItem>
            )}
            disabled={!isEditing}
          />
        </Grid>
      </Grid>
      {/* Franchise Network */}
      <Typography variant="h6" fontWeight={700} sx={{ color: "#ff9800" }}>
        Franchise Network
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{
          mt: 3,
          display: "grid",
          gridTemplateColumns: { md: "repeat(4, 1fr)", xs: "1fr" },
        }}
      >
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Company Owned Outlets"
            name="companyOwnedOutlets"
            value={data.companyOwnedOutlets || ""}
            onChange={handleChange}
            placeholder="0"
            type="number"
            inputProps={{ min: 0, readOnly: !isEditing }}
            error={!!errors.companyOwnedOutlets}
            helperText={errors.companyOwnedOutlets}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Franchise Outlets"
            name="franchiseOutlets"
            value={data.franchiseOutlets || ""}
            onChange={handleChange}
            placeholder="0"
            type="number"
            inputProps={{ min: 0, readOnly: !isEditing }}
            error={!!errors.franchiseOutlets}
            helperText={errors.franchiseOutlets}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Total Outlets"
            name="totalOutlets"
            value={data.totalOutlets || ""}
            type="number"
            InputProps={{ readOnly: true }}
            variant="filled"
            error={!!errors.totalOutlets}
            helperText={errors.totalOutlets}
            required
          />
        </Grid>
      </Grid>
      {/* Franchise Details Section */}
      <Typography variant="h6" fontWeight={700} sx={{ mt: 2, color: "#ff9800" }}>
        Franchise Business Models
      </Typography>
      {errors.fico && typeof errors.fico === "string" && (
        <Typography color="error" sx={{ mb: 2 }}>
          {errors.fico}
        </Typography>
      )}
      {/* Current FICO Model Form - Only show when editing */}
      {isEditing && (
        <>
          <Grid
            container
            spacing={2}
            sx={{
              display: "grid",
              gridTemplateColumns: { md: "repeat(4, 1fr)", xs: "1fr" },
              gap: 2,
              mb: 2,
              mt: 2,
            }}
          >
            {/* Column 1 - Franchise Model */}
            <Grid item>
              <FormControl
                fullWidth
                error={!!errors.franchiseModel}
                required
                size="medium"
              >
                <InputLabel>Franchise Model</InputLabel>
                <Select
                  value={currentFicoModel.franchiseModel}
                  onChange={handleFicoChange}
                  name="franchiseModel"
                  label="Franchise Model"
                >
                  {franchiseModels.map((model) => (
                    <MenuItem key={model} value={model}>
                      {model}
                    </MenuItem>
                  ))}
                </Select>
                {errors.franchiseModel && (
                  <FormHelperText error>{errors.franchiseModel}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* Column 2 - Franchise Type */}
            <Grid item>
              <FormControl
                fullWidth
                error={!!errors.franchiseType}
                required
                size="medium"
              >
                <InputLabel>Franchise Type</InputLabel>
                <Select
                  value={currentFicoModel.franchiseType}
                  onChange={handleFicoChange}
                  name="franchiseType"
                  label="Franchise Type*"
                >
                  {franchiseTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {errors.franchiseType && (
                  <FormHelperText error>{errors.franchiseType}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* Column 3 - Investment Range */}
            <Grid item>
              <FormControl
                fullWidth
                error={!!errors.investmentRange}
                required
                size="medium"
              >
                <InputLabel>Investment Range</InputLabel>
                <Select
                  value={currentFicoModel.investmentRange}
                  onChange={handleFicoChange}
                  name="investmentRange"
                  label="Investment Range*"
                >
                  {investmentRanges.map((range) => (
                    <MenuItem key={range.value} value={range.value}>
                      {range.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.investmentRange && (
                  <FormHelperText error>{errors.investmentRange}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* Column 4 - Area Required */}
            <Grid item>
              <FormControl
                fullWidth
                size="medium"
                required
                error={!!errors.areaRequired}
              >
                <InputLabel>Area Required</InputLabel>
                <Select
                  label="Area Required"
                  name="areaRequired"
                  value={currentFicoModel.areaRequired || ""}
                  onChange={handleFicoChange}
                  endAdornment={
                    <InputAdornment position="end" sx={{ mr: 2 }}>
                      Sq.Ft
                    </InputAdornment>
                  }
                >
                  <MenuItem value="No Space Required">
                    No Space Required
                  </MenuItem>
                  <MenuItem value="100 - 200 Sq. Ft.">100-200 Sq. Ft.</MenuItem>
                  <MenuItem value="200 - 500 Sq. Ft.">200-500 Sq. Ft.</MenuItem>
                  <MenuItem value="500 - 1,000 Sq. Ft.">
                    500-1,000 Sq. Ft.
                  </MenuItem>
                  <MenuItem value="1,000 - 2,000 Sq. Ft.">
                    1,000-2,000 Sq. Ft.
                  </MenuItem>
                  <MenuItem value="2,000 - 3,000 Sq. Ft.">
                    2,000-3,000 Sq. Ft.
                  </MenuItem>
                  <MenuItem value="3,000 - 5,000 Sq. Ft.">
                    3,000-5,000 Sq. Ft.
                  </MenuItem>
                  <MenuItem value="5,000 - 7,000 Sq. Ft.">
                    5,000-7,000 Sq. Ft.
                  </MenuItem>
                  <MenuItem value="7,000 - 10,000 Sq. Ft.">
                    7,000-10,000 Sq. Ft.
                  </MenuItem>
                  <MenuItem value="10,000 - 15,000 Sq. Ft.">
                    10,000-15,000 Sq. Ft.
                  </MenuItem>
                </Select>
                {errors.areaRequired && (
                  <FormHelperText error>{errors.areaRequired}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* Column 5 agreementPeriod */}
            <Grid item>
              <FormControl
                fullWidth
                error={!!errors.agreementPeriod}
                required
                size="medium"
              >
                <InputLabel>Agreement Period </InputLabel>
                <Select
                  label="Agreement Period "
                  name="agreementPeriod"
                  value={currentFicoModel.agreementPeriod || ""}
                  onChange={handleFicoChange}
                  renderValue={(selected) => (selected ? `${selected} ` : "")}
                  endAdornment={
                    <InputAdornment position="end" sx={{ mr: 2 }}>
                      Years
                    </InputAdornment>
                  }
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        width: 250,
                        maxHeight: 300,
                        "& .MuiList-root": {
                          display: "grid",
                          gridTemplateColumns: "repeat(5, 1fr)",
                          gap: "4px",
                          padding: "4px",
                        },
                      },
                    },
                  }}
                >
                  {Array.from({ length: 50 }, (_, i) => i + 1).map((year) => (
                    <MenuItem
                      key={year}
                      value={year}
                      sx={{
                        minWidth: 0,
                        padding: "6px 4px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {year}
                    </MenuItem>
                  ))}
                </Select>
                {errors.agreementPeriod && (
                  <FormHelperText error>{errors.agreementPeriod}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* Column 6 - Franchise Fee */}
            <Grid item>
              <FormControl fullWidth>
                <TextField
                  fullWidth
                  size="medium"
                  label="Franchise Fee"
                  name="franchiseFee"
                  value={currentFicoModel.franchiseFee}
                  onChange={handleFicoChange}
                  error={!!errors.franchiseFee}
                  helperText={errors.franchiseFee}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Select
                          value={currentFicoModel.franchiseFeeUnit}
                          onChange={handleFeeUnitChange("franchiseFee")}
                          sx={{
                            "& .MuiSelect-select": {
                              padding: "8px 8px",
                              fontSize: "0.875rem",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                          }}
                        >
                          {otherFeeUnits.map((unit) => (
                            <MenuItem key={unit.value} value={unit.value}>
                              {unit.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </InputAdornment>
                    ),
                    readOnly: noFees.franchiseFee,
                  }}
                  required
                  disabled={noFees.franchiseFee}
                />
              </FormControl>
            </Grid>
            {/* Column 7 - Interior Cost */}
            <Grid item>
              <FormControl fullWidth>
                <TextField
                  fullWidth
                  size="medium"
                  label="Interior Cost"
                  name="interiorCost"
                  value={currentFicoModel.interiorCost}
                  onChange={handleFicoChange}
                  error={!!errors.interiorCost}
                  helperText={errors.interiorCost}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Select
                          value={currentFicoModel.interiorCostUnit}
                          onChange={handleFeeUnitChange("interiorCost")}
                          sx={{
                            "& .MuiSelect-select": {
                              padding: "8px 8px",
                              fontSize: "0.875rem",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                          }}
                        >
                          {otherFeeUnits.map((unit) => (
                            <MenuItem key={unit.value} value={unit.value}>
                              {unit.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </InputAdornment>
                    ),
                    readOnly: noFees.interiorCost,
                  }}
                  required
                  disabled={noFees.interiorCost}
                />
              </FormControl>
            </Grid>
            {/* Column 8 - Stock Investment */}
            <Grid item>
              <FormControl fullWidth>
                <TextField
                  fullWidth
                  size="medium"
                  label="Stock Investment"
                  name="stockInvestment"
                  value={currentFicoModel.stockInvestment}
                  onChange={handleFicoChange}
                  error={!!errors.stockInvestment}
                  helperText={errors.stockInvestment}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Select
                          value={currentFicoModel.stockInvestmentUnit}
                          onChange={handleFeeUnitChange("stockInvestment")}
                          sx={{
                            "& .MuiSelect-select": {
                              padding: "8px 8px",
                              fontSize: "0.875rem",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                          }}
                        >
                          {otherFeeUnits.map((unit) => (
                            <MenuItem key={unit.value} value={unit.value}>
                              {unit.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </InputAdornment>
                    ),
                    readOnly: noFees.stockInvestment,
                  }}
                  required
                  disabled={noFees.stockInvestment}
                />
              </FormControl>
            </Grid>
            {/* Column 9 - Other Cost */}
            <Grid item>
              <FormControl fullWidth>
                <TextField
                  fullWidth
                  size="medium"
                  label="Required Additional Cost"
                  name="otherCost"
                  value={currentFicoModel.otherCost}
                  onChange={handleFicoChange}
                  error={!!errors.otherCost}
                  helperText={errors.otherCost}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Select
                          value={currentFicoModel.otherCostUnit}
                          onChange={handleFeeUnitChange("otherCost")}
                          sx={{
                            "& .MuiSelect-select": {
                              padding: "8px 8px",
                              fontSize: "0.875rem",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                          }}
                        >
                          {otherFeeUnits.map((unit) => (
                            <MenuItem key={unit.value} value={unit.value}>
                              {unit.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </InputAdornment>
                    ),
                    readOnly: noFees.otherCost,
                  }}
                  required
                  disabled={noFees.otherCost}
                />
              </FormControl>
            </Grid>
            {/* Column 10 - Required Investment Capital */}
            <Grid item>
              <FormControl fullWidth>
                <TextField
                  fullWidth
                  size="medium"
                  label="Annual Working Capital"
                  name="requireWorkingCapital"
                  value={currentFicoModel.requireWorkingCapital}
                  onChange={handleFicoChange}
                  error={!!errors.requireWorkingCapital}
                  helperText={errors.requireWorkingCapital}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Select
                          value={currentFicoModel.requireWorkingCapitalUnit}
                          onChange={handleFeeUnitChange("requireWorkingCapital")}
                          sx={{
                            "& .MuiSelect-select": {
                              padding: "8px 8px",
                              fontSize: "0.875rem",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                          }}
                        >
                          {otherFeeUnits.map((unit) => (
                            <MenuItem key={unit.value} value={unit.value}>
                              {unit.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </InputAdornment>
                    ),
                    readOnly: noFees.requireWorkingCapital,
                  }}
                  required
                  disabled={noFees.requireWorkingCapital}
                />
              </FormControl>
            </Grid>
            {/* Column 11 - Royalty Fee */}
            <Grid item>
              <FormControl fullWidth>
                <TextField
                  fullWidth
                  size="medium"
                  label="Royalty Fee"
                  name="royaltyFee"
                  value={currentFicoModel.royaltyFee}
                  onChange={handleFicoChange}
                  error={!!errors.royaltyFee}
                  helperText={errors.royaltyFee}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Select
                          value={currentFicoModel.royaltyFeeUnit}
                          onChange={handleFeeUnitChange("royaltyFee")}
                          sx={{
                            "& .MuiSelect-select": {
                              padding: "8px 8px",
                              fontSize: "0.875rem",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                          }}
                        >
                          {royaltyFeeUnits.map((unit) => (
                            <MenuItem key={unit.value} value={unit.value}>
                              {unit.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </InputAdornment>
                    ),
                    readOnly: noFees.royaltyFee,
                  }}
                  required
                  disabled={noFees.royaltyFee}
                />
              </FormControl>
            </Grid>
            {/* Column 12 - Break Even */}
            <Grid item>
              <FormControl
                fullWidth
                size="medium"
                required
                error={!!errors.breakEven}
              >
                <InputLabel>Break Even (months)</InputLabel>
                <Select
                  label="Break Even (months)*"
                  name="breakEven"
                  value={currentFicoModel.breakEven || ""}
                  onChange={handleFicoChange}
                >
                  <MenuItem value="0 to 6 Months">0 to 6 Months</MenuItem>
                  <MenuItem value="6 to 12 Months">6 to 12 Months</MenuItem>
                  <MenuItem value="12 to 18 Months">12 to 18 Months</MenuItem>
                  <MenuItem value="18 to 24 Months">18 to 24 Months</MenuItem>
                  <MenuItem value="24 to 36 Months">24 to 36 Months</MenuItem>
                  <MenuItem value="36 to 48 Months">36 to 48 Months</MenuItem>
                  <MenuItem value="48 to 60 Months">48 to 60 Months</MenuItem>
                </Select>
                {errors.breakEven && (
                  <FormHelperText error>{errors.breakEven}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* Column 13 - ROI */}
            <Grid item>
              <FormControl
                fullWidth
                size="medium"
                required
                error={!!errors.roi}
              >
                <InputLabel>ROI (%)</InputLabel>
                <Select
                  label="ROI (%)"
                  name="roi"
                  value={currentFicoModel.roi || ""}
                  onChange={handleFicoChange}
                  renderValue={(selected) => (selected ? `${selected} %` : "")}
                  disabled={noFees.roi}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        width: 390,
                        maxHeight: 300,
                        "& .MuiList-root": {
                          display: "grid",
                          gridTemplateColumns: "repeat(10, 1fr)",
                          gap: "4px",
                          padding: "4px",
                        },
                      },
                    },
                  }}
                >
                  {Array.from({ length: 99 }, (_, i) => (
                    <MenuItem
                      key={i + 1}
                      value={`${i + 1}`}
                      sx={{
                        minWidth: 0,
                        padding: "6px 4px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {i + 1}
                    </MenuItem>
                  ))}
                </Select>
                {errors.roi && (
                  <FormHelperText error>{errors.roi}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* Column 14 - PayBack Period */}
            <Grid item>
              <TextField
                fullWidth
                size="medium"
                label="PayBack Period"
                name="payBackPeriod"
                value={currentFicoModel.payBackPeriod}
                onChange={handleFicoChange}
                error={!!errors.payBackPeriod}
                helperText={errors.payBackPeriod}
                InputProps={{
                  readOnly: true,
                }}
                required
                disabled={noFees.roi}
              />
            </Grid>
            <Grid item>
              <FormControl
                fullWidth
                size="medium"
                required
                error={!!errors.marginOnSales}
              >
                <InputLabel>MarginOnSales (%)</InputLabel>
                <Select
                  label="Margin ON Sales (%)"
                  name="marginOnSales"
                  value={currentFicoModel.marginOnSales || ""}
                  onChange={handleFicoChange}
                  renderValue={(selected) => (selected ? `${selected} %` : "")}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        width: 390,
                        maxHeight: 300,
                        "& .MuiList-root": {
                          display: "grid",
                          gridTemplateColumns: "repeat(10, 1fr)",
                          gap: "4px",
                          padding: "4px",
                        },
                      },
                    },
                  }}
                >
                  {Array.from({ length: 99 }, (_, i) => (
                    <MenuItem
                      key={i + 1}
                      value={`${i + 1}`}
                      sx={{
                        minWidth: 0,
                        padding: "6px 4px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {i + 1}
                    </MenuItem>
                  ))}
                </Select>
                {errors.marginOnSales && (
                  <FormHelperText error>{errors.marginOnSales}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
          {/* Add/Update/Cancel Buttons */}
          <Grid
            item
            xs={12}
            mt={1}
            sx={{ display: "flex", justifyContent: "space-evenly", gap: 2 }}
          >
            <Button
              variant="contained"
              onClick={handleAddOrUpdateFicoModel}
              size="large"
              sx={{
                backgroundColor: "#7ad03a",
                color: "#fff",
                "&:hover": { backgroundColor: "#388e3c" },
                padding: "8px 70px",
              }}
            >
              {editIndex !== null ? "Update Model" : "Add Model"}
            </Button>
            {editIndex !== null && (
              <Button
                variant="outlined"
                onClick={handleCancelEdit}
                size="large"
                sx={{
                  padding: "8px 70px",
                }}
              >
                Cancel
              </Button>
            )}
          </Grid>
        </>
      )}
      {/* Display saved FICO models */}
      {data.fico?.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
            Saved Franchise Models
          </Typography>
          <Box sx={{ width: "100%", overflowX: "auto", margin: "0 auto" }}>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table
                stickyHeader
                aria-label="saved franchise models"
                size="medium"
                sx={{
                  fontSize: "1rem",
                  "& th, & td": {
                    padding: "12px 16px",
                    fontSize: "1rem",
                    whiteSpace: "nowrap",
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    {[
                      "Model Type",
                      "Franchise Type",
                      "Investment Range",
                      "Area Required",
                      "Agreement Period",
                      "Franchise Fee",
                      "Interior Cost",
                      "Stock Cost",
                      "Additional Cost",
                      "Annual Working Capital",
                      "Royalty Fee",
                      "Break Even",
                      "ROI (%)",
                      "Payback",
                      "Margin On Sales",
                      "Actions",
                    ].map((label, i) => (
                      <TableCell
                        key={i}
                        sx={{
                          fontWeight: "bold",
                          backgroundColor: "#f5f5f5",
                        }}
                      >
                        {label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.fico?.map((model, index) => (
                    <TableRow
                      key={index}
                      hover
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        fontSize: "0.75rem",
                      }}
                    >
                      <TableCell>{model.franchiseModel}</TableCell>
                      <TableCell>{model.franchiseType}</TableCell>
                      <TableCell>{model.investmentRange}</TableCell>
                      <TableCell>{model.areaRequired}</TableCell>
                      <TableCell>{model.agreementPeriod}</TableCell>
                      <TableCell>
                        {formatCurrency(model.franchiseFee)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(model.interiorCost)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(model.stockInvestment)}
                      </TableCell>
                      <TableCell>{formatCurrency(model.otherCost)}</TableCell>
                      <TableCell>
                        {formatCurrency(model.requireWorkingCapital)}
                      </TableCell>
                      <TableCell>
                        {model.royaltyFee && model.royaltyFee !== "No Fee"
                          ? `${model.royaltyFee}${
                              model.royaltyFeeUnit === "%" ? "%" : ""
                            }`
                          : model.royaltyFee}
                      </TableCell>
                      <TableCell>{model.breakEven}</TableCell>
                      <TableCell>{model.roi}%</TableCell>
                      <TableCell>{model.payBackPeriod}</TableCell>
                      <TableCell>{model.marginOnSales}%</TableCell>
                      <TableCell>
                        {isEditing && (
                          <>
                            <IconButton
                              onClick={() => handleEditFicoModel(index)}
                              color="primary"
                              size="small"
                              aria-label="edit"
                              sx={{ mr: 1 }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDeleteFicoModel(index)}
                              color="error"
                              size="small"
                              aria-label="delete"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      )}
      <Divider
        sx={{
          my: 2,
          mt: 4,
          backgroundColor: "rgba(0, 0, 0, 0.08)",
          height: "1px",
        }}
      />
      {/* Support and Training Section */}
      <Grid item xs={12}>
        <Typography variant="h6" color="#ff9800" sx={{ fontWeight: "bold" }}>
          Support and Training
        </Typography>
        <Grid gap={1} item xs={12}>
          {/* Financial Operating Procedure */}
          <Grid item xs={12}>
            <FormControl
              component="fieldset"
              fullWidth
              error={!!errors.aidFinancing}
              required
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { md: "center" },
                gap: 1,
                p: 1,
              }}
            >
              <Box sx={{ mr: { md: "220px" }, minWidth: { md: "300px" } }}>
                <FormLabel
                  component="legend"
                  sx={{
                    fontWeight: "bold",
                    color: errors.aidFinancing ? "error.main" : "text.primary",
                  }}
                >
                  Do you provide aid in financing?
                </FormLabel>
              </Box>
              <RadioGroup
                row
                sx={{ display: "flex", ml: 5, gap: 15 }}
                value={data.aidFinancing || ""}
                onChange={(e) => onChange("aidFinancing", e.target.value)}
              >
                {aidFinancingOptions.map((type) => (
                  <FormControlLabel
                    key={type}
                    value={type}
                    control={
                      <Radio
                        color={errors.aidFinancing ? "error" : "primary"}
                        disabled={!isEditing}
                      />
                    }
                    label={type}
                    checked={data.aidFinancing === type}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            {errors.aidFinancing && (
              <FormHelperText
                error
                sx={{ ml: { md: 2 }, mt: { xs: 0, md: 0 } }}
              >
                {errors.aidFinancing}
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={12}>
            <FormControl
              component="fieldset"
              fullWidth
              error={!!errors.franchiseDevelopment}
              required
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { md: "center" },
                gap: 1,
                p: 1,
              }}
            >
              <Box sx={{ mr: { md: "77px" }, minWidth: { md: "300px" } }}>
                <FormLabel
                  component="legend"
                  sx={{
                    fontWeight: "bold",
                    color: errors.franchiseDevelopment
                      ? "error.main"
                      : "text.primary",
                  }}
                >
                  Would you like consultation for franchise development?
                </FormLabel>
              </Box>
              <RadioGroup
                row
                sx={{ display: "flex", ml: 5, gap: 15 }}
                value={data.franchiseDevelopment || ""}
                onChange={(e) => onChange("franchiseDevelopment", e.target.value)}
              >
                {aidFinancingOptions.map((type) => (
                  <FormControlLabel
                    key={type}
                    value={type}
                    control={
                      <Radio
                        color={
                          errors.franchiseDevelopment ? "error" : "primary"
                        }
                        disabled={!isEditing}
                      />
                    }
                    label={type}
                    checked={data.franchiseDevelopment === type}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            {errors.franchiseDevelopment && (
              <FormHelperText
                error
                sx={{ ml: { md: 2 }, mt: { xs: 0, md: 0 } }}
              >
                {errors.franchiseDevelopment}
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={12}>
            <FormControl
              component="fieldset"
              fullWidth
              error={!!errors.consultationOrAssistance}
              required
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { md: "center" },
                gap: 1,
                p: 1,
              }}
            >
              <Box sx={{ mr: { md: "6px" }, minWidth: { md: "300px" } }}>
                <FormLabel
                  component="legend"
                  sx={{
                    fontWeight: "bold",
                    color: errors.consultationOrAssistance
                      ? "error.main"
                      : "text.primary",
                  }}
                >
                  Would you like consultation for marketing recruitment
                  franchise?
                </FormLabel>
              </Box>
              <RadioGroup
                row
                sx={{ display: "flex", ml: 5, gap: 15 }}
                value={data.consultationOrAssistance || ""}
                onChange={(e) => onChange("consultationOrAssistance", e.target.value)}
              >
                {aidFinancingOptions.map((type) => (
                  <FormControlLabel
                    key={type}
                    value={type}
                    control={
                      <Radio
                        color={
                          errors.consultationOrAssistance ? "error" : "primary"
                        }
                        disabled={!isEditing}
                      />
                    }
                    label={type}
                    checked={data.consultationOrAssistance === type}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            {errors.consultationOrAssistance && (
              <FormHelperText
                error
                sx={{ ml: { md: 2 }, mt: { xs: 0, md: 0 } }}
              >
                {errors.consultationOrAssistance}
              </FormHelperText>
            )}
          </Grid>
          {/* Training Support - Checkbox Group */}
          <Grid item xs={12}>
            <FormControl
              component="fieldset"
              fullWidth
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                p: 1,
              }}
            >
              <Box
                sx={{
                  minWidth: { md: "210px" },
                  alignSelf: "flex-start",
                  pt: 1.2,
                  mr: { md: 6 },
                }}
              >
                <FormLabel
                  component="legend"
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  Training Support Provider:
                </FormLabel>
              </Box>
              <FormGroup
                sx={{ ml: { md: 5 }, display: "flex", flexDirection: "row" }}
              >
                {[
                  "Outlet Setup",
                  "Staff Training",
                  "Staff Recruitment",
                  "Operations Support",
                  "Marketing Support",
                ].map((option) => (
                  <FormControlLabel
                    key={option}
                    control={
                      <Checkbox
                        checked={
                          data.trainingSupport?.includes(option) || false
                        }
                        onChange={(e) => handleTrainingSupportChange(option, e.target.checked)}
                        name="trainingSupport"
                        color="primary"
                        disabled={!isEditing}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ width: "145px" }}>
                        {option}
                      </Typography>
                    }
                    sx={{
                      minWidth: "60px",
                    }}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography
          variant="h6"
          color="#ff9800"
          sx={{ mb: 2, mt: 4, fontWeight: "bold" }}
        >
          Brand Description
        </Typography>
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
            Unique Selling Points (USP):
            <Tooltip
              title={
                <span style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>
                  Highlight what makes your brand or business unique. Try to
                  list 2–5 bullet points that make you stand out.
                </span>
              }
              placement="right-start"
              arrow
              enterTouchDelay={0}
            >
              <IconButton
                size="small"
                sx={{
                  color: "warning.main",
                  "&:hover": {
                    backgroundColor: "info.main",
                    color: "white",
                  },
                  marginLeft: "5px",
                }}
              >
                <InfoOutlined fontSize="medium" />
              </IconButton>
            </Tooltip>
            {errors.uniqueSellingPoints &&
              typeof errors.uniqueSellingPoints === "string" && (
                <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                  {errors.uniqueSellingPoints}
                </Typography>
              )}
          </Typography>
          {/* USP Input and Add Button */}
          {isEditing && (
            <Box
              sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}
            >
              <TextField
                fullWidth
                variant="outlined"
                value={currentUSP}
                onChange={(e) => setCurrentUSP(e.target.value)}
                placeholder="Add a unique selling point"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddUSP();
                  }
                }}
                error={!!errors.uniqueSellingPoints}
                helperText={
                  errors.uniqueSellingPoints &&
                  typeof errors.uniqueSellingPoints === "string"
                    ? errors.uniqueSellingPoints
                    : null
                }
              />
              <Button
                variant="contained"
                onClick={handleAddUSP}
                disabled={!currentUSP.trim()}
                sx={{
                  backgroundColor: "#7ad03a",
                  color: "white",
                  "&:hover": { backgroundColor: "#388e3c" },
                  py: 2,
                  px: 6,
                }}
              >
                Add
              </Button>
            </Box>
          )}
          {/* Display added USPs */}
          {data.uniqueSellingPoints?.length > 0 && (
            <Paper sx={{ p: 2, mb: 3, border: "1px solid #e0e0e0" }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Added USPs:
              </Typography>
              <List dense sx={{ maxHeight: 200, overflow: "auto" }}>
                {data.uniqueSellingPoints.map((usp, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      isEditing && (
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleRemoveUSP(index)}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                      )
                    }
                    sx={{
                      py: 0.5,
                      borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                      "&:last-child": { borderBottom: "none" },
                    }}
                  >
                    <ListItemText
                      primary={`${index + 1}. ${usp}`}
                      primaryTypographyProps={{ variant: "body2" }}
                      secondary={
                        errors[`uniqueSellingPoints[${index}]`] && (
                          <Typography variant="caption" color="error">
                            {errors[`uniqueSellingPoints[${index}]`]}
                          </Typography>
                        )
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Grid>
        <Box sx={{ mt: 2, mb: 4 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
            Brand Description:
            {errors.brandDescription && (
              <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                {errors.brandDescription}
              </Typography>
            )}
          </Typography>
          <TextField
            multiline
            minRows={8}
            fullWidth
            value={data.brandDescription || ""}
            onChange={handleDescriptionChange}
            variant="outlined"
            placeholder="Enter brand description here..."
            error={!!errors.brandDescription}
            helperText={errors.brandDescription}
            InputProps={{
              readOnly: !isEditing,
            }}
          />
        </Box>
      </Grid>
    </Box>
  );
};
export default FranchiseDetailsEdit;