const Tesseract = require('tesseract.js');
const sharp = require('sharp');

const preprocessImage = async (buffer) => {
  return await sharp(buffer)
    .greyscale()
    .normalize()
    .threshold(128)
    .toBuffer();
};

function parseVintedProfile(text) {
  const numberPattern = /\d+/;
  
  const articles = text.match(/(\d+)\s*articles?/)?.[1] || '0';
  const abonnes = text.match(/(\d+)\s*Abonnés?/)?.[1] || '0';
  const evals = text.match(/(\d+)\s*éval/)?.[1] || '0';
  
  return {
    stats: {
      total_articles: parseInt(articles),
      abonnes: parseInt(abonnes),
      evaluations: parseInt(evals),
      pays: text.includes('Espagne') ? 'Espagne' : 'France'
    }
  };
}

exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body);
    const rawBuffer = Buffer.from(body.image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const optimizedBuffer = await preprocessImage(rawBuffer);

    const { data: { text } } = await Tesseract.recognize(optimizedBuffer, 'fra');
    const parsedData = parseVintedProfile(text);

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true, data: parsedData })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message })
    };
  }
};
