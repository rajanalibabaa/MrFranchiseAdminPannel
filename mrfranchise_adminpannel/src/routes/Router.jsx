import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminLogin from '../Pages/AdminLogin'
import ViewAllBrands from '../Components/ViewAllBrands/ViewAllBrands'
import BrandRegisterForm from '../Components/Brands/BrandLIstingRegister/BrandRegisterForm';
import InvestorManage from '../Components/ManageInvestor/InvestorManage';
import MainPageDashboard from '../Pages/dashboardOutlet/MainPageDashboard'
import NewInvestor from '../Components/ManageInvestor/NewInvestor';
import AllInvestor from '../Components/ManageInvestor/AllInvestor';

const Router = () => {
  return (
    <div>
        <Routes>
          <Route path="/" element={<AdminLogin/>} />
          <Route path="/dashboard" element={<MainPageDashboard />}>
            <Route index element={<ViewAllBrands />} />

            // Manage Brand Routes
            <Route path="createbrand" element={<BrandRegisterForm />} />
            <Route path="viewallbrands" element={<InvestorManage />} />


            // Manage Investor Routes
            <Route path="allinvestors" element={<AllInvestor />} />
            <Route path="newinvestors" element={<NewInvestor />} />
          </Route>
        </Routes>
    </div>
  )
}

export default Router;