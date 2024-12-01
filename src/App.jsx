import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import StatsDisplay from './components/StatsDisplay';

export default function App() {
  const [analysisData, setAnalysisData] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Analyseur de Profils Vinted
        </h1>
        <ImageUpload onAnalysisComplete={setAnalysisData} />
        {analysisData && <StatsDisplay data={analysisData} />}
      </div>
    </div>
  );
}
