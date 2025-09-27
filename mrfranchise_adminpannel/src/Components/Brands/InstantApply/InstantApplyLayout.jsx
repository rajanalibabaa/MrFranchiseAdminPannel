import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { GetApiCall } from '../../../api/default/GetApi'
import { Api } from '../../../api/apiurl'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TablePagination,
} from '@mui/material'

const InstantApplyLayout = () => {
  const { adminData } = useSelector((state) => state.admin)
  const [instantApplyList, setInstantApplyList] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  useEffect(() => {
    const fetchInstantApply = async () => {
      try {
        if (adminData?.adminData?.uuid && adminData?.adminAccessToken) {
          const res = await GetApiCall(
            `${Api.admin.get.instantApply}/${adminData?.adminData?.uuid}`,
            adminData?.adminAccessToken,
            {}
          )
          setInstantApplyList(res.data?.data?.data || [])
        }
      } catch (error) {
        console.error('Error fetching Instant Apply:', error)
      }
    }

    fetchInstantApply()
  }, [adminData])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const paginatedData = instantApplyList.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  return (
    <>
      <TableContainer component={Paper} sx={{ margin: 2 }}>
        <Typography variant="h6" sx={{ padding: 2 }}>
          Instant Apply List
        </Typography>
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
                    onClick={() => setSelectedItem(item)}
                  >
                    More Info
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={instantApplyList.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      {/* Popup Dialog */}
      <Dialog
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Additional Info</DialogTitle>
        <DialogContent dividers>
          {selectedItem && (
            <Box>
              <Typography>Plan to Invest: {selectedItem.planToInvest}</Typography>
              <Typography>Ready to Invest: {selectedItem.readyToInvest}</Typography>
              <Typography>City: {selectedItem.city || '-'}</Typography>
              <Typography>District: {selectedItem.district}</Typography>
              <Typography>State: {selectedItem.state}</Typography>
              <Typography>Brand Email: {selectedItem.brandEmail}</Typography>
              <Typography>Apply By: {selectedItem.apply?.applyBy}</Typography>
              <Typography>Apply ID: {selectedItem.apply?.applyId}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedItem(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default InstantApplyLayout
