document.addEventListener('DOMContentLoaded', () => {
    
    // ⚠️ CORRECTION : La variable doit être définie au début de la portée
    // CONFIRMEZ QUE CETTE URL EST EXACTEMENT CELLE DE VOTRE DÉPLOIEMENT VERCEL
    const VERCEL_API_URL = 'https://framewo-jshzwqldu-anouarsabs-projects.vercel.app'; 

    // --- Configuration Générale ---
    const SECTIONS = document.querySelectorAll('main section');
    const NAV_ITEMS = document.querySelectorAll('.nav-item');
    
    // Éléments du Menu Mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = document.getElementById('menu-icon');

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

        // GESTION DE LA CLASSE 'ACTIVE' SUR LES LIENS
        let current = 'accueil'; 

        SECTIONS.forEach(section => {
            const sectionTop = section.offsetTop; 
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - sectionHeight / 2) {
                current = section.getAttribute('id');
            }
        });

        NAV_ITEMS.forEach(item => {
            item.classList.remove('active');
            if (item.href.includes(current)) {
                item.classList.add('active');
            }
        });
    }

    // --- 3. GESTION DU MENU MOBILE (Hamburger) ---
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            // Change l'icône : hamburger <-> croix
            if (navLinks.classList.contains('open')) {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-times');
            } else {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        });

        // Ferme le menu après un clic sur un lien (pour le mode mobile)
        NAV_ITEMS.forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('open');
                    menuIcon.classList.remove('fa-times');
                    menuIcon.classList.add('fa-bars');
                }
            });
        });
    }
    
    // --- 4. FONCTION : GESTION DU FORMULAIRE DE CONTACT (Final) ---
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

            const timeout = 10000; 
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            try {
                // Utilisation de l'URL Vercel qui est maintenant définie au début du script
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