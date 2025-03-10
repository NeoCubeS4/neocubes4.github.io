// Script principal pour le site NeoCube

// Gestion de l'écran de chargement
document.addEventListener('DOMContentLoaded', function() {
    // S'assurer que la vidéo est prête avant de masquer l'écran de chargement
    const heroVideo = document.querySelector('.hero-video');
    const loadingScreen = document.getElementById('loading-screen');
    
    // Fonction pour masquer l'écran de chargement
    function hideLoadingScreen() {
        loadingScreen.classList.add('fade-out');
        setTimeout(function() {
            loadingScreen.style.display = 'none';
        }, 500);
    }
    
    // Si la vidéo existe, attendre qu'elle soit prête à jouer
    if (heroVideo) {
        heroVideo.addEventListener('canplaythrough', function() {
            setTimeout(hideLoadingScreen, 1000);
        });
        
        // Fallback au cas où la vidéo ne se charge pas correctement
        setTimeout(hideLoadingScreen, 5000);
    } else {
        // Si pas de vidéo, simplement masquer après un délai
        setTimeout(hideLoadingScreen, 3000);
    }
    
    // Initialisation des fonctions
    adjustVideoHeight();
    setupAnimations();
    setupScrollAnimations();
    setupLauncherImageRotation();
});

// Ajustement de la hauteur de la vidéo pour correspondre au conteneur de texte
function adjustVideoHeight() {
    const titleBox = document.querySelector('.hero-text');
    const videoContainer = document.querySelector('.hero-video-container');
    
    if(titleBox && videoContainer) {
        videoContainer.style.height = `${titleBox.offsetHeight}px`;
    }
}

// Exécuter les ajustements au redimensionnement
window.addEventListener('resize', adjustVideoHeight);

// Curseur personnalisé optimisé avec throttling et effets améliorés
document.addEventListener('DOMContentLoaded', function() {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;
    
    let cursorX = 0, cursorY = 0;
    let ticking = false;
    let trailElements = [];
    let maxTrails = 5;
    
    // Créer des éléments de traînée pour un effet plus fluide
    function createTrailElements() {
        for (let i = 0; i < maxTrails; i++) {
            const trailElement = document.createElement('div');
            trailElement.classList.add('cursor-trail');
            trailElement.style.opacity = (1 - i / maxTrails) * 0.3;
            document.body.appendChild(trailElement);
            trailElements.push({
                element: trailElement,
                x: -100,
                y: -100,
                delay: i * 40 // Délai progressif pour créer l'effet de traînée
            });
        }
    }
    
    createTrailElements();
    
    // Fonction pour mettre à jour la position du curseur avec RAF et effet fluide
    function updateCursorPosition(x, y) {
        // Mise à jour du curseur principal
        cursor.style.setProperty('left', `${x}px`, 'important');
        cursor.style.setProperty('top', `${y}px`, 'important');
        
        // Mise à jour des éléments de traînée avec délais
        trailElements.forEach((trail, index) => {
            setTimeout(() => {
                trail.x = x;
                trail.y = y;
                trail.element.style.left = `${x}px`;
                trail.element.style.top = `${y}px`;
            }, trail.delay);
        });
        
        ticking = false;
    }
    
    // Écouteur d'événement optimisé pour mousemove
    document.addEventListener('mousemove', function(e) {
        cursorX = e.clientX;
        cursorY = e.clientY;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateCursorPosition(cursorX, cursorY);
            });
            ticking = true;
        }
    });
    
    // Amélioration des effets de clic
    document.addEventListener('mousedown', function(e) {
        // Appliquer l'animation de clic
        cursor.classList.add('clicking');
        
        // Créer un effet d'onde au clic
        const clickEffect = document.createElement('div');
        clickEffect.classList.add('cursor-click-effect');
        clickEffect.style.left = `${e.clientX}px`;
        clickEffect.style.top = `${e.clientY}px`;
        document.body.appendChild(clickEffect);
        
        // Supprimer l'élément après l'animation
        setTimeout(() => {
            clickEffect.remove();
        }, 600); // Durée de l'animation
    });
    
    document.addEventListener('mouseup', function() {
        // Retirer la classe après un délai pour que l'animation se termine
        setTimeout(() => {
            cursor.classList.remove('clicking');
        }, 150);
    });
    
    // Pour les cartes avec effet parallaxe
    const parallaxCards = document.querySelectorAll('.parallax-card');
    
    if (parallaxCards.length) {
        parallaxCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                cursor.classList.add('on-parallax-card');
            });
            
            card.addEventListener('mouseleave', function() {
                cursor.classList.remove('on-parallax-card');
            });
        });
    }
    
    // Assurer que le curseur est visible même après changement de page ou scroll rapide
    document.addEventListener('mouseleave', function() {
        if (cursor) {
            cursor.style.opacity = '0';
            trailElements.forEach(trail => {
                trail.element.style.opacity = '0';
            });
        }
    });

    document.addEventListener('mouseenter', function() {
        if (cursor) {
            cursor.style.opacity = '1';
            trailElements.forEach((trail, index) => {
                setTimeout(() => {
                    trail.element.style.opacity = (1 - index / maxTrails) * 0.3;
                }, index * 50);
            });
        }
    });

    // Ajout d'effet visuel sur les éléments survolés
    const cards = document.querySelectorAll('.feature-card, .social-card, .blog-post, .faq-item');
    const buttons = document.querySelectorAll('.download-btn, .download-btn-small a, .nav-item-small a, .read-more, .version-link');
    
    // Pour les cartes
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            cursor.classList.add('hover-card');
        });
        
        card.addEventListener('mouseleave', function() {
            cursor.classList.remove('hover-card');
        });
    });
    
    // Pour les boutons
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            cursor.classList.add('hover-button');
        });
        
        button.addEventListener('mouseleave', function() {
            cursor.classList.remove('hover-button');
        });
    });

    // Effet supplémentaire pour les éléments survolés
    const interactiveElements = document.querySelectorAll('a, button, .feature-card, .social-card, .blog-post, .faq-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'filter 0.3s ease';
            this.style.filter = 'contrast(1.1) brightness(1.1)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.filter = '';
        });
    });
});

