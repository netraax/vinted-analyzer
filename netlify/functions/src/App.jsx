import React, { useState } from 'react';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    
    try {
      // Convertir l'image en base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = reader.result;

        // Appel à notre fonction Netlify
        const response = await fetch('/.netlify/functions/analyzeImage', {
          method: 'POST',
          body: JSON.stringify({ image: base64Image })
        });

        const data = await response.json();
        setResults(data);
      };
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Analyseur Vinted</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4"
      />

      {loading && <p>Analyse en cours...</p>}

      {results && (
        <div className="bg-white p-4 rounded shadow">
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
