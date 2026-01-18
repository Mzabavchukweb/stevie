/**
 * Stevie Athletics — Visuals & 3D Interactions
 * Uses Three.js for Hero Background & GSAP for Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initGSAP();
});

/* ═══════════════════════════════════════════════════════════════
   THREE.JS HERO SCENE - FALLING BARBELLS
   ═══════════════════════════════════════════════════════════════ */
function initThreeJS() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    // Scene Setup
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x4A80D8, 1);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    // Barbell Group
    const barbells = [];
    const barbellCount = 15; // Number of falling barbells

    // Geometry reused
    const barGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.2, 8);
    const weightGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 16);

    // Materials
    const barMaterial = new THREE.MeshStandardMaterial({
        color: 0xc0c0c0,
        metalness: 0.8,
        roughness: 0.2
    });
    const weightMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.5
    });

    const createBarbell = () => {
        const group = new THREE.Group();

        // Bar
        const bar = new THREE.Mesh(barGeometry, barMaterial);
        bar.rotation.z = Math.PI / 2;
        group.add(bar);

        // Weights (Inner)
        const w1 = new THREE.Mesh(weightGeometry, weightMaterial);
        w1.rotation.z = Math.PI / 2;
        w1.position.x = -0.4;
        group.add(w1);

        const w2 = new THREE.Mesh(weightGeometry, weightMaterial);
        w2.rotation.z = Math.PI / 2;
        w2.position.x = 0.4;
        group.add(w2);

        // Weights (Outer)
        const w3 = new THREE.Mesh(weightGeometry, weightMaterial);
        w3.rotation.z = Math.PI / 2;
        w3.position.x = -0.5;
        group.add(w3);

        const w4 = new THREE.Mesh(weightGeometry, weightMaterial);
        w4.rotation.z = Math.PI / 2;
        w4.position.x = 0.5;
        group.add(w4);

        return group;
    };

    // Initialize Barbells
    for (let i = 0; i < barbellCount; i++) {
        const mesh = createBarbell();

        // Random Position
        mesh.position.x = (Math.random() - 0.5) * 8;
        mesh.position.y = (Math.random() - 0.5) * 10;
        mesh.position.z = (Math.random() - 0.5) * 4;

        // Random Rotation
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;

        // Custom properties for animation
        mesh.userData = {
            velocity: 0.02 + Math.random() * 0.03,
            rotSpeedX: (Math.random() - 0.5) * 0.02,
            rotSpeedY: (Math.random() - 0.5) * 0.02
        };

        scene.add(mesh);
        barbells.push(mesh);
    }

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        barbells.forEach(b => {
            // Fall down
            b.position.y -= b.userData.velocity;

            // Rotation
            b.rotation.x += b.userData.rotSpeedX;
            b.rotation.y += b.userData.rotSpeedY;

            // Mouse influence (slight repulsion or attraction)
            b.position.x += mouseX * 0.01;

            // Reset if below screen
            if (b.position.y < -6) {
                b.position.y = 6;
                b.position.x = (Math.random() - 0.5) * 8;
                b.userData.velocity = 0.02 + Math.random() * 0.03;
            }
        });

        renderer.render(scene, camera);
    }

    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

/* ═══════════════════════════════════════════════════════════════
   GSAP ANIMATIONS
   ═══════════════════════════════════════════════════════════════ */
function initGSAP() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Text Reveal
    const revealTexts = document.querySelectorAll('.reveal-text');
    revealTexts.forEach(text => {
        const delay = text.dataset.delay || 0;
        gsap.to(text, { // Use .to() and starting CSS to avoid FOUC issues if possible, or clearProps
            y: 0,
            opacity: 1,
            duration: 1,
            delay: parseFloat(delay),
            ease: 'power3.out',
            overwrite: 'auto'
        });
    });

    // Hero Fade Elements
    const fadeElements = document.querySelectorAll('.reveal-fade');
    fadeElements.forEach(el => {
        const delay = el.dataset.delay || 0;
        gsap.to(el, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: parseFloat(delay),
            ease: 'power2.out',
            overwrite: 'auto'
        });
    });

    // Methodology Stagger
    // Ensure initial state is set
    gsap.set('.methodology__step', { y: 50, opacity: 0 });

    ScrollTrigger.batch('.methodology__step', {
        start: 'top 85%',
        onEnter: batch => gsap.to(batch, {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power2.out',
            overwrite: true
        })
    });

    // General Fade In Elements
    const generalFades = document.querySelectorAll('[data-animate]');
    generalFades.forEach(el => {
        // Set initial state via JS to prevent permanent invisibility if JS fails earlier
        gsap.set(el, { y: 30, opacity: 0 });

        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 90%',
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: el.dataset.animateDelay ? parseInt(el.dataset.animateDelay) / 1000 : 0,
            ease: 'power2.out'
        });
    });
}
