// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Button,
//   Box,
//   Dialog,
//   Typography,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   List,
//   ListItem,
//   ListItemText,
//   Divider,
//   IconButton,
//   Checkbox,
//   FormControlLabel,
//   FormGroup,
//   Dialog as MuiDialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Alert,
//   CircularProgress,
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import IndustryModal from "../../Components/IndustryMangement/IndustryCreatemodel";

// const IndustryManagementPage = () => {
//   const [openModal, setOpenModal] = useState(false);
//   const [modalData, setModalData] = useState(null);
//   const [industries, setIndustries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [selectedIndustry, setSelectedIndustry] = useState(null);
//   const [deleteMode, setDeleteMode] = useState("partial"); // 'full' or 'partial'
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [selectedProductParents, setSelectedProductParents] = useState([]);
//   const [selectedProductTags, setSelectedProductTags] = useState([]);
//   const [selectedServiceParents, setSelectedServiceParents] = useState([]);
//   const [selectedServiceTags, setSelectedServiceTags] = useState([]);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [deleteSuccess, setDeleteSuccess] = useState(null);
//   const [deleteError, setDeleteError] = useState(null);

//   useEffect(() => {
//     fetchIndustries();
//   }, []);

//   const fetchIndustries = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await axios.get(
//         "http://localhost:5000/api/v1/admin/getAllIndustry"
//       );
//       if (response.data.success) {
//         setIndustries(response.data.data);
//       } else {
//         setError("Failed to fetch industries");
//       }
//     } catch (error) {
//       console.error("Error fetching industries:", error);
//       setError("Error fetching industries. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreate = () => {
//     setModalData(null);
//     setOpenModal(true);
//   };

//   const handleEditClick = (industry) => {
//     setModalData(industry);
//     setOpenModal(true);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//     setModalData(null);
//   };

//   const handleSaveSuccess = () => {
//     fetchIndustries();
//   };

//   const handleDeleteClick = (industry) => {
//     setSelectedIndustry(industry);
//     setSelectedCategories([]);
//     setSelectedProductParents([]);
//     setSelectedProductTags([]);
//     setSelectedServiceParents([]);
//     setSelectedServiceTags([]);
//     setDeleteMode("partial");
//     setDeleteDialogOpen(true);
//     setDeleteSuccess(null);
//     setDeleteError(null);
//   };

//   const handleCloseDeleteDialog = () => {
//     setDeleteDialogOpen(false);
//     setSelectedIndustry(null);
//     setDeleteSuccess(null);
//     setDeleteError(null);
//   };

//   const handleCategoryToggle = (categoryId) => {
//     setSelectedCategories(prev =>
//       prev.includes(categoryId)
//         ? prev.filter(id => id !== categoryId)
//         : [...prev, categoryId]
//     );
//   };

//   const handleProductParentToggle = (productId) => {
//     setSelectedProductParents(prev =>
//       prev.includes(productId)
//         ? prev.filter(id => id !== productId)
//         : [...prev, productId]
//     );
//   };

//   const handleProductTagToggle = (productId, tagId) => {
//     const tagKey = `${productId}-${tagId}`;
//     setSelectedProductTags(prev => {
//       const exists = prev.find(t => t.productId === productId && t.ids.includes(tagId));
//       if (exists) {
//         return prev.map(t =>
//           t.productId === productId
//             ? { ...t, ids: t.ids.filter(id => id !== tagId) }
//             : t
//         ).filter(t => t.ids.length > 0);
//       } else {
//         const existingProduct = prev.find(t => t.productId === productId);
//         if (existingProduct) {
//           return prev.map(t =>
//             t.productId === productId
//               ? { ...t, ids: [...t.ids, tagId] }
//               : t
//           );
//         } else {
//           return [...prev, { productId, ids: [tagId] }];
//         }
//       }
//     });
//   };

//   const handleServiceParentToggle = (serviceId) => {
//     setSelectedServiceParents(prev =>
//       prev.includes(serviceId)
//         ? prev.filter(id => id !== serviceId)
//         : [...prev, serviceId]
//     );
//   };

//   const handleServiceTagToggle = (serviceId, tagId) => {
//     setSelectedServiceTags(prev => {
//       const exists = prev.find(t => t.serviceId === serviceId && t.ids.includes(tagId));
//       if (exists) {
//         return prev.map(t =>
//           t.serviceId === serviceId
//             ? { ...t, ids: t.ids.filter(id => id !== tagId) }
//             : t
//         ).filter(t => t.ids.length > 0);
//       } else {
//         const existingService = prev.find(t => t.serviceId === serviceId);
//         if (existingService) {
//           return prev.map(t =>
//             t.serviceId === serviceId
//               ? { ...t, ids: [...t.ids, tagId] }
//               : t
//           );
//         } else {
//           return [...prev, { serviceId, ids: [tagId] }];
//         }
//       }
//     });
//   };

