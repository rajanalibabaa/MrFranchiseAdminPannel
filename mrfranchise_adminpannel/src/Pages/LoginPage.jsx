import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  InputAdornment,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  CheckCircleOutline,
  Lock
} from '@mui/icons-material';
import InvestorImage from "../assets/Images/LoginRightContent.jpg";
import Logo from "../assets/Images/logo.png"; 

const AdminLogin = () => {
  const [contact, setContact] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9]\d{9}$/;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSendOTP = () => {
    setError('');
    setIsVerified(false);

    if (!contact) {
      setError('Please enter your email or phone number');
      return;
    }

    const isEmail = emailRegex.test(contact);
    const isPhone = phoneRegex.test(contact);

    if (!isEmail && !isPhone) {
      setError('Please enter a valid email or 10-digit Indian phone number');
      return;
    }

    const otpValue = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otpValue);
    setOtpSent(true);

    // console.log(`OTP for ${contact}: ${otpValue}`);
    
    // alert(`OTP sent to ${contact}`);
    alert (`Your OTP is: ${otpValue}`);
  };

  const handleVerify = () => {
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    if (otp === generatedOtp) {
      setIsVerified(true);
      setError('');
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <Box 
      display="flex" 
      height="97vh" 
      bgcolor="#f5f7ff"
      sx={{
        overflow: "hidden",
        backgroundImage: 'radial-gradient(#e0e7ff 1px, transparent 1px)'
      }}
    >
      {/* Left Side - Branding Panel */}
      <Box 
        flex={1} 
        display={{ xs: 'none', md: 'flex' }}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          color: 'white',
          padding: 4,
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: `url(${InvestorImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '200%',
            height: '200%',
            top: '-50%',
            left: '-50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            transform: 'rotate(30deg)',
          }
        }}
      />

      {/* Right Side - Login Form */}
      <Box 
        flex={1} 
        display="flex" 
        justifyContent="center"
        alignItems="center"
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: 500,
            borderRadius: 4,
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.05)',
            overflow: 'visible',
            position: 'relative',
            '&:hover': {
              boxShadow: '0 15px 35px rgba(0,0,0,0.12)',
            },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 2,
            }}
          >
            <img src={Logo} alt="Mr Franchise Logo" style={{ height: 48, width: 'auto' }} loading="lazy" />
          </Box>

          <Box 
            sx={{
              position: 'absolute',
              top: -20,
              left: '50%',
              transform: 'translateX(-50%)',
              bgcolor: "#7ad03a",
              color: 'white',
              borderRadius: '50%',
              width: 80,
              height: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(30, 60, 114, 0.3)',
            }}
          >
            <Lock sx={{ fontSize: 40 }} />
          </Box>

          <CardContent sx={{ pt: 8, px: 4, pb: 4 }}>
            <Typography 
              variant="h5" 
              align="center" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                color: "black",
                mb: 4
              }}
            >
              ADMIN LOGIN
            </Typography>

            {!isVerified ? (
              <>
                <TextField
                  fullWidth
                  margin="normal"
                  label={otpSent ? "Verification Code Sent To" : "Email or Phone"}
                  variant="outlined"
                  value={contact}
                  disabled={otpSent}
                  onChange={(e) => {
                    setContact(e.target.value.trim());
                    setError('');
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: '#e0e0e0',
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    }
                  }}
                />

                {otpSent ? (
                  <>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Enter 6-digit OTP"
                      variant="outlined"
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.trim());
                        setError('');
                      }}
                      inputProps={{ maxLength: 6 }}
                    //   InputProps={{
                    //     startAdornment: (
                    //       <InputAdornment position="start">
                    //         <CheckCircleOutline sx={{ color: theme.palette.primary.main }} />
                    //       </InputAdornment>
                    //     ),
                    //   }}
                      sx={{
                        mt: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />

                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleVerify}
                      sx={{
                        mt: 3,
                        py: 1.5,
                        borderRadius: 2,
                        backgroundColor: "#e99830",
                        fontWeight: 'bold',
                        fontSize: 16,
                        textTransform: 'none',
                        boxShadow: '0 4px 12px rgba(30, 60, 114, 0.2)',
                        '&:hover': {
                          backgroundColor: '#7ad03a',
                          boxShadow: '0 6px 15px rgba(30, 60, 114, 0.3)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Verify & Sign In
                    </Button>
                     {/* Resend OTP Button */}
    <Button
      fullWidth
      variant="text"
      onClick={() => {
        handleSendOTP();
        setOtp('');
      }}
      sx={{
        mt: 2,
        color: "black",
        fontWeight: 'bold',
        textTransform: 'none',
        '&:hover': {
          textDecoration: 'underline',
          backgroundColor: 'transparent',
        }
      }}
    >
      Resend OTP
    </Button>
                  </>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSendOTP}
                    sx={{
                      mt: 3,
                      py: 1.5,
                      borderRadius: 2,
                      backgroundColor: "#e99830",
                      fontWeight: 'bold',
                      fontSize: 16,
                      textTransform: 'none',
                      boxShadow: '0 4px 12px rgba(30, 60, 114, 0.2)',
                      '&:hover': {
                        backgroundColor: '#7ad03a',
                        boxShadow: '0 6px 15px rgba(30, 60, 114, 0.3)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Send Verification Code
                  </Button>
                )}
              </>
            ) : (
              <Box textAlign="center" py={4}>
                <CheckCircleOutline 
                  sx={{ 
                    fontSize: 80, 
                    color: '#4caf50',
                    mb: 2
                  }} 
                />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                  Login Successful!
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, color: '#555' }}>
                  Redirecting to admin dashboard...
                </Typography>
              </Box>
            )}

            {error && (
              <Box 
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" color="error" align="center">
                  {error}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AdminLogin;
