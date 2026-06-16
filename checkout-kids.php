<?php
// checkout-kids.php
header('Content-Type: application/json');

// 1. Charge l'autoloader de Stripe (ajuste le chemin selon ton installation, ex: vendor/autoload.php)
require_once 'vendor/autoload.php';

// Insertion de ta clé secrète Stripe existante
\Stripe\Stripe::setApiKey('sk_live_TON_ANCIENNE_CLE_SECRET'); 
// (Pour tes tests cette nuit, tu peux utiliser ta clé test 'sk_test_...')

// Récupérer le contenu du panier envoyé par le JavaScript
$input = json_decode(file_get_contents('php://input'), true);
$items = $input['items'] ?? [];

if (empty($items)) {
    echo json_encode(['error' => 'Le panier est vide.']);
    exit;
}

$line_items = [];

// 2. Boucler sur les items du panier pour bâtir la commande Stripe
foreach ($items as $item) {
    $line_items[] = [
        'price_data' => [
            'currency' => 'cad',
            'product_data' => [
                'name' => $item['name'],
                'description' => 'Artiste : ' . $item['artist'],
                // On passe l'image du t-shirt pour qu'elle s'affiche sur la page Stripe
                'images' => ['https://artistmind.ca' . $item['image']], 
                'metadata' => [
                    'artiste' => $item['artist'],
                    'image_path' => $item['image']
                ]
            ],
            // Stripe calcule en sous (29.99 $ * 100 = 2999) - Taxes incluses !
            'unit_amount' => number_format($item['price'] * 100, 0, '.', ''),
        ],
        'quantity' => $item['quantity'],
    ];
}

try {
    // 3. Création de la session d'achat Stripe Checkout
    $session = \Stripe\Checkout\Session::create([
        'payment_method_types' => ['card'],
        'line_items' => $line_items,
        'mode' => 'payment',
        
        // 🛠️ CORRECTIF 1 : Forcer la collecte de l'adresse de livraison au Canada
        'shipping_address_collection' => [
            'allowed_countries' => ['CA'],
        ],

        // 🛠️ CORRECTIF 2 : Injecter tes frais de livraison fixes de 9.99 $ (999 sous)
        'shipping_options' => [
            [
                'shipping_rate_data' => [
                    'type' => 'fixed_amount',
                    'fixed_amount' => [
                        'amount' => 999, 
                        'currency' => 'cad',
                    ],
                    'display_name' => 'Livraison Standard Artist Mind',
                    'delivery_estimate' => [
                        'minimum' => ['unit' => 'business_day', 'value' => 3],
                        'maximum' => ['unit' => 'business_day', 'value' => 7],
                    ]
                ]
            ]
        ],
        
        // Liens de redirection après l'achat
        'success_url' => 'https://artistmind.ca/success.html',
        'cancel_url' => 'https://artistmind.ca/kids.html',
    ]);

    // Renvoyer l'URL de paiement sécurisée au JavaScript
    echo json_encode(['url' => $session->url]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