//   const handleDelete = async () => {
//     if (!selectedIndustry) return;
//     try {
//       setDeleteLoading(true);
//       setDeleteError(null);
//       const payload = {
//         deleteIndustry: deleteMode === "full" ? "true" : "false",
//         remove: deleteMode === "partial" ? {
//           categories: selectedCategories,
//           productTags: {
//             products: selectedProductParents,
//             tags: selectedProductTags
//           },
//           serviceTags: {
//             services: selectedServiceParents,
//             tags: selectedServiceTags
//           }
//         } : undefined
//       };
//       const response = await axios.delete(
//         `http://localhost:5000/api/v1/admin/deleteIndustryById/${selectedIndustry.uuid}`,
//         { data: payload }
//       );
//       if (response.data.success) {
//         setDeleteSuccess(response.data.message || "Deleted successfully!");
//         setTimeout(() => {
//           handleCloseDeleteDialog();
//           fetchIndustries(); // Refresh the list
//         }, 1500);
//       } else {
//         setDeleteError(response.data.message || "Failed to delete");
//       }
//     } catch (error) {
//       console.error("Delete error:", error);
//       setDeleteError(
//         error.response?.data?.message ||
//         error.message ||
//         "Something went wrong"
//       );
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   const renderDeleteContent = () => {
//     if (!selectedIndustry) return null;
//     if (deleteMode === "full") {
//       return (
//         <Alert severity="warning" sx={{ mb: 2 }}>
//           Are you sure you want to delete the entire industry "{selectedIndustry.industry}"?
//           This action cannot be undone.
//         </Alert>
//       );
//     }
//     return (
//       <Box>
//         <Typography variant="subtitle1" gutterBottom>
//           Select items to delete from "{selectedIndustry.industry}":
//         </Typography>
//         {/* Categories */}
//         {selectedIndustry.categories?.length > 0 && (
//           <Box sx={{ mb: 2 }}>
//             <Typography variant="subtitle2" gutterBottom>
//               Categories:
//             </Typography>
//             <FormGroup>
//               {selectedIndustry.categories.map((cat, index) => (
//                 <FormControlLabel
//                   key={cat.id || index}
//                   control={
//                     <Checkbox
//                       checked={selectedCategories.includes(cat.id)}
//                       onChange={() => handleCategoryToggle(cat.id)}
//                       size="small"
//                     />
//                   }
//                   label={cat.category}
//                 />
//               ))}
//             </FormGroup>
//           </Box>
//         )}
//         {/* Product Tags */}
//         {selectedIndustry.productTags?.length > 0 && (
//           <Box sx={{ mb: 2 }}>
//             <Typography variant="subtitle2" gutterBottom>
//               Product Tags:
//             </Typography>
//             {selectedIndustry.productTags.map((product, pIndex) => (
//               <Box key={product.id || pIndex} sx={{ ml: 2, mb: 1 }}>
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       checked={selectedProductParents.includes(product.id)}
//                       onChange={() => handleProductParentToggle(product.id)}
//                       size="small"
//                     />
//                   }
//                   label={
//                     <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                       {product.parent} (Entire parent)
//                     </Typography>
//                   }
//                 />
               
//                 {product.tags?.length > 0 && (
//                   <Box sx={{ ml: 3 }}>
//                     {product.tags.map((tag, tIndex) => (
//                       <FormControlLabel
//                         key={tag.id || tIndex}
//                         control={
//                           <Checkbox
//                             checked={selectedProductTags.some(
//                               pt => pt.productId === product.id && pt.ids.includes(tag.id)
//                             )}
//                             onChange={() => handleProductTagToggle(product.id, tag.id)}
//                             size="small"
//                           />
//                         }
//                         label={
//                           <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
//                             {tag.tag}
//                           </Typography>
//                         }
//                       />
//                     ))}
//                   </Box>
//                 )}
//               </Box>
//             ))}
//           </Box>
//         )}
//         {/* Service Tags */}
//         {selectedIndustry.serviceTags?.length > 0 && (
//           <Box sx={{ mb: 2 }}>
//             <Typography variant="subtitle2" gutterBottom>
//               Service Tags:
//             </Typography>
//             {selectedIndustry.serviceTags.map((service, sIndex) => (
//               <Box key={service.id || sIndex} sx={{ ml: 2, mb: 1 }}>
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       checked={selectedServiceParents.includes(service.id)}
//                       onChange={() => handleServiceParentToggle(service.id)}
//                       size="small"
//                     />
//                   }
//                   label={
//                     <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                       {service.parent} (Entire parent)
//                     </Typography>
//                   }
//                 />
               
//                 {service.tags?.length > 0 && (
//                   <Box sx={{ ml: 3 }}>
//                     {service.tags.map((tag, tIndex) => (
//                       <FormControlLabel
//                         key={tag.id || tIndex}
//                         control={
//                           <Checkbox
//                             checked={selectedServiceTags.some(
//                               st => st.serviceId === service.id && st.ids.includes(tag.id)
//                             )}
//                             onChange={() => handleServiceTagToggle(service.id, tag.id)}
//                             size="small"
//                           />
//                         }
//                         label={
//                           <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
//                             {tag.tag}
//                           </Typography>
//                         }
//                       />
//                     ))}
//                   </Box>
//                 )}
//               </Box>
//             ))}
//           </Box>
//         )}
//         {!selectedIndustry.categories?.length &&
//          !selectedIndustry.productTags?.length &&
//          !selectedIndustry.serviceTags?.length && (
//           <Typography variant="body2" color="text.secondary">
//             No items available for deletion in partial mode.
//           </Typography>
//         )}
//       </Box>
//     );
//   };

//   if (loading) {
//     return (
//       <Box sx={{ p: 3, display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
//         <CircularProgress />
//         <Typography variant="body1" sx={{ ml: 2 }}>Loading industries...</Typography>
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
//         <Typography variant="body1" color="error">
//           {error}
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <>
//       <Box sx={{ p: 3 }}>
//         <Button variant="contained" onClick={handleCreate} sx={{ mb: 2 }}>
//           Create Industry
//         </Button>
//         {/* Industries List */}
//         <Box sx={{ mt: 2 }}>
//           <Typography variant="h5" gutterBottom>
//             Industries
//           </Typography>
//           {industries.length === 0 ? (
//             <Typography variant="body2" color="text.secondary">
//               No industries found.
//             </Typography>
//           ) : (
//             industries.map((item, index) => (
//               <Accordion
//                 key={item.uuid || item._id || index}
//                 sx={{ mb: 3, boxShadow: 2 }}
//                 defaultExpanded={false}
//               >
//                 <AccordionSummary
//                   expandIcon={<ExpandMoreIcon />}
//                   aria-controls={`panel${index}-content`}
//                   id={`panel${index}-header`}
//                 >
//                   <Box
//                     sx={{
//                       width: "97%",
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                     }}
//                   >
//                     <Typography variant="h5" sx={{ fontWeight: "bold" }}>
//                       {item.industry}
//                     </Typography>
//                     <Box>
//                       <IconButton
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleEditClick(item);
//                         }}
//                         color="primary"
//                         size="small"
//                       >
//                         <EditIcon />
//                       </IconButton>
//                       <IconButton
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleDeleteClick(item);
//                         }}
//                         color="error"
//                         size="small"
//                       >
//                         <DeleteIcon />
//                       </IconButton>
//                     </Box>
//                   </Box>
//                 </AccordionSummary>
//                 <AccordionDetails>
//                   {/* Categories as bullet points */}
//                   <Typography
//                     variant="h6"
//                     gutterBottom
//                     sx={{ fontWeight: "bold", color: "#eca310ff" }}
//                   >
//                     Categories
//                   </Typography>
//                   {item.categories && item.categories.length > 0 ? (
//                     <List disablePadding>
//                       {item.categories.map((cat, catIndex) => (
//                         <ListItem key={cat.id || catIndex} disablePadding>
//                           <ListItemText primary={`• ${cat.category}`} />
//                         </ListItem>
//                       ))}
//                     </List>
//                   ) : (
//                     <Typography variant="body2" color="text.secondary">
//                       N/A
//                     </Typography>
//                   )}
//                   <Divider sx={{ my: 2 }} />
//                   {/* Product Tags */}
//                   <Typography
//                     variant="h6"
//                     gutterBottom
//                     sx={{ fontWeight: "bold", color: "#eca310ff" }}
//                   >
//                     Product Tags:
//                   </Typography>
//                   {item.productTags && item.productTags.length > 0 ? (
//                     item.productTags.map((pt, ptIndex) => (
//                       <Box key={pt.id || ptIndex} sx={{ mb: 2 }}>
//                         <Typography
//                           variant="subtitle1"
//                           gutterBottom
//                           sx={{ fontWeight: "bold" }}
//                         >
//                           {pt.parent}
//                         </Typography>
//                         {pt.tags && pt.tags.length > 0 ? (
//                           <List disablePadding>
//                             {pt.tags.map((t, tIndex) => (
//                               <ListItem
//                                 key={t.id || tIndex}
//                                 disablePadding
//                                 sx={{ pl: 2 }}
//                               >
//                                 <ListItemText
//                                   primary={
//                                     <Typography variant="body2" component="p">
//                                       • {t.tag}
//                                     </Typography>
//                                   }
//                                 />
//                               </ListItem>
//                             ))}
//                           </List>
//                         ) : (
//                           <Typography variant="body2" color="text.secondary">
//                             N/A
//                           </Typography>
//                         )}
//                       </Box>
//                     ))
//                   ) : (
//                     <Typography variant="body2" color="text.secondary">
//                       N/A
//                     </Typography>
//                   )}
//                   <Divider sx={{ my: 2 }} />
//                   {/* Service Tags */}
//                   <Typography
//                     variant="h6"
//                     gutterBottom
//                     sx={{ fontWeight: "bold", color: "#eca310ff" }}
//                   >
//                     Service Tags
//                   </Typography>
//                   {item.serviceTags && item.serviceTags.length > 0 ? (
//                     item.serviceTags.map((st, stIndex) => (
//                       <Box key={st.id || stIndex} sx={{ mb: 2 }}>
//                         <Typography
//                           variant="subtitle1"
//                           gutterBottom
//                           sx={{ fontWeight: "bold" }}
//                         >
//                           {st.parent}
//                         </Typography>
//                         {st.tags && st.tags.length > 0 ? (
//                           <List disablePadding>
//                             {st.tags.map((tag, tagIndex) => (
//                               <ListItem
//                                 key={tag.id || tagIndex}
//                                 disablePadding
//                                 sx={{ pl: 2 }}
//                               >
//                                 <ListItemText
//                                   primary={
//                                     <Typography variant="body2" component="p">
//                                       • {tag.tag}
//                                     </Typography>
//                                   }
//                                 />
//                               </ListItem>
//                             ))}
//                           </List>
//                         ) : (
//                           <Typography variant="body2" color="text.secondary">
//                             N/A
//                           </Typography>
//                         )}
//                       </Box>
//                     ))
//                   ) : (
//                     <Typography variant="body2" color="text.secondary">
//                       N/A
//                     </Typography>
//                   )}
//                 </AccordionDetails>
//               </Accordion>
//             ))
//           )}
//         </Box>
//       </Box>
//       {/* Industry Modal (Create/Edit) */}
//       <Dialog
//         open={openModal}
//         onClose={handleCloseModal}
//         fullWidth
//         maxWidth="md"
//         aria-labelledby="industry-modal"
//       >
//         <IndustryModal
//           data={modalData}
//           isEdit={!!modalData}
//           onClose={handleCloseModal}
//           onSaveSuccess={handleSaveSuccess}
//         />
//       </Dialog>
//       {/* Delete Confirmation Dialog */}
//       <MuiDialog
//         open={deleteDialogOpen}
//         onClose={handleCloseDeleteDialog}
//         maxWidth="md"
//         fullWidth
//       >
//         <DialogTitle>
//           {deleteMode === "full" ? "Delete Entire Industry" : "Delete Industry Items"}
//         </DialogTitle>
//         <DialogContent>
//           {deleteSuccess && (
//             <Alert severity="success" sx={{ mb: 2 }}>
//               {deleteSuccess}
//             </Alert>
//           )}
//           {deleteError && (
//             <Alert severity="error" sx={{ mb: 2 }}>
//               {deleteError}
//             </Alert>
//           )}
         
