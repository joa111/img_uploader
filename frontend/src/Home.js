import React, { useState } from 'react';
import axios from 'axios';

function ImageUpload() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:8081/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <input type="file" onChange={handleImageChange} required />
      <button type="submit">Upload Image</button>
    </form>
  );
}

export default ImageUpload;
