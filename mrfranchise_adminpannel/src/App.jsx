import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SidebarAdmin from './Components/SidebarAdmin';
import AdminLogin from './Pages/LoginPAge';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AdminLogin/>} />
        <Route path="/sidebar" element={<SidebarAdmin />} />
      </Routes>
    </>
  )
}

export default App
