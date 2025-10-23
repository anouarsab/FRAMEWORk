// server.js - Backend Express pour le formulaire de contact

const express = require('express');
const cors = require('cors'); 
const mongoose = require('mongoose');
const nodemailer = require('nodemailer'); // Pour l'envoi d'emails (optionnel)
const logger = require('./logger'); // Importation du module de log Winston
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// -----------------------------\
// CONFIGURATION CORS
// -----------------------------\
const allowedOrigins = [
  'https://anouarsab.github.io', // NOUVELLE ORIGINE : L'URL où votre portfolio est hébergé
  'http://localhost:5500'        // pour test local
];

app.use(cors({
    origin: function(origin, callback){
        if(!origin) return callback(null, true); // pour Postman ou curl
        if(allowedOrigins.indexOf(origin) === -1){
            const msg = `CORS bloqué pour l'origine: ${origin}`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST'],
    credentials: true
}));
// app.options('*', cors()); // LIGNE SUPPRIMÉE : Cause le PathError. Le middleware ci-dessus gère toutes les requêtes, y compris OPTIONS.
app.use(express.json());

// -----------------------------\
// CONNEXION MONGODB
// -----------------------------\
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';

mongoose.connect(MONGO_URI)
    .then(() => logger.info('✅ Connexion MongoDB réussie !')) // Utilisation de logger.info
    .catch(err => logger.error('Erreur de connexion MongoDB:', err)); // Utilisation de logger.error

// -----------------------------\
// SCHÉMA MONGODB
// -----------------------------\
const messageSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// -----------------------------\
// ROUTE POST POUR CONTACT
// -----------------------------\
app.post('/api/contact', async (req, res) => {
    const { nom, email, message } = req.body;

    if (!nom || !email || !message) {
        logger.warn('Tentative d\'envoi de message incomplète.');
        return res.status(400).json({ success: false, message: 'Tous les champs sont requis.' });
    }

    try {
        // 1. Enregistrer dans la base de données
        const newMessage = new Message({ nom, email, message });
        await newMessage.save();
        logger.info(`Nouveau message de ${nom} (${email}) enregistré.`); // Utilisation de logger.info

        // 2. Optionnel : envoi email via Nodemailer
        if (process.env.SMTP_HOST) {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT || 587,
                secure: false, // true pour 465, false pour les autres ports
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });

            await transporter.sendMail({
                from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
                to: process.env.MY_EMAIL, // ton email
                subject: `Nouveau message de ${nom}`,
                text: `Nom: ${nom}\nEmail: ${email}\nMessage: ${message}`
            });

            // Ligne de correction de la parenthèse et utilisation de logger
            logger.info('Email de notification envoyé à l\'administrateur.'); 

        }

        res.status(200).json({ success: true, message: 'Message envoyé et enregistré avec succès !' });

    } catch (error) {
        logger.error('Erreur lors de l\'enregistrement ou envoi:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur. Contactez l’administrateur.' });
    }
});

// -----------------------------\
// LANCEMENT DU SERVEUR
// -----------------------------\
app.listen(port, () => {
    logger.info(`Serveur démarré sur le port http://localhost:${port}`); // Utilisation de logger.info
});

module.exports = app;
