const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    // Sécurité et autorisations
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // ON RÉCUPÈRE TOUTES LES INFOS EN UNE SEULE FOIS ICI
    const { name, email, size, qty, color, image, total } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'jerome.vaillancourt200@gmail.com',
            pass: 'tropkiuxnmnqccpy'
        }
    });

    // Configuration de l'email
    const mailOptions = {
        from: 'jerome.vaillancourt200@gmail.com',
        to: 'jerome.vaillancourt200@gmail.com',
        subject: `COMMANDE HACK : ${total} - ${name}`,
        text: `NOUVELLE COMMANDE\n\n` +
              `Client: ${name}\n` +
              `Email: ${email}\n` +
              `Quantité: ${qty}\n` +
              `Taille: ${size}\n` +
              `Couleur: ${color}\n` +
              `------------------------\n` +
              `PRIX TOTAL: ${total}`,
        attachments: image ? [{ 
            filename: 'design-client.png', 
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
