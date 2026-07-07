// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Paper,
//   Grid,
//   Divider,
//   Chip,
//   IconButton,
//   Card,
//   CardContent,
//   CardActions,
// } from "@mui/material";
// import {
//   Add as AddIcon,
//   Delete as DeleteIcon,
//   Edit as EditIcon,
//   Save as SaveIcon,
//   Cancel as CancelIcon,
// } from "@mui/icons-material";

// const IndustryForm = ({ initialData, isEdit, onClose, onSaveSuccess }) => {
//   const [industry, setIndustry] = useState("");
//   const [categoryInput, setCategoryInput] = useState("");
//   const [categories, setCategories] = useState([]); // [{id?: string, category: string}]
//   const [newServiceParent, setNewServiceParent] = useState("");
//   const [newServiceTag, setNewServiceTag] = useState("");
//   const [serviceTags, setServiceTags] = useState([]); // [{id?: string, parent: string, tags: [{id?: string, tag: string}]}]
//   const [editingServiceParentIndex, setEditingServiceParentIndex] = useState(null);
//   const [editingServiceParentValue, setEditingServiceParentValue] = useState("");
//   // PRODUCT TAGS STATE
//   const [productTags, setProductTags] = useState([]); // same structure
//   const [newProductParent, setNewProductParent] = useState("");
//   const [newProductTag, setNewProductTag] = useState("");
//   const [editingProductParentIndex, setEditingProductParentIndex] = useState(null);
//   const [editingProductParentValue, setEditingProductParentValue] = useState("");

//   useEffect(() => {
//     if (initialData) {
//       setIndustry(initialData.industry || "");
//       setCategories(initialData.categories ? initialData.categories.map(c => ({ id: c.id, category: c.category })) : []);
//       setProductTags(initialData.productTags ? initialData.productTags.map(p => ({
//         id: p.id,
//         parent: p.parent,
//         tags: p.tags ? p.tags.map(t => ({ id: t.id, tag: t.tag })) : []
//       })) : []);
//       setServiceTags(initialData.serviceTags ? initialData.serviceTags.map(s => ({
//         id: s.id,
//         parent: s.parent,
//         tags: s.tags ? s.tags.map(t => ({ id: t.id, tag: t.tag })) : []
//       })) : []);
//     } else {
//       // Reset for create
//       setIndustry("");
//       setCategories([]);
//       setProductTags([]);
//       setServiceTags([]);
//     }
//   }, [initialData]);

//   // ADD CATEGORY
//   const addCategory = () => {
//     if (!categoryInput.trim()) return;
//     setCategories([...categories, { category: categoryInput.trim() }]);
//     setCategoryInput("");
//   };

//   const deleteCategory = (index) => {
//     setCategories(categories.filter((_, i) => i !== index));
//   };

//   // ADD NEW PRODUCT PARENT
//   const addProductParent = () => {
//     if (!newProductParent.trim()) return;
   
//     const parentExists = productTags.some(product => product.parent.toLowerCase() === newProductParent.trim().toLowerCase());
   
//     if (parentExists) {
//       alert("Product parent already exists!");
//       return;
//     }
   
//     setProductTags([
//       ...productTags,
//       {
//         parent: newProductParent.trim(),
//         tags: []
//       }
//     ]);
//     setNewProductParent("");
//   };

//   // ADD TAG TO EXISTING PRODUCT PARENT
//   const addProductTag = (parentIndex) => {
//     if (!newProductTag.trim()) return;
   
//     const updatedProductTags = [...productTags];
//     const parent = updatedProductTags[parentIndex];
   
//     // Check if tag already exists
//     if (parent.tags.some(t => t.tag === newProductTag.trim())) {
//       alert("Tag already exists for this parent!");
//       return;
//     }
   
//     parent.tags.push({ tag: newProductTag.trim() });
//     setProductTags(updatedProductTags);
//     setNewProductTag("");
//   };

//   // DELETE PRODUCT PARENT
//   const deleteProductParent = (index) => {
//     setProductTags(productTags.filter((_, i) => i !== index));
//   };

//   // DELETE PRODUCT TAG
//   const deleteProductTag = (parentIndex, tagIndex) => {
//     const updatedProductTags = [...productTags];
//     updatedProductTags[parentIndex].tags = updatedProductTags[parentIndex].tags.filter((_, i) => i !== tagIndex);
//     setProductTags(updatedProductTags);
//   };

//   // EDIT PRODUCT PARENT
//   const startEditProductParent = (index) => {
//     setEditingProductParentIndex(index);
//     setEditingProductParentValue(productTags[index].parent);
//   };

//   const saveEditProductParent = (index) => {
//     if (!editingProductParentValue.trim()) return;
   
//     const updatedProductTags = [...productTags];
//     updatedProductTags[index].parent = editingProductParentValue.trim();
//     setProductTags(updatedProductTags);
//     setEditingProductParentIndex(null);
//     setEditingProductParentValue("");
//   };

//   const cancelEditProductParent = () => {
//     setEditingProductParentIndex(null);
//     setEditingProductParentValue("");
//   };

//   // ADD SERVICE PARENT
//   const addServiceParent = () => {
//     if (!newServiceParent.trim()) return;
   
//     const parentExists = serviceTags.some(service => service.parent.toLowerCase() === newServiceParent.trim().toLowerCase());
   
//     if (parentExists) {
//       alert("Service parent already exists!");
//       return;
//     }
   
//     setServiceTags([
//       ...serviceTags,
//       {
//         parent: newServiceParent.trim(),
//         tags: []
//       }
//     ]);
//     setNewServiceParent("");
//   };

//   // ADD TAG TO EXISTING SERVICE PARENT
//   const addServiceTag = (parentIndex) => {
//     if (!newServiceTag.trim()) return;
   
