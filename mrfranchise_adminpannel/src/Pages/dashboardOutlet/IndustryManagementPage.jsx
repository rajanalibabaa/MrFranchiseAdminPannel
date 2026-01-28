import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Box,
  Dialog,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IndustryModal from "../../Components/IndustryMangement/IndustryCreatemodel";

const IndustryManagementPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [deleteMode, setDeleteMode] = useState("partial"); // 'full' or 'partial'
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
  }, []);

  const fetchIndustries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        "https://mrfranchisebackend.mrfranchise.in/api/v1/admin/getAllIndustry"
      );
      if (response.data.success) {
        setIndustries(response.data.data);
      } else {
        setError("Failed to fetch industries");
      }
    } catch (error) {
      console.error("Error fetching industries:", error);
      setError("Error fetching industries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setModalData(null);
    setOpenModal(true);
  };

  const handleEditClick = (industry) => {
    setModalData(industry);
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

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleProductParentToggle = (productId) => {
    setSelectedProductParents(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleProductTagToggle = (productId, tagId) => {
    const tagKey = `${productId}-${tagId}`;
    setSelectedProductTags(prev => {
      const exists = prev.find(t => t.productId === productId && t.ids.includes(tagId));
      if (exists) {
        return prev.map(t =>
          t.productId === productId
            ? { ...t, ids: t.ids.filter(id => id !== tagId) }
            : t
        ).filter(t => t.ids.length > 0);
      } else {
        const existingProduct = prev.find(t => t.productId === productId);
        if (existingProduct) {
          return prev.map(t =>
            t.productId === productId
              ? { ...t, ids: [...t.ids, tagId] }
              : t
          );
        } else {
          return [...prev, { productId, ids: [tagId] }];
        }
      }
    });
  };

  const handleServiceParentToggle = (serviceId) => {
    setSelectedServiceParents(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleServiceTagToggle = (serviceId, tagId) => {
    setSelectedServiceTags(prev => {
      const exists = prev.find(t => t.serviceId === serviceId && t.ids.includes(tagId));
      if (exists) {
        return prev.map(t =>
          t.serviceId === serviceId
            ? { ...t, ids: t.ids.filter(id => id !== tagId) }
            : t
        ).filter(t => t.ids.length > 0);
      } else {
        const existingService = prev.find(t => t.serviceId === serviceId);
        if (existingService) {
          return prev.map(t =>
            t.serviceId === serviceId
              ? { ...t, ids: [...t.ids, tagId] }
              : t
          );
        } else {
          return [...prev, { serviceId, ids: [tagId] }];
        }
      }
    });
  };

  const handleDelete = async () => {
    if (!selectedIndustry) return;
    try {
      setDeleteLoading(true);
      setDeleteError(null);
      const payload = {
        deleteIndustry: deleteMode === "full" ? "true" : "false",
        remove: deleteMode === "partial" ? {
          categories: selectedCategories,
          productTags: {
            products: selectedProductParents,
            tags: selectedProductTags
          },
          serviceTags: {
            services: selectedServiceParents,
            tags: selectedServiceTags
          }
        } : undefined
      };
      const response = await axios.delete(
        `https://mrfranchisebackend.mrfranchise.in/api/v1/admin/deleteIndustryById/${selectedIndustry.uuid}`,
        { data: payload }
      );
      if (response.data.success) {
        setDeleteSuccess(response.data.message || "Deleted successfully!");
        setTimeout(() => {
          handleCloseDeleteDialog();
          fetchIndustries(); // Refresh the list
        }, 1500);
      } else {
        setDeleteError(response.data.message || "Failed to delete");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setDeleteError(
        error.response?.data?.message ||
        error.message ||
        "Something went wrong"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const renderDeleteContent = () => {
    if (!selectedIndustry) return null;
    if (deleteMode === "full") {
      return (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Are you sure you want to delete the entire industry "{selectedIndustry.industry}"?
          This action cannot be undone.
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
            <Typography variant="subtitle2" gutterBottom>
              Categories:
            </Typography>
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
            <Typography variant="subtitle2" gutterBottom>
              Product Tags:
            </Typography>
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
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
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
                              pt => pt.productId === product.id && pt.ids.includes(tag.id)
                            )}
                            onChange={() => handleProductTagToggle(product.id, tag.id)}
                            size="small"
                          />
                        }
                        label={
                          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
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
            <Typography variant="subtitle2" gutterBottom>
              Service Tags:
            </Typography>
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
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
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
                              st => st.serviceId === service.id && st.ids.includes(tag.id)
                            )}
                            onChange={() => handleServiceTagToggle(service.id, tag.id)}
                            size="small"
                          />
                        }
                        label={
                          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
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
            No items available for deletion in partial mode.
          </Typography>
        )}
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>Loading industries...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Button variant="contained" onClick={handleCreate} sx={{ mb: 2 }}>
          Create Industry
        </Button>
        {/* Industries List */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h5" gutterBottom>
            Industries
          </Typography>
          {industries.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No industries found.
            </Typography>
          ) : (
            industries.map((item, index) => (
              <Accordion
                key={item.uuid || item._id || index}
                sx={{ mb: 3, boxShadow: 2 }}
                defaultExpanded={false}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                >
                  <Box
                    sx={{
                      width: "97%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {item.industry}
                    </Typography>
                    <Box>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(item);
                        }}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(item);
                        }}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {/* Categories as bullet points */}
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold", color: "#eca310ff" }}
                  >
                    Categories
                  </Typography>
                  {item.categories && item.categories.length > 0 ? (
                    <List disablePadding>
                      {item.categories.map((cat, catIndex) => (
                        <ListItem key={cat.id || catIndex} disablePadding>
                          <ListItemText primary={`• ${cat.category}`} />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      N/A
                    </Typography>
                  )}
                  <Divider sx={{ my: 2 }} />
                  {/* Product Tags */}
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold", color: "#eca310ff" }}
                  >
                    Product Tags:
                  </Typography>
                  {item.productTags && item.productTags.length > 0 ? (
                    item.productTags.map((pt, ptIndex) => (
                      <Box key={pt.id || ptIndex} sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          sx={{ fontWeight: "bold" }}
                        >
                          {pt.parent}
                        </Typography>
                        {pt.tags && pt.tags.length > 0 ? (
                          <List disablePadding>
                            {pt.tags.map((t, tIndex) => (
                              <ListItem
                                key={t.id || tIndex}
                                disablePadding
                                sx={{ pl: 2 }}
                              >
                                <ListItemText
                                  primary={
                                    <Typography variant="body2" component="p">
                                      • {t.tag}
                                    </Typography>
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            N/A
                          </Typography>
                        )}
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      N/A
                    </Typography>
                  )}
                  <Divider sx={{ my: 2 }} />
                  {/* Service Tags */}
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold", color: "#eca310ff" }}
                  >
                    Service Tags
                  </Typography>
                  {item.serviceTags && item.serviceTags.length > 0 ? (
                    item.serviceTags.map((st, stIndex) => (
                      <Box key={st.id || stIndex} sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          sx={{ fontWeight: "bold" }}
                        >
                          {st.parent}
                        </Typography>
                        {st.tags && st.tags.length > 0 ? (
                          <List disablePadding>
                            {st.tags.map((tag, tagIndex) => (
                              <ListItem
                                key={tag.id || tagIndex}
                                disablePadding
                                sx={{ pl: 2 }}
                              >
                                <ListItemText
                                  primary={
                                    <Typography variant="body2" component="p">
                                      • {tag.tag}
                                    </Typography>
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            N/A
                          </Typography>
                        )}
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      N/A
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </Box>
      </Box>
      {/* Industry Modal (Create/Edit) */}
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
      {/* Delete Confirmation Dialog */}
      <MuiDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {deleteMode === "full" ? "Delete Entire Industry" : "Delete Industry Items"}
        </DialogTitle>
        <DialogContent>
          {deleteSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {deleteSuccess}
            </Alert>
          )}
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError}
            </Alert>
          )}
         
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
          <Button onClick={handleCloseDeleteDialog} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleteLoading ||
              (deleteMode === "partial" &&
               selectedCategories.length === 0 &&
               selectedProductParents.length === 0 &&
               selectedProductTags.length === 0 &&
               selectedServiceParents.length === 0 &&
               selectedServiceTags.length === 0)}
            startIcon={deleteLoading && <CircularProgress size={20} />}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </MuiDialog>
    </>
  );
};

export default IndustryManagementPage;