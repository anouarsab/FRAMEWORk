// script.js - Logique Frontend

document.addEventListener('DOMContentLoaded', () => {
    
    // IMPORTANT : Utilisez l'URL de base de votre déploiement Vercel
    const VERCEL_API_URL = 'https://framewo-o3esye80k-anouarsabs-projects.vercel.app'; 

    const SECTIONS = document.querySelectorAll('main section');
    const NAV_ITEMS = document.querySelectorAll('.nav-item');
    
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = document.getElementById('menu-icon');

    const typewriterElement = document.getElementById('typewriter');
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

    // Gestion de l'ouverture/fermeture du menu mobile
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            // Change l'icône de bars à times (X)
            menuIcon.classList.toggle('fa-bars');
            menuIcon.classList.toggle('fa-xmark'); 
        });

        // Fermer le menu lors du clic sur un lien (sur mobile)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('open');
                    menuIcon.classList.remove('fa-xmark');
                    menuIcon.classList.add('fa-bars');
                }
            });
        });
    }

    const revealElements = document.querySelectorAll('.reveal');
    const navbar = document.getElementById('navbar');
    const heroSection = document.querySelector('.hero');
    // Calcule la hauteur pour le déclenchement du changement de couleur de la navbar
    const heroHeight = heroSection ? heroSection.offsetHeight * 0.5 : 300; 

    function checkScrollAnimations() {
        // Animation au défilement (Scroll Reveal)
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const revealPoint = window.innerHeight * 0.8;
            if (elementTop < revealPoint) el.classList.add('active');
        });

        // Changement de style de la Navbar au défilement
        if (window.scrollY > heroHeight) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Activation du lien de navigation
        let current = '';
        SECTIONS.forEach(section => {
            const sectionTop = section.offsetTop;
            // Utilise la hauteur de la navbar pour un décalage plus précis
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - navbar.offsetHeight - 10) { 
                current = section.getAttribute('id');
            }
        });

        NAV_ITEMS.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').substring(1) === current) {
                a.classList.add('active');
            }
        });
    }


    // ----------------------------------------
    // Gestion du Formulaire de Contact
    // ----------------------------------------
    const contactForm = document.getElementById('contact-form');
    const messageStatus = document.querySelector('.message-status');
    const submitButton = contactForm ? contactForm.querySelector('button[type="submit"]') : null;


    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validation simple
            if (!submitButton) return; 

            submitButton.disabled = true;
            messageStatus.textContent = 'Envoi en cours...';
            messageStatus.style.color = '#333';

            const nom = contactForm.nom.value;
            const email = contactForm.email.value;
            const message = contactForm.message.value;

            // Protection contre les erreurs réseau ou timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout après 10 secondes

            try {
                // Utilisation de VERCEL_API_URL + '/api/contact'
                const response = await fetch(`${VERCEL_API_URL}/api/contact`, { 
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
                    messageStatus.textContent = 'Erreur inconnue. Vérifiez Vercel.';
                    messageStatus.style.color = 'red';
                }
            } catch (error) {
                clearTimeout(timeoutId);
                messageStatus.textContent = error.name === 'AbortError' 
                    ? "Erreur réseau: Timeout, le serveur est peut-être endormi." 
                    : "Erreur réseau: Vérifiez Vercel/CORS (URL incorrecte?)."; // Message mis à jour
                messageStatus.style.color = 'red';
                console.error(error);
            } finally {
                submitButton.disabled = false;
            }
        });
    }

    typeWriter();
    window.addEventListener('scroll', checkScrollAnimations);
    checkScrollAnimations();
});
