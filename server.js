// server.js - Fichier principal de l'application Express/Node.js

const express = require('express');
const cors = require('cors'); // Import de la librairie CORS
const app = express();
const port = process.env.PORT || 3000;

// URL de votre Front-end sur GitHub Pages.
// C'est l'URL que le serveur doit autoriser.
const FRONTEND_ORIGIN = 'https://anouarsab.github.io'; 

// --- Configuration CORS ---
const corsOptions = {
    // 1. Définir l'origine autorisée pour les requêtes (votre portfolio)
    origin: FRONTEND_ORIGIN, 
    
    // 2. Définir les méthodes HTTP autorisées (POST est obligatoire pour le formulaire)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    
    // 3. Permettre au serveur d'envoyer les en-têtes d'état de succès pour les requêtes OPTIONS
    optionsSuccessStatus: 204 
};

// --- MIDDLEWARES ---

// Appliquer la configuration CORS à toutes les routes
app.use(cors(corsOptions));

// Middleware pour parser le corps des requêtes en JSON (nécessaire pour req.body)
app.use(express.json());


// =======================================================
// ROUTES DE L'APPLICATION
// =======================================================

// Route de test simple (GET)
app.get('/', (req, res) => {
    res.status(200).send('API de Mikesonna en ligne ! Prête pour le contact.');
});

// Route de contact (POST) - Gère le formulaire
app.post('/contact', async (req, res) => {
    const { nom, email, message } = req.body;

    if (!nom || !email || !message) {
        return res.status(400).json({ success: false, message: 'Veuillez remplir tous les champs obligatoires.' });
    }

    try {
        // ------------------------------------------------------------------
        // *** LOGIQUE À INTÉGRER ICI ***
        // Si vous utilisez MongoDB/Mongoose, la logique d'enregistrement va ici.
        // Si vous utilisez Nodemailer, la logique d'envoi d'email va ici.
        // ------------------------------------------------------------------

        // Simulation de l'enregistrement et de l'envoi
        console.log(`Nouveau message reçu: Nom: ${nom}, Email: ${email}`);
        
        // Envoi de la réponse de succès au Front-end
        res.status(200).json({ 
            success: true, 
            message: 'Message envoyé et enregistré avec succès !' 
        });

    } catch (error) {
        console.error('Erreur lors du traitement du message:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur interne. Contactez l\'administrateur.' 
        });
    }
});


// =======================================================
// DÉMARRAGE DU SERVEUR
// IMPORTANT : Vercel n'utilise pas 'app.listen' mais exporte 'module.exports = app'
// Nous conservons app.listen pour les tests en local.
// =======================================================

app.listen(port, () => {
    console.log(`Serveur Express démarré sur le port ${port}`);
});

// Pour Vercel, l'exportation du module est nécessaire au bon fonctionnement.
module.exports = app; 
