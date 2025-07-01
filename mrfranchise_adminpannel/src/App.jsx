import React from 'react'
import  { Routes, Route} from 'react-router-dom'
import BrandListing from './Components/Brands/GetAllBrands'
import MainPageDashboard from './Pages/MainPageDashboard'
function App() {
  return (
    <>
    <Routes>
      <Route path='/getallbrands' element={<BrandListing/>}></Route>
    <Route path='/' element={<MainPageDashboard/>}/>
    </Routes>
    </>
  )
}

export default App
