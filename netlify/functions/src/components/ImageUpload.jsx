import React, { useState } from 'react';
import axios from 'axios';

export default function ImageUpload() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleUpload = async () => {
    if (!image) {
      alert('Sélectionnez une image');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await axios.post('/.netlify/functions/analyzeImage', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setData(response.data.data);
    } catch (error) {
      console.error('Erreur upload:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <input
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        className="mb-4"
      />
      
      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full p-2 bg-blue-500 text-white rounded"
      >
        {loading ? 'Analyse...' : 'Analyser l\'image'}
      </button>

      {data && (
        <div className="mt-4">
          <h3 className="font-bold">Résultats :</h3>
          <pre className="bg-gray-100 p-2 rounded">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