// Gestion de l'effet de glow qui suit la souris sur les cartes
document.addEventListener('mousemove', function(e) {
    const cards = document.querySelectorAll('.feature-card, .social-card, .blog-post, .faq-item');
    
    cards.forEach(function(card) {
        const rect = card.getBoundingClientRect();
        const cardGlow = card.querySelector('.card-glow');
        
        if (cardGlow) {
            // Vérifier si la souris est sur la carte
            if (
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom
            ) {
                // Calculer la position relative de la souris sur la carte
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Déplacer le glow à la position de la souris
                cardGlow.style.left = `${x - 50}px`; // 50 = moitié de la largeur du glow
                cardGlow.style.top = `${y - 50}px`; // 50 = moitié de la hauteur du glow
                cardGlow.style.opacity = '0.4';
            } else {
                // Cacher le glow si la souris n'est pas sur la carte
                cardGlow.style.opacity = '0';
            }
        }
    });
});

// Transition douce entre sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Optimiser la détection de section pour le curseur
document.addEventListener('DOMContentLoaded', function() {
    const cursor = document.querySelector('.custom-cursor');
    const sections = document.querySelectorAll('section, header');
    let currentSection = null;
    let ticking = false;
    
    // Fonction pour déterminer la section actuelle
    function getCurrentSection(y) {
        for (const section of sections) {
            const rect = section.getBoundingClientRect();
            if (y >= rect.top && y <= rect.bottom) {
                return section;
            }
        }
        return null;
    }
    
    // Mise à jour optimisée du curseur
    function updateCursorClass(section) {
        // Réinitialiser les classes
        cursor.className = 'custom-cursor';
        
        // Appliquer la classe correspondante
        if (section) {
            if (section.classList.contains('section-blue')) {
                cursor.classList.add('in-section-blue');
            } else if (section.classList.contains('section-purple')) {
                cursor.classList.add('in-section-purple');
            } else if (section.classList.contains('section-green')) {
                cursor.classList.add('in-section-green');
            } else if (section.classList.contains('section-red')) {
                cursor.classList.add('in-section-red');
            } else if (section.classList.contains('section-orange')) {
                cursor.classList.add('in-section-orange');
            }
        }
    }
    
    // Écouteur optimisé pour mousemove
    document.addEventListener('mousemove', function(e) {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const newSection = getCurrentSection(e.clientY);
                if (newSection !== currentSection) {
                    currentSection = newSection;
                    updateCursorClass(currentSection);
                }
                ticking = false;
            });
            ticking = true;
        }
    });
});

