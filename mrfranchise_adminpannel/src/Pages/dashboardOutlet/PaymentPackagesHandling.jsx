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

  const handleOpen = () => setOpenCreate(true);
  const handleClose = () => setOpenCreate(false);

  const options = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
  ];

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
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  style: {
                    maxHeight: 200, // 👈 control dropdown height
                  },
                },
              },
            }}
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

        <Button variant="contained" onClick={handleOpen}>
          Create Plan
        </Button>
      </Box>

      {/* Create Popup */}
      <Dialog open={openCreate} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          <Typography variant="h6" color="orange" gutterBottom>
            Create Package Plan
          </Typography>

          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", right: 10, top: 10 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <CreatePackagePlan onClose={handleClose} />
        </DialogContent>
      </Dialog>

      <PackagePlansTable range={range} />

      <Box>

      </Box>





    </Box>
  );
};

export default PaymentPackagesPage;
