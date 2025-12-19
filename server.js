const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// CONFIGURATION SIMPLIFIÉE
const transporter = nodemailer.createTransport({
    service: 'gmail', // On revient au mode simple
    auth: {
        user: 'jerome.vaillancourt200@gmail.com',
        pass: 'tropkiuxnmnqccpy' 
    }
});

app.post('/api/checkout', (req, res) => {
    const { text, color, size, customerName, customerEmail } = req.body;

    console.log("🚀 COMMANDE REÇUE POUR :", customerName);

    const mailOptions = {
        from: 'jerome.vaillancourt200@gmail.com',
        to: 'jerome.vaillancourt200@gmail.com',
        subject: `Commande de ${customerName}`,
        text: `Nom: ${customerName}\nEmail: ${customerEmail}\nTexte: ${text}\nCouleur: ${color}\nTaille: ${size}`
    };

    // On envoie l'email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("❌ ERREUR :");
            console.log(error.message);
            // On répond au site même s'il y a une erreur pour ne pas qu'il reste bloqué
            return res.status(500).json({ message: "Erreur d'envoi", details: error.message });
        }
        console.log("✅ EMAIL ENVOYÉ !");
        // On répond au site que c'est réussi
        res.status(200).json({ message: "Succès" });
    });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`✅ Serveur prêt`);
});
