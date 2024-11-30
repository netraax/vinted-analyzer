import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import Dashboard from './components/Dashboard';

export default function App() {    // Notez le 'A' majuscule ici
  const [analysisData, setAnalysisData] = useState(null);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Analyseur de Profils Vinted</h1>
      <ImageUpload onAnalysisComplete={(data) => setAnalysisData(data)} />
      {analysisData && <Dashboard data={analysisData} />}
    </div>
  );
}
