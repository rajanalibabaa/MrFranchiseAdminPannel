// ======================================================
// src/components/payment/PaymentTable.jsx
// ======================================================

import React from "react";

import dayjs from "dayjs";

import {
  Avatar,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const PaymentTable = ({
  payments,
}) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow
            sx={{
              background:
                "#f8fafc",
            }}
          >
            <TableCell>
              Customer
            </TableCell>

            <TableCell>
              Order ID
            </TableCell>

            <TableCell>
              Payment Method
            </TableCell>

            <TableCell>
              Base Amount
            </TableCell>

            <TableCell>
              GST
            </TableCell>

            <TableCell>
              Final Amount
            </TableCell>

            <TableCell>
              Status
            </TableCell>

            <TableCell>
              Created Date
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {payments?.map(
            (item) => (
              <TableRow
                key={item._id}
                hover
              >
                <TableCell>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <Avatar>
                      {item.customer?.name?.charAt(
                        0
                      )}
                    </Avatar>

                    <Box>
                      <Typography fontWeight={700}>
                        {
                          item
                            .customer
                            ?.name
                        }
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {
                          item
                            .customer
                            ?.email
                        }
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {
                          item
                            .customer
                            ?.brandID
                        }
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  {
                    item.orderId
                  }
                </TableCell>

                <TableCell>
                  <Chip
                    label={
                      item
                        ?.paymentMethod
                        ?.type ||
                      "N/A"
                    }
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>

                <TableCell>
                  ₹
                  {
                    item
                      .breakdown
                      ?.baseAmount
                  }
                </TableCell>

                <TableCell>
                  ₹
                  {
                    item
                      .breakdown
                      ?.tax
                  }
                </TableCell>

                <TableCell>
                  <Typography fontWeight={700}>
                    ₹
                    {
                      item
                        .breakdown
                        ?.finalAmount
                    }
                  </Typography>
                </TableCell>

                <TableCell>
                  <Chip
                    label={
                      item.paymentSuccess
                        ? "SUCCESS"
                        : "FAILED"
                    }
                    color={
                      item.paymentSuccess
                        ? "success"
                        : "error"
                    }
                  />
                </TableCell>

                <TableCell>
                  {dayjs(
                    item.createdAt
                  ).format(
                    "DD MMM YYYY • hh:mm A"
                  )}
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PaymentTable;
