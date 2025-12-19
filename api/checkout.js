const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    // Configuration des headers pour la sécurité (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // On récupère toutes les données envoyées par ton site
    const { name, email, size, qty, color, image, total, product } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'jerome.vaillancourt200@gmail.com',
            pass: 'tropkiuxnmnqccpy' // Ton mot de passe d'application Gmail
        }
    });

    // Préparation du contenu de l'email
    const mailOptions = {
        from: 'jerome.vaillancourt200@gmail.com',
        to: 'jerome.vaillancourt200@gmail.com',
        // Le sujet contient maintenant le type de produit et le prix
        subject: `COMMANDE ${product.toUpperCase()} : ${total} - ${name}`,
        text: `NOUVELLE COMMANDE REÇUE\n\n` +
              `PRODUIT : ${product.toUpperCase()}\n` +
              `CLIENT : ${name}\n` +
              `EMAIL : ${email}\n` +
              `QUANTITÉ : ${qty}\n` +
              `TAILLE : ${size}\n` +
              `COULEUR : ${color}\n` +
              `---------------------------\n` +
              `PRIX TOTAL : ${total}\n\n` +
              `L'image du design est jointe à ce courriel.`,
        attachments: image ? [{ 
            filename: `design-${product}.png`, 
            content: image.split("base64,")[1], 
            encoding: 'base64' 
        }] : []
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Erreur Mailer:", error);
        return res.status(500).json({ error: error.message });
    }
}
