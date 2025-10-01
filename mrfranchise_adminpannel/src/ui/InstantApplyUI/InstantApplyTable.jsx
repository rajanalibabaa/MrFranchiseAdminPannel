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
import { useCallback, useRef, useEffect } from "react"; // Import necessary hooks

const InstantApplyTable = ({
  instantApplyList,
  setSelectedItem,
  handlePagination
}) => {
  
  
  const tableContainerRef = useRef(null);

  const handleScroll = useCallback(async() => {
    const container = tableContainerRef.current;

    if (container) {
      const { scrollHeight, scrollTop, clientHeight } = container;

      
      if (scrollHeight - scrollTop - clientHeight < 1) {
        const lastIndex = instantApplyList.length - 1;
        
        console.log("Reached the last index:", lastIndex);
        handlePagination()

      }
    }
  }, [instantApplyList,handlePagination]); 
  
  useEffect(() => {
    const container = tableContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll]);

  return (
    // Attach the ref to the TableContainer
    <TableContainer
      ref={tableContainerRef}
      component={Paper}
      sx={{
        maxHeight: 400,
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
          {Array.isArray(instantApplyList) && instantApplyList?.map((item, index) => {
            return (
              <TableRow key={item?.uuid}>
                <TableCell>
                  <Avatar
                    src={item?.brandLogo}
                    alt={item?.brandName}
                    sx={{ width: 56, height: 56 }}
                  />
                </TableCell>
                <TableCell>{item?.brandName}</TableCell>
                <TableCell>{item?.fullName}</TableCell>
                <TableCell>{item?.email}</TableCell>
                <TableCell>{item?.mobileNumber}</TableCell>
                <TableCell>{item?.investmentRange}</TableCell>
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