// Fonction pour changer les images du launcher avec un effet de glissement
function setupLauncherImageRotation() {
    const launcherPreview = document.querySelector('.launcher-preview');
    if (!launcherPreview) return;
    
    const launcherImages = [
        './assets/images/launcher/launcher-preview1.png',
        './assets/images/launcher/launcher-preview2.png',
        './assets/images/launcher/launcher-preview3.png',
    ];
    
    let currentImg = launcherPreview.querySelector('img');
    if (!currentImg) {
        currentImg = new Image();
        currentImg.src = launcherImages[0];
        currentImg.alt = "NeoCube Launcher Preview";
        launcherPreview.appendChild(currentImg);
        
        // Précharger toutes les images
        launcherImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    // Utiliser requestAnimationFrame pour les animations
    let currentIndex = 0;
    let direction = 1;
    
    function rotateImages() {
        direction = -direction;
        currentIndex = (currentIndex + 1) % launcherImages.length;
        
        // Créer la nouvelle image
        const newImg = new Image();
        newImg.src = launcherImages[currentIndex];
        newImg.alt = "NeoCube Launcher Preview";
        newImg.style.opacity = "0";
        
        if (direction > 0) {
            currentImg.style.animation = "slideOutLeft 0.8s forwards";
            newImg.style.animation = "slideInRight 0.8s forwards";
        } else {
            currentImg.style.animation = "slideOutRight 0.8s forwards";
            newImg.style.animation = "slideInLeft 0.8s forwards";
        }
        
        launcherPreview.appendChild(newImg);
        
        setTimeout(() => {
            launcherPreview.removeChild(currentImg);
            currentImg = newImg;
        }, 800);
    }
    
    // Utiliser visibilitychange pour pauser/reprendre les animations quand la page n'est pas visible
    let imageInterval = setInterval(rotateImages, 6000);
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(imageInterval);
        } else {
            imageInterval = setInterval(rotateImages, 6000);
        }
    });
    
    // Observer la visibilité du launcher pour pauser/reprendre
    if (window.IntersectionObserver) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                if (!imageInterval) {
                    imageInterval = setInterval(rotateImages, 6000);
                }
            } else {
                clearInterval(imageInterval);
                imageInterval = null;
            }
        }, { threshold: 0.1 });
        
        observer.observe(launcherPreview);
    }
}

// Animation d'apparition progressive des éléments
function setupAnimations() {
    const animatedElements = document.querySelectorAll('.feature-card, .social-card, .blog-post, .faq-item, .how-step');
    
    // Ajouter un index à chaque élément pour l'animation séquentielle
    animatedElements.forEach((element, index) => {
        element.style.setProperty('--item-index', index % 4); // Regroupe par 4 pour l'animation
    });
    
    // Animation de la section hero après chargement
    function animateHeroSection() {
        const heroElements = document.querySelectorAll('.hero-text h1, .hero-text h4, .hero-text p, .hero-text .download-btn');
        
        // Animation séquentielle des éléments du héros
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animated');
            }, 300 * index);
        });
    }
    
    // Déclencher l'animation du héros
    animateHeroSection();
}

