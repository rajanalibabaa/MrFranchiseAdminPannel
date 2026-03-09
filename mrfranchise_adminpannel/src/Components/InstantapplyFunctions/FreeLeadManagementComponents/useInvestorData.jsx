import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Api } from '../../../api/apiurl';
import { DEBOUNCE_DELAY } from './investorConstants';

export const useInvestorData = ({ page, filters }) => {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [filterOptions, setFilterOptions] = useState({
    states: [],
    cities: [],
    districts: [],
    investmentRanges: [],
    planToInvestOptions: [],
    readyToInvestOptions: [],
    mainCategories: [],
    subCategories: [],
    childCategories: [],
    applyByOptions: ['Investor', 'Brand', 'other']
  });
  const [stats, setStats] = useState({});

  const fetchInvestors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('limit', '50');
      queryParams.append('sortBy', 'createdAt');
      queryParams.append('sortOrder', 'desc');

      // Add active filters with optimization
      const activeFilters = Object.entries(filters).filter(
        ([_, value]) => value && value.trim()
      );
      
      activeFilters.forEach(([key, value]) => {
        queryParams.append(key, value.trim());
      });

      const response = await axios.get(
        `${Api.admin.get.instantApply.freeleadS}?${queryParams.toString()}`,
        {
          timeout: 10000, // 10 second timeout
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        const data = response.data.data;
        
        // Process the data to add calculated fields
        const processedData = (data.data || []).map(investor => ({
          ...investor,
          totalBrandsSent: investor.brandsSent ? investor.brandsSent.length : 0,
          emailsSent: investor.brandsSent ? investor.brandsSent.filter(b => b.emailSent).length : 0,
          categoryString: investor.category && investor.category.length > 0 
            ? `${investor.category[0].main} > ${investor.category[0].sub} > ${investor.category[0].child}`
            : 'No category',
          locationString: `${investor.location?.city || ''}, ${investor.location?.district || ''}, ${investor.location?.state || ''}`.replace(/^,\s*|,\s*$/g, '').replace(/,\s*,/g, ',')
        }));

        setInvestors(processedData);
        setTotalPages(data.pagination?.totalPages || 0);
        setTotalCount(data.pagination?.totalCount || 0);
        
        // Extract filter options from the data
        const uniqueStates = [...new Set(processedData.map(inv => inv.location?.state).filter(Boolean))];
        const uniqueCities = [...new Set(processedData.map(inv => inv.location?.city).filter(Boolean))];
        const uniqueDistricts = [...new Set(processedData.map(inv => inv.location?.district).filter(Boolean))];
        const uniqueInvestmentRanges = [...new Set(processedData.map(inv => inv.investmentRange).filter(Boolean))];
        const uniquePlanToInvest = [...new Set(processedData.map(inv => inv.planToInvest).filter(Boolean))];
        const uniqueReadyToInvest = [...new Set(processedData.map(inv => inv.readyToInvest).filter(Boolean))];
        const uniqueMainCategories = [...new Set(processedData.flatMap(inv => inv.category?.map(cat => cat.main) || []).filter(Boolean))];

        setFilterOptions({
          states: uniqueStates.sort(),
          cities: uniqueCities.sort(),
          districts: uniqueDistricts.sort(),
          investmentRanges: uniqueInvestmentRanges.sort(),
          planToInvestOptions: uniquePlanToInvest.sort(),
          readyToInvestOptions: uniqueReadyToInvest.sort(),
          mainCategories: uniqueMainCategories.sort(),
          subCategories: [],
          childCategories: [],
          applyByOptions: ['Investor', 'Brand', 'other']
        });

        // Calculate stats
        const totalBrandsSent = processedData.reduce((sum, inv) => sum + (inv.brandsSent?.length || 0), 0);
        setStats({
          totalBrandsSent,
          averageBrandsPerInvestor: processedData.length > 0 ? (totalBrandsSent / processedData.length).toFixed(2) : 0
        });

      } else {
        throw new Error(response.data.message || 'Failed to fetch investors');
      }
    } catch (error) {
      console.error('Error fetching investors:', error);
      if (error.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else if (error.response?.status === 404) {
        setError('No investors found matching your criteria.');
        setInvestors([]);
      } else if (error.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(error.message || 'Network error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  // Debounced effect for better performance
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchInvestors();
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [fetchInvestors]);

  return {
    investors,
    loading,
    error,
    totalPages,
    totalCount,
    filterOptions,
    stats,
    fetchInvestors,
    setError
  };
};
