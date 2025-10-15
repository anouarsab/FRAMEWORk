// 1. Charger les dépendances (Ajoutez 'cors')
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose'); 
const cors = require('cors'); // <--- ASSUREZ-VOUS QUE CELA EST LÀ

// Charger les variables d'environnement
dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;

// --- DÉBUT : Configuration CORS ---
// L'URL de votre site Front-end sur GitHub Pages
const allowedOrigin = 'https://anouarsab.github.io'; 

const corsOptions = {
  origin: function (origin, callback) {
    // Autorise si l'origine est autorisée OU si c'est une requête sans origine (comme Postman/Thunder Client)
    if (origin === allowedOrigin || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'POST,GET', // N'autorise que les méthodes utilisées (GET pour l'accueil, POST pour le formulaire)
};

// 2. Middleware
app.use(cors(corsOptions)); // <--- UTILISEZ LA NOUVELLE CONFIGURATION
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// 3. Route d'accueil
app.get('/', (req, res) => {
    res.send('Serveur de Portfolio en ligne ! Le Back-end et MongoDB sont OK.');
});

// 4. Route pour le Formulaire de Contact (MISE À JOUR)
app.post('/api/contact', async (req, res) => {
    const { nom, email, message } = req.body;

    // Validation 1 : Tous les champs sont requis
    if (!nom || !email || !message) {
        return res.status(400).json({ success: false, message: 'Tous les champs sont requis.' });
    }

    // Validation 2 : Format de l'email avec Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/; 
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Veuillez fournir une adresse email valide.' });
    }
    
    // Si la validation passe, on enregistre uniquement dans la base de données
    try {
        // ENREGISTREMENT DANS LA BASE DE DONNÉES
        const newMessage = new ContactMessage({ nom, email, message });
        await newMessage.save();

        console.log(`\n✅ Message de ${nom} enregistré en base de données (Email désactivé).`);

        // Réponse envoyée au Front-end
        res.status(200).json({ 
            success: true, 
            message: 'Message envoyé et enregistré ! (Vous devrez vérifier la base de données).',
        });
    } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde du message en base de données :', error);
        res.status(500).json({ success: false, message: 'Erreur serveur lors de l\'enregistrement.' });
    }
});

// 5. Démarrer le serveur
app.listen(PORT, () => {
    console.log(`\nServeur démarré sur le port http://localhost:${PORT}`);
});