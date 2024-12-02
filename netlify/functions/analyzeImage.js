const axios = require('axios');
const Tesseract = require('tesseract.js');
const sharp = require('sharp');

// Fonction de prétraitement d'image avec Sharp
const preprocessImage = async (buffer) => {
  return await sharp(buffer)
    .greyscale()
    .normalize()
    .threshold(128)
    .toBuffer();
};

exports.handler = async function (event) {
  try {
    console.log('Event body:', typeof event.body, event.body);
    
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    
    if (!body.image) {
      throw new Error('Aucune image reçue');
    }

    // Conversion et optimisation de l'image
    const rawBuffer = Buffer.from(body.image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const optimizedBuffer = await preprocessImage(rawBuffer);
    console.log('Image optimisée');

    // OCR avec Tesseract
    const { data: { text } } = await Tesseract.recognize(
      optimizedBuffer,
      'fra',
      {
        logger: m => console.log('Tesseract:', m)
      }
    );
    console.log('Texte extrait:', text);

    // Analyse GPT
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
          
          Adapte les valeurs selon ce texte: ${text}`
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
    console.log('Données analysées:', analyzedData);

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
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Erreur analyse',
        details: error.message
      })
    };
  }
};
