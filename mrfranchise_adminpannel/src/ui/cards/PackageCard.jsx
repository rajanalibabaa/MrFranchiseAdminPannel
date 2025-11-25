import { Card, CardContent, Typography, Box } from "@mui/material";

const PackageCard = ({ data, color = "black", background = "#dddddd4e" }) => {
    
  return (
    <Card
      sx={{
        width: 240,
        borderRadius: 1.5,
        boxShadow: 1,
        border: "1px solid #ddd",
        backgroundColor: { background },
        color: { color },
      }}
    >
      <CardContent sx={{ p: 1.5 }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, textTransform: "capitalize", mb: 0.5 }}
        >
          {data.packageType} Package
        </Typography>

        <Box sx={{ fontSize: "11px", lineHeight: 1.4 }}>
          <div>
            <strong>Status:</strong>{" "}
            <span
              style={{
                color: data.isActive ? "#83ed77ff" : "#bb0c0cff",
                fontWeight: 600,
              }}
            >
              {data.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div>
            <strong>Amount:</strong> ₹{data.totalAmount}
          </div>
          <div>
            <strong>Months:</strong> {data.totalMonths}
          </div>
          <div>
            <strong>PM Leads:</strong> {data.perMonthLead}
          </div>
          <div>
            <strong>Total Leads:</strong> {data.totalLeads}
          </div>
          <div>
            <strong>Sent Percentage:</strong> {data.sentLeadsPercentage}
          </div>
          <div>
            <strong>Updated:</strong>
            {new Date(data.packageUpdatedTime).toLocaleDateString()}
          </div>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PackageCard;