//     const updatedServiceTags = [...serviceTags];
//     const parent = updatedServiceTags[parentIndex];
   
//     // Check if tag already exists
//     if (parent.tags.some(t => t.tag === newServiceTag.trim())) {
//       alert("Tag already exists for this parent!");
//       return;
//     }
   
//     parent.tags.push({ tag: newServiceTag.trim() });
//     setServiceTags(updatedServiceTags);
//     setNewServiceTag("");
//   };

//   // DELETE SERVICE PARENT
//   const deleteServiceParent = (index) => {
//     setServiceTags(serviceTags.filter((_, i) => i !== index));
//   };

//   // DELETE SERVICE TAG
//   const deleteServiceTag = (parentIndex, tagIndex) => {
//     const updatedServiceTags = [...serviceTags];
//     updatedServiceTags[parentIndex].tags = updatedServiceTags[parentIndex].tags.filter((_, i) => i !== tagIndex);
//     setServiceTags(updatedServiceTags);
//   };

//   // EDIT SERVICE PARENT
//   const startEditServiceParent = (index) => {
//     setEditingServiceParentIndex(index);
//     setEditingServiceParentValue(serviceTags[index].parent);
//   };

//   const saveEditServiceParent = (index) => {
//     if (!editingServiceParentValue.trim()) return;
   
//     const updatedServiceTags = [...serviceTags];
//     updatedServiceTags[index].parent = editingServiceParentValue.trim();
//     setServiceTags(updatedServiceTags);
//     setEditingServiceParentIndex(null);
//     setEditingServiceParentValue("");
//   };

//   const cancelEditServiceParent = () => {
//     setEditingServiceParentIndex(null);
//     setEditingServiceParentValue("");
//   };

