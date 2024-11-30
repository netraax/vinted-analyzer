import React, { useState } from 'react';

export default function ImageUpload() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/.netlify/functions/analyzeImage', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <input
        type="file"
        onChange={handleImageUpload}
        accept="image/*"
        className="mb-4"
      />
      
      {loading && (
        <div className="text-center">
          <p>Analyse en cours...</p>
        </div>
      )}

      {data && (
        <div className="mt-4">
          <h3 className="font-bold">Résultats de l'analyse :</h3>
          <pre className="bg-gray-100 p-2 rounded mt-2">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
