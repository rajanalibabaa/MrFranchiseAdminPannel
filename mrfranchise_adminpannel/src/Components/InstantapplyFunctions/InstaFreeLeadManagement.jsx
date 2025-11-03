import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import { useInvestorData } from './FreeLeadManagementComponents/useInvestorData';
import StatisticsCards from './FreeLeadManagementComponents/StatisticsCards';
import FilterSection from './FreeLeadManagementComponents/FilterSection';
import InvestorTable from './FreeLeadManagementComponents/InvestorTable';
import PaginationComponent from './FreeLeadManagementComponents/PaginationComponent';
import InvestorDetailsDialog from './FreeLeadManagementComponents/InvestorDetailsDialog';
import { INITIAL_FILTERS } from './FreeLeadManagementComponents/investorConstants';

const InvestorManagement = () => {
  // State management
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});

  // Custom hook for data management
  const {
    investors,
    loading,
    error,
    totalPages,
    totalCount,
    filterOptions,
    stats,
    setError
  } = useInvestorData({ page, filters });

  // Memoized values
  const activeFiltersCount = useMemo(() => 
    Object.values(filters).filter(filter => filter && filter.trim()).length,
    [filters]
  );

  // Debounced filter change handler
  const handleFilterChange = useCallback((filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setPage(1);
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setPage(1);
  }, []);

  // Handle row expansion with performance optimization
  const toggleRowExpansion = useCallback((investorId) => {
    setExpandedRows(prev => ({
      ...prev,
      [investorId]: !prev[investorId]
    }));
  }, []);

  // Handle view investor details
  const handleViewInvestor = useCallback((investor) => {
    setSelectedInvestor(investor);
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setSelectedInvestor(null);
  }, []);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Box sx={{ p: 3, maxWidth: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <Typography 
        variant="h4" 
        gutterBottom 
        color="primary" 
        sx={{ 
          fontWeight: 'bold',
          textAlign: 'center',
          mb: 4
        }}
      >
        Free Leads Management System
      </Typography>

      {/* Statistics Cards */}
      <StatisticsCards
        totalCount={totalCount}
        stats={stats}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Filter Section */}
      <FilterSection
        filters={filters}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        loading={loading}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2, borderRadius: 2 }} 
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          my: 6,
          flexDirection: 'column',
          gap: 2
        }}>
          <CircularProgress size={40} />
          <Typography color="text.secondary">Loading investors...</Typography>
        </Box>
      )}

      {/* Investors Table */}
      {!loading && (
        <InvestorTable
          investors={investors}
          expandedRows={expandedRows}
          onToggleExpansion={toggleRowExpansion}
          onViewInvestor={handleViewInvestor}
          activeFiltersCount={activeFiltersCount}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <PaginationComponent
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Investor Details Dialog */}
      <InvestorDetailsDialog
        open={dialogOpen}
        investor={selectedInvestor}
        onClose={handleCloseDialog}
      />
    </Box>
  );
};

export default InvestorManagement;
