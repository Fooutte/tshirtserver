const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { name, email, size, qty, color, image } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'jerome.vaillancourt200@gmail.com',
            pass: 'tropkiuxnmnqccpy'
        }
    });

    // On prépare l'email avec l'image en pièce jointe si elle existe
    const mailOptions = {
        from: 'jerome.vaillancourt200@gmail.com',
        to: 'jerome.vaillancourt200@gmail.com',
        subject: `NOUVELLE COMMANDE HACK - ${name}`,
        text: `Client: ${name}\nEmail: ${email}\nQuantité: ${qty}\nTaille: ${size}\nCouleur: ${color}`,
        attachments: image ? [{ filename: 'logo.png', content: image.split("base64,")[1], encoding: 'base64' }] : []
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
