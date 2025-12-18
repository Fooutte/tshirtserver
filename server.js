const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
// Très important : utiliser le port donné par Render ou 3000 par défaut
const PORT = process.env.PORT || 3000;
const nodemailer = require('nodemailer');

const nodemailer = require('nodemailer');

// 1. On configure la connexion avec ton Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'jerome.vaillancourt200@gmail.com', // <--- Ton adresse Gmail ici
        pass: 'trop kiux nmnq ccpy'   // <--- Ton code de 16 caractères ici
    }
});

// Dans ton app.post('/api/checkout', ...), ajoute ce bloc juste AVANT le res.json :

    // 2. Préparation de l'email
    const mailOptions = {
        from: 'Hack Dalphond <jerome.vaillancourt200@gmail.com>',
        to: 'jerome.vaillancourt200@gmail.com', // Tu peux t'envoyer l'email à toi-même
        subject: `👕 Nouvelle commande de ${customerName} !`,
        text: `Tu as reçu une nouvelle commande !\n\n` +
              `Client : ${customerName}\n` +
              `Email : ${customerEmail}\n` +
              `Taille : ${size}\n` +
              `Design : "${text}"\n` +
              `Couleur : ${color}\n\n` +
              `Check tes logs Render pour plus de détails.`
    };

    // 3. Envoi de l'email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("❌ Erreur d'envoi d'email :", error);
        } else {
            console.log("📧 Email de notification envoyé avec succès !");
        }
    });

    // On garde ton message de succès pour le site
    res.json({ success: true, message: `Merci ${customerName} !` });
});
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Le serveur de Hack Dalphond est en ligne !");
});

// Cette partie gère la réception des commandes
app.post('/api/checkout', (req, res) => {
    // 1. On extrait toutes les données envoyées par le site
    const { text, color, size, customerName, customerEmail } = req.body;

    // 2. On affiche les infos dans les logs de Render
    console.log("🚀 NOUVELLE COMMANDE REÇUE !");
    console.log(`👤 Client : ${customerName}`);
    console.log(`📧 Email  : ${customerEmail}`);
    console.log(`👕 Taille : ${size || "Non spécifiée"}`); 
    console.log(`🎨 Design : "${text}" en couleur ${color}`);
    console.log("-----------------------------------------");

    // 3. On répond au client pour confirmer
    res.json({ 
        success: true, 
        message: `Merci ${customerName}, ta commande en taille ${size || 'M'} est bien reçue !` 
    });
});

app.listen(PORT, () => {
    console.log(`Serveur en ligne sur le port ${PORT}`);
});
