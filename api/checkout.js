const nodemailer = require('nodemailer');

export default async function handler(req, res) {
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
            subject: `COMMANDE : ${customerName}`,
            text: `Nouvelle commande !\n\nClient: ${customerName}\nEmail: ${customerEmail}\nDesign: ${text}\nCouleur: ${color}\nTaille: ${size}`
        });
        return res.status(200).json({ message: "Envoyé" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
