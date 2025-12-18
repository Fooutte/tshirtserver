const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
// Très important : utiliser le port donné par Render ou 3000 par défaut
const PORT = process.env.PORT || 3000;

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
