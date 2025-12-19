const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// CONFIGURATION DE L'ENVOI D'EMAIL
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
        user: 'jerome.vaillancourt200@gmail.com',
        pass: 'tropkiuxnmnqccpy' 
    },
    tls: {
        rejectUnauthorized: false
    }
});

// ROUTE POUR RECEVOIR LA COMMANDE DU SITE
app.post('/api/checkout', (req, res) => {
    const { text, color, size, customerName, customerEmail } = req.body;

    console.log("🚀 NOUVELLE COMMANDE REÇUE !");
    console.log(`👤 Client : ${customerName} (${size})`);

    const mailOptions = {
        from: 'jerome.vaillancourt200@gmail.com',
        to: 'jerome.vaillancourt200@gmail.com', 
        subject: `Nouvelle commande T-Shirt de ${customerName}`,
        text: `
            Détails de la commande :
            ------------------------
            Nom du client : ${customerName}
            Email du client : ${customerEmail}
            Texte du T-shirt : ${text}
            Couleur : ${color}
            Taille : ${size}
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("❌ ERREUR GMAIL :");
            console.log(error.message);
            return res.status(500).json({ message: "Erreur d'envoi", details: error.message });
        }
        console.log("📧 EMAIL ENVOYÉ AVEC SUCCÈS !");
        res.status(200).json({ message: "Commande réussie, email envoyé !" });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
});
