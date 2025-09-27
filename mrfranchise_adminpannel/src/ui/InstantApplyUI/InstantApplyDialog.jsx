import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material'

const InstantApplyDialog = ({ selectedItem, onClose }) => {
  return (
    <Dialog open={!!selectedItem} onClose={onClose} maxWidth="sm" fullWidth>
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
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default InstantApplyDialog
