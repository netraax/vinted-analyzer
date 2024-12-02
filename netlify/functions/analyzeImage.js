const axios = require('axios');
const Tesseract = require('tesseract.js');

exports.handler = async function (event) {
  console.log('Fonction appelée avec event:', event);

  // Vérifie que la méthode est POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Méthode non autorisée. Utilisez POST.' }),
    };
  }

  try {
    // Parse le corps de la requête
    const body = JSON.parse(event.body);
    const { image } = body;

    if (!image) {
      throw new Error('Aucune image reçue dans la requête.');
    }

    // Conversion de l'image base64 en buffer
    const buffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    console.log('Image reçue et convertie en buffer.');

    // OCR avec Tesseract.js
    const { data: { text } } = await Tesseract.recognize(buffer, 'fra', {
      logger: (m) => console.log('Tesseract log:', m),
    });

    console.log('Texte extrait par Tesseract:', text);

    // Analyse du texte avec l'API OpenAI
    const gptResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: `Analyse ce profil Vinted et retourne un JSON avec :
              nombre_articles_en_vente,
              nombre_ventes_realisees,
              note_moyenne,
              nombre_evaluations,
              pays_vendeur,
              categorie_principale,
              prix_moyen.

              Texte du profil : ${text}`,
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

    console.log('Réponse OpenAI reçue.');

    // Extraction des données analysées
    const analyzedData = gptResponse.data.choices[0].message.content;

    console.log('Données analysées:', analyzedData);

    // Retourne les données
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ success: true, data: analyzedData }),
    };
  } catch (error) {
    console.error('Erreur dans analyzeImage:', error.message);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Erreur lors de l\'analyse',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne',
      }),
    };
  }
};
