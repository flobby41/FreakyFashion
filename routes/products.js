const express = require('express');
const router = express.Router();
const db = require('../db/db');
const multer = require('multer'); // Middleware pour gérer les fichiers

router.get('/', (req, res)=>{
  const sql = 
  'SELECT id, name, price, brand, picture, slug FROM products ORDER BY RANDOM() LIMIT 8'
      
  db.all(sql, [], function(err, rows){
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send("Internal Server Error");
    }
  res.render('products', {products: rows})
})
})



router.get('/search', (req, res) => {
  const searchQuery = req.query.query;
  // Normalisation : enlever les espaces et les tirets du terme de recherche
  const normalizedQuery = searchQuery.replace(/[-\s]/g, '');
  const sql = `
    SELECT id, name, price, brand, picture, slug 
    FROM products 
    WHERE REPLACE(REPLACE(name, '-', ''), ' ', '') LIKE ?
  `;
  const params = [`%${normalizedQuery}%`];

  db.all(sql, params, (err, products) => {
    if (err) {
      console.error("Erreur lors de la recherche des produits:", err);
      res.status(500).send("Erreur du serveur");
    } else {
      res.render('search-results', { products, searchQuery });
    }
  });
});
// Route pour afficher les produits similaires
router.get('/:slug', (req, res) => {
  const slug = req.params.slug.toLowerCase();
  console.log('slug : ' + slug)
  // Requête pour le produit principal
  const mainProductSql = 'SELECT id, name, price, brand, picture, slug FROM products WHERE slug = ?';

  db.get(mainProductSql, [slug], (err, product) => {
    if (err) {
      console.error("Error fetching product:", err);
      res.status(500).send("Internal Server Error");
    } else if (product) {
      // Requête pour récupérer 8 produits aléatoires pour la section "Produits similaires"
      const similarProductsSql = 'SELECT id, name, price, brand, picture, slug FROM products ORDER BY RANDOM() LIMIT 8';
      
      db.all(similarProductsSql, [], (err, similarProducts) => {
        if (err) {
          console.error("Error fetching similar products:", err);
          res.status(500).send("Internal Server Error");
        } else {
          // Rendre la vue avec le produit principal et les produits similaires
          console.log('product : ' + product)
          console.log('Similarproduct : ' + similarProducts)
          res.render('products-details', { product, similarProducts });
        }
      });
    } else {
      res.status(404).send('Product not found');
    }
  });
});
router.get('/api/products', (req, res) => {
  const sql = 'SELECT id, name, price, brand, picture, slug, SKU FROM products';
  db.all(sql, [], (err, products) => {
    if (err) {
      console.error("Error fetching products:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(products); // Retourne les produits en JSON
    }
  });
});
router.delete('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const sql = 'DELETE FROM products WHERE id = ?';
  
  db.run(sql, productId, function(err) {
    if (err) {
      console.error("Erreur lors de la suppression du produit :", err);
      res.status(500).json({ error: "Erreur du serveur" });
    } else {
      res.status(200).json({ message: "Produit supprimé avec succès" });
    }
  });
});


const upload = multer({ dest: 'uploads/' }); // Dossier temporaire pour les fichiers

router.post('/api/products', upload.single('filename'), (req, res) => {
  console.log("Données reçues :", req.body); // Debug: voir les données reçues
  console.log("Fichier reçu :", req.file); // Debug: voir le fichier reçu
  const { namn, Beskrivning, brand, SKU, Pris, Publiseringsdatum } = req.body;
  const filename = req.file ? req.file.filename : null; // Nom du fichier téléchargé
  const originalname = req.file ? req.file.originalname : null; // Nom du fichier original
  
  // Ajoutez une requête pour insérer le produit dans la base de données
  const sql = `INSERT INTO products (name, description, picture, brand, SKU, price, publicationDate, uploadsName)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [namn, Beskrivning, originalname, brand, SKU, Pris, Publiseringsdatum, filename ];
  
  db.run(sql, params, function (err) {
    if (err) {
      console.error("Erreur lors de l'ajout du produit :", err);
      return res.status(500).json({ error: "Erreur lors de l'ajout du produit" });
    }
    res.status(201).json({ message: "Produit ajouté avec succès" });
  });
});
module.exports = router;