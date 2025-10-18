// server.js

// 1. Charger les dépendances
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose'); 
const cors = require('cors');
// Si vous n'avez pas créé logger.js, vous pouvez commenter la ligne ci-dessous
const logger = require('./logger'); 

// Charger les variables d'environnement (Doit être en premier)
dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;

// =======================================================
// DÉCLARATION DU MODÈLE MONGOOSE
// =======================================================

// Schéma et Modèle simple pour les messages de contact
const contactSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const ContactMessage = mongoose.model('ContactMessage', contactSchema);

// =======================================================
// CONFIGURATION DE LA BASE DE DONNÉES
// =======================================================
mongoose.connect(process.env.MONGO_URI, {
    // Les options d'anciennes versions sont maintenant obsolètes et sont supprimées
})
.then(() => logger.info('✅ Connexion MongoDB réussie !'))
.catch(err => {
    logger.error('❌ Erreur de connexion MongoDB:', { 
        message: err.message, 
        uri: process.env.MONGO_URI ? 'URI fournie' : 'URI manquante'
    });
    // Dans un environnement de production (comme Vercel), cette erreur est fatale.
});


// =======================================================
// MIDDLEWARES
// =======================================================

// --- Configuration CORS (Temporairement large pour résoudre l'Erreur Réseau) ---
// Vous devriez revenir à 'https://anouarsab.github.io' une fois que cela fonctionne.
const corsOptions = {
    origin: '*', // Autorise TOUTES les origines pour le test. 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Middlewares pour parser les corps de requête JSON et URL-encoded
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


// =======================================================
// ROUTES
// =======================================================

// Route d'accueil pour vérifier que le serveur est en ligne
app.get('/', (req, res) => {
    res.status(200).send('Serveur de Portfolio en ligne ! Le Back-end et MongoDB sont OK.');
});

// Route pour le Formulaire de Contact (Route simplifiée: /contact)
app.post('/contact', async (req, res) => {
    try {
        const { nom, email, message } = req.body;

        // 1. Validation : Champs requis
        if (!nom || !email || !message) {
            return res.status(400).json({ success: false, message: 'Tous les champs sont requis.' });
        }
        
        // 2. Validation : Format de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/; 
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Veuillez fournir une adresse email valide.' });
        }
        
        // 3. ENREGISTREMENT DANS LA BASE DE DONNÉES
        const newMessage = new ContactMessage({ nom, email, message });
        await newMessage.save();

        logger.info(`Message de contact enregistré: ${nom} (${email})`);

        // 4. Réponse envoyée au Front-end
        res.status(200).json({ 
            success: true, 
            message: 'Message envoyé et enregistré !',
        });

    } catch (error) {
        // En cas d'erreur Mongoose (par exemple, un problème de connexion BDD)
        logger.error(`Erreur critique sur la route /contact: ${error.message}`, { 
            stack: error.stack, 
            inputData: req.body 
        }); 
        
        // Réponse générique d'erreur pour le client
        res.status(500).json({ 
            success: false, 
            message: "Une erreur interne est survenue. Le problème a été enregistré pour diagnostic." 
        });
    }
});


// =======================================================
// DÉMARRAGE DU SERVEUR
// =======================================================
app.listen(PORT, () => {
    logger.info(`Serveur démarré sur le port http://localhost:${PORT}`);
});
