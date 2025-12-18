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

app.post('/api/checkout', (req, res) => {
    const data = req.body;
    const message = `[${new Date().toLocaleString()}] COMMANDE: ${data.text} | Couleur: ${data.color}\n`;
    
    // Sur Render, les fichiers sont effacés au redémarrage, 
    // mais pour tes premiers tests, cela fonctionnera dans les logs !
    console.log("Nouvelle commande reçue :", message);
    
    fs.appendFileSync('./commandes.txt', message);
    res.json({ success: true, message: "Commande enregistrée sur le serveur Cloud !" });
});

app.listen(PORT, () => {
    console.log(`Serveur en ligne sur le port ${PORT}`);
});