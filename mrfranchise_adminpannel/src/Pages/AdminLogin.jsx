import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";
import { Lock } from "@mui/icons-material";
import InvestorImage from "../assets/Images/LoginRightContent.jpg";
import Logo from "../assets/Images/logo.png";
import { useNavigate } from "react-router-dom";
import { PostApiWithData } from "../api/default/PostApi";
import { Api } from "../api/apiurl";
import { useDispatch } from "react-redux";
import { Login } from "../Redux/Slices/admin/authSlice";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [contact, setContact] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const dispatch = useDispatch();

  const handleSendOTP = async () => {
    setLoading(true);

    if (!contact.trim()) {
      setOpen(true);
      setSeverity("error");
      setMessage("Please enter your email");
      setLoading(false);
      return;
    }

    try {
      const data = { email: contact.trim() };
      const res = await PostApiWithData(Api.admin.post.login.generateOTP, data);

      if (res?.data?.statuscode === 200) {
        setOtpSent(true);
        setSeverity("success");
      } else {
        setSeverity("error");
      }

      setMessage(res?.data?.message || "Something went wrong");
      setOpen(true);
    } catch (err) {
      console.error(err);
      setMessage("Server error. Please try again later.");
      setSeverity("error");
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!otp.trim()) {
      setOpen(true);
      setSeverity("error");
      setMessage("Please enter the OTP");
      return;
    }
    
    try {
      setLoading(true);
      const data = { email: contact.trim(), verifyOTP: otp.trim() };
      const res = await PostApiWithData(Api.admin.post.login.verifyOTP, data);

      if (res?.data?.statuscode === 200) {
        dispatch(Login(res.data.data));
        setSeverity("success");
        setMessage(res?.data?.message || "Login Successful");
        setOpen(true);
        const now = new Date().getTime();
        const expiryTime = now + 1 * 60 * 1000
        localStorage.setItem("autoLogout", expiryTime);
        navigate("/dashboard");

      } else {
        setSeverity("error");
        setMessage(res?.data?.message || "Verification failed");
        setOpen(true);
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error. Please try again.");
      setSeverity("error");
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <Box
      display="flex"
      height="97vh"
      bgcolor="#f5f7ff"
      sx={{
        overflow: "hidden",
        backgroundImage: "radial-gradient(#e0e7ff 1px, transparent 1px)",
      }}
    >
      <Box
        flex={1}
        display={{ xs: "none", md: "flex" }}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          color: "white",
          padding: 4,
          position: "relative",
          backgroundImage: `url(${InvestorImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            width: "200%",
            height: "200%",
            top: "-50%",
            left: "-50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
            transform: "rotate(30deg)",
          },
        }}
      />

      <Box flex={1} display="flex" justifyContent="center" alignItems="center">
        <Card
          sx={{
            width: "100%",
            maxWidth: 500,
            borderRadius: 4,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            border: "1px solid rgba(0,0,0,0.05)",
            overflow: "visible",
            position: "relative",
          }}
        >
          <Box sx={{ position: "absolute", top: 16, right: 16 }}>
            <img src={Logo} alt="Logo" style={{ height: 48 }} />
          </Box>

          <Box
            sx={{
              position: "absolute",
              top: -20,
              left: "50%",
              transform: "translateX(-50%)",
              bgcolor: "#7ad03a",
              color: "white",
              borderRadius: "50%",
              width: 80,
              height: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(30, 60, 114, 0.3)",
            }}
          >
            <Lock sx={{ fontSize: 40 }} />
          </Box>

          <CardContent sx={{ pt: 8, px: 4, pb: 4 }}>
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              sx={{ fontWeight: "bold", mb: 4 }}
            >
              ADMIN LOGIN
            </Typography>

            <TextField
              fullWidth
              margin="normal"
              label={otpSent ? "Verification Code Sent To" : "Email or Phone"}
              variant="outlined"
              value={contact}
              disabled={otpSent}
              onChange={(e) => setContact(e.target.value)}
            />

            {otpSent ? (
              <>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Enter 6-digit OTP"
                  variant="outlined"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  inputProps={{ maxLength: 6 }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleVerify}
                  sx={{ mt: 3, py: 1.5, borderRadius: 2 }}
                >
                  {loading ? "Loading..." : "Verify & Sign In"}
                </Button>

                <Button
                  fullWidth
                  variant="text"
                  onClick={() => {
                    handleSendOTP();
                    setOtp("");
                  }}
                  sx={{ mt: 2 }}
                >
                  Resend OTP
                </Button>
              </>
            ) : (
              <Button
                fullWidth
                variant="contained"
                onClick={handleSendOTP}
                sx={{ mt: 3, py: 1.5, borderRadius: 2 }}
              >
                {loading ? "Loading..." : "Send Verification Code"}
              </Button>
            )}
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminLogin;
