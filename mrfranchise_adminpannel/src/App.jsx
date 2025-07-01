import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SidebarAdmin from './Components/SidebarAdmin';
import AdminLogin from './Pages/AdminLogin';
import ViewAllBrands from './Components/ViewAll Brands/ViewAllBrands';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AdminLogin/>} />
        <Route path="/sidebar" element={<SidebarAdmin />} />
        <Route path="/viewallbrands" element={<ViewAllBrands />} />
      </Routes>
    </>
  )
}

export default App
