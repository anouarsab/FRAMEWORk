// server.js - Backend Express pour le formulaire de contact

const express = require('express');
const cors = require('cors'); 
const mongoose = require('mongoose');
const nodemailer = require('nodemailer'); // Pour l'envoi d'emails (optionnel)
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// -----------------------------
// CONFIGURATION CORS
// -----------------------------
const FRONTEND_ORIGIN = 'https://github.com/anouarsab/FRAMEWORk.git' // Change selon ton site //

const corsOptions = {
    origin: FRONTEND_ORIGIN,
    methods: ['GET', 'POST'],
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());

// -----------------------------
// CONNEXION MONGODB
// -----------------------------
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';

mongoose.connect(MONGO_URI)
    .then(() => console.log('Connexion MongoDB réussie !'))
    .catch(err => console.error('Erreur de connexion MongoDB:', err));

// -----------------------------
// SCHÉMA & MODÈLE MESSAGE
// -----------------------------
const messageSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// -----------------------------
// ROUTES
// -----------------------------
app.get('/', (req, res) => {
    res.status(200).send('API de Mikesonna en ligne !');
});

// POST /contact
app.post('/contact', async (req, res) => {
    const { nom, email, message } = req.body;

    if (!nom || !email || !message) {
        return res.status(400).json({ success: false, message: 'Tous les champs sont obligatoires.' });
    }

    try {
        // Enregistrement dans MongoDB
        const newMessage = new Message({ nom, email, message });
        await newMessage.save();
        console.log(`Nouveau message de ${nom} (${email})`);

        // Optionnel : envoi email via Nodemailer
        if (process.env.SMTP_HOST) {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT || 587,
                secure: false,
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

            console.log('Email envoyé à l\'administrateur.');
        }

        res.status(200).json({ success: true, message: 'Message envoyé et enregistré avec succès !' });

    } catch (error) {
        console.error('Erreur lors de l\'enregistrement ou envoi:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur. Contactez l’administrateur.' });
    }
});

// -----------------------------
// LANCEMENT DU SERVEUR
// -----------------------------
app.listen(port, () => {
    console.log(`Serveur Express démarré sur le port ${port}`);
});

module.exports = app;
