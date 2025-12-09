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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IndustryCreateModel from "../../Components/IndustryMangement/IndustryCreatemodel";

const IndustryManagementPage = () => {
  const [openCreateModel, setOpenCreateModel] = useState(false);
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          "http://localhost:5000/api/v1/admin/getAllIndustry"
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

    fetchIndustries();
  }, []);

  const handleCreate = () => {
    setOpenCreateModel(true);
  };

  const handleCloseCreate = () => {
    setOpenCreateModel(false);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <Typography variant="body1">Loading industries...</Typography>
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
                key={item._id || index}
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

                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                    >
                      Delete
                    </Button>
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
                        <ListItem key={catIndex} disablePadding>
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
                      <Box key={ptIndex} sx={{ mb: 2 }}>
                        {/* Parent as subtitle1 */}
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          sx={{ fontWeight: "bold" }}
                        >
                          {pt.parent}
                        </Typography>
                        {/* Tags as point-wise p tags in list */}
                        {pt.tags && pt.tags.length > 0 ? (
                          <List disablePadding>
                            {pt.tags.map((t, tIndex) => (
                              <ListItem
                                key={tIndex}
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

                  {/* Service Tags - Same structure as Product Tags */}
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold", color: "#eca310ff" }}
                  >
                    Service Tags
                  </Typography>
                  {item.serviceTags && item.serviceTags.length > 0 ? (
                    item.serviceTags.map((st, stIndex) => (
                      <Box key={stIndex} sx={{ mb: 2 }}>
                        {/* Parent as subtitle1 for consistency */}
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          sx={{ fontWeight: "bold" }}
                        >
                          {st.parent}
                        </Typography>
                        {/* Tags as point-wise p tags in list */}
                        {st.tags && st.tags.length > 0 ? (
                          <List disablePadding>
                            {st.tags.map((tag, tagIndex) => (
                              <ListItem
                                key={tagIndex}
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

      {/* MUI Dialog */}
      <Dialog
        open={openCreateModel}
        onClose={handleCloseCreate}
        fullWidth
        maxWidth="md"
        aria-labelledby="industry-create-dialog"
      >
        <IndustryCreateModel onClose={handleCloseCreate} />
      </Dialog>
    </>
  );
};

export default IndustryManagementPage;
