const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    // Configuration des headers CORS pour autoriser ton site à appeler l'API
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Réponse rapide pour les requêtes de vérification du navigateur (OPTIONS)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        try {
            const { amount, email, metadata } = req.body;

            // Création de l'intention de paiement chez Stripe
            const paymentIntent = await stripe.paymentIntents.create({
                // On multiplie par 100 car Stripe compte en centimes (ex: 25.00$ -> 2500)
                amount: Math.round(parseFloat(amount) * 100),
                currency: 'cad',
                receipt_email: email,
                metadata: metadata, // Contient Nom, Produit, Taille, Couleur
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            // On renvoie le code secret au front-end pour afficher le formulaire
            res.status(200).send({
                clientSecret: paymentIntent.client_secret,
            });
        } catch (err) {
            console.error("Erreur Stripe:", err.message);
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(405).send('Méthode non autorisée');
    }
};
