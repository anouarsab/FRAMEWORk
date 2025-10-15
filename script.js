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
        // ... (votre code Scroll Reveal)
        const revealElements = document.querySelectorAll('.reveal');
        const navbar = document.getElementById('navbar');
        const heroSection = document.querySelector('.hero');
        const heroHeight = heroSection ? heroSection.offsetHeight * 0.5 : 300; 

        function checkScrollAnimations() {
            revealElements.forEach(el => {
                const elementTop = el.getBoundingClientRect().top;
                const revealPoint = window.innerHeight * 0.8;
                if (elementTop < revealPoint) {
                    el.classList.add('active');
                }
            });

            if (window.scrollY > heroHeight) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // --- 3. FONCTION : GESTION DU FORMULAIRE DE CONTACT (URL simplifiée) ---
        const contactForm = document.querySelector('.contact-form');
        const messageStatus = document.querySelector('.message-status');

        // URL de base de votre API Vercel. Attention, pas de /api ici.
        const VERCEL_API_URL = 'https://framewo-jshzwqldu-anouarsabs-projects.vercel.app'; 
        
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
                        signal: controller.signal // Ajout du signal d'annulation
                    });

                    // Annule le timeout si la requête a réussi ou échoué rapidement
                    clearTimeout(timeoutId); 

                    const result = await response.json();

                    if (response.ok && result.success) { // Vérifie le statut HTTP et le succès dans la réponse
                        messageStatus.textContent = result.message;
                        messageStatus.style.color = 'green';
                        contactForm.reset();
                    } else if (result.message) {
                         // Affiche le message d'erreur du serveur (ex: "Tous les champs sont requis")
                        messageStatus.textContent = 'Erreur: ' + result.message;
                        messageStatus.style.color = 'red';
                    } else {
                        // Erreur non spécifiée par le serveur
                        messageStatus.textContent = 'Erreur inconnue lors de la transaction.';
                        messageStatus.style.color = 'red';
                    }

                } catch (error) {
                    // Annule le timeout en cas d'erreur
                    clearTimeout(timeoutId); 

                    if (error.name === 'AbortError') {
                        messageStatus.textContent = 'Erreur réseau: Délai d\'attente dépassé (Timeout). Le serveur Vercel est peut-être endormi.';
                        messageStatus.style.color = 'orange';
                    } else {
                        messageStatus.textContent = 'Erreur réseau: Impossible de joindre le serveur Vercel.';
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
    
