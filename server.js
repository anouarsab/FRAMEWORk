// 1. Charger les dépendances
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose'); 

// Charger les variables d'environnement
dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000; // Utilisez 5000 comme configuré dans .env

// --- Connexion à MongoDB ---
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB connecté avec succès !'))
    .catch(err => console.error('❌ Erreur de connexion MongoDB :', err));
    
// --- Modèle de Schéma pour le Contact ---
const ContactSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const ContactMessage = mongoose.model('ContactMessage', ContactSchema);

// 2. Middleware
app.use(cors()); 
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