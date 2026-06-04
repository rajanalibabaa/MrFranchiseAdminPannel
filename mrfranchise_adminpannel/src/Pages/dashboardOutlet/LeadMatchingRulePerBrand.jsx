"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  Box,
  Typography,
  Button,
  Checkbox,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";

const LeadMatchingRulePerBrand = () => {
  const [loading, setLoading] =
    useState(false);

  const [updateLoading, setUpdateLoading] =
    useState(false);

  const [rules, setRules] = useState([]);

  const [brandName, setBrandName] =
  useState("");

  const [tabs, setTabs] = useState([]);

  const [activeTab, setActiveTab] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  /* =====================================================
     GET API
  ===================================================== */
  const brandId = "80469c64-efe0-4ef1-891c-86c033f46d91";

  const fetchLeadMatch = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `http://localhost:5000/api/v1/leadMatchingRulePerBrand/get/${brandId}`,
      );

const data = response?.data?.data;

setBrandName(data?.brandName || "");

const allRules = data?.rules || [];

      setRules(allRules);

      /* =====================================================
         UNIQUE PACKAGE TYPES
      ===================================================== */

      const uniqueTabs = [
        ...new Set(
          allRules.flatMap((rule) =>
            rule.packagePlans.map(
              (pkg) => pkg.packageType,
            ),
          ),
        ),
      ];

      /* =====================================================
         TAB ORDER
      ===================================================== */

      const tabOrder = [
        "Lead",
        "Listing",
        "Free",
      ];

      uniqueTabs.sort(
        (a, b) =>
          tabOrder.indexOf(a) -
          tabOrder.indexOf(b),
      );

      setTabs(uniqueTabs);

      if (uniqueTabs.length > 0) {
        setActiveTab(uniqueTabs[0]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadMatch();
  }, []);

  /* =====================================================
     GET CURRENT PACKAGE
  ===================================================== */

  const getCurrentPackage = (
    packagePlans,
  ) => {
    return packagePlans.find(
      (pkg) =>
        pkg.packageType === activeTab,
    );
  };

  /* =====================================================
     CHECKBOX CHANGE
  ===================================================== */

  const handleCheckboxChange = (
    ruleId,
    checked,
  ) => {
    const updatedRules = rules.map(
      (rule) => {
        if (rule._id === ruleId) {
          return {
            ...rule,

            packagePlans:
              rule.packagePlans.map((pkg) => {
                if (
                  pkg.packageType ===
                  activeTab
                ) {
                  return {
                    ...pkg,

                    isActive: checked,
                  };
                }

                return pkg;
              }),
          };
        }

        return rule;
      },
    );

    setRules(updatedRules);
  };

  /* =====================================================
     UPDATE API
  ===================================================== */

  const handleUpdate = async () => {
    try {
      setUpdateLoading(true);

      const selectedMatchTypes = rules
        .filter((rule) => {
          const currentPackage =
            getCurrentPackage(
              rule.packagePlans,
            );

          return (
            currentPackage?.isActive ===
            true
          );
        })

        /* =====================================================
           ONLY PRIORITY SORT
        ===================================================== */

        .sort((a, b) => {
          const priorityA =
            getCurrentPackage(
              a.packagePlans,
            )?.priority || 9999;

          const priorityB =
            getCurrentPackage(
              b.packagePlans,
            )?.priority || 9999;

          return priorityA - priorityB;
        })

        .map((rule) => {
          const currentPackage =
            getCurrentPackage(
              rule.packagePlans,
            );

          return {
            matchType:
              rule.matchType,

            priority:
              currentPackage?.priority ||
              0,
          };
        });

      await axios.put(
        `http://localhost:5000/api/v1/leadMatchingRulePerBrand/update/${brandId}`,
        {
          packageType: activeTab,

          selectedMatchTypes,
        },
      );

      setSuccessMessage(
        "Updated Successfully",
      );

      fetchLeadMatch();
    } catch (error) {
      console.log(error);
    } finally {
      setUpdateLoading(false);
    }
  };

  /* =====================================================
     ONLY PRIORITY WISE SORT
     PRIORITY 1 = FIRST CARD
  ===================================================== */

  const sortedRules = useMemo(() => {
    return [...rules].sort((a, b) => {
      const priorityA =
        getCurrentPackage(
          a.packagePlans,
        )?.priority || 9999;

      const priorityB =
        getCurrentPackage(
          b.packagePlans,
        )?.priority || 9999;

      return priorityA - priorityB;
    });
  }, [rules, activeTab]);

  return (
    <Box
      sx={{
        p: 1.5,
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          mb: 2,
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#222",
          }}
        >
          Lead Matching Rules Per Brand
        </Typography>


  <Typography
    sx={{
      fontSize: "13px",
      fontWeight: 600,
      color: "#f59e0b",
      mt: 0.3,
    }}
  >
    {brandName}
  </Typography>

        <Button
          variant="contained"
          color="success"
          onClick={handleUpdate}
          disabled={updateLoading}
          size="small"
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 700,
            px: 2,
            fontSize: "12px",
          }}
        >
          {updateLoading
            ? "Updating..."
            : "Update"}
        </Button>
      </Box>

      {/* =====================================================
          PACKAGE TABS
      ===================================================== */}

      <Box
        sx={{
          display: "flex",
          gap: 1,
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        {tabs.map((tab) => (
          <Button
            key={tab}
            size="small"
            variant={
              activeTab === tab
                ? "contained"
                : "outlined"
            }
            onClick={() =>
              setActiveTab(tab)
            }
            sx={{
              minWidth: "75px",

              borderRadius: "8px",

              textTransform: "none",

              fontSize: "11px",

              fontWeight: 700,

              backgroundColor:
                activeTab === tab
                  ? "#f59e0b"
                  : "#fff",

              color:
                activeTab === tab
                  ? "#fff"
                  : "#f59e0b",

              borderColor: "#f59e0b",

              py: 0.5,

              "&:hover": {
                backgroundColor:
                  activeTab === tab
                    ? "#d97706"
                    : "#fff7ed",

                borderColor: "#d97706",
              },
            }}
          >
            {tab}
          </Button>
        ))}
      </Box>

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent:
              "center",
            mt: 5,
          }}
        >
          <CircularProgress size={28} />
        </Box>
      )}

      {/* =====================================================
          SMALL SINGLE LINE CARDS
      ===================================================== */}

      {!loading &&
        sortedRules.map(
          (rule, index) => {
            const currentPackage =
              getCurrentPackage(
                rule.packagePlans,
              );

            return (
              <Paper
                key={rule._id}
                elevation={0}
                sx={{
                  p: 1,
                  mb: 1,

                  borderRadius: "10px",

                  display: "flex",

                  alignItems: "center",

                  justifyContent:
                    "space-between",

                  border:
                    "1px solid #e5e7eb",

                  background:
                    currentPackage?.isActive
                      ? "#f0fdf4"
                      : "#ffffff",
                }}
              >
                {/* LEFT */}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flex: 1,
                    overflow: "hidden",
                  }}
                >
                  {/* PRIORITY */}

                  <Chip
                    label={`P${currentPackage?.priority || 0}`}
                    size="small"
                    color="warning"
                    sx={{
                      height: "22px",

                      "& .MuiChip-label":
                        {
                          px: 1,
                          fontSize: "10px",
                          fontWeight: 700,
                        },
                    }}
                  />

                  {/* ORDER */}

                  <Typography
                    sx={{
                      fontSize: "10px",
                      color: "#777",
                      minWidth: "24px",
                    }}
                  >
                    #{index + 1}
                  </Typography>

                  {/* MATCH TYPE */}

                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#222",

                      overflow: "hidden",

                      textOverflow:
                        "ellipsis",

                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {rule.matchType}
                  </Typography>
                </Box>

                {/* RIGHT */}

                <Checkbox
                  size="small"
                  checked={
                    currentPackage?.isActive ===
                    true
                  }
                  onChange={(e) =>
                    handleCheckboxChange(
                      rule._id,
                      e.target.checked,
                    )
                  }
                />
              </Paper>
            );
          },
        )}

      {/* =====================================================
          SUCCESS MESSAGE
      ===================================================== */}

      <Snackbar
        open={successMessage !== ""}
        autoHideDuration={3000}
        onClose={() =>
          setSuccessMessage("")
        }
      >
        <Alert
          severity="success"
          variant="filled"
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LeadMatchingRulePerBrand;  