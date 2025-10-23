document.addEventListener('DOMContentLoaded', () => {
    
    // NOTE: Remplacer l'URL Vercel ci-dessous par la VRAIE URL de votre backend
    // Si votre backend est déployé sur Vercel, l'URL sera 'https://[nom-de-votre-projet].vercel.app'
    const VERCEL_API_URL = 'https://framewo-o3esye80k-anouarsabs-projects.vercel.app'; 

    const SECTIONS = document.querySelectorAll('main section');
    const NAV_ITEMS = document.querySelectorAll('.nav-item');
    
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = document.getElementById('menu-icon');

    const typewriterElement = document.getElementById('typewriter');
    const textToType = "Développeur Web Full-Stack."; 
    let i = 0;

    /**
     * Initialise l'effet de machine à écrire sur l'élément #typewriter.
     */
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

    const revealElements = document.querySelectorAll('.reveal');
    const navbar = document.getElementById('navbar');
    const heroSection = document.querySelector('.hero');
    // Détermine la hauteur de la section Hero pour changer la couleur de la navbar au scroll
    const heroHeight = heroSection ? heroSection.offsetHeight * 0.5 : 300; 

    /**
     * Gère les animations au scroll et le changement de style de la navbar.
     */
    function checkScrollAnimations() {
        // Animation "Reveal"
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const revealPoint = window.innerHeight * 0.8;
            if (elementTop < revealPoint) el.classList.add('active');
        });

        // Changement de style de la navbar (scrolled)
        if (window.scrollY > heroHeight) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Mise en évidence du lien de navigation actif
        let current = '';
        SECTIONS.forEach(section => {
            const sectionTop = section.offsetTop;
            // On vérifie le point à 150px du haut de la fenêtre pour changer la section active
            if (window.scrollY >= sectionTop - 150) {
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
    
    // ------------------------------------
    // LOGIQUE DU MENU MOBILE (HAMBURGER)
    // ------------------------------------

    /**
     * Bascule l'état du menu mobile (ouvert/fermé)
     */
    function toggleMenu() {
        navLinks.classList.toggle('open');
        // Changer l'icône : bars <-> times (X)
        const isOpen = navLinks.classList.contains('open');
        menuIcon.classList.toggle('fa-bars', !isOpen);
        menuIcon.classList.toggle('fa-times', isOpen);
        // Empêcher le scroll du body lorsque le menu est ouvert
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    }

    // Écouteur pour l'icône hamburger
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }
    
    // Fermer le menu après un clic sur un lien (sur mobile)
    NAV_ITEMS.forEach(link => {
        link.addEventListener('click', () => {
            // Vérifie si le menu est actuellement ouvert (pour ne pas perturber la navigation sur desktop)
            if (window.innerWidth <= 768) {
                 // Ferme le menu s'il est ouvert
                 if (navLinks.classList.contains('open')) {
                    toggleMenu(); 
                 }
            }
        });
    });

    // ------------------------------------
    // LOGIQUE DU FORMULAIRE DE CONTACT
    // ------------------------------------
    const contactForm = document.getElementById('contact-form');
    const messageStatus = document.querySelector('.message-status');
    const submitButton = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!submitButton) return;

            submitButton.disabled = true;
            messageStatus.textContent = 'Envoi en cours...';
            messageStatus.style.color = '#007bff';

            const nom = contactForm.querySelector('input[name="nom"]').value;
            const email = contactForm.querySelector('input[name="email"]').value;
            const message = contactForm.querySelector('textarea[name="message"]').value;
            
            // Timeout pour éviter une attente infinie si le backend est endormi (Vercel free tier)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 secondes de timeout

            try {
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
                    messageStatus.textContent = 'Erreur inconnue. Vérifiez Vercel.';
                    messageStatus.style.color = 'red';
                }
            } catch (error) {
                clearTimeout(timeoutId);
                messageStatus.textContent = error.name === 'AbortError' 
                    ? "Erreur réseau: Timeout, le serveur est peut-être endormi." 
                    : "Erreur réseau: Vérifiez Vercel/CORS.";
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
