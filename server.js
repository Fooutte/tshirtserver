import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(express.json());

// CONFIGURATION SERVICE DIRECT (DERNIER RECOURS)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'jerome.vaillancourt200@gmail.com',
        pass: 'tropkiuxnmnqccpy'
    }
});

app.post('/api/checkout', async (req, res) => {
    const { text, color, size, customerName, customerEmail } = req.body;
    console.log("🚀 COMMANDE REÇUE ! Client:", customerName);

    const mailOptions = {
        from: 'jerome.vaillancourt200@gmail.com',
        to: 'jerome.vaillancourt200@gmail.com',
        subject: `Commande T-Shirt - ${customerName}`,
        text: `Nouveau T-shirt commandé !\n\nClient: ${customerName}\nEmail: ${customerEmail}\nTexte: ${text}\nCouleur: ${color}\nTaille: ${size}`
    };

    // Envoi de l'email en arrière-plan
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("❌ ERREUR GMAIL DETAILLÉE :");
            console.log(error);
        } else {
            console.log("✅ EMAIL ENVOYÉ AVEC SUCCÈS !");
        }
    });

    // On répond immédiatement au site pour débloquer le bouton
    return res.status(200).json({ message: "Reçu" });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`✅ Serveur prêt sur le port ${PORT}`);
});
