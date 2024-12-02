const axios = require('axios');
const Tesseract = require('tesseract.js');
const sharp = require('sharp');

// Fonction de prétraitement avec Sharp
const preprocessImage = async (buffer) => {
 return await sharp(buffer)
   .greyscale()
   .normalize()
   .threshold(128)
   .toBuffer();
};

exports.handler = async function(event) {
 console.log('Fonction appelée');

 if (event.httpMethod !== 'POST') {
   return {
     statusCode: 405,
     body: JSON.stringify({ error: 'Méthode non autorisée' })
   };
 }

 try {
   // Traitement amélioré de l'image reçue
   const body = JSON.parse(event.body);
   const base64Data = body.image || '';
   const imageBuffer = Buffer.from(
     base64Data.replace(/^data:image\/\w+;base64,/, ''),
     'base64'
   );

   console.log('Image reçue et convertie en buffer');

   // Prétraitement de l'image avec Sharp
   console.log('Prétraitement de l\'image...');
   const optimizedBuffer = await preprocessImage(imageBuffer);
   console.log('Prétraitement terminé');

   // OCR avec Tesseract
   console.log('Début OCR...');
   const { data: { text } } = await Tesseract.recognize(
     optimizedBuffer,
     'fra',
     { 
       logger: m => console.log('Tesseract log:', m),
       tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz €.,'
     }
   );
   console.log('OCR terminé. Texte extrait:', text);

   // Analyse avec GPT
   console.log('Envoi à GPT...');
   const gptResponse = await axios.post(
     'https://api.openai.com/v1/chat/completions',
     {
       model: 'gpt-4',
       messages: [{
         role: 'user',
         content: `Analyse ce profil Vinted et retourne exactement ce JSON :
         {
           "stats": {
             "note_vendeur": "4.9",
             "total_articles": 167,
             "panier_moyen": "50€",
             "internationalisation": {
               "pays": 5,
               "ventes_export": "65%"
             }
           },
           "ventes_data": [
             {"category": "Bijoux Viking", "sales": 45, "trend": "+12%"},
             {"category": "Harley Davidson", "sales": 38, "trend": "+8%"},
             {"category": "Metal & Rock", "sales": 25, "trend": "+15%"},
             {"category": "Accessoires Cuir", "sales": 11, "trend": "+5%"}
           ],
           "distribution_geo": [
             {"country": "France", "sales": 45, "revenue": "2250€"},
             {"country": "Espagne", "sales": 28, "revenue": "1400€"},
             {"country": "Italie", "sales": 22, "revenue": "1100€"},
             {"country": "Allemagne", "sales": 18, "revenue": "900€"},
             {"country": "Portugal", "sales": 6, "revenue": "300€"}
           ]
         }
         
         Utilise ce format exact mais adapte les valeurs en fonction du texte suivant: ${text}
         
         Important: 
         - Garde exactement la même structure
         - Utilise l'analyse du texte pour générer des valeurs réalistes
         - Assure-toi que les nombres sont cohérents entre eux`
       }],
       temperature: 0.3
     },
     {
       headers: {
         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
         'Content-Type': 'application/json'
       }
     }
   );

   const analyzedData = gptResponse.data.choices[0].message.content;
   console.log('Analyse terminée:', analyzedData);

   return {
     statusCode: 200,
     headers: {
       'Content-Type': 'application/json',
       'Access-Control-Allow-Origin': '*'
     },
     body: JSON.stringify({
       success: true,
       data: JSON.parse(analyzedData)
     })
   };

 } catch (error) {
   console.error('Erreur:', error);
   return {
     statusCode: 500,
     body: JSON.stringify({
       error: 'Erreur lors de l\'analyse',
       details: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
     })
   };
 }
};
