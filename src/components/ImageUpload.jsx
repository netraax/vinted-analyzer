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
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="text-center">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Scanner un profil Vinted</h2>
          <p className="text-gray-600">Uploadez une capture d'écran pour analyser</p>
        </div>

        <label className="block">
          <input
            type="file"
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <span className="bg-blue-500 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors inline-block">
            {loading ? 'Analyse en cours...' : 'Sélectionner une image'}
          </span>
        </label>

        {loading && (
          <div className="mt-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-2">Analyse en cours...</p>
          </div>
        )}

        {data && (
          <div className="mt-8 bg-gray-50 p-6 rounded-lg text-left">
            <h3 className="text-xl font-semibold mb-4">Résultats de l'analyse</h3>
            <pre className="bg-white p-4 rounded border overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
