import React, { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Button,
  Typography,
  Box,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

const SendLeadDialog = ({
  open,
  onClose,
  brands = [],
  selectedLead,
  onSendLead,
}) => {
  const [search, setSearch] =
    useState("");

  const [selectedBrand, setSelectedBrand] =
    useState(null);

  const filteredBrands =
    brands.filter((brand) =>
      brand.brandName
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
        }}
      >
        Send Lead To Brand

        <IconButton
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box mb={2}>
          <Typography
            fontWeight={600}
          >
            Investor:
            {" "}
            {
              selectedLead?.investorName
            }
          </Typography>
        </Box>

        <TextField
          fullWidth
          placeholder="Search Brand Name"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <List
          sx={{
            mt: 2,
            maxHeight: 400,
            overflowY: "auto",
          }}
        >
          {filteredBrands.map(
            (brand) => (
              <ListItemButton
                key={
                  brand._id
                }
                selected={
                  selectedBrand?._id ===
                  brand._id
                }
                onClick={() =>
                  setSelectedBrand(
                    brand
                  )
                }
              >
                <ListItemText
                  primary={
                    brand.brandName
                  }
                  secondary={
                    brand.category
                  }
                />
              </ListItemButton>
            )
          )}
        </List>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          disabled={
            !selectedBrand
          }
          onClick={() =>
            onSendLead(
              selectedLead,
              selectedBrand
            )
          }
        >
          Send Lead
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SendLeadDialog;