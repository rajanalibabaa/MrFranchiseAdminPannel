import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import ManualSubmissionForm from '../../Components/InstantapplyFunctions/InstantapplyManualFunction';
import ExcelUploadForm from '../../Components/InstantapplyFunctions/ExcelUploadInstantApplyForm';

const InstantApplyForm = ({ selectedBrand, onClose }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          centered
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Manual Submission" />
          <Tab label="Bulk Upload (Excel)" />
        </Tabs>

      <Box hidden={tabValue !== 0}>
        <ManualSubmissionForm 
          selectedBrand={selectedBrand} 
          onClose={onClose}
        />
      </Box>

      <Box hidden={tabValue !== 1}>
        <ExcelUploadForm 
          selectedBrand={selectedBrand}
        />
      </Box>
    </Box>
  );
};

export default InstantApplyForm;
