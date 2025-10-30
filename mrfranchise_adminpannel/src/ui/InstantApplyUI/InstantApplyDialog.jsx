import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material'

const InstantApplyDialog = ({ selectedItem, onClose }) => {

  console.log("incoming dilog box data",selectedItem);
  
  return (
    <Dialog open={!!selectedItem} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle color='warning'>Additional Info</DialogTitle>
      <DialogContent dividers>
        {selectedItem && (
          <Box>
            
            <Typography>Investor Name : {selectedItem?.fullName}</Typography>
            <Typography>Investor Mobile Number :{selectedItem?.mobileNumber}</Typography>
            <Typography>Investor Email : {selectedItem?.email}</Typography>
            <Typography>Plan to Invest: {selectedItem?.planToInvest}</Typography>
            <Typography>Ready to Invest: {selectedItem?.readyToInvest}</Typography>
                        <Typography>State: {selectedItem?.state}</Typography>
            <Typography>District: {selectedItem?.district}</Typography>

            <Typography>City: {selectedItem?.city || '-'}</Typography>
            <Typography>Brand Email: {selectedItem?.brandEmail}</Typography>
            <Typography>Apply By: {selectedItem?.apply?.applyBy}</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='error'>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default InstantApplyDialog
