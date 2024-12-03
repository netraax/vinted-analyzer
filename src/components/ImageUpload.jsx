import React, { useState } from 'react';

export default function ImageUpload() {
 const [image, setImage] = useState(null);
 const [preview, setPreview] = useState(null);
 const [loading, setLoading] = useState(false);
 const [data, setData] = useState(null);

 const handleImageUpload = async (event) => {
   const file = event.target.files[0];
   if (!file) return;

   console.log("Fichier sélectionné :", file);
   
   if (!file.type.startsWith('image/')) {
     alert('Veuillez télécharger un fichier image valide.');
     return;
   }

   if (file.size > 5 * 1024 * 1024) {
     alert('Veuillez télécharger une image de moins de 5 Mo.');
     return;
   }

   setImage(file);
   setPreview(URL.createObjectURL(file));
   setLoading(true);

   try {
     // Convertir en base64
     const base64 = await new Promise((resolve, reject) => {
       const reader = new FileReader();
       reader.readAsDataURL(file);
       reader.onload = () => resolve(reader.result);
       reader.onerror = error => reject(error);
     });

     console.log("Envoi de l'image...");
     const response = await fetch('/.netlify/functions/analyzeImage', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ image: base64 })
     });

     console.log("Réponse brute:", response);
     
     if (!response.ok) {
       throw new Error(Erreur serveur: ${response.statusText});
     }

     const result = await response.json();
     console.log("Données reçues:", result);

     if (typeof result.data !== 'object') {
       throw new Error('Données invalides');
     }

     setData(result.data);
   } catch (error) {
     console.error('Erreur:', error);
     alert('Une erreur est survenue. Veuillez réessayer.');
   } finally {
     setLoading(false);
   }
 };

 return (
   <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
     <div className="text-center">
       <div className="mb-8">
         <h2 className="text-2xl font-bold text-gray-800 mb-2">Scanner un profil Vinted</h2>
         <p className="text-gray-600">Uploadez une capture d'écran pour analyser</p>
       </div>

       <label className="block">
         <input
           type="file"
           onChange={handleImageUpload}
           accept="image/*"
           className="hidden"
         />
         <span className="bg-blue-500 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors inline-block">
           {loading ? 'Analyse en cours...' : 'Sélectionner une image'}
         </span>
       </label>

       {preview && (
         <div className="mt-4">
           <img src={preview} alt="Prévisualisation" className="max-w-full h-auto rounded" />
         </div>
       )}

       {loading && (
         <div className="mt-6 flex flex-col items-center">
           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
           <p className="text-gray-600 mt-2">Analyse en cours... Cela peut prendre quelques secondes.</p>
         </div>
       )}

       {data && (
         <div className="mt-8 bg-gray-50 p-6 rounded-lg text-left">
           <h3 className="text-xl font-semibold mb-4">Résultats de l'analyse</h3>
           <pre className="bg-white p-4 rounded border overflow-x-auto">
             {JSON.stringify(data, null, 2)}
           </pre>
         </div>
       )}
     </div>
   </div>
 );
