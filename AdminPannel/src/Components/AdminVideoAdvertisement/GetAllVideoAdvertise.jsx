import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { api } from '../../api/api.jsx';

const GetAllVideoAdvertise = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(api.AdminVideoAdvertisement.getAllVideoAdvertise);
        const videoData = response.data.data;
        console.log(videoData);
        setData(videoData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>All Video Advertisements</h2>
      {data.length === 0 ? (
        <p>No video advertisements found.</p>
      ) : (
        <table border="1" cellPadding="4" cellSpacing="0">
          <thead>
            <tr style={{ backgroundColor: 'green', color: 'white' }}>
              <th>Title</th>
              <th>Description</th>
              <th>Video URL</th>
              <th>Thumbnail URL</th>
              <th>UUID</th>
              <th>ID</th>
              {/* <th>Created At</th>
              <th>Updated At</th> */}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.uuid}>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>
                  <a href={item.videoUrl} target="_blank" rel="noopener noreferrer">
                    {item.videoUrl}
                  </a>
                </td>
                <td>
                  <a href={item.thumbnailUrl} target="_blank" rel="noopener noreferrer">
                    {item.thumbnailUrl}
                  </a>
                </td>
                <td>{item.uuid}</td>
                <td>{item._id}</td>
                {/* <td>{new Date(item.createdAt).toLocaleString()}</td>
                <td>{new Date(item.updatedAt).toLocaleString()}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
  
  
};

export default GetAllVideoAdvertise;