//           <Box sx={{ mb: 2 }}>
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={deleteMode === "full"}
//                   onChange={(e) => setDeleteMode(e.target.checked ? "full" : "partial")}
//                 />
//               }
//               label="Delete entire industry"
//             />
//           </Box>
         
//           {renderDeleteContent()}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDeleteDialog} disabled={deleteLoading}>
//             Cancel
//           </Button>
//           <Button
//             onClick={handleDelete}
//             color="error"
//             variant="contained"
//             disabled={deleteLoading ||
//               (deleteMode === "partial" &&
//                selectedCategories.length === 0 &&
//                selectedProductParents.length === 0 &&
//                selectedProductTags.length === 0 &&
//                selectedServiceParents.length === 0 &&
//                selectedServiceTags.length === 0)}
//             startIcon={deleteLoading && <CircularProgress size={20} />}
//           >
//             {deleteLoading ? "Deleting..." : "Delete"}
//           </Button>
//         </DialogActions>
//       </MuiDialog>
//     </>
//   );
// };

// export default IndustryManagementPage;
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button, Box, Dialog, Typography, Accordion, AccordionSummary,
  AccordionDetails, List, ListItem, ListItemText, Divider, IconButton,
  Checkbox, FormControlLabel, FormGroup, Dialog as MuiDialog,
  DialogTitle, DialogContent, DialogActions, Alert, CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IndustryModal from "../../Components/IndustryMangement/IndustryCreatemodel";

