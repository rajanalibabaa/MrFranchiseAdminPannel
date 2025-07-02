import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SidebarAdmin from './Components/SidebarAdmin';
import AdminLogin from './Pages/AdminLogin';
import ViewAllBrands from './Components/ViewAll Brands/ViewAllBrands';
import InvestorManage from './Components/ManageInvestor/InvestorManage';
import MainPageDashboard from './Pages/MainPageDashboard';
import InvestorViewPage from './Components/ManageInvestor/InvestorViewDetails';


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AdminLogin/>} />
        <Route path="/sidebar" element={<SidebarAdmin />} />
        <Route path="/viewallbrands" element={<ViewAllBrands />} />
        <Route path="/investormanage" element={<InvestorManage />} />
        <Route path="/dashboard" element={<MainPageDashboard/>}/>
        <Route path="/admin/investors/:uuid" element={<InvestorViewPage />} />
</Routes>
    </>
  )
}

export default App
