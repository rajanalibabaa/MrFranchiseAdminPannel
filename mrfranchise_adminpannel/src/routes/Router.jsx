import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import AdminLogin from "../Pages/AdminLogin";
import ViewAllBrands from "../Components/ViewAllBrands/ViewAllBrands";
import BrandRegisterForm from "../Components/Brands/BrandLIstingRegister/BrandRegisterForm";
import InvestorManage from "../Components/ManageInvestor/InvestorManage";
import MainPageDashboard from "../Pages/dashboardOutlet/MainPageDashboard";
import AllInvestor from "../Components/ManageInvestor/AllInvestor";
import GetAllBrands from "../Components/Brands/GetAllBrands";
import InvestorRegister from "../Components/ManageInvestor/NewInvestorRegister/InvestorRegister";
import EditInvestor from "../Components/ManageInvestor/EditInvestor";
import BrandListingEdit from "../Components/Brands/BrandEdit/BrandListingEdit";
import Bredcrumbs from "../Components/Brands/Bredcrumbs";
import Leads from "../Components/Brands/Leads/Leads";
import MainDashboard from "../Components/Dashboard/MainDashboard";
import InstantApplyLayout from "../Components/Brands/InstantApply/InstantApplyLayout";
import ErrorPage from "../Components/Error/ErrorPage";
import { useDispatch, useSelector } from "react-redux";
import { Logout } from "../Redux/Slices/admin/authSlice";
import FreeLeadPage from "../Pages/LeadsHandling/FreeLeadPage";
import PaymentPackagesPage from "../Pages/dashboardOutlet/PaymentPackagesHandling";
import AllNotificationsPage from "../Components/Dashboard/AllNotigicationPage";
import MembershipPakagesEdit from "../Components/Brands/MembershipPakagesEdit/MembershipPakagesEdit";
import IndustryManagementPage from "../Pages/dashboardOutlet/IndustryManagementPage";

const Router = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const storedTime = localStorage.getItem("autoLogout");
    const currentTime = new Date().getTime();

    if (storedTime && currentTime > storedTime) {
      console.log("currentTime");
      dispatch(Logout());
    }
  }, [dispatch]);
  const { adminData } = useSelector((state) => state.admin);
  return (
    <div>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        {adminData && adminData?.adminData?.uuid && (
          <Route path="/dashboard" element={<MainPageDashboard />}>
            <Route index element={<MainDashboard />} />
            {/* // Manage Brand Routes */}
            <Route path="createbrand" element={<BrandRegisterForm />} />
            <Route path="getallbrands" element={<Bredcrumbs />} />
            <Route path="edit-brand/:uuid" element={<BrandListingEdit />} />
            <Route path="brand-packages/:uuid" element={<MembershipPakagesEdit />} />
            <Route path="notificationpage" element={<AllNotificationsPage />} />
            {/* // leads */}
            <Route path="getallbrands/leads/:id" element={<Leads />} />
            {/* // Instant Apply */}
            <Route path="instantapply" element={<InstantApplyLayout />} />
            <Route path="freeleadlist" element={<FreeLeadPage />} />
            <Route path="packagemanagement" element={<PaymentPackagesPage />} />
            <Route path="industrymanagement" element={<IndustryManagementPage />} />
            {/* // Manage Investor Routes */}
            <Route path="allinvestors" element={<AllInvestor />} />
            <Route path="newinvestors" element={<InvestorRegister />} />
            <Route path="edit-investor/:id" element={<EditInvestor />} />
          </Route>
        )}

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
};

export default Router;
