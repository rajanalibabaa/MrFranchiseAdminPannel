import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  Grid,
  Divider,
} from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";

const IndustryForm = ({ onClose }) => {
  const [industry, setIndustry] = useState("");
  const [categories, setCategories] = useState([""]);
  const [productTags, setProductTags] = useState([{ parent: "", tag: [""] }]);
  const [serviceTags, setServiceTags] = useState([{ parent: "", tag: [""] }]);

  // CATEGORY HANDLERS
  const handleCategoryChange = (index, value) => {
    const updated = [...categories];
    updated[index] = value;
    setCategories(updated);
  };

  const addCategory = () => {
    setCategories([...categories, ""]);
  };

  const removeCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  // PRODUCT TAGS HANDLERS
  const handleProductParentChange = (index, value) => {
    const updated = [...productTags];
    updated[index].parent = value;
    setProductTags(updated);
  };

  const handleProductTagChange = (pIndex, tIndex, value) => {
    const updated = [...productTags];
    updated[pIndex].tag[tIndex] = value;
    setProductTags(updated);
  };

  const addProductTagParent = () => {
    setProductTags([...productTags, { parent: "", tag: [""] }]);
  };

  const removeProductTagParent = (index) => {
    setProductTags(productTags.filter((_, i) => i !== index));
  };

  const addProductTag = (pIndex) => {
    const updated = [...productTags];
    updated[pIndex].tag.push("");
    setProductTags(updated);
  };

  const removeProductTag = (pIndex, tIndex) => {
    const updated = [...productTags];
    updated[pIndex].tag = updated[pIndex].tag.filter((_, i) => i !== tIndex);
    setProductTags(updated);
  };

  // SERVICE TAGS HANDLERS
  const handleServiceParentChange = (index, value) => {
    const updated = [...serviceTags];
    updated[index].parent = value;
    setServiceTags(updated);
  };

  const handleServiceTagChange = (sIndex, tIndex, value) => {
    const updated = [...serviceTags];
    updated[sIndex].tag[tIndex] = value;
    setServiceTags(updated);
  };

  const addServiceTagParent = () => {
    setServiceTags([...serviceTags, { parent: "", tag: [""] }]);
  };

  const removeServiceTagParent = (index) => {
    setServiceTags(serviceTags.filter((_, i) => i !== index));
  };

  const addServiceTag = (sIndex) => {
    const updated = [...serviceTags];
    updated[sIndex].tag.push("");
    setServiceTags(updated);
  };

  const removeServiceTag = (sIndex, tIndex) => {
    const updated = [...serviceTags];
    updated[sIndex].tag = updated[sIndex].tag.filter((_, i) => i !== tIndex);
    setServiceTags(updated);
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      industry,
      categories: categories.filter((c) => c.trim() !== ""),
      productTags: productTags.map((p) => ({
        parent: p.parent,
        tag: p.tag.filter((t) => t.trim() !== ""),
      })),
      serviceTags: serviceTags.map((s) => ({
        parent: s.parent,
        tag: s.tag.filter((t) => t.trim() !== ""),
      })),
    };

    try {
      const response = await axios.post("http://localhost:5000/api/industry", payload);
      alert("Data Saved Successfully!");
      console.log(response.data);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error saving data");
    }
  };

  return (
    <Paper
      elevation={3}
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 3,
        maxWidth: 800,
        mx: "auto",
        mt: 2,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Add Industry Data
      </Typography>

      {/* INDUSTRY */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Industry
        </Typography>
        <TextField
          fullWidth
          label="Industry Name"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          variant="outlined"
          required
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* CATEGORIES */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Categories
        </Typography>
        <Grid container spacing={2}>
          {categories.map((cat, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TextField
                  fullWidth
                  value={cat}
                  onChange={(e) => handleCategoryChange(index, e.target.value)}
                  label={`Category ${index + 1}`}
                  variant="outlined"
                />
                {categories.length > 1 && (
                  <IconButton
                    color="error"
                    onClick={() => removeCategory(index)}
                    size="small"
                  >
                    <RemoveIcon />
                  </IconButton>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addCategory}
          sx={{ mt: 2 }}
        >
          Add Category
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* PRODUCT TAGS */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Product Tags
        </Typography>
        {productTags.map((item, pIndex) => (
          <Paper key={pIndex} elevation={1} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label={`Product Parent ${pIndex + 1}`}
                value={item.parent}
                onChange={(e) => handleProductParentChange(pIndex, e.target.value)}
                variant="outlined"
              />
              {productTags.length > 1 && (
                <IconButton
                  color="error"
                  onClick={() => removeProductTagParent(pIndex)}
                  size="small"
                >
                  <RemoveIcon />
                </IconButton>
              )}
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Tags
            </Typography>
            <Grid container spacing={2}>
              {item.tag.map((t, tIndex) => (
                <Grid item xs={12} md={6} key={tIndex}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TextField
                      fullWidth
                      value={t}
                      onChange={(e) => handleProductTagChange(pIndex, tIndex, e.target.value)}
                      label={`Tag ${tIndex + 1}`}
                      variant="outlined"
                    />
                    {item.tag.length > 1 && (
                      <IconButton
                        color="error"
                        onClick={() => removeProductTag(pIndex, tIndex)}
                        size="small"
                      >
                        <RemoveIcon />
                      </IconButton>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => addProductTag(pIndex)}
              sx={{ mt: 2 }}
            >
              Add Tag
            </Button>
          </Paper>
        ))}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addProductTagParent}
          sx={{ mt: 2 }}
        >
          Add Product Parent
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* SERVICE TAGS */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Service Tags
        </Typography>
        {serviceTags.map((item, sIndex) => (
          <Paper key={sIndex} elevation={1} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label={`Service Parent ${sIndex + 1}`}
                value={item.parent}
                onChange={(e) => handleServiceParentChange(sIndex, e.target.value)}
                variant="outlined"
              />
              {serviceTags.length > 1 && (
                <IconButton
                  color="error"
                  onClick={() => removeServiceTagParent(sIndex)}
                  size="small"
                >
                  <RemoveIcon />
                </IconButton>
              )}
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Tags
            </Typography>
            <Grid container spacing={2}>
              {item.tag.map((t, tIndex) => (
                <Grid item xs={12} md={6} key={tIndex}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TextField
                      fullWidth
                      value={t}
                      onChange={(e) => handleServiceTagChange(sIndex, tIndex, e.target.value)}
                      label={`Tag ${tIndex + 1}`}
                      variant="outlined"
                    />
                    {item.tag.length > 1 && (
                      <IconButton
                        color="error"
                        onClick={() => removeServiceTag(sIndex, tIndex)}
                        size="small"
                      >
                        <RemoveIcon />
                      </IconButton>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => addServiceTag(sIndex)}
              sx={{ mt: 2 }}
            >
              Add Tag
            </Button>
          </Paper>
        ))}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addServiceTagParent}
          sx={{ mt: 2 }}
        >
          Add Service Parent
        </Button>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </Paper>
  );
};

export default IndustryForm;