// ── API base URLs ───────────────────────────────────────────────────────────
const ADMIN_API_BASE = "http://localhost:5000/api/v1/admin";

// NOTE: adjust this prefix to match wherever you mounted FilterBlockRouter,
// e.g. app.use("/api/v1/admin/filterblock", FilterBlockRouter)
const FILTER_BLOCK_API_BASE = `${ADMIN_API_BASE}`;

// ── Small reusable "Block" checkbox ─────────────────────────────────────────
const BlockCheckbox = ({ checked, onChange, loading, label = "Block" }) => (
  <FormControlLabel
    onClick={(e) => e.stopPropagation()}
    control={
      <Checkbox
        size="small"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={loading}
      />
    }
    label={
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        {loading && <CircularProgress size={12} />}
      </Box>
    }
    sx={{ mr: 2, ml: 0 }}
  />
);

const emptyBlockConfig = {
  headings: [],
  industries: [],
  categories: [],
  productTags: [],
  serviceTags: [],
};

const IndustryManagementPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  // headings: [{ heading: string, industries: [...] }]
  const [headings, setHeadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Filter-block (checkbox blocking) state ────────────────────────────────
  const [blockConfig, setBlockConfig] = useState(emptyBlockConfig);
  const [blockLoadingKeys, setBlockLoadingKeys] = useState(new Set());
  const [blockError, setBlockError] = useState(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [deleteMode, setDeleteMode] = useState("partial"); // 'full' | 'partial'
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedProductParents, setSelectedProductParents] = useState([]);
  const [selectedProductTags, setSelectedProductTags] = useState([]);
  const [selectedServiceParents, setSelectedServiceParents] = useState([]);
  const [selectedServiceTags, setSelectedServiceTags] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    fetchIndustries();
    fetchBlockConfig();
  }, []);

  const fetchIndustries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${ADMIN_API_BASE}/getAllIndustry`
      );
      if (response.data.success) {
        setHeadings(response.data.data || []);
      } else {
        // Don't treat "no data" as a blocking error — just set empty
        setHeadings([]);
      }
    } catch (err) {
      console.error("Error fetching industries:", err);
      // 404 just means no data yet, not a real error
      if (err.response?.status === 404) {
        setHeadings([]);
      } else {
        setError("Error fetching industries. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBlockConfig = async () => {
    try {
      setBlockError(null);
      const response = await axios.get(`${FILTER_BLOCK_API_BASE}/getblocks`);
      if (response.data.success) {
        const data = response.data.data || {};
        setBlockConfig({
          headings: data.headings || [],
          industries: data.industries || [],
          categories: data.categories || [],
          productTags: data.productTags || [],
          serviceTags: data.serviceTags || [],
        });
      }
    } catch (err) {
      console.error("Error fetching filter block config:", err);
      setBlockError("Error fetching block settings. Checkboxes may be out of sync.");
    }
  };

  const handleCreate = () => {
    setModalData(null);
    setOpenModal(true);
  };

  const handleEditClick = (industry, headingName) => {
    // Pass heading name along so the form can use it if needed
    setModalData({ ...industry, heading: headingName });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalData(null);
  };

  const handleSaveSuccess = () => {
    fetchIndustries();
  };

  const handleDeleteClick = (industry) => {
    setSelectedIndustry(industry);
    setSelectedCategories([]);
    setSelectedProductParents([]);
    setSelectedProductTags([]);
    setSelectedServiceParents([]);
    setSelectedServiceTags([]);
    setDeleteMode("partial");
    setDeleteDialogOpen(true);
    setDeleteSuccess(null);
    setDeleteError(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedIndustry(null);
    setDeleteSuccess(null);
    setDeleteError(null);
  };

  // ── Toggle helpers (delete-selection checkboxes) ────────────────────────────
  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleProductParentToggle = (productId) => {
    setSelectedProductParents((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleProductTagToggle = (productId, tagId) => {
    setSelectedProductTags((prev) => {
      const existing = prev.find((t) => t.productId === productId);
      if (existing) {
        const hasTag = existing.ids.includes(tagId);
        return prev
          .map((t) =>
            t.productId === productId
              ? { ...t, ids: hasTag ? t.ids.filter((id) => id !== tagId) : [...t.ids, tagId] }
              : t
          )
          .filter((t) => t.ids.length > 0);
      }
      return [...prev, { productId, ids: [tagId] }];
    });
  };

  const handleServiceParentToggle = (serviceId) => {
    setSelectedServiceParents((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleServiceTagToggle = (serviceId, tagId) => {
    setSelectedServiceTags((prev) => {
      const existing = prev.find((t) => t.serviceId === serviceId);
      if (existing) {
        const hasTag = existing.ids.includes(tagId);
        return prev
          .map((t) =>
            t.serviceId === serviceId
              ? { ...t, ids: hasTag ? t.ids.filter((id) => id !== tagId) : [...t.ids, tagId] }
              : t
          )
          .filter((t) => t.ids.length > 0);
      }
      return [...prev, { serviceId, ids: [tagId] }];
    });
  };

  // ── Delete submit ────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!selectedIndustry) return;
    try {
      setDeleteLoading(true);
      setDeleteError(null);

      const payload =
        deleteMode === "full"
          ? { deleteIndustry: "true" }
          : {
              deleteIndustry: "false",
              remove: {
                categories: selectedCategories,
                productTags: {
                  products: selectedProductParents,
                  tags: selectedProductTags,
                },
                serviceTags: {
                  services: selectedServiceParents,
                  tags: selectedServiceTags,
                },
              },
            };

      const response = await axios.delete(
        `${ADMIN_API_BASE}/deleteIndustryById/${selectedIndustry.uuid}`,
        { data: payload }
      );

      if (response.data.success) {
        setDeleteSuccess(response.data.message || "Deleted successfully!");
        setTimeout(() => {
          handleCloseDeleteDialog();
          fetchIndustries();
        }, 1500);
      } else {
        setDeleteError(response.data.message || "Failed to delete");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setDeleteError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Filter-block (checkbox blocking) logic ──────────────────────────────────

  const isKeyLoading = (key) => blockLoadingKeys.has(key);

  const setKeyLoading = (key, isLoading) => {
    setBlockLoadingKeys((prev) => {
      const next = new Set(prev);
      if (isLoading) next.add(key);
      else next.delete(key);
      return next;
    });
  };

  // headings / industries / categories are plain string arrays
  const isSimpleBlocked = (type, value) => (blockConfig[type] || []).includes(value);

  // productTags / serviceTags are [{ parent, tags: [] }]
  const isParentBlocked = (type, parentName) =>
    (blockConfig[type] || []).some((g) => g.parent === parentName);

  const isTagBlocked = (type, parentName, tagName) =>
    (blockConfig[type] || []).some(
      (g) => g.parent === parentName && (g.tags || []).includes(tagName)
    );

  // Toggle a plain string value (headings / industries / categories)
  const toggleSimpleBlock = async (type, value, isChecked) => {
    const key = `${type}:${value}`;
    if (isKeyLoading(key)) return;
    setKeyLoading(key, true);
    setBlockError(null);

    // optimistic update
    setBlockConfig((prev) => {
      const list = prev[type] || [];
      const updated = isChecked
        ? Array.from(new Set([...list, value]))
        : list.filter((v) => v !== value);
      return { ...prev, [type]: updated };
    });

    try {
      const endpoint = isChecked ? "updateblocks" : "removeblocks";
      const response = await axios.patch(`${FILTER_BLOCK_API_BASE}/${endpoint}`, {
        [type]: [value],
      });
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update block list");
      }
    } catch (err) {
      console.error(`Error toggling ${type} block for "${value}":`, err);
      setBlockError(err.response?.data?.message || err.message || "Failed to update block settings");
      // revert optimistic update
      setBlockConfig((prev) => {
        const list = prev[type] || [];
        const reverted = isChecked
          ? list.filter((v) => v !== value)
          : Array.from(new Set([...list, value]));
        return { ...prev, [type]: reverted };
      });
    } finally {
      setKeyLoading(key, false);
    }
  };

  // Toggle "block entire parent" for productTags / serviceTags
  const toggleParentBlock = async (type, parentName, isChecked) => {
    const key = `${type}:${parentName}:__parent__`;
    if (isKeyLoading(key)) return;
    setKeyLoading(key, true);
    setBlockError(null);

    const prevConfigSnapshot = blockConfig[type] || [];

    // optimistic update
    setBlockConfig((prev) => {
      const list = prev[type] || [];
      if (isChecked) {
        const exists = list.some((g) => g.parent === parentName);
        const updated = exists ? list : [...list, { parent: parentName, tags: [] }];
        return { ...prev, [type]: updated };
      }
      // unchecking a parent drops the whole group (tags included)
      const updated = list.filter((g) => g.parent !== parentName);
      return { ...prev, [type]: updated };
    });

    try {
      const endpoint = isChecked ? "updateblocks" : "removeblocks";
      const response = await axios.patch(`${FILTER_BLOCK_API_BASE}/${endpoint}`, {
        [type]: [{ parent: parentName, tags: [] }],
      });
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update block list");
      }
    } catch (err) {
      console.error(`Error toggling ${type} parent block for "${parentName}":`, err);
      setBlockError(err.response?.data?.message || err.message || "Failed to update block settings");
      // revert to snapshot taken before optimistic update
      setBlockConfig((prev) => ({ ...prev, [type]: prevConfigSnapshot }));
    } finally {
      setKeyLoading(key, false);
    }
  };

  // Toggle a single tag under a parent for productTags / serviceTags
  const toggleTagBlock = async (type, parentName, tagName, isChecked) => {
    const key = `${type}:${parentName}:${tagName}`;
    if (isKeyLoading(key)) return;
    setKeyLoading(key, true);
    setBlockError(null);

    const prevConfigSnapshot = blockConfig[type] || [];

    // optimistic update
    setBlockConfig((prev) => {
      const list = prev[type] || [];
      const idx = list.findIndex((g) => g.parent === parentName);

      if (isChecked) {
        if (idx === -1) {
          return { ...prev, [type]: [...list, { parent: parentName, tags: [tagName] }] };
        }
        const updatedTags = Array.from(new Set([...(list[idx].tags || []), tagName]));
        const updated = [...list];
        updated[idx] = { ...updated[idx], tags: updatedTags };
        return { ...prev, [type]: updated };
      }

      // unchecking: remove tag, drop the group entirely if no tags remain
      if (idx === -1) return prev;
      const remainingTags = (list[idx].tags || []).filter((t) => t !== tagName);
      let updated;
      if (remainingTags.length === 0) {
        updated = list.filter((g) => g.parent !== parentName);
      } else {
        updated = [...list];
        updated[idx] = { ...updated[idx], tags: remainingTags };
      }
      return { ...prev, [type]: updated };
    });

    try {
      const endpoint = isChecked ? "updateblocks" : "removeblocks";
      const response = await axios.patch(`${FILTER_BLOCK_API_BASE}/${endpoint}`, {
        [type]: [{ parent: parentName, tags: [tagName] }],
      });
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update block list");
      }
    } catch (err) {
      console.error(`Error toggling ${type} tag block for "${parentName}/${tagName}":`, err);
      setBlockError(err.response?.data?.message || err.message || "Failed to update block settings");
      setBlockConfig((prev) => ({ ...prev, [type]: prevConfigSnapshot }));
    } finally {
      setKeyLoading(key, false);
    }
  };

  // ── Delete dialog content ────────────────────────────────────────────────────
  const renderDeleteContent = () => {
    if (!selectedIndustry) return null;

    if (deleteMode === "full") {
      return (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Are you sure you want to delete the entire industry "
          {selectedIndustry.industry}"? This action cannot be undone.
        </Alert>
      );
    }

    return (
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Select items to delete from "{selectedIndustry.industry}":
        </Typography>

        {/* Categories */}
        {selectedIndustry.categories?.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Categories:</Typography>
            <FormGroup>
              {selectedIndustry.categories.map((cat, index) => (
                <FormControlLabel
                  key={cat.id || index}
                  control={
                    <Checkbox
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => handleCategoryToggle(cat.id)}
                      size="small"
                    />
                  }
                  label={cat.category}
                />
              ))}
            </FormGroup>
          </Box>
        )}

        {/* Product Tags */}
        {selectedIndustry.productTags?.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Product Tags:</Typography>
            {selectedIndustry.productTags.map((product, pIndex) => (
              <Box key={product.id || pIndex} sx={{ ml: 2, mb: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedProductParents.includes(product.id)}
                      onChange={() => handleProductParentToggle(product.id)}
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {product.parent} (Entire parent)
                    </Typography>
                  }
                />
                {product.tags?.length > 0 && (
                  <Box sx={{ ml: 3 }}>
                    {product.tags.map((tag, tIndex) => (
                      <FormControlLabel
                        key={tag.id || tIndex}
                        control={
                          <Checkbox
                            checked={selectedProductTags.some(
                              (pt) => pt.productId === product.id && pt.ids.includes(tag.id)
                            )}
                            onChange={() => handleProductTagToggle(product.id, tag.id)}
                            size="small"
                          />
                        }
                        label={
                          <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                            {tag.tag}
                          </Typography>
                        }
                      />
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}

        {/* Service Tags */}
        {selectedIndustry.serviceTags?.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Service Tags:</Typography>
            {selectedIndustry.serviceTags.map((service, sIndex) => (
              <Box key={service.id || sIndex} sx={{ ml: 2, mb: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedServiceParents.includes(service.id)}
                      onChange={() => handleServiceParentToggle(service.id)}
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {service.parent} (Entire parent)
                    </Typography>
                  }
                />
                {service.tags?.length > 0 && (
                  <Box sx={{ ml: 3 }}>
                    {service.tags.map((tag, tIndex) => (
                      <FormControlLabel
                        key={tag.id || tIndex}
                        control={
                          <Checkbox
                            checked={selectedServiceTags.some(
                              (st) => st.serviceId === service.id && st.ids.includes(tag.id)
                            )}
                            onChange={() => handleServiceTagToggle(service.id, tag.id)}
                            size="small"
                          />
                        }
                        label={
                          <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                            {tag.tag}
                          </Typography>
                        }
                      />
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}

        {!selectedIndustry.categories?.length &&
          !selectedIndustry.productTags?.length &&
          !selectedIndustry.serviceTags?.length && (
            <Typography variant="body2" color="text.secondary">
              No items available for partial deletion.
            </Typography>
          )}
      </Box>
    );
  };

  // ── Render industry accordion ────────────────────────────────────────────────
  const renderIndustry = (item, index, headingName) => (
    <Accordion
      key={item.uuid || index}
      sx={{ mb: 2, boxShadow: 2 }}
      defaultExpanded={false}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ width: "97%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {item.industry}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <BlockCheckbox
              checked={isSimpleBlocked("industries", item.industry)}
              loading={isKeyLoading(`industries:${item.industry}`)}
              onChange={(checked) => toggleSimpleBlock("industries", item.industry, checked)}
            />
            <IconButton
              onClick={(e) => { e.stopPropagation(); handleEditClick(item, headingName); }}
              color="primary"
              size="small"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={(e) => { e.stopPropagation(); handleDeleteClick(item); }}
              color="error"
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </AccordionSummary>

      <AccordionDetails>
        {/* Categories */}
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#eca310ff" }}>
          Categories
        </Typography>
        {item.categories?.length > 0 ? (
          <List disablePadding>
            {item.categories.map((cat, i) => (
              <ListItem
                key={cat.id || i}
                disablePadding
                sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <ListItemText primary={`• ${cat.category}`} />
                <BlockCheckbox
                  checked={isSimpleBlocked("categories", cat.category)}
                  loading={isKeyLoading(`categories:${cat.category}`)}
                  onChange={(checked) => toggleSimpleBlock("categories", cat.category, checked)}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">N/A</Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Product Tags */}
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#eca310ff" }}>
          Product Tags
        </Typography>
        {item.productTags?.length > 0 ? (
          item.productTags.map((pt, ptIndex) => (
            <Box key={pt.id || ptIndex} sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>{pt.parent}</Typography>
                <BlockCheckbox
                  label="Block parent"
                  checked={isParentBlocked("productTags", pt.parent)}
                  loading={isKeyLoading(`productTags:${pt.parent}:__parent__`)}
                  onChange={(checked) => toggleParentBlock("productTags", pt.parent, checked)}
                />
              </Box>
              {pt.tags?.length > 0 ? (
                <List disablePadding>
                  {pt.tags.map((t, tIndex) => (
                    <ListItem
                      key={t.id || tIndex}
                      disablePadding
                      sx={{ pl: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    >
                      <ListItemText primary={<Typography variant="body2">• {t.tag}</Typography>} />
                      <BlockCheckbox
                        checked={isTagBlocked("productTags", pt.parent, t.tag)}
                        loading={isKeyLoading(`productTags:${pt.parent}:${t.tag}`)}
                        onChange={(checked) => toggleTagBlock("productTags", pt.parent, t.tag, checked)}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">N/A</Typography>
              )}
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">N/A</Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Service Tags */}
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#eca310ff" }}>
          Service Tags
        </Typography>
        {item.serviceTags?.length > 0 ? (
          item.serviceTags.map((st, stIndex) => (
            <Box key={st.id || stIndex} sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>{st.parent}</Typography>
                <BlockCheckbox
                  label="Block parent"
                  checked={isParentBlocked("serviceTags", st.parent)}
                  loading={isKeyLoading(`serviceTags:${st.parent}:__parent__`)}
                  onChange={(checked) => toggleParentBlock("serviceTags", st.parent, checked)}
                />
              </Box>
              {st.tags?.length > 0 ? (
                <List disablePadding>
                  {st.tags.map((tag, tagIndex) => (
                    <ListItem
                      key={tag.id || tagIndex}
                      disablePadding
                      sx={{ pl: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    >
                      <ListItemText primary={<Typography variant="body2">• {tag.tag}</Typography>} />
                      <BlockCheckbox
                        checked={isTagBlocked("serviceTags", st.parent, tag.tag)}
                        loading={isKeyLoading(`serviceTags:${st.parent}:${tag.tag}`)}
                        onChange={(checked) => toggleTagBlock("serviceTags", st.parent, tag.tag, checked)}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">N/A</Typography>
              )}
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">N/A</Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>Loading industries...</Typography>
      </Box>
    );
  }

  const totalIndustries = headings.reduce((acc, h) => acc + (h.industries?.length || 0), 0);

  // ── Main render ──────────────────────────────────────────────────────────────
  return (
    <>
      <Box sx={{ p: 3 }}>
        <Button variant="contained" onClick={handleCreate} sx={{ mb: 2 }}>
          Create Industry
        </Button>

        {/* Show errors inline, never block the whole page */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {blockError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setBlockError(null)}>
            {blockError}
          </Alert>
        )}

        <Typography variant="h5" gutterBottom>Industries</Typography>

        {totalIndustries === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No industries found. Click "Create Industry" to add one.
          </Typography>
        ) : (
          headings.map((headingObj, hIndex) => (
            <Box key={hIndex} sx={{ mb: 4 }}>
              {/* Heading label */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                  px: 1,
                  py: 0.5,
                  bgcolor: "#f5f5f5",
                  borderLeft: "4px solid #eca310",
                  borderRadius: 1,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {headingObj.heading}
                </Typography>
                <BlockCheckbox
                  checked={isSimpleBlocked("headings", headingObj.heading)}
                  loading={isKeyLoading(`headings:${headingObj.heading}`)}
                  onChange={(checked) => toggleSimpleBlock("headings", headingObj.heading, checked)}
                />
              </Box>

              {headingObj.industries?.map((item, index) =>
                renderIndustry(item, index, headingObj.heading)
              )}
            </Box>
          ))
        )}
      </Box>

      {/* Create / Edit Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="md"
        aria-labelledby="industry-modal"
      >
        <IndustryModal
          data={modalData}
          isEdit={!!modalData}
          onClose={handleCloseModal}
          onSaveSuccess={handleSaveSuccess}
        />
      </Dialog>

      {/* Delete Dialog */}
      <MuiDialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {deleteMode === "full" ? "Delete Entire Industry" : "Delete Industry Items"}
        </DialogTitle>
        <DialogContent>
          {deleteSuccess && <Alert severity="success" sx={{ mb: 2 }}>{deleteSuccess}</Alert>}
          {deleteError && <Alert severity="error" sx={{ mb: 2 }}>{deleteError}</Alert>}

          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={deleteMode === "full"}
                  onChange={(e) => setDeleteMode(e.target.checked ? "full" : "partial")}
                />
              }
              label="Delete entire industry"
            />
          </Box>

          {renderDeleteContent()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={deleteLoading}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={
              deleteLoading ||
              (deleteMode === "partial" &&
                selectedCategories.length === 0 &&
                selectedProductParents.length === 0 &&
                selectedProductTags.length === 0 &&
                selectedServiceParents.length === 0 &&
                selectedServiceTags.length === 0)
            }
            startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </MuiDialog>
    </>
  );
};

export default IndustryManagementPage;
