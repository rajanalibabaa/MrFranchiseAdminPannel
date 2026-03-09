import React from "react";

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
  Chip,
  Typography,
  Box,
  Collapse,
  IconButton,
} from "@mui/material";
import { useCallback, useRef, useEffect, useState } from "react";

import { ExpandMore, ExpandLess } from "@mui/icons-material";

const InstantApplyTable = ({
  instantApplyList,
  setSelectedItem,
  handlePagination
}) => {
  
  console.log("log of instant apply -", instantApplyList);
  
  const tableContainerRef = useRef(null);
  
  // Change from Set to single brandId for single accordion behavior
  const [expandedBrandId, setExpandedBrandId] = useState(null);

  // Group leads by brandId and calculate counts
  const groupedLeads = useCallback(() => {
    if (!Array.isArray(instantApplyList)) return [];
    
    const grouped = instantApplyList.reduce((acc, item) => {
      const brandId = item.brandId;
      if (!acc[brandId]) {
        acc[brandId] = {
          brandInfo: {
            brandId: item.brandId,
            brandName: item.brandName,
            brandLogo: item.brandLogo,
            brandEmail: item.brandEmail
          },
          leads: [],
          totalCount: 0
        };
      }
      acc[brandId].leads.push(item);
      acc[brandId].totalCount = acc[brandId].leads.length;
      return acc;
    }, {});
    
    return Object.values(grouped);
  }, [instantApplyList]);

  // Modified function for single accordion behavior
  const handleExpandBrand = (brandId) => {
    if (expandedBrandId === brandId) {
      // If clicking on already expanded brand, close it
      setExpandedBrandId(null);
    } else {
      // Open the clicked brand (this will automatically close others)
      setExpandedBrandId(brandId);
    }
  };

  const handleScroll = useCallback(async() => {
    const container = tableContainerRef.current;

    if (container) {
      const { scrollHeight, scrollTop, clientHeight } = container;
      
      if (scrollHeight - scrollTop - clientHeight < 1) {
        const lastIndex = instantApplyList.length - 1;
        console.log("Reached the last index:", lastIndex);
        handlePagination();
      }
    }
  }, [instantApplyList, handlePagination]); 
  
  useEffect(() => {
    const container = tableContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll]);

  const grouped = groupedLeads();

  return (
     <TableContainer
    ref={tableContainerRef}
    component={Paper}
    elevation={3}
    sx={{
      maxHeight: { xs: 300, sm: 400, md: 500 },
      overflowY: "auto",
      overflowX: "auto",
      borderRadius: 2,
      '& .MuiTable-root': {
        minWidth: { xs: 800, sm: 900, md: 1000 }
      }
    }}
  >
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell 
            sx={{ 
              width: { xs: '80px', sm: '100px', md: '120px' },
              fontWeight: 700,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              backgroundColor: '#f8fafc',
              color: '#1e293b',
              borderBottom: '2px solid #e2e8f0',
              padding: { xs: '8px 4px', sm: '16px 8px' }
            }}
          >
            Brand Logo
          </TableCell>
          <TableCell 
            sx={{ 
              width: { xs: '120px', sm: '150px', md: '180px' },
              fontWeight: 700,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              backgroundColor: '#f8fafc',
              color: '#1e293b',
              borderBottom: '2px solid #e2e8f0',
              padding: { xs: '8px 4px', sm: '16px 8px' }
            }}
          >
            Brand Name
          </TableCell>
          <TableCell 
            sx={{ 
              width: { xs: '100px', sm: '120px', md: '140px' },
              fontWeight: 700,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              backgroundColor: '#f8fafc',
              color: '#1e293b',
              borderBottom: '2px solid #e2e8f0',
              padding: { xs: '8px 4px', sm: '16px 8px' },
              textAlign: 'center'
            }}
          >
            Total Leads
          </TableCell>
          <TableCell 
            sx={{ 
              width: { xs: '120px', sm: '140px', md: '160px' },
              fontWeight: 700,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              backgroundColor: '#f8fafc',
              color: '#1e293b',
              borderBottom: '2px solid #e2e8f0',
              padding: { xs: '8px 4px', sm: '16px 8px' }
            }}
          >
            Applicant Name
          </TableCell>
          <TableCell 
            sx={{ 
              width: { xs: '140px', sm: '160px', md: '180px' },
              fontWeight: 700,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              backgroundColor: '#f8fafc',
              color: '#1e293b',
              borderBottom: '2px solid #e2e8f0',
              padding: { xs: '8px 4px', sm: '16px 8px' }
            }}
          >
            Email
          </TableCell>
          <TableCell 
            sx={{ 
              width: { xs: '100px', sm: '120px', md: '140px' },
              fontWeight: 700,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              backgroundColor: '#f8fafc',
              color: '#1e293b',
              borderBottom: '2px solid #e2e8f0',
              padding: { xs: '8px 4px', sm: '16px 8px' }
            }}
          >
            Mobile
          </TableCell>
          <TableCell 
            sx={{ 
              width: { xs: '120px', sm: '140px', md: '160px' },
              fontWeight: 700,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              backgroundColor: '#f8fafc',
              color: '#1e293b',
              borderBottom: '2px solid #e2e8f0',
              padding: { xs: '8px 4px', sm: '16px 8px' }
            }}
          >
            Investment Range
          </TableCell>
          <TableCell 
            sx={{ 
              width: { xs: '100px', sm: '120px', md: '140px' },
              fontWeight: 700,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              backgroundColor: '#f8fafc',
              color: '#1e293b',
              borderBottom: '2px solid #e2e8f0',
              padding: { xs: '8px 4px', sm: '16px 8px' },
              textAlign: 'center'
            }}
          >
            More Info
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {grouped.map((brandGroup) => {
          // Changed to check single brandId instead of Set
          const isExpanded = expandedBrandId === brandGroup.brandInfo.brandId;
          
          return (
            <React.Fragment key={`brand-${brandGroup.brandInfo.brandId}`}>
              {/* Brand Summary Row */}
              <TableRow 
                sx={{ 
                  // Add different background color for expanded brand
                  backgroundColor: isExpanded ? '#e0f2fe' : 'inherit',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: isExpanded ? '#b3e5fc' : '#f5f5f5',
                  }
                }}
                onClick={() => handleExpandBrand(brandGroup.brandInfo.brandId)}
              >
                <TableCell sx={{ padding: { xs: '8px 4px', sm: '16px 8px' } }}>
                  <Avatar
                    src={brandGroup.brandInfo.brandLogo}
                    alt={brandGroup.brandInfo.brandName}
                    sx={{ 
                      width: { xs: 40, sm: 48, md: 56 }, 
                      height: { xs: 40, sm: 48, md: 56 },
                      border: isExpanded ? '3px solid #f35921ff' : '3px solid white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      transition: 'all 0.3s ease'
                    }}
                  />
                </TableCell>
                <TableCell sx={{ padding: { xs: '8px 4px', sm: '16px 8px' } }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 700,
                        color: isExpanded ? '#c01526ff' : 'black',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        transition: 'color 0.3s ease'
                      }}
                    >
                      {brandGroup.brandInfo.brandName}
                    </Typography>
                    <IconButton
                      size="small"
                      sx={{ 
                        color: isExpanded ? '#1565c0' : 'black',
                        backgroundColor: isExpanded ? 'rgba(33, 150, 243, 0.1)' : 'transparent',
                        '&:hover': { 
                          backgroundColor: isExpanded ? 'rgba(33, 150, 243, 0.2)' : 'rgba(0,0,0,0.1)' 
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {isExpanded ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell sx={{ padding: { xs: '8px 4px', sm: '16px 8px' }, textAlign: 'center' }}>
                  <Chip 
                    label={`${brandGroup.totalCount} Lead${brandGroup.totalCount > 1 ? 's' : ''}`}
                    sx={{
                      backgroundColor: isExpanded ? '#2196f3' : 'white',
                      color: isExpanded ? 'white' : '#667eea',
                      fontWeight: 600,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      '&:hover': { 
                        backgroundColor: isExpanded ? '#1976d2' : '#f1f5f9' 
                      },
                      transition: 'all 0.3s ease'
                    }}
                    size={window.innerWidth < 600 ? "small" : "medium"}
                  />
                </TableCell>
                <TableCell 
                  colSpan={5} 
                  sx={{ padding: { xs: '8px 4px', sm: '16px 8px' } }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: isExpanded ? '#1565c0' : 'rgba(0, 0, 0, 0.9)',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      transition: 'color 0.3s ease'
                    }}
                  >
                    Click to {isExpanded ? 'collapse' : 'expand'} and view individual leads
                    {isExpanded && ' (Only one brand can be expanded at a time)'}
                  </Typography>
                </TableCell>
              </TableRow>

              {/* Individual Leads Rows */}
              {brandGroup.leads.map((item, index) => (
                <TableRow 
                  key={item?.uuid}
                  sx={{ 
                    display: isExpanded ? 'table-row' : 'none',
                    backgroundColor: index % 2 === 0 ? '#f8fafc' : '#ffffff',
                    '&:hover': { 
                      backgroundColor: '#e2e8f0',
                      transform: 'translateX(4px)',
                      transition: 'all 0.2s ease'
                    },
                    borderLeft: '4px solid #f34b21ff', // Changed to blue to match theme
                    // Add smooth transition for expand/collapse
                    transition: 'all 0.3s ease',
                  }}
                >
                  <TableCell sx={{ 
                    paddingLeft: { xs: 2, sm: 4 },
                    padding: { xs: '8px 4px', sm: '12px 8px' }
                  }}>
                    <Box 
                      sx={{
                        width: { xs: 16, sm: 20 }, 
                        height: { xs: 16, sm: 20 },
                        backgroundColor: '#2196f3', // Changed to blue
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography 
                        sx={{ 
                          color: 'white', 
                          fontSize: { xs: '0.625rem', sm: '0.75rem' },
                          fontWeight: 600
                        }}
                      >
                        {index + 1}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ 
                    paddingLeft: { xs: 1, sm: 2 },
                    padding: { xs: '8px 4px', sm: '12px 8px' }
                  }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#64748b',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        fontWeight: 500
                      }}
                    >
                      Lead #{index + 1}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ 
                    padding: { xs: '8px 4px', sm: '12px 8px' },
                    textAlign: 'center'
                  }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#000000ff',
                          fontSize: { xs: '0.625rem', sm: '0.75rem' },
                          fontWeight: 500
                        }}
                      >
                      from: {item?.apply?.applyBy}
                      </Typography>
                  </TableCell>
                  <TableCell sx={{ padding: { xs: '8px 4px', sm: '12px 8px' } }}>
                    <Typography sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      fontWeight: 500,
                      color: '#1e293b'
                    }}>
                      {item?.fullName}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ padding: { xs: '8px 4px', sm: '12px 8px' } }}>
                    <Typography sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      color: '#1e293b'
                    }}>
                      {item?.email}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ padding: { xs: '8px 4px', sm: '12px 8px' } }}>
                    <Typography sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      color: '#1e293b'
                    }}>
                      {item?.investorMobileNumber
}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ padding: { xs: '8px 4px', sm: '12px 8px' } }}>
                    <Typography sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      color: '#1e293b'
                    }}>
                      {item?.investmentRange}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ 
                    padding: { xs: '8px 4px', sm: '12px 8px' },
                    textAlign: 'center'
                  }}>
                    <Button
                      variant="contained"
                      size={window.innerWidth < 600 ? "small" : "medium"}
                      onClick={() => {
                        console.log("Clicked row index:", index);
                        setSelectedItem(item);
                      }}
                      sx={{
                        backgroundColor: '#ffb907ff',
                        borderRadius: 2,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: '#f57f17',
                        }
                      }}
                    >
                      More Info
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>
  );
};

export default InstantApplyTable;
