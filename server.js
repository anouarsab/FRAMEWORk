// server.js - Fichier principal de l'application Express/Node.js

const express = require('express');
const cors = require('cors'); 
const mongoose = require('mongoose'); // 1. IMPORT MONGOOSE
const app = express();
const port = process.env.PORT || 3000;

// URL de votre Front-end sur GitHub Pages.
const FRONTEND_ORIGIN = 'https://anouarsab.github.io'; 
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio'; // 2. URI DE CONNEXION (Utilisez process.env.MONGO_URI sur Vercel !)

// --- Configuration CORS ---
const corsOptions = {
    origin: FRONTEND_ORIGIN, 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    optionsSuccessStatus: 204 
};

// --- CONNEXION MONGOOSE ---
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connexion MongoDB réussie !'))
    .catch(err => console.error('Erreur de connexion MongoDB:', err));

// --- SCHÉMA ET MODÈLE DE MESSAGE ---
const messageSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// --- MIDDLEWARES ---
app.use(cors(corsOptions));
app.use(express.json());

// =======================================================
// ROUTES DE L'APPLICATION
// =======================================================

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
        // 3. LOGIQUE D'ENREGISTREMENT DANS MONGO DB
        const newMessage = new Message({ nom, email, message });
        await newMessage.save();

        console.log(`Nouveau message enregistré : ${nom} (${email})`);

        // Si vous avez Nodemailer, la logique d'envoi d'email irait ici
        
        res.status(200).json({ 
            success: true, 
            message: 'Message envoyé et enregistré avec succès !' 
        });

    } catch (error) {
        console.error('Erreur lors de l\'enregistrement du message dans MongoDB:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur interne lors de l\'enregistrement. Contactez l\'administrateur.' 
        });
    }
});


// =======================================================
// DÉMARRAGE DU SERVEUR
// =======================================================

app.listen(port, () => {
    console.log(`Serveur Express démarré sur le port ${port}`);
});

module.exports = app; 
