import axios from 'axios';
import React, { useState } from 'react';
import { api } from '../../api/api';

const TopThree = () => {
    const [video, setVideo] = useState(['', '', '']);
    const [message, setMessage] = useState(false);

    const handleChange = (index, value) => {
        const updated = [...video];
        updated[index] = value;
        setVideo(updated);
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log('Submitted video IDs:', video);
        
        const response = await axios.post(api.AdminVideoAdvertisement.topThree,{videoIds : video}, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('Response from server:', response);

        if (response.status === 200) {
            setMessage(true);
            setTimeout(() => {
                setMessage(false);
            }, 3000);
        }

        setVideo(['', '', '']); 
    };

    return (
        <div>
            <h2>Assign Top Three Video Advertisements</h2>
            <form onSubmit={handleSubmit}>
                {video.map((id, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                        <label htmlFor={`video-${index}`}>
                            Video ID #{index + 1}
                        </label>
                        <input
                            id={`video-${index}`}
                            type="text"
                            placeholder={`Enter Video ID #${index + 1}`}
                            value={id}
                            onChange={(e) => handleChange(index, e.target.value)}
                        />
                    </div>
                ))}
                <button type="submit">Submit</button>
            </form>
            {message && <p style={{ color: 'green' }}>Top Three Video Advertisements Assigned Successfully!</p>}
        </div>
    );
};

export default TopThree;
