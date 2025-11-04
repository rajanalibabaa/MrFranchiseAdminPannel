import React, { useState } from 'react';
import axios from 'axios';
import { api } from '../../api/api.jsx';

const CreateVideoAdvertise = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleThumbnailChange = (e) => {
    setThumbnailFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile || !thumbnailFile) {
      setMessage('Both video and thumbnail files are required.');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('videos', videoFile); // key must match backend field
    data.append('thumbnail', thumbnailFile);

    try {
      const response = await axios.post(api.AdminVideoAdvertisement.createVideoAdvertisement, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Video advertisement created successfully!');
      setFormData({ title: '', description: '' });
      setVideoFile(null);
      setThumbnailFile(null);
      console.log(response.data);
    } catch (error) {
      console.error('Error creating video advertisement:', error);
      setMessage('Failed to create video advertisement.');
    }
  };

  return (
    <div className="create-video-advertise">
      <h2>Create Video Advertisement</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div>
          <label>Video File:</label>
          <input type="file" accept="video/*" onChange={handleVideoChange} required />
        </div>
        <div>
          <label>Thumbnail Image:</label>
          <input type="file" accept="image/*" onChange={handleThumbnailChange} required />
        </div>
        <button type="submit">Create</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateVideoAdvertise;
