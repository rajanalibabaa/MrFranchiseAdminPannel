import React, { useState } from "react";
import { Button, Box, Dialog } from "@mui/material";
import IndustryCreateModel from "../../Components/IndustryMangement/IndustryCreatemodel";

const IndustryManagementPage = () => {
  const [openCreateModel, setOpenCreateModel] = useState(false);

  const handleCreate = () => {
    setOpenCreateModel(true);
  };

  return (
    <>
      <Box>
        <Button variant="contained" onClick={handleCreate}>
          Create
        </Button>
      </Box>
      {/* MUI Dialog */}
      <Dialog
        open={openCreateModel}
        onClose={() => setOpenCreateModel(false)}
        fullWidth
        maxWidth="md"
      >
        <IndustryCreateModel onClose={() => setOpenCreateModel(false)} />
      </Dialog>
    </>
  );
};

export default IndustryManagementPage;
