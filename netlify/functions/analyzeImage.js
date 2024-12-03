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
  const patterns = {
    boutique: /^([^\n]+)/,
    articles: /(\d+)\s*articles?/i,
    evaluations: /(\d+)\s*éval/i,
    etoiles: /(\d+(?:\.\d+)?)\s*\/\s*5/,
    abonnes: /(\d+)\s*Abonnés?/i,
    abonnements: /(\d+)\s*Abonnements?/i,
    lieu: /(France|Espagne|Italie|Allemagne|Portugal|Belgique)/i
  };

  return {
    stats: {
      nom_boutique: text.match(patterns.boutique)?.[1]?.trim() || 'Inconnu',
      total_articles: parseInt(text.match(patterns.articles)?.[1] || '0'),
      nombre_ventes: parseInt(text.match(patterns.evaluations)?.[1] || '0'),
      note: text.match(patterns.etoiles)?.[1] || 'N/A',
      abonnes: parseInt(text.match(patterns.abonnes)?.[1] || '0'),
      abonnements: parseInt(text.match(patterns.abonnements)?.[1] || '0'),
      pays: text.match(patterns.lieu)?.[1] || 'Non spécifié'
    }
  };
}

exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body);
    const rawBuffer = Buffer.from(body.image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const optimizedBuffer = await preprocessImage(rawBuffer);

    const { data: { text } } = await Tesseract.recognize(optimizedBuffer, 'fra');
    console.log('Texte extrait:', text);
    
    const parsedData = parseVintedProfile(text);
    console.log('Données parsées:', parsedData);

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
