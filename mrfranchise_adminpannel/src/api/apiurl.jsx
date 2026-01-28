
const BASE_URL = "https://mrfranchisebackend.mrfranchise.in/api/v1/admin" 
const BASE_URL_2 = "https://mrfranchisebackend.mrfranchise.in/api/v1" 

export const Api = {
  admin: {
    brand: {
      getNewIncomingBrands: `${BASE_URL}/getNewIncomingBrands`,
      getAllBrands: `${BASE_URL_2}/brandlisting/getAllBrandListing`,
      brandApprove: `${BASE_URL}/brandApprove`,
      getNewIncomingBrandById: `${BASE_URL}/getNewIncomingBrandById`,
      getBrandByID:`${BASE_URL_2}/brandlisting/getBrandById`
    },
    investor:{
      getAllInvestors: `${BASE_URL_2}/investor/getInvestor`,
      createInvestor: `${BASE_URL_2}/investor/createInvestor`,
      updateInvestor: (uuid) => `${BASE_URL_2}/investor/updateInvestor/${uuid}`,
    },
    otp:{
      sendOtpEmail: `${BASE_URL_2}/otpverify/send-otp-email`,
      verifyOtp: `${BASE_URL_2}/otpverify/verify-otp`,
    },


    delete : {
      newIncomingBrand:`${BASE_URL}/deleteNewIncomingBrandById`,
    },

    get:{
      user:{
        usersCount:`${BASE_URL}/userCount`,
      },
      instantApply : {
        data : `${BASE_URL_2}/instantapply/getAllLeads`,
        freeleadS:`${BASE_URL_2}/instantapply/getFreeLeads`,
        dropdown : `${BASE_URL}/instantapply/getInstantApplyDropDownData`,
        filterandsearch : `${BASE_URL}/instantapply/getInstantApplySearchData`,
        emailconfig : `${BASE_URL}/batch-email-config`,
        updateEmailConfig : `${BASE_URL}/batch-email-config`,
      },
      brands:{
        allpauseBrand:`${BASE_URL}/getAllPauseBrand`,
        getallpaidbrands:`${BASE_URL}/getAllPaidBrand`,
        getleadsbybrandid:`${BASE_URL_2}/getleadsbybrandid`,
        
      }
    },

    post : {
      login : {
        generateOTP : `${BASE_URL}/login/generateOTPforAdminLogin`,
        verifyOTP : `${BASE_URL}/login/verifyAdminLoginOTP`,
      },
      logout :`${BASE_URL_2}/logout`,
      brand:{
        pausePlay:`${BASE_URL}/toggleBrandPausePlay`,
        payment:`${BASE_URL}/togglePayment`,
        toggleleadPausedorPlayById:`${BASE_URL}/toggleleadPausedorPlayById`,
        togglePaidBrandLeadpausePlayById:`${BASE_URL}/togglePaidleadPausedandPlayById`,
      },
      industryManagement : {
        create:`${BASE_URL}/createIndustryManagement`,
      }
    }
  },
};
