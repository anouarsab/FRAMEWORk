// utils/emailService.js
const nodemailer = require('nodemailer');
const logger = require('../logger');

/**
 * Configure et envoie un email de notification à l'administrateur.
 * @param {string} nom - Nom de l'expéditeur.
 * @param {string} email - Email de l'expéditeur.
 * @param {string} message - Contenu du message.
 */
async function sendContactEmail({ nom, email, message }) {
    if (!process.env.SMTP_HOST) {
        logger.warn('SMTP_HOST n\'est pas configuré. L\'envoi d\'email est ignoré.');
        return;
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_PORT == 465, // true pour 465 (SSL), false pour les autres (TLS)
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        await transporter.sendMail({
            from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
            to: process.env.MY_EMAIL, // Ton email
            subject: `[Portfolio] Nouveau message de ${nom}`,
            text: `Nom: ${nom}\nEmail: ${email}\nMessage:\n${message}`
        });

        logger.info('Email de notification envoyé à l\'administrateur.');
    } catch (error) {
        logger.error('Erreur lors de l\'envoi de l\'email:', error);
        // On ne propage pas l'erreur, l'enregistrement en DB reste prioritaire.
    }
}

module.exports = { sendContactEmail };