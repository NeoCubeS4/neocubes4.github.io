document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.feature-card, .social-card, .blog-post, .faq-item');
    
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) return;
    
    const config = {
        ease: 0.12,
        maxRotation: 5,
        maxTranslation: 10
    };
    
    const cardStates = new WeakMap();
    
    let ticking = false;
    
    cards.forEach(card => {
        cardStates.set(card, {
            targetX: 0,
            targetY: 0,
            currentX: 0,
            currentY: 0,
            isHovering: false,
            animation: null,
            
            elements: {
                icons: card.querySelectorAll('.pixel-icon, i'),
                titles: card.querySelectorAll('h3'),
                texts: card.querySelectorAll('p')
            }
        });
        
        card.classList.add('parallax-card');
        
        const state = cardStates.get(card);
        state.elements.icons.forEach(icon => icon.classList.add('parallax-icon'));
        state.elements.titles.forEach(title => title.classList.add('parallax-title'));
        state.elements.texts.forEach(text => text.classList.add('parallax-text'));
        
        card.addEventListener('mouseenter', () => {
            const state = cardStates.get(card);
            state.isHovering = true;
            
            if (!state.animation) {
                state.animation = requestAnimationFrame(() => updateCardAnimation(card));
            }
        });
        
        card.addEventListener('mousemove', (e) => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleMouseMove(e);
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const state = cardStates.get(card);
            state.isHovering = false;
            state.targetX = 0;
            state.targetY = 0;
        });
        
        function handleMouseMove(e) {
            const state = cardStates.get(card);
            if (!state.isHovering) return;
            
            const rect = card.getBoundingClientRect();
            
            const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
            
            state.targetX = x;
            state.targetY = y;
        }
    });
    
    function updateCardAnimation(card) {
        const state = cardStates.get(card);
        if (!state) return;
        
        state.currentX += (state.targetX - state.currentX) * config.ease;
        state.currentY += (state.targetY - state.currentY) * config.ease;
        
        const isAtRest = Math.abs(state.currentX) < 0.005 && Math.abs(state.currentY) < 0.005 && !state.isHovering;
        if (isAtRest) {
            card.style.transform = '';
            
            resetElements(state.elements);
            
            state.animation = null;
            return;
        }
        
        const rotateY = state.currentX * config.maxRotation;
        const rotateX = -state.currentY * config.maxRotation;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        
        applyTransforms(state);
        
        state.animation = requestAnimationFrame(() => updateCardAnimation(card));
    }
    
    function applyTransforms(state) {
        const xTranslation = state.currentX * config.maxTranslation;
        const yTranslation = state.currentY * config.maxTranslation;
        
        applyTransformToElements(state.elements.icons, xTranslation, yTranslation, 1.0);
        applyTransformToElements(state.elements.titles, xTranslation, yTranslation, 0.7);
        applyTransformToElements(state.elements.texts, xTranslation, yTranslation, 0.5);
    }
    
    function applyTransformToElements(elements, x, y, factor) {
        const xVal = x * factor;
        const yVal = y * factor;
        const zVal = 20 * factor;
        
        elements.forEach(el => {
            el.style.transform = `translateX(${xVal}px) translateY(${yVal}px) translateZ(${zVal}px)`;
        });
    }
    
    function resetElements(elements) {
        Object.values(elements).forEach(group => {
            group.forEach(el => {
                el.style.transform = '';
            });
        });
    }
    
    let isScrolling = false;
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            isScrolling = true;
            document.body.classList.add('is-scrolling');
            
            cards.forEach(card => {
                const state = cardStates.get(card);
                if (state && state.animation) {
                    cancelAnimationFrame(state.animation);
                    state.animation = null;
                }
                card.style.transform = '';
                resetElements(state.elements);
            });
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
            document.body.classList.remove('is-scrolling');
            
            cards.forEach(card => {
                const state = cardStates.get(card);
                if (state) {
                    state.currentX = 0;
                    state.currentY = 0;
                    state.targetX = 0;
                    state.targetY = 0;
                }
            });
        }, 100);
    }, { passive: true });
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const card = entry.target;
                const state = cardStates.get(card);
                
                if (!state) return;
                
                if (!entry.isIntersecting) {
                    if (state.animation) {
                        cancelAnimationFrame(state.animation);
                        state.animation = null;
                        card.style.transform = '';
                        resetElements(state.elements);
                    }
                }
            });
        }, { threshold: 0.1 });
        
        cards.forEach(card => observer.observe(card));
    }
});
