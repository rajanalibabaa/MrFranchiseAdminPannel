import React from 'react'
import { Table, TableHead, TableRow, TableCell, TableBody, Avatar, Button } from '@mui/material'

const InstantApplyTable = ({ paginatedData, setSelectedItem }) => {
  return (
    <Table>
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
        {paginatedData.map((item) => (
          <TableRow key={item.uuid}>
            <TableCell>
              <Avatar src={item.brandLogo} alt={item.brandName} sx={{ width: 56, height: 56 }} />
            </TableCell>
            <TableCell>{item.brandName}</TableCell>
            <TableCell>{item.fullName}</TableCell>
            <TableCell>{item.email}</TableCell>
            <TableCell>{item.mobileNumber}</TableCell>
            <TableCell>{item.investmentRange}</TableCell>
            <TableCell>
              <Button variant="outlined" size="small" onClick={() => setSelectedItem(item)}>
                More Info
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default InstantApplyTable
