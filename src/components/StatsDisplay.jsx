import React from 'react';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function NicheDashboard() {
  // Données temporelles 
  const hourlyData = [
    { hour: '14h', sales: 1, response: 1 },
    { hour: '16h', sales: 1, response: 1 },
    { hour: '17h', sales: 1, response: 1 },
    { hour: '18h', sales: 1, response: 1 },
    { hour: '20h', sales: 2, response: 2 },
    { hour: '22h', sales: 1, response: 1 }
  ];

  const weeklyData = [
    { day: 'J-6', sales: 15, satisfaction: 5 },
    { day: 'J-5', sales: 18, satisfaction: 5 },
    { day: 'J-4', sales: 16, satisfaction: 5 },
    { day: 'J-3', sales: 12, satisfaction: 5 },
    { day: 'J-2', sales: 3, satisfaction: 5 },
    { day: 'J-1', sales: 4, satisfaction: 5 },
    { day: 'Aujourd\'hui', sales: 7, satisfaction: 5 }
  ];

  const countryData = [
    { country: 'France', sales: 45, revenue: '2250€' },
    { country: 'Espagne', sales: 28, revenue: '1400€' },
    { country: 'Italie', sales: 22, revenue: '1100€' },
    { country: 'Allemagne', sales: 18, revenue: '900€' },
    { country: 'Portugal', sales: 6, revenue: '300€' }
  ];

  const categoryData = [
    { category: 'Bijoux Viking', sales: 45, trend: '+12%' },
    { category: 'Harley Davidson', sales: 38, trend: '+8%' },
    { category: 'Metal & Rock', sales: 25, trend: '+15%' },
    { category: 'Accessoires Cuir', sales: 11, trend: '+5%' }
  ];

  return (
    <div className="p-4 bg-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard philhawov</h1>
          <p className="text-gray-600">Spécialiste Bijoux & Accessoires Style Alternatif</p>
        </div>
        <div className="bg-green-100 px-4 py-2 rounded-full">
          <span className="text-green-800 font-semibold">Power Seller</span>
        </div>
      </div>

      {/* KPIs Principaux */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-sm text-gray-600">Note Vendeur</p>
          <div className="flex items-baseline">
            <p className="text-3xl font-bold text-blue-600">4.9</p>
            <p className="text-sm text-gray-500 ml-1">/5</p>
          </div>
          <p className="text-xs text-gray-500 mt-1">Top 1% vendeurs</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <p className="text-sm text-gray-600">Articles Vendus</p>
          <div className="flex items-baseline">
            <p className="text-3xl font-bold text-green-600">119</p>
          </div>
          <p className="text-xs text-green-600 mt-1">167 articles en stock</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <p className="text-sm text-gray-600">Panier Moyen</p>
          <div className="flex items-baseline">
            <p className="text-3xl font-bold text-purple-600">50€</p>
          </div>
          <p className="text-xs text-purple-600 mt-1">+15% ce mois</p>
        </div>

        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
          <p className="text-sm text-gray-600">Internationalisation</p>
          <div className="flex items-baseline">
            <p className="text-3xl font-bold text-amber-600">5</p>
            <p className="text-sm text-gray-500 ml-1">pays</p>
          </div>
          <p className="text-xs text-amber-600 mt-1">65% ventes export</p>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-bold mb-4">Ventes par Catégorie</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={categoryData}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#4CAF50" name="Ventes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-bold mb-4">Performance Hebdomadaire</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={weeklyData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#4CAF50" name="Ventes" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="font-bold mb-4">Distribution Géographique</h3>
          <div className="space-y-2">
            {countryData.map(item => (
              <div key={item.country} className="flex justify-between items-center">
                <span>{item.country}</span>
                <div className="flex items-center gap-4">
                  <div 
                    className="bg-blue-500 h-2 rounded" 
                    style={{width: `${(item.sales/countryData[0].sales)*100}px`}}
                  />
                  <span className="font-bold min-w-[60px] text-right">{item.sales}</span>
                  <span className="text-gray-600 min-w-[60px] text-right">{item.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="font-bold mb-4">Analyse de Niche</h3>
          <div className="space-y-3">
            <div className="border-b pb-2">
              <p className="font-semibold">Style Principal</p>
              <p className="text-gray-600">Alternative & Biker</p>
            </div>
            <div className="border-b pb-2">
              <p className="font-semibold">Catégories Phares</p>
              {categoryData.map(cat => (
                <div key={cat.category} className="flex justify-between text-sm">
                  <span>{cat.category}</span>
                  <span className="text-green-600">{cat.trend}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="font-semibold">Positionnement Prix</p>
              <p className="text-gray-600">Moyen/Haut de gamme</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="font-bold mb-4">Points Forts Marché</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Part de marché niche</span>
              <span className="font-bold">Top 5%</span>
            </div>
            <div className="flex justify-between">
              <span>Fidélisation client</span>
              <span className="font-bold">85%</span>
            </div>
            <div className="flex justify-between">
              <span>Expédition rapide</span>
              <span className="font-bold">&lt;24h</span>
            </div>
            <div className="flex justify-between">
              <span>Qualité produits</span>
              <span className="font-bold">4.9/5</span>
            </div>
            <div className="mt-4 p-2 bg-blue-50 rounded">
              <p className="text-sm font-semibold">Spécialité:</p>
              <p className="text-sm">Bijoux et accessoires de style alternatif avec focus sur thématiques Viking et Harley Davidson</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
