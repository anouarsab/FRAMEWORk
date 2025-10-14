document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. FONCTION : EFFET MACHINE À ÉCRIRE (Typewriter) ---
    const typewriterElement = document.getElementById('typewriter');
    const textToType = "Je suis Mikesonna, Développeur Web."; 
    let i = 0;

    function typeWriter() {
        if (i < textToType.length) {
            typewriterElement.innerHTML += textToType.charAt(i);
            i++;
            setTimeout(typeWriter, 70);
        } else {
            typewriterElement.classList.add('finished-typing'); 
        }
    }
    
    // --- 2. FONCTION : ANIMATION AU SCROLL (Scroll Reveal) ---
    // ... (Tout le code des fonctions checkScrollAnimations, etc. est ici) ...
    const revealElements = document.querySelectorAll('.reveal');
    const navbar = document.getElementById('navbar');
    const heroSection = document.querySelector('.hero');
    const heroHeight = heroSection ? heroSection.offsetHeight * 0.5 : 300; 

    function checkScrollAnimations() {
        // ANIMATION 'REVEAL'
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const revealPoint = window.innerHeight * 0.8;
            if (elementTop < revealPoint) {
                el.classList.add('active');
            }
        });

        // ANIMATION 'NAVBAR FIXE'
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

            try {
                const response = await fetch('https://framewo-jshzwqldu-anouarsabs-projects.vercel.app/api/contact', { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nom, email, message })
                });

                const result = await response.json();

                if (result.success) {
                    messageStatus.textContent = result.message;
                    messageStatus.style.color = 'green';
                    contactForm.reset();
                } else {
                    messageStatus.textContent = 'Erreur lors de l\'envoi : ' + result.message;
                    messageStatus.style.color = 'red';
                }

            } catch (error) {
                messageStatus.textContent = 'Erreur réseau : Vérifiez que le serveur est démarré (npm run dev).';
                messageStatus.style.color = 'red';
                console.error('Erreur Fetch API:', error);
            }
        });
    }

    // --- DÉCLENCHEMENT DES FONCTIONS (C'est ici qu'elles doivent être !) ---
    
    typeWriter(); // <-- Doit être DANS le bloc DOMContentLoaded
    window.addEventListener('scroll', checkScrollAnimations);
    checkScrollAnimations(); 
    
}); // <-- Le } final du bloc DOMContentLoaded

