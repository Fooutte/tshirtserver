import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    // Configuration CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'POST') {
        const { name, email, product, size, qty, color, total, image } = req.body;

        // Configuration de l'envoi d'email (Gmail par exemple)
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'jerome.vaillancourt200@gmail.com', // Ton adresse
                pass: 'tropkiuxnmnqccpy' // Ton mot de passe d'application Google
            }
        });

        const mailOptions = {
            from: 'NEXT-GEN BOUTIQUE',
            to: 'jerome.vaillancourt200@gmail.com',
            subject: `Nouvelle commande de ${name}`,
            html: `
                <h1>Détails de la commande</h1>
                <p><strong>Client :</strong> ${name} (${email})</p>
                <p><strong>Produit :</strong> ${product}</p>
                <p><strong>Taille :</strong> ${size}</p>
                <p><strong>Quantité :</strong> ${qty}</p>
                <p><strong>Couleur :</strong> ${color}</p>
                <p><strong>Total :</strong> ${total}</p>
            `,
            attachments: image ? [{
                filename: 'design.png',
                content: image.split("base64,")[1],
                encoding: 'base64'
            }] : []
        };

        try {
            await transporter.sendMail(mailOptions);
            return res.status(200).json({ message: "Email envoyé avec succès" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erreur lors de l'envoi de l'email" });
        }
    } else {
        res.status(405).json({ error: "Méthode non autorisée" });
    }
}
