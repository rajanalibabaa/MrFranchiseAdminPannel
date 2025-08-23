import React, { useState } from 'react';
import axios from 'axios';
import { api } from '../../api/api';
import { useEffect } from 'react';

const TopOne = () => {
    const [videoIds, setVideoIds] = useState(['']);
    const [topOneData, setTopOneData] = useState([]);

    const fetchData = async () => {
        try {
        const response = await axios.get(api.AdminVideoAdvertisement.getTopOne);
        setTopOneData(response.data?.data || []);
        } catch (err) {
        console.error("Error fetching top one data:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const handleChange = (index, value) => {
        const updated = [...videoIds];
        updated[index] = value;
        setVideoIds(updated);
    };

    const handleAddField = () => {
        setVideoIds([...videoIds, '']);
    };

    const handleRemoveField = (index) => {
        const updated = videoIds.filter((_, i) => i !== index);
        setVideoIds(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log('Submitted video IDs:', videoIds);

        const allVideoIds = [
            ...videoIds,
            ...topOneData?.map((item) => item?.uuid)
            ]

            // console.log("allVideoIds :",allVideoIds)

        try {
            const response = await axios.post(api.AdminVideoAdvertisement.topOne, { videoIds:allVideoIds });
            // console.log('Response:', response.data);
            // setTopOneData(response.data.data); 
            // console.log('======= : ',topOneData)
            setTopOneData(response.data?.data)
            setVideoIds(['']);
        } catch (error) {
            console.error('Error submitting video IDs:', error);
        }
    };

    const handleRemoveTopOne = async (id) => {
        console.log("id :",id)
        

          const updatedData = topOneData.filter((item) => item.uuid !== id);
          console.log("updatedData :",updatedData)

          const videoIds = []
          updatedData.map((item) =>{
            videoIds.push(item.uuid)
          })
        console.log("videoIds :",videoIds)

        setTopOneData(updatedData);

        const response = await axios.post(api.AdminVideoAdvertisement.topOne, { videoIds });
        console.log("response after remove :", response.data)
        setTopOneData(response.data?.data || []);
    }

    return (
        <div>
            <h1>Assign Top One Video Advertisements</h1>
            <form onSubmit={handleSubmit}>
                <label>Top One Video IDs</label>
                {videoIds.map((id, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                        <input
                            type="text"
                            placeholder={`Video ID #${index + 1}`}
                            value={id}
                            onChange={(e) => handleChange(index, e.target.value)}
                            required
                        />
                        {videoIds.length > 1 && (
                            <button
                                type="button"
                                onClick={() => handleRemoveField(index)}
                                style={{ marginLeft: '5px' }}
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={handleAddField}>Add More ID</button>
                <button type="submit" style={{ marginLeft: '10px' }}>Submit</button>
            </form>

   {topOneData.length > 0 && (
  <div>
    <div style={{ marginTop: '20px' }}>
    <h3>Top Video Advertisement Results:</h3>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)', // 4 equal columns
        gap: '20px',
        width: '100%',
      }}
    >
      {topOneData.map((item, index) => (
        <div
          key={index}
          style={{
            boxSizing: 'border-box',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '15px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            backgroundColor: '#fafafa',
            minWidth: 0, // helps with text overflow in grid items
          }}
        >
          <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>
            {item.title || 'Untitled Video'}
          </h2>
          <div><strong>Description:</strong> {item.description || 'No description provided'}</div>
          <div><strong>UUID:</strong> {item.uuid}</div>

          {item.thumbnailUrl && (
            <div style={{ marginTop: '10px' }}>
              <img
                src={item.thumbnailUrl}
                alt="Thumbnail"
                style={{ width: '100%', borderRadius: '5px' }}
              />
            </div>
          )}

          {item.videoUrl && (
            <div style={{ marginTop: '10px' }}>
              <strong>Preview:</strong>
              <video
                controls
                style={{
                  width: '100%',
                  height: '200px',
                  borderRadius: '5px',
                  marginTop: '5px',
                  objectFit: 'cover',
                }}
              >
                <source src={item.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          <button
            onClick={() => handleRemoveTopOne(item.uuid)}
            style={{
            marginTop: 'auto',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            }}
        >
            Remove
        </button>
        </div>
        
      ))}
    </div>
  </div>
  </div>
)}



        </div>
    );
};

export default TopOne;
