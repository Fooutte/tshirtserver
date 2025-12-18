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
    // 1. On récupère les données envoyées par ton site
    const { text, color, customerName, customerEmail } = req.body;

    // 2. On affiche les détails dans la console (les Logs de Render)
    console.log("🚀 NOUVELLE COMMANDE REÇUE !");
    console.log(`👤 Client : ${customerName}`);
    console.log(`📧 Email  : ${customerEmail}`);
    console.log(`👕 Design : "${text}" en couleur ${color}`);
    console.log("-----------------------------------------");

    // 3. On répond au site que tout est OK
    res.json({ 
        success: true, 
        message: `Merci ${customerName}, ta commande pour "${text}" est bien reçue !` 
    });
});

app.listen(PORT, () => {
    console.log(`Serveur en ligne sur le port ${PORT}`);
});
