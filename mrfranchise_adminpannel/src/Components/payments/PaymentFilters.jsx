
import React from "react";

import {
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";

const PaymentFilters = ({
  filters,
  setFilters,
}) => {
  return (
    <Grid
      container
      spacing={3}
    >
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Search Brand Name"
          placeholder="Search by customer or brand"
          value={filters.search}
          onChange={(e) =>
            setFilters({
              ...filters,
              search:
                e.target.value,
            })
          }
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <TextField
          select
          fullWidth
          sx={{ textTransform: "capitalize",minWidth: 250
           }}

          label="Payment Status"
          value={
            filters.status
          }
          onChange={(e) =>
            setFilters({
              ...filters,
              status:
                e.target.value,
            })
          }
        >
          <MenuItem value="">
            All Status
          </MenuItem>

          <MenuItem value="captured">
            Success
          </MenuItem>

          <MenuItem value="failed">
            Failed
          </MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} md={2.5}>
        <TextField
          fullWidth
          type="date"
          label="Start Date"
          InputLabelProps={{
            shrink: true,
          }}
          value={
            filters.startDate
          }
          onChange={(e) =>
            setFilters({
              ...filters,
              startDate:
                e.target.value,
            })
          }
        />
      </Grid>

      <Grid item xs={12} md={2.5}>
        <TextField
          fullWidth
          type="date"
          label="End Date"
          InputLabelProps={{
            shrink: true,
          }}
          value={
            filters.endDate
          }
          onChange={(e) =>
            setFilters({
              ...filters,
              endDate:
                e.target.value,
            })
          }
        />
      </Grid>
    </Grid>
  );
};

export default PaymentFilters;