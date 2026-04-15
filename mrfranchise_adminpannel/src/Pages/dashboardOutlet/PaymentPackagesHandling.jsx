import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import CreatePackagePlan from "../../Components/Brands/AdvertiseCreationHandling/CreatePackagePlan";
import PackagePlansTable from "../../Components/Brands/AdvertiseCreationHandling/PackagePlansTable";

const PaymentPackagesPage = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [range, setRange] = useState(1);
  const [editData, setEditData] = useState(null);
  const [editId, setEditId] = useState(null);

  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh(prev => !prev);
  };

  const handleOpen = () => setOpenCreate(true);

  const handleClose = () => {
    setOpenCreate(false);
    setEditData(null);
    setEditId(null);
  };

  const handleEdit = (plan) => {
    setEditData(plan);
    setEditId(plan._id);
    setOpenCreate(true);
  };

  const options = Array.from({ length: 36 }, (_, i) => i + 1);

  return (
    <Box sx={{ p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        mb={2}
      >
        <Box width={200}>
          <TextField
            select
            fullWidth
            label="State Count"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            size="small"
          >
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                {`${option} States`}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }}>
          Package Plan
        </Typography>

        <Button variant="contained"      sx={{
                              backgroundColor: "#e87619",
                              "&:hover": {
                                backgroundColor: "#cf6b08",
                              },
                            }} onClick={handleOpen}>
          Create Plan
        </Button>
      </Box>

      <Dialog open={openCreate} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          <Typography variant="h6" color="orange">
            {editId ? "Edit Package Plan" : "Create Package Plan"}
          </Typography>

          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", right: 10, top: 10 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <CreatePackagePlan
            onClose={handleClose}
            editData={editData}
            editId={editId}
            onSuccess={handleRefresh}
          />
        </DialogContent>
      </Dialog>

      <PackagePlansTable
        range={range}
        onEdit={handleEdit}
        refresh={refresh}
      />
    </Box>
  );
};

export default PaymentPackagesPage;