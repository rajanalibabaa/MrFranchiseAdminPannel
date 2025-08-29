import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminLogin from '../Pages/AdminLogin'
import ViewAllBrands from '../Components/ViewAllBrands/ViewAllBrands'
import BrandRegisterForm from '../Components/Brands/BrandLIstingRegister/BrandRegisterForm';
import InvestorManage from '../Components/ManageInvestor/InvestorManage';
import MainPageDashboard from '../Pages/dashboardOutlet/MainPageDashboard'
import AllInvestor from '../Components/ManageInvestor/AllInvestor';
import GetAllBrands from '../Components/Brands/GetAllBrands';
import InvestorRegister from '../Components/ManageInvestor/NewInvestorRegister/InvestorRegister';
import EditInvestor from '../Components/ManageInvestor/EditInvestor';

const Router = () => {
  return (
    <div>
        <Routes>
          <Route path="/" element={<AdminLogin/>} />
          <Route path="/dashboard" element={<MainPageDashboard />}>
            <Route index element={<ViewAllBrands />} />

            // Manage Brand Routes
            <Route path="createbrand" element={<BrandRegisterForm />} />
            <Route path="getallbrands" element={<GetAllBrands />} />


            // Manage Investor Routes
            <Route path="allinvestors" element={<AllInvestor />} />
            <Route path="newinvestors" element={<InvestorRegister />} />

<Route path="edit-investor/:id" element={<EditInvestor />} />
          </Route>
        </Routes>
    </div>
  )
}

export default Router;