const axios = require('axios');
const Tesseract = require('tesseract.js');

exports.handler = async function(event, context) {
  try {
    const { file } = JSON.parse(event.body);

    // OCR avec Tesseract.js
    const { data: { text } } = await Tesseract.recognize(
      file,
      'fra',
      { logger: m => console.log(m) }
    );

    // Envoi structuré à GPT-4 pour analyse Vinted
    const gptResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [{
          role: 'user',
          content: `Analyse ce profil Vinted. Extrait et retourne un JSON avec :
          - nombre_articles_en_vente
          - nombre_ventes_realisees
          - note_moyenne
          - nombre_evaluations
          - pays_vendeur
          - categorie_principale
          - prix_moyen
          
          Texte du profil : ${text}`
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

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: JSON.parse(gptResponse.data.choices[0].message.content)
      })
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Erreur lors de l\'analyse du profil Vinted',
        details: process.env.NODE_ENV === 'development' ? error.message : null
      })
    };
  }
};
