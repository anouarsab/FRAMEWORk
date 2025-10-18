document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. FONCTION : EFFET MACHINE À ÉCRIRE (Typewriter) ---
    const typewriterElement = document.getElementById('typewriter');
    // Le texte dynamique que vous souhaitez afficher
    const textToType = "Développeur Web Full-Stack."; 
    let i = 0;

    function typeWriter() {
        if (!typewriterElement) return;
        if (i < textToType.length) {
            typewriterElement.innerHTML += textToType.charAt(i);
            i++;
            setTimeout(typeWriter, 70);
        } else {
            typewriterElement.classList.add('finished-typing'); 
        }
    }
    
    // --- 2. FONCTION : ANIMATION AU SCROLL ET NAV ACTIVE ---
    const revealElements = document.querySelectorAll('.reveal');
    const navbar = document.getElementById('navbar');
    const heroSection = document.querySelector('.hero');
    const heroHeight = heroSection ? heroSection.offsetHeight * 0.5 : 300; 

    function checkScrollAnimations() {
        // GESTION DU SCROLL REVEAL
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const revealPoint = window.innerHeight * 0.8;
            if (elementTop < revealPoint) {
                el.classList.add('active');
            }
        });

        // GESTION DE LA CLASSE 'SCROLLED' SUR LA NAVBAR
        if (window.scrollY > heroHeight) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // --- 3. FONCTION : GESTION DU FORMULAIRE DE CONTACT ---
    const contactForm = document.querySelector('.contact-form');
    const messageStatus = document.querySelector('.message-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            messageStatus.textContent = 'Envoi en cours...';
            messageStatus.style.color = '#007bff';

            const nom = contactForm.querySelector('input[type="text"]').value;
            const email = contactForm.querySelector('input[type="email"]').value;
            const message = contactForm.querySelector('textarea').value;

            // --- Configuration du Timeout ---
            const timeout = 10000; // 10 secondes
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            try {
                // Utilisation de la route simplifiée /contact
                const response = await fetch(`${VERCEL_API_URL}/contact`, { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nom, email, message }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId); 

                const result = await response.json();

                if (response.ok && result.success) {
                    messageStatus.textContent = result.message;
                    messageStatus.style.color = 'green';
                    contactForm.reset();
                } else if (result.message) {
                    messageStatus.textContent = 'Erreur: ' + result.message;
                    messageStatus.style.color = 'red';
                } else {
                    messageStatus.textContent = 'Erreur inconnue lors de la transaction. Vérifiez les logs Vercel.';
                    messageStatus.style.color = 'red';
                }

            } catch (error) {
                clearTimeout(timeoutId); 

                if (error.name === 'AbortError') {
                    messageStatus.textContent = 'Erreur réseau: Délai d\'attente dépassé (Timeout). Le serveur Vercel est peut-être endormi.';
                    messageStatus.style.color = 'orange';
                } else {
                    // C'est l'erreur la plus probable pour le CORS/Démarrage serveur
                    messageStatus.textContent = 'Erreur réseau: Problème de connexion ou de CORS. Vérifiez Vercel.';
                    messageStatus.style.color = 'red';
                }
                console.error('Erreur Fetch API:', error);
            }
        });
    }

    // --- DÉCLENCHEMENT DES FONCTIONS ---
    typeWriter(); 
    window.addEventListener('scroll', checkScrollAnimations);
    checkScrollAnimations(); 
    
});
