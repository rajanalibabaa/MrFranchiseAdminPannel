import React from 'react'
import {Route,Routes} from "react-router-dom"
import Main from '../Components/Admin/Main'
import AdminNav from '../Components/Admin/AdminNav'
import GetAllVideoAdvertise from '../Components/AdminVideoAdvertisement/GetAllVideoAdvertise'
import CreateVideoAdvertise from '../Components/AdminVideoAdvertisement/CreateVideoAdvertise'
import TopOne from '../Components/AdminVideoAdvertisement/TopOne'
import TopTwo from '../Components/AdminVideoAdvertisement/TopTwo'
import TopThree from '../Components/AdminVideoAdvertisement/TopThree'
import Dashbord from '../Components/Dashbord/Dashbord'

const Index = () => {
  return (
    <div style={{display:"flex"}}>
      <div>
      <AdminNav />
      </div>
      <div style={{ margin:"10px", width:"100%",alignItems:"center"}}>
      <Routes>
            <Route path="/main" element={ <Main />} />
            <Route path="/getAllVideoAdvertise" element={<GetAllVideoAdvertise />} />

            <Route path="/createVideoAdvertise" element={<CreateVideoAdvertise />} />
            <Route path="/topOneVideoAdvertise" element={<TopOne />} />
            <Route path="/topTwoVideoAdvertise" element={<TopTwo />} />
            <Route path="/topThreeVideoAdvertise" element={<TopThree />} />
            <Route path="/dashboard" element={<Dashbord />} />
        </Routes>
      </div>
    </div>
  )
}

export default Index