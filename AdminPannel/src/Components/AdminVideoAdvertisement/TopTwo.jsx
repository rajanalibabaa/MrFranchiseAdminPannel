import React, { useState } from 'react';
import axios from 'axios';
import { api } from '../../api/api';


const TopTwo = () => {
  const [videos, setVideos] = useState(['', '']);
  const [massage, setMessage] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();

    const videoIds = videos

    console.log('Video IDs to be sent:', videoIds);

    const response = await axios.post(api.AdminVideoAdvertisement.topTwo, {videoIds}, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response from server:', response);

    if (response.status === 200) {
      setMessage(true);
      setTimeout(() => {
        setMessage(false);
      }, 3000); // Hide message after 3 seconds
    }
    setVideos(['', '']); 
  };

  const handleChange = (index, value) => {
    const updatedVideos = [...videos];
    updatedVideos[index] = value;
    setVideos(updatedVideos);
  };

  return (
    <div>
      <h2>Assign Top Two Video Advertisements</h2>
      <form onSubmit={handleSubmit}>
        <label>Enter Video IDs:</label>
        {videos.map((id, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder={`Video ID #${index + 1}`}
              value={id}
              onChange={(e) => handleChange(index, e.target.value)}
              required
            />
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>

      {massage && <p style={{ color: 'green' }}>Top Two Video Advertisements Assigned Successfully!</p>}
    </div>
  );
};

export default TopTwo;
