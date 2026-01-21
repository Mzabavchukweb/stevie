/**
 * Stevie Athletics — Visuals & Animations (Lightweight Version)
 * Pure CSS/GSAP animations - no Three.js for performance
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeroBackground();
    initGSAP();
});

/* ═══════════════════════════════════════════════════════════════
   LIGHTWEIGHT HERO BACKGROUND (Pure CSS Gradients + Subtle Motion)
   ═══════════════════════════════════════════════════════════════ */
function initHeroBackground() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Creating animated gradient overlay using CSS only
    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
        // Hide canvas, replace with CSS animation
        canvas.style.display = 'none';
    }

    // Add subtle floating particles with CSS (much lighter than Three.js)
    createFloatingParticles(hero);
}

function createFloatingParticles(container) {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'hero__particles';
    particleContainer.setAttribute('aria-hidden', 'true');

    // Only create 8 particles (vs 15 3D objects)
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'hero__particle';
        particle.style.cssText = `
            --delay: ${Math.random() * 5}s;
            --duration: ${8 + Math.random() * 4}s;
            --x-start: ${Math.random() * 100}%;
            --size: ${4 + Math.random() * 8}px;
            --opacity: ${0.1 + Math.random() * 0.2};
        `;
        particleContainer.appendChild(particle);
    }

    container.querySelector('.hero__background')?.appendChild(particleContainer);
}

/* ═══════════════════════════════════════════════════════════════
   GSAP ANIMATIONS (Optimized)
   ═══════════════════════════════════════════════════════════════ */
function initGSAP() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Hero Text Reveal - Immediate, no delay
    const revealTexts = document.querySelectorAll('.reveal-text');
    revealTexts.forEach(text => {
        gsap.set(text, { y: 20, opacity: 0 });
        gsap.to(text, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay: parseFloat(text.dataset.delay || 0),
            ease: 'power2.out'
        });
    });

    // Hero Fade Elements
    const fadeElements = document.querySelectorAll('.reveal-fade');
    fadeElements.forEach(el => {
        gsap.set(el, { y: 15, opacity: 0 });
        gsap.to(el, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            delay: parseFloat(el.dataset.delay || 0),
            ease: 'power2.out'
        });
    });

    // Lazy-load scroll animations (only initialize when needed)
    const animatedElements = document.querySelectorAll('[data-animate]');
    if (animatedElements.length === 0) return;

    // Use IntersectionObserver for better performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.dataset.animateDelay ? parseInt(el.dataset.animateDelay) / 1000 : 0;

                gsap.to(el, {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    delay: delay,
                    ease: 'power2.out'
                });

                observer.unobserve(el);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    animatedElements.forEach(el => {
        gsap.set(el, { y: 20, opacity: 0 });
        observer.observe(el);
    });
}
