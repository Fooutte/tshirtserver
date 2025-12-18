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
    // 1. On déballe TOUT ce qui arrive du site (on extrait les données du "paquet" req.body)
    const { text, color, size, customerName, customerEmail } = req.body;

    // 2. On prépare une variable de secours au cas où la taille est manquante
    const displaySize = size || "Non précisée";

    // 3. On affiche proprement dans les logs de Render
    console.log("🚀 NOUVELLE COMMANDE REÇUE !");
    console.log(`👤 Client : ${customerName}`);
    console.log(`📧 Email  : ${customerEmail}`);
    console.log(`👕 Taille : ${displaySize}`); 
    console.log(`🎨 Design : "${text}" en couleur ${color}`);
    console.log("-----------------------------------------");

    // 4. On répond au navigateur du client
    res.json({ 
        success: true, 
        message: `Merci ${customerName}, ta commande (${displaySize}) est enregistrée !` 
    });
});

app.listen(PORT, () => {
    console.log(`Serveur en ligne sur le port ${PORT}`);
});
