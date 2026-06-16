<?php
// admin/upload-kids.php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $targetDir = "../uploads/";
    
    // Créer le dossier s'il n'existe pas
    if (!file_exists($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

    // Infos du produit
    $name = $_POST['name'] ?? 'Édition Limitée';
    $artist = $_POST['artist'] ?? 'Artiste Invité';
    $price = $_POST['price'] ?? '29.99';
    
    // Gestion de l'image
    $fileName = basename($_FILES["image"]["name"]);
    $targetFilePath = $targetDir . time() . "_" . $fileName; // Évite les doublons avec un timestamp
    $fileType = pathinfo($targetFilePath, PATHINFO_EXTENSION);

    // Autoriser certains formats
    $allowTypes = array('jpg', 'png', 'jpeg', 'gif', 'webp');
    if (in_array(strtolower($fileType), $allowTypes)) {
        if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFilePath)) {
            
            // Chemin final à enregistrer pour le site web
            $webPath = str_replace("../", "/", $targetFilePath);

            // Charger les produits existants
            $jsonFile = "../products.json";
            $currentProducts = [];
            if (file_exists($jsonFile)) {
                $currentProducts = json_decode(file_get_contents($jsonFile), true) ?? [];
            }

            // Ajouter le nouveau produit
            $newProduct = [
                "name" => $name,
                "artist" => $artist,
                "price" => (float)$price,
                "image" => $webPath
            ];
            $currentProducts[] = $newProduct;

            // Sauvegarder dans le fichier JSON
            file_put_contents($jsonFile, json_encode($currentProducts, JSON_PRETTY_PRINT));

            echo json_encode(["status" => "success", "message" => "Produit ajouté avec succès !"]);
            exit;
        }
    }
    echo json_encode(["status" => "error", "message" => "Échec de l'upload."]);
    exit;
}
?>
