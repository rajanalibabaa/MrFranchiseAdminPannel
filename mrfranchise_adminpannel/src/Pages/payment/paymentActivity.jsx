import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Box,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Pagination,
  Paper,
  Typography,
} from "@mui/material";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import PaymentFilters from "../../Components/payments/PaymentFilters";

import PaymentTable from "../../Components/payments/PaymentTable";

import {
  fetchAllPaymentAnalytics,
  fetchPaymentHistory,
} from "../../Redux/Slices/paymentSlice/paymentActivity";

const PaymentHistoryPage =
  () => {
    const dispatch =
      useDispatch();

    const {
      payments,
      analyticsPayments,
      loading,
      totalPages,
      total,
    } = useSelector(
      (state) =>
        state.paymentHistory
    );

    // ======================================================
    // FILTERS
    // ======================================================

    const [
      filters,
      setFilters,
    ] = useState({
      search: "",
      status: "",
      startDate: "",
      endDate: "",
      page: 1,
    });

    // ======================================================
    // FETCH TABLE DATA
    // ======================================================

    useEffect(() => {
      dispatch(
        fetchPaymentHistory({
          page:
            filters.page,

          limit: 20,

          status:
            filters.status,

          startDate:
            filters.startDate,

          endDate:
            filters.endDate,
        })
      );
    }, [
      dispatch,
      filters.page,
      filters.status,
      filters.startDate,
      filters.endDate,
    ]);

    // ======================================================
    // FETCH OVERALL ANALYTICS
    // ======================================================

    useEffect(() => {
      dispatch(
        fetchAllPaymentAnalytics()
      );
    }, [dispatch]);

    // ======================================================
    // SEARCH FILTER
    // ======================================================

    const filteredPayments =
      useMemo(() => {
        return payments.filter(
          (item) =>
            item.customer?.name
              ?.toLowerCase()
              .includes(
                filters.search.toLowerCase()
              )
        );
      }, [
        payments,
        filters.search,
      ]);

    // ======================================================
    // OVERALL ANALYTICS CALCULATION
    // ======================================================

    const dashboardStats =
      useMemo(() => {
        let totalRevenue = 0;

        let successRevenue = 0;

        let failedRevenue = 0;

        let totalTax = 0;

        let totalBaseAmount = 0;

        let totalFinalAmount = 0;

        let successCount = 0;

        let failedCount = 0;

        analyticsPayments.forEach(
          (item) => {
            totalRevenue +=
              Number(
                item.amount ||
                  0
              );

            totalTax +=
              Number(
                item
                  ?.breakdown
                  ?.tax || 0
              );

            totalBaseAmount +=
              Number(
                item
                  ?.breakdown
                  ?.baseAmount ||
                  0
              );

            totalFinalAmount +=
              Number(
                item
                  ?.breakdown
                  ?.finalAmount ||
                  0
              );

            // ======================================================
            // SUCCESS
            // ======================================================

            if (
              item.paymentSuccess
            ) {
              successCount++;

              successRevenue +=
                Number(
                  item.amount ||
                    0
                );
            }

            // ======================================================
            // FAILED
            // ======================================================

            else {
              failedCount++;

              failedRevenue +=
                Number(
                  item.amount ||
                    0
                );
            }
          }
        );

        return {
          totalRevenue:
            totalRevenue.toFixed(
              2
            ),

          successRevenue:
            successRevenue.toFixed(
              2
            ),

          failedRevenue:
            failedRevenue.toFixed(
              2
            ),

          totalTax:
            totalTax.toFixed(
              2
            ),

          totalBaseAmount:
            totalBaseAmount.toFixed(
              2
            ),

          totalFinalAmount:
            totalFinalAmount.toFixed(
              2
            ),

          successCount,

          failedCount,
        };
      }, [
        analyticsPayments,
      ]);

    // ======================================================
    // CARD COMPONENT
    // ======================================================

    const DashboardCard =
      ({
        title,
        value,
        subtitle,
        color,
      }) => (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            background:
              "#fff",
            border:
              "1px solid #e2e8f0",
            height: "100%",
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            mb={1}
          >
            {title}
          </Typography>

          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              color,
            }}
          >
            {value}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            mt={1}
          >
            {subtitle}
          </Typography>
        </Paper>
      );

    return (
      <Box
        sx={{
          background:
            "#f1f5f9",
          minHeight:
            "100vh",
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          {/* ====================================================== */}
          {/* HEADER */}
          {/* ====================================================== */}

          <Box mb={4}>
            <Typography
              variant="h5"
              fontWeight={600}
            >
              Payment Analytics
            </Typography>

           
          </Box>

          {/* ====================================================== */}
          {/* TOP CARDS */}
          {/* ====================================================== */}

          <Grid
            container
            spacing={1}
            mb={4}
          >
            <Grid
              item
              xs={12}
              md={3}
            >
              <DashboardCard
                title="TOTAL PAYMENTS"
                value={total}
                subtitle="Overall payment count"
                color="#2563eb"
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={3}
            >
              <DashboardCard
                title="TOTAL REVENUE"
                value={`₹${dashboardStats.totalRevenue}`}
                subtitle="Total collected amount"
                color="#059669"
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={3}
            >
              <DashboardCard
                title="SUCCESS PAYMENTS"
                value={
                  dashboardStats.successCount
                }
                subtitle={`₹${dashboardStats.successRevenue}`}
                color="#16a34a"
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={3}
            >
              <DashboardCard
                title="FAILED PAYMENTS"
                value={
                  dashboardStats.failedCount
                }
                subtitle={`₹${dashboardStats.failedRevenue}`}
                color="#dc2626"
              />
            </Grid>
            {/* <Grid
              item
              xs={12}
              md={4}
            >
              <DashboardCard
                title="BASE AMOUNT"
                value={`₹${dashboardStats.totalBaseAmount}`}
                subtitle="Before GST"
                color="#7c3aed"
              />
            </Grid> */}
          </Grid>

          {/* ====================================================== */}
          {/* BREAKDOWN CARDS */}
          {/* ====================================================== */}

          {/* <Grid
            container
            spacing={3}
            mb={4}
          >
            

            <Grid
              item
              xs={12}
              md={4}
            >
              <DashboardCard
                title="TOTAL GST"
                value={`₹${dashboardStats.totalTax}`}
                subtitle="Collected GST"
                color="#ea580c"
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={4}
            >
              <DashboardCard
                title="FINAL AMOUNT"
                value={`₹${dashboardStats.totalFinalAmount}`}
                subtitle="After GST"
                color="#0891b2"
              />
            </Grid>
          </Grid> */}

          {/* ====================================================== */}
          {/* FILTERS */}
          {/* ====================================================== */}

          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 4,
              border:
                "1px solid #e2e8f0",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              mb={2}
            >
              Search & Filters
            </Typography>

            <Divider
              sx={{
                mb: 3,
              }}
            />

            <PaymentFilters
              filters={filters}
              setFilters={
                setFilters
              }
            />
          </Paper>

          {/* ====================================================== */}
          {/* TABLE */}
          {/* ====================================================== */}

          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              overflow:
                "hidden",
              border:
                "1px solid #e2e8f0",
            }}
          >
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="400px"
              >
                <CircularProgress />
              </Box>
            ) : (
              <>
                <PaymentTable
                  payments={
                    filteredPayments
                  }
                />

                <Box
                  display="flex"
                  justifyContent="center"
                  p={3}
                >
                  <Pagination
                    page={
                      filters.page
                    }
                    count={
                      totalPages
                    }
                    color="primary"
                    onChange={(
                      e,
                      value
                    ) =>
                      setFilters({
                        ...filters,
                        page: value,
                      })
                    }
                  />
                </Box>
              </>
            )}
          </Paper>
        </Container>
      </Box>
    );
  };

export default PaymentHistoryPage;