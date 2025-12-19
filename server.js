const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 1. Configuration de Gmail (Une seule fois au début)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'jerome.vaillancourt200@gmail.com',
        pass: 'tropkiuxnmnqccpy' // Ton mot de passe d'application
    }
});

app.get('/', (req, res) => {
    res.send("Le serveur de Hack Dalphond est en ligne !");
});

// 2. La route qui reçoit la commande
app.post('/api/checkout', (req, res) => {
    const { text, color, size, customerName, customerEmail } = req.body;
    const displaySize = size || "Non spécifiée";

    // Affiche dans les logs de Render
    console.log("🚀 NOUVELLE COMMANDE REÇUE !");
    console.log(`👤 Client : ${customerName} (${displaySize})`);

    // 3. Préparation de l'email
    const mailOptions = {
        from: 'Hack Dalphond <jerome.vaillancourt200@gmail.com>',
        to: 'jerome.vaillancourt200@gmail.com',
        subject: `👕 Nouvelle commande de ${customerName} !`,
        text: `Tu as reçu une nouvelle commande !\n\n` +
              `Client : ${customerName}\n` +
              `Email : ${customerEmail}\n` +
              `Taille : ${displaySize}\n` +
              `Design : "${text}"\n` +
              `Couleur : ${color}\n\n` +
              `Check tes logs Render pour plus de détails.`
    };

    // 4. Envoi de l'email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("❌ Erreur d'envoi d'email :", error);
        } else {
            console.log("📧 Email envoyé avec succès !");
        }
    });

    // 5. Réponse au site web
    res.json({ 
        success: true, 
        message: `Merci ${customerName}, ta commande est enregistrée !` 
    });
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});
