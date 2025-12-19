const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    // Autoriser ton site à parler à ce serveur
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { text, color, size, customerName, customerEmail } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'jerome.vaillancourt200@gmail.com',
            pass: 'tropkiuxnmnqccpy'
        }
    });

    try {
        await transporter.sendMail({
            from: 'jerome.vaillancourt200@gmail.com',
            to: 'jerome.vaillancourt200@gmail.com',
            subject: `COMMANDE DE : ${customerName}`,
            text: `Détails:\nNom: ${customerName}\nEmail: ${customerEmail}\nTexte: ${text}\nCouleur: ${color}\nTaille: ${size}`
        });
        return res.status(200).json({ message: "Envoyé !" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
