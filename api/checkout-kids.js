import Stripe from 'stripe';

// Initialisation de Stripe avec ta clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Sécuriser pour n'accepter que les requêtes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { amount, currency, description } = req.body;

    // Création de l'intention de paiement
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Montant en cents (ex: 2000 pour 20.00$)
      currency: currency || 'cad',
      description: description || 'Achat collection Kids',
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
