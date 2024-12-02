import React from 'react';

export default function Dashboard({ data }) {
  // Vérification de la validité des données
  if (!data) return <p>Chargement en cours...</p>;

  const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

  // Si les données ne correspondent pas au format attendu
  if (!parsedData.stats) return <p>Les données sont mal formatées.</p>;

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-4">
      <h2 className="text-xl font-bold mb-4">Analyse du Profil</h2>

      {/* Affichage des statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-3 bg-gray-50 rounded shadow">
          <h3 className="font-semibold text-lg">Statistiques Globales</h3>
          <ul className="mt-2 text-sm">
            <li><strong>Note Vendeur:</strong> {parsedData.stats.note_vendeur}</li>
            <li><strong>Total d'articles:</strong> {parsedData.stats.total_articles}</li>
            <li><strong>Panier Moyen:</strong> {parsedData.stats.panier_moyen}</li>
            <li><strong>Internationalisation:</strong> {parsedData.stats.internationalisation.pays} pays</li>
            <li><strong>Ventes Export:</strong> {parsedData.stats.internationalisation.ventes_export}</li>
          </ul>
        </div>

        {/* Affichage des Ventes par Catégorie */}
        <div className="p-3 bg-gray-50 rounded shadow">
          <h3 className="font-semibold text-lg">Ventes par Catégorie</h3>
          <ul className="mt-2 text-sm">
            {parsedData.ventes_data.map((category, index) => (
              <li key={index}>
                <strong>{category.category}:</strong> {category.sales} ventes (Tendance: {category.trend})
              </li>
            ))}
          </ul>
        </div>

        {/* Affichage des Ventes par Pays */}
        <div className="p-3 bg-gray-50 rounded shadow">
          <h3 className="font-semibold text-lg">Distribution Géographique</h3>
          <ul className="mt-2 text-sm">
            {parsedData.distribution_geo.map((region, index) => (
              <li key={index}>
                <strong>{region.country}:</strong> {region.sales} ventes, {region.revenue} revenus
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
