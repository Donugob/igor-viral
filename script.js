// --- GENERATIVE PULSE ENGINE ---
const canvas = document.getElementById('pulse-canvas');
const ctx = canvas.getContext('2d');
let circles = [];
const mouse = { x: undefined, y: undefined };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

class Circle {
    constructor(x, y, radius, dx, dy) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.maxRadius = 25 + Math.random() * 25;
        this.dx = dx;
        this.dy = dy;
        this.opacity = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.strokeStyle = `rgba(0, 255, 163, ${this.opacity})`;
        ctx.stroke();
    }

    update() {
        // Grow and fade
        if (this.radius < this.maxRadius) {
            this.radius += 0.5;
            this.opacity += 0.01;
        } else {
            this.opacity -= 0.01;
        }
        
        // Mouse interaction (repel)
        let dist = Math.hypot(mouse.x - this.x, mouse.y - this.y);
        if (dist < 100) {
            this.x -= (mouse.x - this.x) * 0.01;
            this.y -= (mouse.y - this.y) * 0.01;
        }

        // Move
        this.x += this.dx;
        this.y += this.dy;

        // Reset if faded or off-screen
        if (this.opacity <= 0 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }

        this.draw();
    }
    
    reset() {
        this.radius = Math.random() * 2;
        this.maxRadius = 25 + Math.random() * 25;
        this.opacity = 0;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
    }
}

function init() {
    circles = [];
    for (let i = 0; i < 50; i++) {
        let radius = Math.random() * 2;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let dx = (Math.random() - 0.5) * 0.1;
        let dy = (Math.random() - 0.5) * 0.1;
        circles.push(new Circle(x, y, radius, dx, dy));
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(circle => circle.update());
}

init();
animate();


// --- GSAP ANIMATION ENGINE ---
gsap.registerPlugin(ScrollTrigger);

// Hero Animation
gsap.to('.hero h1', { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: 'power3.out' });
gsap.to('.hero p', { opacity: 1, y: 0, duration: 1, delay: 0.8, ease: 'power3.out' });

// Staggered section reveal
const sections = document.querySelectorAll('section:not(.hero)');
sections.forEach(section => {
    const title = section.querySelector('.section-title');
    const content = section.querySelectorAll('.service-card, .step');

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
        }
    });

    if (title) {
        tl.to(title, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
    }
    if (content.length > 0) {
        tl.to(content, {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
        }, "-=0.8");
    }
});