//   // SUBMIT
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!industry.trim()) {
//       alert("Industry name is required!");
//       return;
//     }

//     try {
//       if (!isEdit) {
//         // Create
//         const payload = {
//           industry,
//           categories: categories.map(c => c.category),
//           productTags: productTags.map(product => ({
//             parent: product.parent,
//             tags: product.tags.map(t => t.tag)
//           })),
//           serviceTags: serviceTags.map(service => ({
//             parent: service.parent,
//             tags: service.tags.map(t => t.tag)
//           })),
//         };
//         await axios.post("https://mrfranchisebackend.mrfranchise.in/api/v1/admin/createIndustryManagement", payload);
//         alert("Industry Data Saved Successfully!");
//       } else {
//         // Update - compute diffs
//         const originalData = initialData;

//         // Categories
//         const originalCategories = originalData.categories || [];
//         const addedCategories = categories.filter(c => !c.id).map(c => c.category);
//         const removedCategories = originalCategories.filter(oc => !categories.some(cc => cc.id === oc.id)).map(c => c.id);

//         // Product Tags
//         const originalProductTags = originalData.productTags || [];
//         let addedProductTags = productTags.filter(p => !p.id).map(p => ({
//           parent: p.parent,
//           tags: p.tags.map(t => t.tag)
//         }));
//         const renamedProductIds = [];
//         productTags.forEach(p => {
//           if (p.id) {
//             const orig = originalProductTags.find(o => o.id === p.id);
//             if (orig && orig.parent !== p.parent) {
//               renamedProductIds.push(p.id);
//               addedProductTags.push({
//                 parent: p.parent,
//                 tags: p.tags.map(t => t.tag)
//               });
//             }
//           }
//         });
//         const currentNonRenamedIds = productTags
//           .filter(p => p.id && !renamedProductIds.includes(p.id))
//           .map(p => p.id);
//         const removedProductParents = originalProductTags
//           .filter(op => !currentNonRenamedIds.includes(op.id))
//           .map(p => p.id)
//           .concat(renamedProductIds);
//         let pushProductTags = [];
//         let removedProductTagsObj = [];
//         const nonRenamedCurrent = productTags.filter(p => p.id && !renamedProductIds.includes(p.id));
//         nonRenamedCurrent.forEach(p => {
//           const origParent = originalProductTags.find(op => op.id === p.id);
//           if (origParent) {
//             const origTags = origParent.tags || [];
//             const origTagIds = origTags.map(t => t.id);
//             const currentTagIds = p.tags.filter(t => t.id).map(t => t.id);
//             // New tags
//             const newTags = p.tags.filter(t => !t.id || !origTagIds.includes(t.id)).map(t => t.tag);
//             if (newTags.length > 0) {
//               pushProductTags.push({
//                 id: p.id,
//                 tags: newTags
//               });
//             }
//             // Removed tags
//             const removedTagsForP = origTags.filter(ot => !currentTagIds.includes(ot.id)).map(t => t.id);
//             if (removedTagsForP.length > 0) {
//               removedProductTagsObj.push({
//                 productId: p.id,
//                 ids: removedTagsForP
//               });
//             }
//           }
//         });

//         // Service Tags (symmetric to product)
//         const originalServiceTags = originalData.serviceTags || [];
//         let addedServiceTags = serviceTags.filter(s => !s.id).map(s => ({
//           parent: s.parent,
//           tags: s.tags.map(t => t.tag)
//         }));
//         const renamedServiceIds = [];
//         serviceTags.forEach(s => {
//           if (s.id) {
//             const orig = originalServiceTags.find(o => o.id === s.id);
//             if (orig && orig.parent !== s.parent) {
//               renamedServiceIds.push(s.id);
//               addedServiceTags.push({
//                 parent: s.parent,
//                 tags: s.tags.map(t => t.tag)
//               });
//             }
//           }
//         });
//         const currentNonRenamedServiceIds = serviceTags
//           .filter(s => s.id && !renamedServiceIds.includes(s.id))
//           .map(s => s.id);
//         const removedServiceParents = originalServiceTags
//           .filter(os => !currentNonRenamedServiceIds.includes(os.id))
//           .map(s => s.id)
//           .concat(renamedServiceIds);
//         let pushServiceTags = [];
//         let removedServiceTagsObj = [];
//         const nonRenamedCurrentService = serviceTags.filter(s => s.id && !renamedServiceIds.includes(s.id));
//         nonRenamedCurrentService.forEach(s => {
//           const origService = originalServiceTags.find(os => os.id === s.id);
//           if (origService) {
//             const origTags = origService.tags || [];
//             const origTagIds = origTags.map(t => t.id);
//             const currentTagIds = s.tags.filter(t => t.id).map(t => t.id);
//             // New tags
//             const newTags = s.tags.filter(t => !t.id || !origTagIds.includes(t.id)).map(t => t.tag);
//             if (newTags.length > 0) {
//               pushServiceTags.push({
//                 id: s.id,
//                 tags: newTags
//               });
//             }
//             // Removed tags
//             const removedTagsForS = origTags.filter(ot => !currentTagIds.includes(ot.id)).map(t => t.id);
//             if (removedTagsForS.length > 0) {
//               removedServiceTagsObj.push({
//                 serviceId: s.id,
//                 ids: removedTagsForS
//               });
//             }
//           }
//         });

//         // Build payload
//         const newUpdate = {
//           industry, // Always send, backend can handle
//           ...(addedCategories.length > 0 && { categories: addedCategories }),
//           productTags: {
//             ...(addedProductTags.length > 0 && { addProductTags: addedProductTags }),
//             ...(pushProductTags.length > 0 && { pushProductTags }),
//           },
//           serviceTags: {
//             ...(addedServiceTags.length > 0 && { addServiceTags: addedServiceTags }),
//             ...(pushServiceTags.length > 0 && { pushServiceTags }),
//           },
//         };

//         const remove = {
//           ...(removedCategories.length > 0 && { removeCategories: removedCategories }),
//           ...( (removedProductParents.length > 0 || removedProductTagsObj.length > 0) && {
//             removeProductTags: {
//               ...(removedProductParents.length > 0 && { products: removedProductParents }),
//               ...(removedProductTagsObj.length > 0 && { tags: removedProductTagsObj }),
//             }
//           }),
//           ...( (removedServiceParents.length > 0 || removedServiceTagsObj.length > 0) && {
//             removeServiceTags: {
//               ...(removedServiceParents.length > 0 && { services: removedServiceParents }),
//               ...(removedServiceTagsObj.length > 0 && { tags: removedServiceTagsObj }),
//             }
//           }),
//         };

//         const payload = { newUpdate, ...(Object.keys(remove).length > 0 && { remove }) };

//         await axios.put(`https://mrfranchisebackend.mrfranchise.in/api/v1/admin/updateIndustryById/${initialData.uuid}`, payload);
//         alert("Industry Data Updated Successfully!");
//       }
//       onSaveSuccess();
//       onClose();
//     } catch (error) {
//       console.log(error);
//       alert(`Error ${isEdit ? 'updating' : 'saving'} data: ${error.response?.data?.message || error.message}`);
//     }
//   };

//   return (
//     <Paper
//       elevation={3}
//       component="form"
//       onSubmit={handleSubmit}
//       sx={{ p: 4, maxWidth: 900, mx: "auto", mt: 3, mb: 3 }}
//     >
//       <Typography variant="h4" align="center" gutterBottom>
//         {isEdit ? "Edit Industry Data" : "Add Industry Data"}
//       </Typography>
//       {/* INDUSTRY */}
//       <TextField
//         fullWidth
//         label="Industry Name"
//         value={industry}
//         onChange={(e) => setIndustry(e.target.value)}
//         required
//         sx={{ mb: 3 }}
//       />
//       <Divider sx={{ my: 2 }} />
//       {/* CATEGORIES */}
//       <Typography variant="h6">Categories</Typography>
//       <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
//         <TextField
//           fullWidth
//           label="Add Category"
//           value={categoryInput}
//           onChange={(e) => setCategoryInput(e.target.value)}
//           onKeyPress={(e) => e.key === 'Enter' && addCategory()}
//         />
//         <Button variant="contained" startIcon={<AddIcon />} onClick={addCategory}>
//           Add
//         </Button>
//       </Box>
//       {/* Display Category List */}
//       <Box sx={{ mt: 2 }}>
//         {categories.map((cat, index) => (
//           <Chip
//             key={cat.id || index}
//             label={cat.category}
//             onDelete={() => deleteCategory(index)}
//             deleteIcon={<DeleteIcon />}
//             sx={{ m: 0.5 }}
//           />
//         ))}
//       </Box>
//       <Divider sx={{ my: 3 }} />
//       {/* PRODUCT TAGS SECTION */}
//       <Typography variant="h6">Product Tags</Typography>
//       {/* Add New Product Parent */}
//       <Box sx={{ mt: 2, mb: 3 }}>
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={12} md={8}>
//             <TextField
//               fullWidth
//               label="New Product Parent"
//               value={newProductParent}
//               onChange={(e) => setNewProductParent(e.target.value)}
//               placeholder="e.g., Electronics, Clothing, Furniture"
//             />
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <Button
//               fullWidth
//               variant="contained"
//               startIcon={<AddIcon />}
//               onClick={addProductParent}
//               disabled={!newProductParent.trim()}
//             >
//               Add Parent
//             </Button>
//           </Grid>
//         </Grid>
//       </Box>
//       {/* Display Product Parents with Tags */}
//       <Box sx={{ mt: 3 }}>
//         {productTags.length === 0 ? (
//           <Typography variant="body2" color="text.secondary" align="center">
//             No product parents added yet. Add a parent to start adding tags.
//           </Typography>
//         ) : (
//           productTags.map((product, parentIndex) => (
//             <Card key={product.id || parentIndex} sx={{ mb: 3, border: "1px solid #e0e0e0" }}>
//               <CardContent>
//                 {/* Product Parent Header */}
//                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                   {editingProductParentIndex === parentIndex ? (
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1 }}>
//                       <TextField
//                         fullWidth
//                         size="small"
//                         value={editingProductParentValue}
//                         onChange={(e) => setEditingProductParentValue(e.target.value)}
//                         autoFocus
//                       />
//                       <IconButton color="success" onClick={() => saveEditProductParent(parentIndex)}>
//                         <SaveIcon />
//                       </IconButton>
//                       <IconButton color="error" onClick={cancelEditProductParent}>
//                         <CancelIcon />
//                       </IconButton>
//                     </Box>
//                   ) : (
//                     <>
//                       <Typography variant="h6" component="div">
//                         {product.parent}
//                       </Typography>
//                       <Box>
//                         <IconButton
//                           size="small"
//                           onClick={() => startEditProductParent(parentIndex)}
//                           title="Edit Parent"
//                         >
//                           <EditIcon fontSize="small" />
//                         </IconButton>
//                         <IconButton
//                           size="small"
//                           color="error"
//                           onClick={() => deleteProductParent(parentIndex)}
//                           title="Delete Parent"
//                         >
//                           <DeleteIcon fontSize="small" />
//                         </IconButton>
//                       </Box>
//                     </>
//                   )}
//                 </Box>
//                 {/* Add Tag to this Parent */}
//                 <Grid container spacing={2} sx={{ mb: 2 }}>
//                   <Grid item xs={12} md={8}>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       label={`Add tag to ${product.parent}`}
//                       value={newProductTag}
//                       onChange={(e) => setNewProductTag(e.target.value)}
//                       onKeyPress={(e) => {
//                         if (e.key === 'Enter') {
//                           e.preventDefault();
//                           addProductTag(parentIndex);
//                         }
//                       }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={4}>
//                     <Button
//                       fullWidth
//                       variant="outlined"
//                       size="small"
//                       startIcon={<AddIcon />}
//                       onClick={() => addProductTag(parentIndex)}
//                       disabled={!newProductTag.trim()}
//                     >
//                       Add Tag
//                     </Button>
//                   </Grid>
//                 </Grid>
//                 {/* Display Tags for this Parent */}
//                 <Box sx={{ mt: 2 }}>
//                   {product.tags.length === 0 ? (
//                     <Typography variant="body2" color="text.secondary">
//                       No tags added yet. Add tags for this product parent.
//                     </Typography>
//                   ) : (
//                     <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
//                       {product.tags.map((tag, tagIndex) => (
//                         <Chip
//                           key={tag.id || tagIndex}
//                           label={tag.tag}
//                           onDelete={() => deleteProductTag(parentIndex, tagIndex)}
//                           deleteIcon={<DeleteIcon />}
//                           color="primary"
//                           variant="outlined"
//                         />
//                       ))}
//                     </Box>
//                   )}
//                 </Box>
//               </CardContent>
//               <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
//                 <Typography variant="caption" color="text.secondary">
//                   {product.tags.length} tags
//                 </Typography>
//               </CardActions>
//             </Card>
//           ))
//         )}
//       </Box>
//       <Divider sx={{ my: 3 }} />
//       {/* SERVICE TAGS SECTION */}
//       <Typography variant="h6">Service Tags</Typography>
//       {/* Add New Service Parent */}
//       <Box sx={{ mt: 2, mb: 3 }}>
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={12} md={8}>
//             <TextField
//               fullWidth
//               label="New Service Parent"
//               value={newServiceParent}
//               onChange={(e) => setNewServiceParent(e.target.value)}
//               placeholder="e.g., Consulting, Marketing, IT Services"
//             />
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <Button
//               fullWidth
//               variant="contained"
//               startIcon={<AddIcon />}
//               onClick={addServiceParent}
//               disabled={!newServiceParent.trim()}
//             >
//               Add Parent
//             </Button>
//           </Grid>
//         </Grid>
//       </Box>
//       {/* Display Service Parents with Tags */}
//       <Box sx={{ mt: 3 }}>
//         {serviceTags.length === 0 ? (
//           <Typography variant="body2" color="text.secondary" align="center">
//             No service parents added yet. Add a parent to start adding tags.
//           </Typography>
//         ) : (
//           serviceTags.map((service, parentIndex) => (
//             <Card key={service.id || parentIndex} sx={{ mb: 3, border: "1px solid #e0e0e0" }}>
//               <CardContent>
//                 {/* Service Parent Header */}
//                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                   {editingServiceParentIndex === parentIndex ? (
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1 }}>
//                       <TextField
//                         fullWidth
//                         size="small"
//                         value={editingServiceParentValue}
//                         onChange={(e) => setEditingServiceParentValue(e.target.value)}
//                         autoFocus
//                       />
//                       <IconButton color="success" onClick={() => saveEditServiceParent(parentIndex)}>
//                         <SaveIcon />
//                       </IconButton>
//                       <IconBut  ton color="error" onClick={cancelEditServiceParent}>
//                         <CancelIcon />
//                       </IconButton>
//                     </Box>
//                   ) : (
//                     <>
//                       <Typography variant="h6" component="div">
//                         {service.parent}
//                       </Typography>
//                       <Box>
//                         <IconButton
//                           size="small"
//                           onClick={() => startEditServiceParent(parentIndex)}
//                           title="Edit Parent"
//                         >
//                           <EditIcon fontSize="small" />
//                         </IconButton>
//                         <IconButton
//                           size="small"
//                           color="error"
//                           onClick={() => deleteServiceParent(parentIndex)}
//                           title="Delete Parent"
//                         >
//                           <DeleteIcon fontSize="small" />
//                         </IconButton>
//                       </Box>
//                     </>
//                   )}
//                 </Box>
//                 {/* Add Tag to this Parent */}
//                 <Grid container spacing={2} sx={{ mb: 2 }}>
//                   <Grid item xs={12} md={8}>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       label={`Add tag to ${service.parent}`}
//                       value={newServiceTag}
//                       onChange={(e) => setNewServiceTag(e.target.value)}
//                       onKeyPress={(e) => {
//                         if (e.key === 'Enter') {
//                           e.preventDefault();
//                           addServiceTag(parentIndex);
//                         }
//                       }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={4}>
//                     <Button
//                       fullWidth
//                       variant="outlined"
//                       size="small"
//                       startIcon={<AddIcon />}
//                       onClick={() => addServiceTag(parentIndex)}
//                       disabled={!newServiceTag.trim()}
//                     >
//                       Add Tag
//                     </Button>
//                   </Grid>
//                 </Grid>
//                 {/* Display Tags for this Parent */}
//                 <Box sx={{ mt: 2 }}>
//                   {service.tags.length === 0 ? (
//                     <Typography variant="body2" color="text.secondary">
//                       No tags added yet. Add tags for this service parent.
//                     </Typography>
//                   ) : (
//                     <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
//                       {service.tags.map((tag, tagIndex) => (
//                         <Chip
//                           key={tag.id || tagIndex}
//                           label={tag.tag}
//                           onDelete={() => deleteServiceTag(parentIndex, tagIndex)}
//                           deleteIcon={<DeleteIcon />}
//                           color="primary"
//                           variant="outlined"
//                         />
//                       ))}
//                     </Box>
//                   )}
//                 </Box>
//               </CardContent>
//               <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
//                 <Typography variant="caption" color="text.secondary">
//                   {service.tags.length} tags
//                 </Typography>
//               </CardActions>
//             </Card>
//           ))
//         )}
//       </Box>
//       <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
//         <Button variant="outlined" onClick={onClose}>
//           Cancel
//         </Button>
//         <Button variant="contained" color="success" type="submit" size="large">
//           {isEdit ? "Update" : "Save"} Industry Data
//         </Button>
//       </Box>
//     </Paper>
//   );
// };

