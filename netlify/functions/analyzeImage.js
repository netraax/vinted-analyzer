const Tesseract = require('tesseract.js');
const sharp = require('sharp');

// Fonction de prétraitement de l'image
const preprocessImage = async (buffer) => {
  return await sharp(buffer)
    .resize({ width: 800 }) // Redimensionne pour uniformiser la taille
    .greyscale() // Convertit en niveaux de gris
    .normalize() // Améliore le contraste
    .threshold(150) // Ajuste le seuil pour binariser l'image
    .toBuffer();
};

// Fonction pour analyser le texte extrait
function parseVintedProfile(text) {
  const patterns = {
    boutique: /^([\w\s-]+)/,
    articles: /(\d+)\s*(?:article|articles?)/i,
    evaluations: /(\d+)\s*(?:évaluation|éval|évals?)/i,
    etoiles: /(\d+(?:[.,]\d+)?)\s*\/\s*5/, // Gère les virgules comme séparateurs décimaux
    abonnes: /(\d+)\s*(?:Abonnés?|Followers?)/i,
    abonnements: /(\d+)\s*(?:Abonnements?|Following)/i,
    lieu: /(France|Espagne|Italie|Allemagne|Portugal|Belgique|Suisse|Luxembourg)/i
  };

  return {
    stats: {
      nom_boutique: text.match(patterns.boutique)?.[1]?.trim() || 'Inconnu',
      total_articles: parseInt(text.match(patterns.articles)?.[1] || '0'),
      nombre_ventes: parseInt(text.match(patterns.evaluations)?.[1] || '0'),
      note: text.match(patterns.etoiles)?.[1]?.replace(',', '.') || 'N/A', // Conversion virgule -> point
      abonnes: parseInt(text.match(patterns.abonnes)?.[1] || '0'),
      abonnements: parseInt(text.match(patterns.abonnements)?.[1] || '0'),
      pays: text.match(patterns.lieu)?.[1] || 'Non spécifié'
    }
  };
}

// Fonction principale d'analyse
exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body);
    const rawBuffer = Buffer.from(body.image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    console.log("Image reçue, taille :", rawBuffer.length);

    const optimizedBuffer = await preprocessImage(rawBuffer);
    console.log("Prétraitement terminé, taille optimisée :", optimizedBuffer.length);

    const { data: { text } } = await Tesseract.recognize(optimizedBuffer, 'fra', {
      logger: (info) => console.log(info), // Optionnel : suivi de la progression
      tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789éàèùç/.,: '
    });
    console.log("Texte extrait :", text);

    const parsedData = parseVintedProfile(text);
    console.log("Données parsées :", parsedData);

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true, data: parsedData })
    };
  } catch (error) {
    console.error("Erreur :", error.message);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message })
    };
  }
};
