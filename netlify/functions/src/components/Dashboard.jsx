import React from 'react';

export default function Dashboard({ data }) {
  if (!data) return null;

  const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-4">
      <h2 className="text-xl font-bold mb-4">Analyse du Profil</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 rounded">
          <h3 className="font-semibold">Statistiques</h3>
          <pre className="mt-2 text-sm">
            {JSON.stringify(parsedData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