// export default IndustryForm;

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box, Button, TextField, Typography, Paper, Grid, Divider,
  Chip, IconButton, Card, CardContent, CardActions,MenuItem, Select, InputLabel, FormControl 
} from "@mui/material";
import {
  Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon,
  Save as SaveIcon, Cancel as CancelIcon,
} from "@mui/icons-material";

const IndustryForm = ({ initialData, isEdit, onClose, onSaveSuccess }) => {
  const [heading, setHeading] = useState("");
  const [industry, setIndustry] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [categories, setCategories] = useState([]);

  const [productTags, setProductTags] = useState([]);
  const [newProductParent, setNewProductParent] = useState("");
  // KEY FIX: per-row tag input state (keyed by parent index)
  const [newProductTagMap, setNewProductTagMap] = useState({});
  const [editingProductParentIndex, setEditingProductParentIndex] = useState(null);
  const [editingProductParentValue, setEditingProductParentValue] = useState("");

  const [serviceTags, setServiceTags] = useState([]);
  const [newServiceParent, setNewServiceParent] = useState("");
  // KEY FIX: per-row tag input state (keyed by parent index)
  const [newServiceTagMap, setNewServiceTagMap] = useState({});
  const [editingServiceParentIndex, setEditingServiceParentIndex] = useState(null);
  const [editingServiceParentValue, setEditingServiceParentValue] = useState("");

  // Dropdown options constant (easy to extend later)
const HEADING_OPTIONS = ["Franchise", "Channel Partner"];

  useEffect(() => {
    if (initialData) {
      setHeading(initialData.heading || "");
      setIndustry(initialData.industry || "");
      setCategories(
        (initialData.categories || []).map((c) => ({ id: c.id, category: c.category }))
      );
      setProductTags(
        (initialData.productTags || []).map((p) => ({
          id: p.id,
          parent: p.parent,
          tags: (p.tags || []).map((t) => ({ id: t.id, tag: t.tag })),
        }))
      );
      setServiceTags(
        (initialData.serviceTags || []).map((s) => ({
          id: s.id,
          parent: s.parent,
          tags: (s.tags || []).map((t) => ({ id: t.id, tag: t.tag })),
        }))
      );
    } else {
      setHeading("");
      setIndustry("");
      setCategories([]);
      setProductTags([]);
      setServiceTags([]);
    }
    // Reset per-row maps on data change
    setNewProductTagMap({});
    setNewServiceTagMap({});
  }, [initialData]);

  // ── Categories ───────────────────────────────────────────────────────────────
  const addCategory = () => {
    if (!categoryInput.trim()) return;
    setCategories([...categories, { category: categoryInput.trim() }]);
    setCategoryInput("");
  };

  const deleteCategory = (index) =>
    setCategories(categories.filter((_, i) => i !== index));

  // ── Product tag parents ──────────────────────────────────────────────────────
  const addProductParent = () => {
    if (!newProductParent.trim()) return;
    if (productTags.some((p) => p.parent.toLowerCase() === newProductParent.trim().toLowerCase())) {
      alert("Product parent already exists!");
      return;
    }
    setProductTags([...productTags, { parent: newProductParent.trim(), tags: [] }]);
    setNewProductParent("");
  };

  const deleteProductParent = (index) => {
    setProductTags(productTags.filter((_, i) => i !== index));
    // Clean up the map entry for this index and re-key remaining entries
    setNewProductTagMap((prev) => {
      const updated = {};
      Object.keys(prev).forEach((key) => {
        const k = Number(key);
        if (k < index) updated[k] = prev[key];
        else if (k > index) updated[k - 1] = prev[key];
      });
      return updated;
    });
  };

  const startEditProductParent = (index) => {
    setEditingProductParentIndex(index);
    setEditingProductParentValue(productTags[index].parent);
  };

  const saveEditProductParent = (index) => {
    if (!editingProductParentValue.trim()) return;
    const updated = [...productTags];
    updated[index].parent = editingProductParentValue.trim();
    setProductTags(updated);
    setEditingProductParentIndex(null);
    setEditingProductParentValue("");
  };

  const cancelEditProductParent = () => {
    setEditingProductParentIndex(null);
    setEditingProductParentValue("");
  };

  // ── Product tags ─────────────────────────────────────────────────────────────
  const addProductTag = (parentIndex) => {
    const tagValue = (newProductTagMap[parentIndex] || "").trim();
    if (!tagValue) return;
    const updated = [...productTags];
    if (updated[parentIndex].tags.some((t) => t.tag === tagValue)) {
      alert("Tag already exists!");
      return;
    }
    updated[parentIndex].tags.push({ tag: tagValue });
    setProductTags(updated);
    // Clear only this row's input
    setNewProductTagMap((prev) => ({ ...prev, [parentIndex]: "" }));
  };

  const deleteProductTag = (parentIndex, tagIndex) => {
    const updated = [...productTags];
    updated[parentIndex].tags = updated[parentIndex].tags.filter((_, i) => i !== tagIndex);
    setProductTags(updated);
  };

  // ── Service tag parents ──────────────────────────────────────────────────────
  const addServiceParent = () => {
    if (!newServiceParent.trim()) return;
    if (serviceTags.some((s) => s.parent.toLowerCase() === newServiceParent.trim().toLowerCase())) {
      alert("Service parent already exists!");
      return;
    }
    setServiceTags([...serviceTags, { parent: newServiceParent.trim(), tags: [] }]);
    setNewServiceParent("");
  };

  const deleteServiceParent = (index) => {
    setServiceTags(serviceTags.filter((_, i) => i !== index));
    setNewServiceTagMap((prev) => {
      const updated = {};
      Object.keys(prev).forEach((key) => {
        const k = Number(key);
        if (k < index) updated[k] = prev[key];
        else if (k > index) updated[k - 1] = prev[key];
      });
      return updated;
    });
  };

  const startEditServiceParent = (index) => {
    setEditingServiceParentIndex(index);
    setEditingServiceParentValue(serviceTags[index].parent);
  };

  const saveEditServiceParent = (index) => {
    if (!editingServiceParentValue.trim()) return;
    const updated = [...serviceTags];
    updated[index].parent = editingServiceParentValue.trim();
    setServiceTags(updated);
    setEditingServiceParentIndex(null);
    setEditingServiceParentValue("");
  };

  const cancelEditServiceParent = () => {
    setEditingServiceParentIndex(null);
    setEditingServiceParentValue("");
  };

  // ── Service tags ─────────────────────────────────────────────────────────────
  const addServiceTag = (parentIndex) => {
    const tagValue = (newServiceTagMap[parentIndex] || "").trim();
    if (!tagValue) return;
    const updated = [...serviceTags];
    if (updated[parentIndex].tags.some((t) => t.tag === tagValue)) {
      alert("Tag already exists!");
      return;
    }
    updated[parentIndex].tags.push({ tag: tagValue });
    setServiceTags(updated);
    // Clear only this row's input
    setNewServiceTagMap((prev) => ({ ...prev, [parentIndex]: "" }));
  };

  const deleteServiceTag = (parentIndex, tagIndex) => {
    const updated = [...serviceTags];
    updated[parentIndex].tags = updated[parentIndex].tags.filter((_, i) => i !== tagIndex);
    setServiceTags(updated);
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!industry.trim()) { alert("Industry name is required!"); return; }

    try {
      if (!isEdit) {
        if (!heading.trim()) { alert("Heading is required!"); return; }

        const payload = {
          heading: heading.trim(),
          industry: industry.trim(),
          categories: categories.map((c) => c.category),
          productTags: productTags.map((p) => ({
            parent: p.parent,
            tags: p.tags.map((t) => t.tag),
          })),
          serviceTags: serviceTags.map((s) => ({
            parent: s.parent,
            tags: s.tags.map((t) => t.tag),
          })),
        };

        await axios.post(
          "https://mrfranchisebackend.mrfranchise.in/api/v1/admin/createIndustryManagement",
          payload
        );
        alert("Industry created successfully!");
      } else {
        const originalCategories = initialData.categories || [];
        const originalProductTags = initialData.productTags || [];
        const originalServiceTags = initialData.serviceTags || [];

        const addedCategories = categories.filter((c) => !c.id).map((c) => c.category);
        const removedCategories = originalCategories
          .filter((oc) => !categories.some((c) => c.id === oc.id))
          .map((c) => c.id);

        let addedProductTags = productTags.filter((p) => !p.id).map((p) => ({
          parent: p.parent,
          tags: p.tags.map((t) => t.tag),
        }));
        const renamedProductIds = [];
        productTags.forEach((p) => {
          if (p.id) {
            const orig = originalProductTags.find((o) => o.id === p.id);
            if (orig && orig.parent !== p.parent) {
              renamedProductIds.push(p.id);
              addedProductTags.push({ parent: p.parent, tags: p.tags.map((t) => t.tag) });
            }
          }
        });
        const currentNonRenamedProductIds = productTags
          .filter((p) => p.id && !renamedProductIds.includes(p.id))
          .map((p) => p.id);
        const removedProductParents = originalProductTags
          .filter((op) => !currentNonRenamedProductIds.includes(op.id))
          .map((p) => p.id)
          .concat(renamedProductIds);

        const pushProductTags = [];
        const removedProductTagsObj = [];
        productTags
          .filter((p) => p.id && !renamedProductIds.includes(p.id))
          .forEach((p) => {
            const origParent = originalProductTags.find((op) => op.id === p.id);
            if (origParent) {
              const origTagIds = (origParent.tags || []).map((t) => t.id);
              const currentTagIds = p.tags.filter((t) => t.id).map((t) => t.id);
              const newTags = p.tags.filter((t) => !t.id || !origTagIds.includes(t.id)).map((t) => t.tag);
              if (newTags.length > 0) pushProductTags.push({ id: p.id, tags: newTags });
              const removedTagIds = (origParent.tags || []).filter((ot) => !currentTagIds.includes(ot.id)).map((t) => t.id);
              if (removedTagIds.length > 0) removedProductTagsObj.push({ productId: p.id, ids: removedTagIds });
            }
          });

        let addedServiceTags = serviceTags.filter((s) => !s.id).map((s) => ({
          parent: s.parent,
          tags: s.tags.map((t) => t.tag),
        }));
        const renamedServiceIds = [];
        serviceTags.forEach((s) => {
          if (s.id) {
            const orig = originalServiceTags.find((o) => o.id === s.id);
            if (orig && orig.parent !== s.parent) {
              renamedServiceIds.push(s.id);
              addedServiceTags.push({ parent: s.parent, tags: s.tags.map((t) => t.tag) });
            }
          }
        });
        const currentNonRenamedServiceIds = serviceTags
          .filter((s) => s.id && !renamedServiceIds.includes(s.id))
          .map((s) => s.id);
        const removedServiceParents = originalServiceTags
          .filter((os) => !currentNonRenamedServiceIds.includes(os.id))
          .map((s) => s.id)
          .concat(renamedServiceIds);

        const pushServiceTags = [];
        const removedServiceTagsObj = [];
        serviceTags
          .filter((s) => s.id && !renamedServiceIds.includes(s.id))
          .forEach((s) => {
            const origService = originalServiceTags.find((os) => os.id === s.id);
            if (origService) {
              const origTagIds = (origService.tags || []).map((t) => t.id);
              const currentTagIds = s.tags.filter((t) => t.id).map((t) => t.id);
              const newTags = s.tags.filter((t) => !t.id || !origTagIds.includes(t.id)).map((t) => t.tag);
              if (newTags.length > 0) pushServiceTags.push({ id: s.id, tags: newTags });
              const removedTagIds = (origService.tags || []).filter((ot) => !currentTagIds.includes(ot.id)).map((t) => t.id);
              if (removedTagIds.length > 0) removedServiceTagsObj.push({ serviceId: s.id, ids: removedTagIds });
            }
          });

        const newUpdate = {
          industry: industry.trim(),
          heading: heading.trim(),
          ...(addedCategories.length > 0 && { categories: addedCategories }),
          productTags: {
            ...(addedProductTags.length > 0 && { addProductTags: addedProductTags }),
            ...(pushProductTags.length > 0 && { pushProductTags }),
          },
          serviceTags: {
            ...(addedServiceTags.length > 0 && { addServiceTags: addedServiceTags }),
            ...(pushServiceTags.length > 0 && { pushServiceTags }),
          },
        };

        const remove = {
          ...(removedCategories.length > 0 && { removeCategories: removedCategories }),
          ...((removedProductParents.length > 0 || removedProductTagsObj.length > 0) && {
            removeProductTags: {
              ...(removedProductParents.length > 0 && { products: removedProductParents }),
              ...(removedProductTagsObj.length > 0 && { tags: removedProductTagsObj }),
            },
          }),
          ...((removedServiceParents.length > 0 || removedServiceTagsObj.length > 0) && {
            removeServiceTags: {
              ...(removedServiceParents.length > 0 && { services: removedServiceParents }),
              ...(removedServiceTagsObj.length > 0 && { tags: removedServiceTagsObj }),
            },
          }),
        };

        const payload = {
          newUpdate,
          ...(Object.keys(remove).length > 0 && { remove }),
        };

        await axios.put(
          `https://mrfranchisebackend.mrfranchise.in/api/v1/admin/updateIndustryById/${initialData.uuid}`,
          payload
        );
        alert("Industry updated successfully!");
      }

      onSaveSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert(`Error ${isEdit ? "updating" : "saving"}: ${err.response?.data?.message || err.message}`);
    }
  };

  // ── Tag parent card (reusable renderer) ─────────────────────────────────────
  const renderTagParentCard = ({
    items, editingIndex, editingValue,
    tagMap, onTagMapChange,           // <-- replaced newTagValue with tagMap
    onEditingValueChange,
    onAddParent, onDeleteParent, onStartEdit, onSaveEdit, onCancelEdit,
    onAddTag, onDeleteTag,
    newParentValue, onNewParentValueChange,
    parentLabel,
  }) => (
    <>
      <Box sx={{ mt: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label={`New ${parentLabel} Parent`}
              value={newParentValue}
              onChange={(e) => onNewParentValueChange(e.target.value)}
              placeholder={parentLabel === "Product" ? "e.g., Electronics, Clothing" : "e.g., Consulting, IT Services"}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button fullWidth variant="contained" startIcon={<AddIcon />} onClick={onAddParent} disabled={!newParentValue.trim()}>
              Add Parent
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 3 }}>
        {items.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center">
            No {parentLabel.toLowerCase()} parents added yet.
          </Typography>
        ) : (
          items.map((item, parentIndex) => {
            // Each card reads its own isolated input value from the map
            const currentTagValue = tagMap[parentIndex] || "";

            return (
              <Card key={item.id || parentIndex} sx={{ mb: 3, border: "1px solid #e0e0e0" }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    {editingIndex === parentIndex ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1 }}>
                        <TextField
                          fullWidth size="small" value={editingValue}
                          onChange={(e) => onEditingValueChange(e.target.value)} autoFocus
                        />
                        <IconButton color="success" onClick={() => onSaveEdit(parentIndex)}><SaveIcon /></IconButton>
                        <IconButton color="error" onClick={onCancelEdit}><CancelIcon /></IconButton>
                      </Box>
                    ) : (
                      <>
                        <Typography variant="h6">{item.parent}</Typography>
                        <Box>
                          <IconButton size="small" onClick={() => onStartEdit(parentIndex)}><EditIcon fontSize="small" /></IconButton>
                          <IconButton size="small" color="error" onClick={() => onDeleteParent(parentIndex)}><DeleteIcon fontSize="small" /></IconButton>
                        </Box>
                      </>
                    )}
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={8}>
                      <TextField
                        fullWidth size="small"
                        label={`Add tag to ${item.parent}`}
                        value={currentTagValue}
                        onChange={(e) =>
                          // Update only this row's entry in the map
                          onTagMapChange((prev) => ({ ...prev, [parentIndex]: e.target.value }))
                        }
                        onKeyPress={(e) => {
                          if (e.key === "Enter") { e.preventDefault(); onAddTag(parentIndex); }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Button fullWidth variant="outlined" size="small" startIcon={<AddIcon />}
                        onClick={() => onAddTag(parentIndex)} disabled={!currentTagValue.trim()}>
                        Add Tag
                      </Button>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 2 }}>
                    {item.tags.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">No tags yet.</Typography>
                    ) : (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {item.tags.map((tag, tagIndex) => (
                          <Chip
                            key={tag.id || tagIndex} label={tag.tag}
                            onDelete={() => onDeleteTag(parentIndex, tagIndex)}
                            deleteIcon={<DeleteIcon />} color="primary" variant="outlined"
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
                  <Typography variant="caption" color="text.secondary">{item.tags.length} tags</Typography>
                </CardActions>
              </Card>
            );
          })
        )}
      </Box>
    </>
  );

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <Paper elevation={3} component="form" onSubmit={handleSubmit} sx={{ p: 4, maxWidth: 900, mx: "auto", mt: 3, mb: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {isEdit ? "Edit Industry Data" : "Add Industry Data"}
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }} required={!isEdit}>
  <InputLabel id="heading-label">Heading</InputLabel>
  <Select
    labelId="heading-label"
    value={heading}
    label="Heading"
    onChange={(e) => setHeading(e.target.value)}
  >
    {HEADING_OPTIONS.map((option) => (
      <MenuItem key={option} value={option}>{option}</MenuItem>
    ))}
  </Select>
</FormControl>

      <TextField
        fullWidth label="Industry Name" value={industry}
        onChange={(e) => setIndustry(e.target.value)}
        required sx={{ mb: 3 }}
      />

      <Divider sx={{ my: 2 }} />

      {/* Categories */}
      <Typography variant="h6">Categories</Typography>
      <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
        <TextField
          fullWidth label="Add Category" value={categoryInput}
          onChange={(e) => setCategoryInput(e.target.value)}
          onKeyPress={(e) => { if (e.key === "Enter") { e.preventDefault(); addCategory(); } }}
        />
        <Button variant="contained" startIcon={<AddIcon />} onClick={addCategory}>Add</Button>
      </Box>
      <Box sx={{ mt: 2 }}>
        {categories.map((cat, index) => (
          <Chip
            key={cat.id || index} label={cat.category}
            onDelete={() => deleteCategory(index)}
            deleteIcon={<DeleteIcon />} sx={{ m: 0.5 }}
          />
        ))}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Product Tags */}
      <Typography variant="h6">Product Tags</Typography>
      {renderTagParentCard({
        items: productTags,
        editingIndex: editingProductParentIndex,
        editingValue: editingProductParentValue,
        tagMap: newProductTagMap,
        onTagMapChange: setNewProductTagMap,
        onEditingValueChange: setEditingProductParentValue,
        newParentValue: newProductParent,
        onNewParentValueChange: setNewProductParent,
        onAddParent: addProductParent,
        onDeleteParent: deleteProductParent,
        onStartEdit: startEditProductParent,
        onSaveEdit: saveEditProductParent,
        onCancelEdit: cancelEditProductParent,
        onAddTag: addProductTag,
        onDeleteTag: deleteProductTag,
        parentLabel: "Product",
      })}

      <Divider sx={{ my: 3 }} />

      {/* Service Tags */}
      <Typography variant="h6">Service Tags</Typography>
      {renderTagParentCard({
        items: serviceTags,
        editingIndex: editingServiceParentIndex,
        editingValue: editingServiceParentValue,
        tagMap: newServiceTagMap,
        onTagMapChange: setNewServiceTagMap,
        onEditingValueChange: setEditingServiceParentValue,
        newParentValue: newServiceParent,
        onNewParentValueChange: setNewServiceParent,
        onAddParent: addServiceParent,
        onDeleteParent: deleteServiceParent,
        onStartEdit: startEditServiceParent,
        onSaveEdit: saveEditServiceParent,
        onCancelEdit: cancelEditServiceParent,
        onAddTag: addServiceTag,
        onDeleteTag: deleteServiceTag,
        parentLabel: "Service",
      })}

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="success" type="submit" size="large">
          {isEdit ? "Update" : "Save"} Industry Data
        </Button>
      </Box>
    </Paper>
  );
};

export default IndustryForm;
