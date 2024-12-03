// App.jsx
import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import Dashboard from './components/Dashboard';

export default function App() {
  const [analysisData, setAnalysisData] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Analyseur de Profils Vinted</h1>
        <ImageUpload onAnalysisComplete={setAnalysisData} />
        {analysisData && <Dashboard data={analysisData} />}
      </div>
    </div>
  );
}