// Configuration des animations au défilement - version corrigée pour que les cartes s'animent correctement
function setupScrollAnimations() {
    // Sélectionner tous les éléments animés
    const animatedElements = document.querySelectorAll('.feature-card, .social-card, .blog-post, .faq-item, .how-step');
    
    // Appliquer des classes initiales à tous les éléments pour préparer l'animation
    animatedElements.forEach((element, index) => {
        // Rendre tous les éléments initialement invisibles mais prêts pour l'animation
        element.style.opacity = '0';
        
        // Type d'animation selon la nature de l'élément
        if (element.classList.contains('feature-card')) {
            if (index % 2 === 0) {
                element.style.transform = 'translateX(-50px) scale(0.95)';
            } else {
                element.style.transform = 'translateX(50px) scale(0.95)';
            }
            element.style.filter = 'blur(5px)';
        } 
        else if (element.classList.contains('social-card')) {
            if (index % 3 === 0) {
                element.style.transform = 'translateY(50px) scale(0.9)';
            } else if (index % 3 === 1) {
                element.style.transform = 'scale(0.8)';
            } else {
                element.style.transform = 'perspective(1000px) rotateY(20deg) translateZ(-100px)';
            }
            element.style.filter = 'blur(8px)';
        } 
        else if (element.classList.contains('blog-post')) {
            element.style.transform = 'translateY(40px) scale(0.92)';
            element.style.filter = 'blur(6px)';
        } 
        else if (element.classList.contains('faq-item')) {
            if (index % 2 === 0) {
                element.style.transform = 'translate(-40px, 20px)';
            } else {
                element.style.transform = 'translate(40px, 20px)';
            }
            element.style.filter = 'blur(4px)';
        } 
        else if (element.classList.contains('how-step')) {
            element.style.transform = 'translateX(-40px)';
            element.style.filter = 'blur(4px)';
        }
        
        // Utiliser une transition CSS fluide pour tous les éléments
        element.style.transition = `opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1) ${index % 5 * 0.1}s, 
                                    transform 0.8s cubic-bezier(0.23, 1, 0.32, 1) ${index % 5 * 0.1}s, 
                                    filter 0.8s cubic-bezier(0.23, 1, 0.32, 1) ${index % 5 * 0.1}s`;
    });
    
    // Observer les éléments pour animer à l'entrée et sortie de l'écran
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const element = entry.target;
            
            if (entry.isIntersecting) {
                // Animation d'entrée
                requestAnimationFrame(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0) translateY(0) scale(1) rotateY(0deg) translateZ(0)';
                    element.style.filter = 'blur(0)';
                    
                    // Ajouter aussi la classe 'animated' pour les effets hover
                    element.classList.add('animated');
                    
                    // Effet de rebond après l'animation principale
                    setTimeout(() => {
                        if (element.classList.contains('how-step')) {
                            element.style.transform = 'translateX(5px)';
                            setTimeout(() => { element.style.transform = 'translateX(0)'; }, 200);
                        } else {
                            element.style.transform = 'translateY(-8px)';
                            setTimeout(() => { element.style.transform = 'translateY(0)'; }, 200);
                        }
                    }, 800);
                });
            } else {
                // Animation de sortie
                requestAnimationFrame(() => {
                    // Redéfinir l'état initial selon le type d'élément
                    if (element.classList.contains('feature-card')) {
                        const index = Array.from(element.parentNode.children).indexOf(element);
                        if (index % 2 === 0) {
                            element.style.transform = 'translateX(-50px) scale(0.95)';
                        } else {
                            element.style.transform = 'translateX(50px) scale(0.95)';
                        }
                        element.style.filter = 'blur(5px)';
                    } 
                    else if (element.classList.contains('social-card')) {
                        const index = Array.from(element.parentNode.children).indexOf(element);
                        if (index % 3 === 0) {
                            element.style.transform = 'translateY(50px) scale(0.9)';
                        } else if (index % 3 === 1) {
                            element.style.transform = 'scale(0.8)';
                        } else {
                            element.style.transform = 'perspective(1000px) rotateY(20deg) translateZ(-100px)';
                        }
                        element.style.filter = 'blur(8px)';
                    } 
                    else if (element.classList.contains('blog-post')) {
                        element.style.transform = 'translateY(40px) scale(0.92)';
                        element.style.filter = 'blur(6px)';
                    } 
                    else if (element.classList.contains('faq-item')) {
                        const index = Array.from(element.parentNode.children).indexOf(element);
                        if (index % 2 === 0) {
                            element.style.transform = 'translate(-40px, 20px)';
                        } else {
                            element.style.transform = 'translate(40px, 20px)';
                        }
                        element.style.filter = 'blur(4px)';
                    } 
                    else if (element.classList.contains('how-step')) {
                        element.style.transform = 'translateX(-40px)';
                        element.style.filter = 'blur(4px)';
                    }
                    
                    element.style.opacity = '0';
                    element.classList.remove('animated');
                });
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
    });
    
    // Observer tous les éléments
    animatedElements.forEach(el => observer.observe(el));
    
    // Continuer avec les animations des titres qui fonctionnent bien
    animateSectionTitles();
}

