import React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const TableOutlet = ({ filteredBrands, handleEdit, handleDelete, searchTerm }) => {

  console.log("Rendering TableOutlet with brands:", filteredBrands);
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Logo</TableCell>
            <TableCell>Brand Name</TableCell>
            <TableCell>Category (Sub)</TableCell>
            <TableCell>Investment Range</TableCell>
            <TableCell>Details</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredBrands?.brands?.length > 0 ? (
            filteredBrands?.brands.map((brand) => (
              <TableRow key={brand?.uuid}>
                {/* Logo */}
                <TableCell>
                  {brand.logo ? (
                    <img
                      src={brand?.logo}
                      alt={brand?.brandname}
                      style={{ width: 50, height: 50, objectFit: "contain", borderRadius: 6 }}
                    />
                  ) : (
                    "No logo"
                  )}
                </TableCell>

                {/* Brand Name */}
                <TableCell>{brand?.brandname}</TableCell>

                {/* Category Sub */}
                <TableCell>{brand?.brandCategories?.sub || "N/A"}</TableCell>

                {/* Investment Range */}
                <TableCell>{brand?.fico.investmentRange || "N/A"}</TableCell>

                {/* Details (Area, Model, Video link, etc.) */}
                <TableCell>
                  <div>
                    <button>info</button>
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell>
                  {/* <IconButton color="primary" onClick={() => handleEdit(brand?.uuid)}>
                    <Edit />
                  </IconButton> */}
                  <IconButton color="error" onClick={() => handleDelete(brand?.uuid)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                {searchTerm ? "No matching brands found" : "No brands available"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableOutlet;
