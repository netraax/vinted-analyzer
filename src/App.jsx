import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import StatsDisplay from './components/StatsDisplay';

export default function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);  // État de chargement
  const [error, setError] = useState(null);  // État d'erreur

  // Fonction pour gérer l'affichage des erreurs
  const handleError = (message) => {
    setError(message);
    setLoading(false);  // Stopper le chargement si erreur
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Analyseur de Profils Vinted
        </h1>

        {/* Afficher un indicateur de chargement pendant l'analyse */}
        {loading && <p className="text-center text-lg text-blue-600">Chargement...</p>}

        {/* Affichage d'erreur si un problème survient */}
        {error && <p className="text-center text-lg text-red-500">{error}</p>}

        {/* Passer handleError et setLoading à ImageUpload */}
        <ImageUpload
          onAnalysisComplete={(data) => {
            setAnalysisData(data);
            setLoading(false);  // Stopper le chargement après l'analyse
          }}
          onError={handleError}  // Passer la fonction pour gérer les erreurs
          setLoading={setLoading}  // Passer la fonction pour démarrer le chargement
        />

        {/* Afficher les données analysées seulement si elles existent */}
        {analysisData && !loading && <StatsDisplay data={analysisData} />}
      </div>
    </div>
  );
}
