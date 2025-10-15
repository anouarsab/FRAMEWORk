    const winston = require('winston');

    const logger = winston.createLogger({
      level: 'info', // Niveau minimum d'information à enregistrer
      format: winston.format.json(),
      transports: [
        // Transport pour la Console (pour le développement local)
        new winston.transports.Console({
          format: winston.format.simple(),
          level: 'debug', 
        }),
        
        // Transport pour le Fichier (sera visible dans les logs Vercel si l'environnement le permet, ou en local)
        new winston.transports.File({ 
          filename: 'error.log', 
          level: 'error',
        }),
        new winston.transports.File({ 
          filename: 'combined.log', 
        }),
      ],
    });

    module.exports = logger;
    
