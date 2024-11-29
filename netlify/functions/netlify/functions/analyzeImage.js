const Tesseract = require('tesseract.js');
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

// Cache pour les analyses
const analysisCache = new Map();

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Méthode non autorisée' })
    };
  }

  try {
    const { image } = JSON.parse(event.body);

    // Vérification du cache
    const cacheKey = image.slice(0, 100);
    if (analysisCache.has(cacheKey)) {
      return {
        statusCode: 200,
        body: JSON.stringify(analysisCache.get(cacheKey))
      };
    }

    // OCR avec Tesseract
    const { data: { text } } = await Tesseract.recognize(
      image,
      'fra', // Français
      { logger: m => console.log(m) }
    );

    // Analyse GPT
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Analyse ce profil Vinted et extrait toutes les données importantes."
        },
        {
          role: "user",
          content: `Analyse ce texte de profil Vinted et donne les informations clés: "${text}"`
        }
      ],
      temperature: 0.3
    });

    // Structuration des données
    const result = {
      timestamp: new Date().toISOString(),
      data: JSON.parse(completion.data.choices[0].message.content),
      metrics: {
        // Métriques additionnelles à calculer
      }
    };

    // Mise en cache
    analysisCache.set(cacheKey, result);
    setTimeout(() => analysisCache.delete(cacheKey), 5 * 60 * 1000); // 5 minutes

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      },
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('Erreur:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Erreur d\'analyse',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};
