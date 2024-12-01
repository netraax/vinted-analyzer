const axios = require('axios');
const Tesseract = require('tesseract.js');

exports.handler = async function (event) {
  console.log('Fonction appelée avec event:', event);

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Méthode non autorisée' }),
    };
  }

  try {
    // Parse les données reçues
    const formData = event.body;
    if (!formData) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Aucune image reçue' }),
      };
    }

    // Convertir l'image base64 en buffer
    const buffer = Buffer.from(formData.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    console.log('Image reçue et convertie en buffer');

    // Ajout d'un timeout manuel pour Tesseract
    const tesseractPromise = Tesseract.recognize(buffer, 'fra', {
      logger: (m) => console.log('Tesseract log:', m),
    });

    const tesseractTimeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Tesseract timeout')), 9000) // Timeout à 9 secondes pour éviter un dépassement
    );

    const { data: { text } } = await Promise.race([tesseractPromise, tesseractTimeout]);

    console.log('Texte extrait:', text);

    // Analyse avec GPT
    const gptResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: `Analyse ce profil Vinted et retourne un JSON avec:
            nombre_articles_en_vente,
            nombre_ventes_realisees,
            note_moyenne,
            nombre_evaluations,
            pays_vendeur,
            categorie_principale,
            prix_moyen.
            
            Texte du profil: ${text}`,
          },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Réponse GPT reçue');
    const analyzedData = gptResponse.data.choices[0].message.content;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        data: analyzedData,
      }),
    };

  } catch (error) {
    console.error('Erreur:', error);

    // Gestion des erreurs spécifiques pour Tesseract
    const errorMessage = error.message === 'Tesseract timeout'
      ? 'Le traitement OCR a dépassé la limite de temps'
      : 'Erreur lors de l\'analyse';

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne',
      }),
    };
  }
};
