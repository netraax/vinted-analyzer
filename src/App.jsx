// App.jsx
import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import Dashboard from './components/Dashboard';

export default function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState(null); // Pour gérer les erreurs
  const [isLoading, setIsLoading] = useState(false); // Pour gérer l'état de chargement

  const handleAnalysisComplete = (data) => {
    if (data?.stats) {
      setAnalysisData(data);
      setError(null);
    } else {
      setAnalysisData(null);
      setError('Analyse échouée : données non valides.');
    }
    setIsLoading(false);
  };

  const handleAnalysisStart = () => {
    setIsLoading(true);
    setError(null);
    setAnalysisData(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Analyseur de Profils Vinted</h1>
        <ImageUpload onAnalysisStart={handleAnalysisStart} onAnalysisComplete={handleAnalysisComplete} />
        
        {isLoading && (
          <p className="text-center text-blue-500 font-semibold mt-4">Analyse en cours...</p>
        )}

        {error && (
          <p className="text-center text-red-500 font-semibold mt-4">{error}</p>
        )}

        {analysisData && <Dashboard data={analysisData} />}
      </div>
    </div>
  );
}
