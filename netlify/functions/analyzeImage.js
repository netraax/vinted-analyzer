const axios = require('axios');
const Tesseract = require('tesseract.js');

exports.handler = async function(event) {
  // Log pour déboguer
  console.log('Fonction appelée avec event:', event);

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Méthode non autorisée' })
    };
  }

  try {
    // Déboguer le contenu reçu
    console.log('Body reçu:', event.body);

    const formData = event.body;
    const buffer = Buffer.from(formData.replace(/^data:image\/\w+;base64,/, ''), 'base64');

    // Log pour confirmation
    console.log('Image reçue et convertie en buffer');

    // OCR avec Tesseract
    const { data: { text } } = await Tesseract.recognize(
      buffer,
      'fra',
      { 
        logger: m => console.log('Tesseract log:', m)
      }
    );

    console.log('Texte extrait:', text);

    // Analyse avec GPT
    const gptResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [{
          role: 'user',
          content: `Analyse ce profil Vinted et retourne un JSON avec:
            nombre_articles_en_vente,
            nombre_ventes_realisees,
            note_moyenne,
            nombre_evaluations,
            pays_vendeur,
            categorie_principale,
            prix_moyen.
            
            Texte du profil: ${text}`
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

    console.log('Réponse GPT reçue');

    const analyzedData = gptResponse.data.choices[0].message.content;
    console.log('Données analysées:', analyzedData);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        data: analyzedData
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
