import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Divider,
  Chip,
  IconButton,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

const IndustryForm = ({ onClose }) => {
  const [industry, setIndustry] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [newServiceParent, setNewServiceParent] = useState("");
  const [newServiceTag, setNewServiceTag] = useState("");
  const [serviceTags, setServiceTags] = useState([]);
  const [editingServiceParentIndex, setEditingServiceParentIndex] = useState(null);
  const [editingServiceParentValue, setEditingServiceParentValue] = useState("");

  // PRODUCT TAGS STATE
  const [productTags, setProductTags] = useState([]);
  const [newProductParent, setNewProductParent] = useState("");
  const [newProductTag, setNewProductTag] = useState("");
  const [editingProductParentIndex, setEditingProductParentIndex] = useState(null);
  const [editingProductParentValue, setEditingProductParentValue] = useState("");

  // ADD CATEGORY
  const addCategory = () => {
    if (!categoryInput.trim()) return;
    setCategories([...categories, categoryInput]);
    setCategoryInput("");
  };

  const deleteCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  // ADD NEW PRODUCT PARENT
  const addProductParent = () => {
    if (!newProductParent.trim()) return;
    
    const parentExists = productTags.some(product => product.parent.toLowerCase() === newProductParent.toLowerCase());
    
    if (parentExists) {
      alert("Product parent already exists!");
      return;
    }
    
    setProductTags([
      ...productTags,
      {
        parent: newProductParent,
        tags: []
      }
    ]);
    setNewProductParent("");
  };

  // ADD TAG TO EXISTING PRODUCT PARENT
  const addProductTag = (parentIndex) => {
    if (!newProductTag.trim()) return;
    
    const updatedProductTags = [...productTags];
    const parent = updatedProductTags[parentIndex];
    
    // Check if tag already exists
    if (parent.tags.includes(newProductTag)) {
      alert("Tag already exists for this parent!");
      return;
    }
    
    parent.tags.push(newProductTag);
    setProductTags(updatedProductTags);
    setNewProductTag("");
  };

  // DELETE PRODUCT PARENT
  const deleteProductParent = (index) => {
    setProductTags(productTags.filter((_, i) => i !== index));
  };

  // DELETE PRODUCT TAG
  const deleteProductTag = (parentIndex, tagIndex) => {
    const updatedProductTags = [...productTags];
    updatedProductTags[parentIndex].tags.splice(tagIndex, 1);
    setProductTags(updatedProductTags);
  };

  // EDIT PRODUCT PARENT
  const startEditProductParent = (index) => {
    setEditingProductParentIndex(index);
    setEditingProductParentValue(productTags[index].parent);
  };

  const saveEditProductParent = (index) => {
    if (!editingProductParentValue.trim()) return;
    
    const updatedProductTags = [...productTags];
    updatedProductTags[index].parent = editingProductParentValue;
    setProductTags(updatedProductTags);
    setEditingProductParentIndex(null);
    setEditingProductParentValue("");
  };

  const cancelEditProductParent = () => {
    setEditingProductParentIndex(null);
    setEditingProductParentValue("");
  };

  // ADD SERVICE PARENT
  const addServiceParent = () => {
    if (!newServiceParent.trim()) return;
    
    const parentExists = serviceTags.some(service => service.parent.toLowerCase() === newServiceParent.toLowerCase());
    
    if (parentExists) {
      alert("Service parent already exists!");
      return;
    }
    
    setServiceTags([
      ...serviceTags,
      {
        parent: newServiceParent,
        tags: []
      }
    ]);
    setNewServiceParent("");
  };

  // ADD TAG TO EXISTING SERVICE PARENT
  const addServiceTag = (parentIndex) => {
    if (!newServiceTag.trim()) return;
    
    const updatedServiceTags = [...serviceTags];
    const parent = updatedServiceTags[parentIndex];
    
    // Check if tag already exists
    if (parent.tags.includes(newServiceTag)) {
      alert("Tag already exists for this parent!");
      return;
    }
    
    parent.tags.push(newServiceTag);
    setServiceTags(updatedServiceTags);
    setNewServiceTag("");
  };

  // DELETE SERVICE PARENT
  const deleteServiceParent = (index) => {
    setServiceTags(serviceTags.filter((_, i) => i !== index));
  };

  // DELETE SERVICE TAG
  const deleteServiceTag = (parentIndex, tagIndex) => {
    const updatedServiceTags = [...serviceTags];
    updatedServiceTags[parentIndex].tags.splice(tagIndex, 1);
    setServiceTags(updatedServiceTags);
  };

  // EDIT SERVICE PARENT
  const startEditServiceParent = (index) => {
    setEditingServiceParentIndex(index);
    setEditingServiceParentValue(serviceTags[index].parent);
  };

  const saveEditServiceParent = (index) => {
    if (!editingServiceParentValue.trim()) return;
    
    const updatedServiceTags = [...serviceTags];
    updatedServiceTags[index].parent = editingServiceParentValue;
    setServiceTags(updatedServiceTags);
    setEditingServiceParentIndex(null);
    setEditingServiceParentValue("");
  };

  const cancelEditServiceParent = () => {
    setEditingServiceParentIndex(null);
    setEditingServiceParentValue("");
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      industry,
      categories,
      productTags: productTags.map(product => ({
        parent: product.parent,
        tags: product.tags
      })),
      serviceTags: serviceTags.map(service => ({
        parent: service.parent,
        tags: service.tags
      })),
    };

    try {
      await axios.post("http://localhost:5000/api/v1/admin/createIndustryManagement", payload);
      alert("Industry Data Saved Successfully!");
      onClose();
    } catch (error) {
      console.log(error);
      alert("Error saving data");
    }
  };

  return (
    <Paper
      elevation={3}
      component="form"
      onSubmit={handleSubmit}
      sx={{ p: 4, maxWidth: 900, mx: "auto", mt: 3, mb: 3 }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Add Industry Data
      </Typography>

      {/* INDUSTRY */}
      <TextField
        fullWidth
        label="Industry Name"
        value={industry}
        onChange={(e) => setIndustry(e.target.value)}
        required
        sx={{ mb: 3 }}
      />

      <Divider sx={{ my: 2 }} />

      {/* CATEGORIES */}
      <Typography variant="h6">Categories</Typography>

      <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
        <TextField
          fullWidth
          label="Add Category"
          value={categoryInput}
          onChange={(e) => setCategoryInput(e.target.value)}
        />
        <Button variant="contained" startIcon={<AddIcon />} onClick={addCategory}>
          Add
        </Button>
      </Box>

      {/* Display Category List */}
      <Box sx={{ mt: 2 }}>
        {categories.map((cat, index) => (
          <Chip
            key={index}
            label={cat}
            onDelete={() => deleteCategory(index)}
            deleteIcon={<DeleteIcon />}
            sx={{ m: 0.5 }}
          />
        ))}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* PRODUCT TAGS SECTION */}
      <Typography variant="h6">Product Tags</Typography>

      {/* Add New Product Parent */}
      <Box sx={{ mt: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="New Product Parent"
              value={newProductParent}
              onChange={(e) => setNewProductParent(e.target.value)}
              placeholder="e.g., Electronics, Clothing, Furniture"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addProductParent}
              disabled={!newProductParent.trim()}
            >
              Add Parent
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Display Product Parents with Tags */}
      <Box sx={{ mt: 3 }}>
        {productTags.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center">
            No product parents added yet. Add a parent to start adding tags.
          </Typography>
        ) : (
          productTags.map((product, parentIndex) => (
            <Card key={parentIndex} sx={{ mb: 3, border: "1px solid #e0e0e0" }}>
              <CardContent>
                {/* Product Parent Header */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  {editingProductParentIndex === parentIndex ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={editingProductParentValue}
                        onChange={(e) => setEditingProductParentValue(e.target.value)}
                        autoFocus
                      />
                      <IconButton color="success" onClick={() => saveEditProductParent(parentIndex)}>
                        <SaveIcon />
                      </IconButton>
                      <IconButton color="error" onClick={cancelEditProductParent}>
                        <CancelIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    <>
                      <Typography variant="h6" component="div">
                        {product.parent}
                      </Typography>
                      <Box>
                        <IconButton 
                          size="small" 
                          onClick={() => startEditProductParent(parentIndex)}
                          title="Edit Parent"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => deleteProductParent(parentIndex)}
                          title="Delete Parent"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </>
                  )}
                </Box>

                {/* Add Tag to this Parent */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      size="small"
                      label={`Add tag to ${product.parent}`}
                      value={newProductTag}
                      onChange={(e) => setNewProductTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addProductTag(parentIndex);
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => addProductTag(parentIndex)}
                      disabled={!newProductTag.trim()}
                    >
                      Add Tag
                    </Button>
                  </Grid>
                </Grid>

                {/* Display Tags for this Parent */}
                <Box sx={{ mt: 2 }}>
                  {product.tags.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No tags added yet. Add tags for this product parent.
                    </Typography>
                  ) : (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {product.tags.map((tag, tagIndex) => (
                        <Chip
                          key={tagIndex}
                          label={tag}
                          onDelete={() => deleteProductTag(parentIndex, tagIndex)}
                          deleteIcon={<DeleteIcon />}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
                <Typography variant="caption" color="text.secondary">
                  {product.tags.length} tags
                </Typography>
              </CardActions>
            </Card>
          ))
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* SERVICE TAGS SECTION */}
      <Typography variant="h6">Service Tags</Typography>

      {/* Add New Service Parent */}
      <Box sx={{ mt: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="New Service Parent"
              value={newServiceParent}
              onChange={(e) => setNewServiceParent(e.target.value)}
              placeholder="e.g., Consulting, Marketing, IT Services"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addServiceParent}
              disabled={!newServiceParent.trim()}
            >
              Add Parent
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Display Service Parents with Tags */}
      <Box sx={{ mt: 3 }}>
        {serviceTags.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center">
            No service parents added yet. Add a parent to start adding tags.
          </Typography>
        ) : (
          serviceTags.map((service, parentIndex) => (
            <Card key={parentIndex} sx={{ mb: 3, border: "1px solid #e0e0e0" }}>
              <CardContent>
                {/* Service Parent Header */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  {editingServiceParentIndex === parentIndex ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={editingServiceParentValue}
                        onChange={(e) => setEditingServiceParentValue(e.target.value)}
                        autoFocus
                      />
                      <IconButton color="success" onClick={() => saveEditServiceParent(parentIndex)}>
                        <SaveIcon />
                      </IconButton>
                      <IconButton color="error" onClick={cancelEditServiceParent}>
                        <CancelIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    <>
                      <Typography variant="h6" component="div">
                        {service.parent}
                      </Typography>
                      <Box>
                        <IconButton 
                          size="small" 
                          onClick={() => startEditServiceParent(parentIndex)}
                          title="Edit Parent"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => deleteServiceParent(parentIndex)}
                          title="Delete Parent"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </>
                  )}
                </Box>

                {/* Add Tag to this Parent */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      size="small"
                      label={`Add tag to ${service.parent}`}
                      value={newServiceTag}
                      onChange={(e) => setNewServiceTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addServiceTag(parentIndex);
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => addServiceTag(parentIndex)}
                      disabled={!newServiceTag.trim()}
                    >
                      Add Tag
                    </Button>
                  </Grid>
                </Grid>

                {/* Display Tags for this Parent */}
                <Box sx={{ mt: 2 }}>
                  {service.tags.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No tags added yet. Add tags for this service parent.
                    </Typography>
                  ) : (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {service.tags.map((tag, tagIndex) => (
                        <Chip
                          key={tagIndex}
                          label={tag}
                          onDelete={() => deleteServiceTag(parentIndex, tagIndex)}
                          deleteIcon={<DeleteIcon />}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
                <Typography variant="caption" color="text.secondary">
                  {service.tags.length} tags
                </Typography>
              </CardActions>
            </Card>
          ))
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="success" type="submit" size="large">
          Save Industry Data
        </Button>
      </Box>
    </Paper>
  );
};

export default IndustryForm;