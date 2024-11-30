import React from 'react';
import ImageUpload from './components/ImageUpload';
import Dashboard from './components/Dashboard';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Analyseur de Profils Vinted
        </h1>
        <ImageUpload />
      </div>
    </div>
  );
}
