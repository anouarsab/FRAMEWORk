// server.js - Backend Express pour le formulaire de contact

const express = require('express');
const cors = require('cors'); 
const mongoose = require('mongoose');
const logger = require('./logger');
const Message = require('./models/Message'); // Nouveau : Import du Model Mongoose
const { sendContactEmail } = require('./utils/emailService'); // Nouveau : Import du service d'email
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';

// -----------------------------\
// CONFIGURATION CORS
// -----------------------------\
// Utilisation d'une variable d'environnement pour une flexibilité accrue en production
const allowedOrigins = (process.env.CORS_ORIGINS || 'https://anouarsab.github.io,http://localhost:5500').split(',');

app.use(cors({
    origin: (origin, callback) => {
        // Autorise les requêtes sans origine (comme les outils REST ou same-origin)
        if (!origin) return callback(null, true); 
        
        // Vérifie si l'origine est dans la liste autorisée
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        // Blocage
        const msg = `CORS bloqué pour l'origine: ${origin}`;
        logger.warn(msg);
        return callback(new Error(msg), false);
    },
    methods: ['POST'], // Limite les méthodes permises
    credentials: true
}));

app.use(express.json());

// -----------------------------\
// CONNEXION MONGODB
// -----------------------------\
mongoose.connect(MONGO_URI)
    .then(() => logger.info('✅ Connexion MongoDB réussie !'))
    .catch(error => {
        logger.error('❌ Erreur de connexion MongoDB:', error);
        // Optionnel: Quitter l'application si la connexion DB est critique
        // process.exit(1); 
    });


// -----------------------------\
// ROUTE DE CONTACT
// -----------------------------\
app.post('/api/contact', async (req, res) => {
    // 1. Validation de base et Destructuring
    const { nom, email, message } = req.body;

    if (!nom || !email || !message) {
        logger.warn('Tentative de soumission avec champs manquants.');
        return res.status(400).json({ success: false, message: 'Tous les champs sont requis.' });
    }

    try {
        // 2. Enregistrement du message dans la base de données
        const newMessage = new Message({ nom, email, message });
        await newMessage.save();
        logger.info(`Nouveau message de ${nom} (${email}) enregistré (ID: ${newMessage._id}).`);

        // 3. Optionnel : Envoi de l'email de notification (non bloquant)
        sendContactEmail({ nom, email, message });

        // 4. Réponse au client
        res.status(200).json({ success: true, message: 'Message envoyé et enregistré avec succès ! Merci de m\'avoir contacté.' });

    } catch (error) {
        // Gérer les erreurs de validation Mongoose
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            logger.warn('Erreur de validation des données:', messages);
            return res.status(400).json({ success: false, message: messages.join(' ') });
        }
        
        // Gérer les autres erreurs serveur
        logger.error('Erreur lors de l\'enregistrement:', error.stack);
        res.status(500).json({ success: false, message: 'Erreur serveur interne. Veuillez réessayer plus tard.' });
    }
});

// -----------------------------\
// ROUTE SANITAIRE (PING)
// -----------------------------\
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});


// -----------------------------\
// LANCEMENT DU SERVEUR
// -----------------------------\
// Gestion des erreurs non capturées pour plus de robustesse
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.listen(port, () => {
    logger.info(`Serveur démarré sur le port http://localhost:${port}`);
});