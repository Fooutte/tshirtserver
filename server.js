const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// CONFIGURATION ULTRA-STABLE
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'jerome.vaillancourt200@gmail.com',
        pass: 'tropkiuxnmnqccpy'
    },
    connectionTimeout: 10000, // 10 secondes max pour se connecter
    greetingTimeout: 10000
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

    // On envoie l'email sans faire attendre le site web
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("❌ ERREUR GMAIL DETAILLÉE :");
            console.log(error);
        } else {
            console.log("✅ EMAIL ENVOYÉ AVEC SUCCÈS !");
        }
    });

    // On répond TOUT DE SUITE au site pour débloquer l'affichage "Envoi en cours"
    return res.status(200).json({ message: "Reçu" });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`✅ Serveur prêt sur le port ${PORT}`);
});
