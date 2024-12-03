import React from 'react';

export default function Dashboard({ data }) {
  if (!data?.stats) return null;

  const { stats } = data;

  return (
    <div className="bg-gray-100 p-6 rounded-lg max-w-6xl mx-auto">
      {/* En-tête */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-2">{stats.nom_boutique}</h1>
        <div className="flex items-center gap-2">
          <span className="text-yellow-500">★</span>
          <span className="font-bold">{stats.note}/5</span>
          <span className="text-gray-500">({stats.nombre_ventes} ventes)</span>
        </div>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Dressing</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Articles</span>
              <span className="font-bold">{stats.total_articles}</span>
            </div>
            <div className="flex justify-between">
              <span>Ventes réalisées</span>
              <span className="font-bold">{stats.nombre_ventes}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Communauté</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Abonnés</span>
              <span className="font-bold">{stats.abonnes}</span>
            </div>
            <div className="flex justify-between">
              <span>Abonnements</span>
              <span className="font-bold">{stats.abonnements}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Taux de vente</span>
              <span className="font-bold">
                {((stats.nombre_ventes / stats.total_articles) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Localisation</span>
              <span className="font-bold">{stats.pays}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