// Nouvelle fonction pour des titres avec animation avancée
function animateSectionTitles() {
    const sectionTitles = document.querySelectorAll('section h2');
    
    sectionTitles.forEach(title => {
        title.style.opacity = '0';
        title.style.transform = 'translateY(30px)';
        title.style.filter = 'blur(5px)';
        title.style.transition = 'opacity 0.7s cubic-bezier(0.23, 1, 0.32, 1), transform 0.7s cubic-bezier(0.23, 1, 0.32, 1), filter 0.7s cubic-bezier(0.23, 1, 0.32, 1)';
        
        const titleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animation d'entrée élégante
                    requestAnimationFrame(() => {
                        title.style.opacity = '1';
                        title.style.transform = 'translateY(0)';
                        title.style.filter = 'blur(0)';
                        
                        // Effet de mise en évidence après l'apparition
                        setTimeout(() => {
                            title.classList.add('highlight-text');
                        }, 300);
                    });
                } else {
                    // Animation de sortie
                    requestAnimationFrame(() => {
                        title.style.opacity = '0';
                        title.style.transform = 'translateY(30px)';
                        title.style.filter = 'blur(5px)';
                        title.classList.remove('highlight-text');
                    });
                }
            });
        }, { threshold: 0.3 });
        
        titleObserver.observe(title);
    });
    
    // Ajout d'un effet de parallaxe léger au défilement
    document.addEventListener('scroll', () => {
        if (!sectionTitles.length) return;
        
        const scrollPosition = window.scrollY;
        
        sectionTitles.forEach(title => {
            const titlePosition = title.getBoundingClientRect().top + window.scrollY;
            const offset = scrollPosition - titlePosition;
            
            // Appliquer un effet de parallaxe subtil si le titre est visible
            if (Math.abs(offset) < 1000) { // Limite la portée de l'effet
                requestAnimationFrame(() => {
                    title.style.transform = `translateY(${offset * 0.05}px)`; // Effet très subtil
                });
            }
        });
    }, { passive: true }); // Optimisation de performance
}

// Préparer les éléments pour les animations
function prepareAnimatedElements() {
    // Ajouter des classes d'animation aux éléments existants
    const cards = document.querySelectorAll('.feature-card, .social-card, .blog-post');
    cards.forEach((card, index) => {
        card.classList.add('animate-on-scroll', 'animate-zoom', 'animate-bounce');
        card.dataset.animationDelay = 100 * (index % 4); // Délai par groupe de 4
    });
    
    // Animer les étapes "comment ça fonctionne"
    const steps = document.querySelectorAll('.how-step');
    steps.forEach((step, index) => {
        step.classList.add('animate-on-scroll', 'animate-left', 'animate-bounce');
        step.dataset.animationDelay = 150 * index;
    });
    
    // Animer les éléments FAQ
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item, index) => {
        item.classList.add('animate-on-scroll', index % 2 === 0 ? 'animate-left' : 'animate-right', 'animate-bounce');
        item.dataset.animationDelay = 100 * (index % 4);
    });
    
    // Animer les titres des sections
    document.querySelectorAll('section h2').forEach(title => {
        title.classList.add('animate-on-scroll', 'animate-fade');
    });
    
    // Animer la section de téléchargement
    const downloadSection = document.querySelector('#download .container');
    if (downloadSection) {
        downloadSection.classList.add('animate-on-scroll', 'animate-fade');
    }
}
