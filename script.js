// script.js - Logique Frontend

document.addEventListener('DOMContentLoaded', () => {

    // IMPORTANT : Utiliser un chemin d'accès relatif pour le déploiement sur la même plateforme (ex: Vercel)
    const CONTACT_API_PATH = '/api/contact'; 

    const SECTIONS = document.querySelectorAll('main section');
    const NAV_ITEMS = document.querySelectorAll('.nav-item');
    
    // Éléments DOM de la navigation
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = document.getElementById('menu-icon');

    // Éléments DOM du Typewriter
    const typewriterElement = document.getElementById('typewriter');
    const textToType = "Développeur Web Full-Stack."; 
    let charIndex = 0;
    let animationFrameId = null; // ID pour requestAnimationFrame

    // -----------------------------\
    // Fonction Typewriter (Utilisation de requestAnimationFrame pour la performance)
    // -----------------------------\
    function typeWriter() {
        if (!typewriterElement) return;

        if (charIndex < textToType.length) {
            typewriterElement.innerHTML += textToType.charAt(charIndex);
            charIndex++;
            animationFrameId = requestAnimationFrame(typeWriter); // Meilleure performance
        } else {
            typewriterElement.classList.add('finished-typing'); 
        }
    }

    // -----------------------------\
    // Gestion du Menu Mobile
    // -----------------------------\
    if (menuToggle && navLinks) {
        const toggleMenu = () => {
            navLinks.classList.toggle('open');
            menuIcon.classList.toggle('fa-bars');
            menuIcon.classList.toggle('fa-times');
            // Amélioration de l'accessibilité
            menuToggle.setAttribute('aria-expanded', navLinks.classList.contains('open')); 
        };
        
        menuToggle.addEventListener('click', toggleMenu);

        // Fermer le menu lors du clic sur un lien
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('open')) {
                    toggleMenu();
                }
            });
        });
    }

    // -----------------------------\
    // Animations au Défilement (Révélation des éléments)
    // -----------------------------\
    function checkScrollAnimations() {
        const revealElements = document.querySelectorAll('.reveal');
        const triggerBottom = window.innerHeight * 0.8;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < triggerBottom) {
                element.classList.add('visible');
            } else {
                 // Optionnel : permet de "cacher" à nouveau lorsque l'utilisateur remonte (effet plus dynamique)
                element.classList.remove('visible'); 
            }
        });

        // Mise à jour de la classe 'active' pour la navigation
        SECTIONS.forEach((section, index) => {
            const sectionTop = section.offsetTop - 100; // Ajustement
            const sectionHeight = section.offsetHeight;
            const scrollPosition = window.scrollY;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                NAV_ITEMS.forEach(item => item.classList.remove('active'));
                // Le lien actif correspond au index de la section (attention aux index)
                const activeLink = document.querySelector(`.nav-links a[href="#${section.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }


    // -----------------------------\
    // Gestion du Formulaire de Contact
    // -----------------------------\
    const contactForm = document.getElementById('contact-form');
    const messageStatus = document.querySelector('#contact-form .message-status');

    if (contactForm && messageStatus) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            messageStatus.textContent = 'Envoi en cours...';
            messageStatus.style.color = '#007bff'; // Couleur de chargement

            const nom = contactForm.elements['nom'].value.trim();
            const email = contactForm.elements['email'].value.trim();
            const message = contactForm.elements['message'].value.trim();
            
            // Timeout pour gérer les serveurs "endormis" (ex: Vercel serverless)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 secondes

            try {
                const response = await fetch(CONTACT_API_PATH, {
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
                    // Gérer les erreurs 400 (validation) et 500 (serveur) du backend
                    messageStatus.textContent = 'Erreur: ' + result.message;
                    messageStatus.style.color = 'red';
                } else {
                    messageStatus.textContent = 'Erreur inconnue du serveur.';
                    messageStatus.style.color = 'red';
                }
            } catch (error) {
                clearTimeout(timeoutId);
                if (error.name === 'AbortError') {
                    messageStatus.textContent = "Erreur: Le serveur est peut-être endormi. Veuillez réessayer.";
                } else {
                    messageStatus.textContent = "Erreur réseau. Vérifiez votre connexion ou l'URL de l'API."; 
                }
                messageStatus.style.color = 'red';
                console.error(error);
            } finally {
                submitButton.disabled = false;
            }
        });
    }

    // Lancement des fonctions au chargement de la page
    typeWriter();
    window.addEventListener('scroll', checkScrollAnimations);
    window.addEventListener('resize', checkScrollAnimations); // Ajout pour la réactivité
    checkScrollAnimations();
});