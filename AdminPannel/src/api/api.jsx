const baseURL = "http://localhost:5000";

export const api = {
  investors: {
    getAllInvestor: `${baseURL}/api/v1/admin/getAllInvestors`
  },

  AdminVideoAdvertisement: {
    createVideoAdvertisement: `${baseURL}/api/v1/admin/videoAdvertise/createAdminVideoAdvertise`,
    topOne: `${baseURL}/api/v1/admin/videoAdvertise/postAdminVideoAdvertiseTopOne`,
    topTwo: `${baseURL}/api/v1/admin/videoAdvertise/postAdminVideoAdvertiseTopTwo`,
    topThree: `${baseURL}/api/v1/admin/videoAdvertise/postAdminVideoAdvertiseTopThree`,
    getAllVideoAdvertise: `${baseURL}/api/v1/admin/videoAdvertise/getAdminVideoAdvertise`,
  },

  AdminDashboard: {
    getAllClient: `${baseURL}/api/v1/admin/dashboard/getAdminDashBoardClient`
  }
};
