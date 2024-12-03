import React from 'react';

export default function Dashboard({ data }) {
 if (!data || !data.stats) return null;

 const { stats } = data;

 return (
   <div className="max-w-7xl mx-auto p-4">
     <div className="mb-8">
       <h2 className="text-2xl font-bold mb-4">Statistiques du Profil</h2>
       
       {/* Stats principales */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
         <div className="bg-white p-6 rounded-lg shadow-sm">
           <p className="text-gray-500 text-sm">Articles en Vente</p>
           <p className="text-2xl font-bold">{stats.total_articles}</p>
         </div>
         
         <div className="bg-white p-6 rounded-lg shadow-sm">
           <p className="text-gray-500 text-sm">Abonnés</p>
           <p className="text-2xl font-bold">{stats.abonnes}</p>
         </div>
         
         <div className="bg-white p-6 rounded-lg shadow-sm">
           <p className="text-gray-500 text-sm">Évaluations</p>
           <p className="text-2xl font-bold">{stats.evaluations}</p>
         </div>

         <div className="bg-white p-6 rounded-lg shadow-sm">
           <p className="text-gray-500 text-sm">Pays</p>
           <p className="text-2xl font-bold">{stats.pays}</p>
         </div>
       </div>

       {/* Stats détaillées */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="bg-white p-6 rounded-lg shadow-sm">
           <h3 className="font-bold mb-4">Performance</h3>
           <div className="space-y-4">
             <div className="flex justify-between">
               <span>Taux de conversion</span>
               <span className="font-bold">
                 {((stats.evaluations / stats.total_articles) * 100).toFixed(1)}%
               </span>
             </div>
             <div className="flex justify-between">
               <span>Articles moyens</span>
               <span className="font-bold">{stats.total_articles}</span>
             </div>
           </div>
         </div>

         <div className="bg-white p-6 rounded-lg shadow-sm">
           <h3 className="font-bold mb-4">Engagement</h3>
           <div className="space-y-4">
             <div className="flex justify-between">
               <span>Ratio abonnés/articles</span>
               <span className="font-bold">
                 {(stats.abonnes / stats.total_articles).toFixed(2)}
               </span>
             </div>
             <div className="flex justify-between">
               <span>Évaluations moyennes</span>
               <span className="font-bold">
                 {(stats.evaluations / stats.total_articles).toFixed(2)}
               </span>
             </div>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
}
