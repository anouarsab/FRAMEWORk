document.addEventListener('DOMContentLoaded', () => {
    
    const VERCEL_API_URL = 'https://framewo-jshzwqldu-anouarsabs-projects.vercel.app'; 

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

    const revealElements = document.querySelectorAll('.reveal');
    const navbar = document.getElementById('navbar');
    const heroSection = document.querySelector('.hero');
    const heroHeight = heroSection ? heroSection.offsetHeight * 0.5 : 300; 

    function checkScrollAnimations() {
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const revealPoint = window.innerHeight * 0.8;
            if (elementTop < revealPoint) el.classList.add('active');
        });

        if (window.scrollY > heroHeight) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');

        let current = 'accueil'; 
        SECTIONS.forEach(section => {
            const sectionTop = section.offsetTop; 
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - sectionHeight / 2) current = section.getAttribute('id');
        });

        NAV_ITEMS.forEach(item => {
            item.classList.remove('active');
            if (item.href.includes(current)) item.classList.add('active');
        });
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            if (navLinks.classList.contains('open')) {
                menuIcon.classList.replace('fa-bars', 'fa-times');
            } else {
                menuIcon.classList.replace('fa-times', 'fa-bars');
            }
        });

        NAV_ITEMS.forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('open');
                    menuIcon.classList.replace('fa-times', 'fa-bars');
                }
            });
        });
    }

    // --- FORMULAIRE CONTACT ---
    const contactForm = document.getElementById('contact-form');
    const messageStatus = document.querySelector('.message-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;

            const nom = contactForm.querySelector('input[name="nom"]').value;
            const email = contactForm.querySelector('input[name="email"]').value;
            const message = contactForm.querySelector('textarea[name="message"]').value;

            if (!nom || !email || !message) {
                messageStatus.textContent = 'Veuillez remplir tous les champs !';
                messageStatus.style.color = 'red';
                submitButton.disabled = false;
                return;
            }

            messageStatus.textContent = 'Envoi en cours...';
            messageStatus.style.color = '#007bff';

            const timeout = 10000; 
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

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
