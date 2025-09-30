import React, { useCallback, useRef } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Button,
  TableContainer,
  Paper,
} from "@mui/material";

const InstantApplyTable = ({
  instantApplyList,
  setSelectedItem,
  loadMore,
  hasMore,
  loading,
}) => {
  const observer = useRef();

  const lastRowRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log("Last row reached, loading more...");
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore]
  );

  return (
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: 400, // adjust height as needed
        overflowY: "auto",
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Brand Logo</TableCell>
            <TableCell>Brand Name</TableCell>
            <TableCell>Applicant Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Mobile</TableCell>
            <TableCell>Investment Range</TableCell>
            <TableCell>More Info</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {instantApplyList?.map((item, index) => {
            const isLast = index === instantApplyList.length - 1;
            return (
              <TableRow
                key={item.uuid}
                ref={isLast ? lastRowRef : null} // attach only to last row
              >
                <TableCell>
                  <Avatar
                    src={item.brandLogo}
                    alt={item.brandName}
                    sx={{ width: 56, height: 56 }}
                  />
                </TableCell>
                <TableCell>{item.brandName}</TableCell>
                <TableCell>{item.fullName}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.mobileNumber}</TableCell>
                <TableCell>{item.investmentRange}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      console.log("Clicked row index:", index);
                      setSelectedItem(item);
                    }}
                  >
                    More Info
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InstantApplyTable;
