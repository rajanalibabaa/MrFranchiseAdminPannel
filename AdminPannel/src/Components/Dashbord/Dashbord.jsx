import React, { useEffect } from 'react'
import axios from 'axios';
import { api } from '../../api/api.jsx'

const Dashbord = () => {

    const [data, setData] = React.useState([]);

    

    useEffect( () => {
        const fetchData = async () => {
            
           const data = await axios.get(api.AdminDashboard.getAllClient)

            // console.log(data.data.data.length);
            setData(data.data.data)
            // if (data.data.data.length > 0) {
            // console.log("Data fetched successfully:", data.data.data);
            // };
          

        };
        fetchData();
        
    }, []);

    
  return (
    <div>
        <h2 style={{textAlign:"center", fontSize:"30px", fontWeight:"bold"}}>
        Dashbord
        </h2>
        {data.length > 0 ? (
           <div
           style={{
             display: 'flex',
             flexWrap: 'wrap',
             justifyContent: 'center',
             alignItems: 'center',
             gap: '5px',
           }}
         >
           {data.map((item, index) => (
             <div
               key={index}
               style={{
                 margin: '10px',
                 padding: '15px',
                 borderRadius: '8px',
                 backgroundColor: 'red',
                 height: '100px',
                 width: '200px',
                 boxShadow: '10px 10px 8px rgba(22, 15, 15, 0.1)',
                 color: '#fff',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 fontWeight: 'bold',
               }}
             >
               {/* 👇 Centered vertical layout inside card */}
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                 <div style={{ marginBottom: '5px' }}>
                   <label>Label : </label>
                   <span>{item.label}</span>
                 </div>
                 <div>
                   <label>Count : </label>
                   <span>{item.count}</span>
                 </div>
               </div>
             </div>
           ))}
         </div>
         
          
              
        ) : (
            <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                <h2>Loading...</h2>
            </div>
        )}
    </div>
  )
}

export default Dashbord