const axios = require('axios');
const Tesseract = require('tesseract.js');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Méthode non autorisée' })
    };
  }

  try {
    const { file } = JSON.parse(event.body);

    // OCR avec Tesseract.js
    const { data: { text } } = await Tesseract.recognize(
      file,
      'fra',
      { logger: m => console.log(m) }
    );

    // Envoi à GPT-4
    const gptResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [{
          role: 'user',
          content: `Analyse ce profil Vinted : ${text}\nExtrait: prix, état, nombre de ventes, évaluations`
        }],
        max_tokens: 150,
        temperature: 0.7
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
        data: gptResponse.data.choices[0].message.content
      })
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Erreur lors du traitement de l\'image' 
      })
    };
  }
};
