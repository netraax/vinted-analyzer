const axios = require('axios');
const Tesseract = require('tesseract.js');
const sharp = require('sharp');

const preprocessImage = async (buffer) => {
  try {
    return await sharp(buffer)
      .greyscale() // Convertir l'image en niveaux de gris
      .normalize() // Normaliser les valeurs de l'image pour améliorer la reconnaissance
      .threshold(128) // Appliquer un seuil pour simplifier l'image
      .toBuffer();
  } catch (error) {
    throw new Error(`Erreur lors du prétraitement de l'image : ${error.message}`);
  }
};

exports.handler = async function (event) {
  try {
    // Vérification du corps de la requête
    if (!event.body) {
      throw new Error('Aucun corps de requête trouvé.');
    }

    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

    if (!body.image) {
      throw new Error('Aucune image reçue');
    }

    // Décodage de l'image base64
    const rawBuffer = Buffer.from(body.image.replace(/^data:image\/\w+;base64,/, ''), 'base64');

    // Optimisation de l'image
    const optimizedBuffer = await preprocessImage(rawBuffer);
    console.log('Image optimisée avec succès');

    // Utilisation de Tesseract pour extraire le texte
    const { data: { text } } = await Tesseract.recognize(
      optimizedBuffer,
      'fra', // Langue : français
      {
        logger: (m) => console.log('Tesseract:', m) // Log pour suivre l'avancement
      }
    );
    console.log('Texte extrait avec succès:', text);

    // Requête à l'API OpenAI pour analyser le texte
    const gptResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
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
          
          Texte du profil : ${text}`,
        }],
        max_tokens: 1000,
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Validation de la réponse et parsing du JSON
    const analyzedData = gptResponse.data.choices[0].message.content;
    let parsedData;
    try {
      parsedData = JSON.parse(analyzedData);
    } catch (error) {
      throw new Error('Erreur lors du parsing des données générées par GPT');
    }

    console.log('Données analysées:', parsedData);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        data: parsedData
      })
    };
  } catch (error) {
    console.error('Erreur générale:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Erreur lors de l\'analyse',
        details: error.message
      })
    };
  }
};
