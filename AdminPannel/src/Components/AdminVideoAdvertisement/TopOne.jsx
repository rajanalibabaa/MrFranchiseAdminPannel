import React, { useState } from 'react';
import axios from 'axios';
import { api } from '../../api/api';

const TopOne = () => {
    const [videoIds, setVideoIds] = useState(['']); 


    // Handle input change
    const handleChange = (index, value) => {
        const updated = [...videoIds];
        updated[index] = value;
        setVideoIds(updated);
    };

    // Add new input field
    const handleAddField = () => {
        setVideoIds([...videoIds, '']);
    };

    // Remove input field
    const handleRemoveField = (index) => {
        const updated = videoIds.filter((_, i) => i !== index);
        setVideoIds(updated);
    };

    // Submit handler
    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log('Submitted video IDs:', videoIds);

        try {
            const response = await axios.post(api.AdminVideoAdvertisement.topOne, { videoIds });
            console.log(response.data); 
            setVideoIds([""])
    
        } catch (error) {
            console.error('Error submitting video IDs:', error);
        }
    };

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
        </div>
    );
};

export default TopOne;
