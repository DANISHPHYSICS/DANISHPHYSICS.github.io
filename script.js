document.addEventListener('DOMContentLoaded', () => {
    // --- Advanced Theme Switch Logic ---
    const themeSwitch = document.getElementById('theme-switch');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Apply saved theme on load
    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
        themeSwitch.classList.remove('dark');
        themeSwitch.classList.add('light');
    } else {
        themeSwitch.classList.add('dark');
    }

    themeSwitch.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        
        if (document.body.classList.contains('light-mode')) {
            themeSwitch.classList.remove('dark');
            themeSwitch.classList.add('light');
            localStorage.setItem('theme', 'light');
        } else {
            themeSwitch.classList.remove('light');
            themeSwitch.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    });

    // --- Sticky Banner Scroll Logic ---
    const banner = document.getElementById('sticky-banner');
    const mainHeader = document.querySelector('header');

    if (mainHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > mainHeader.offsetHeight - 150) {
                banner.classList.add('visible');
            } else {
                banner.classList.remove('visible');
            }
        });
    } else {
        banner.classList.add('visible');
    }

    // --- Cosmic Ray Shower Animation (Subtle & Branching) ---
    const canvas = document.getElementById('cosmic-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        class Particle {
            constructor(x, y, vx, vy, level) {
                this.x = x;
                this.y = y;
                this.vx = vx;
                this.vy = vy;
                this.level = level; // 0 = Primary, 1 = Secondary, 2 = Tertiary
                this.history = [];
                this.dead = false;
                
                if (level === 0) {
                    this.splitY = height * 0.15 + Math.random() * (height * 0.2); // Break high up
                    this.color = 'rgba(255, 255, 255, 0.4)'; // highly transparent white
                    this.size = 1.2;
                } else if (level === 1) {
                    this.splitY = this.y + height * 0.2 + Math.random() * (height * 0.3); // Break mid-air
                    this.color = 'rgba(0, 240, 255, 0.3)'; // transparent cyan
                    this.size = 0.8;
                } else {
                    this.splitY = height + 2000; // Never breaks again
                    this.color = 'rgba(176, 38, 255, 0.2)'; // transparent purple
                    this.size = 0.5;
                }
            }

            update() {
                this.history.push({x: this.x, y: this.y});
                if (this.history.length > (15 - this.level * 3)) this.history.shift();

                this.x += this.vx;
                this.y += this.vy;

                // Branching logic
                if (this.y >= this.splitY && !this.dead && this.level < 2) {
                    this.dead = true;
                    // Many particles on break: Primary makes 3-5, Secondary makes 4-8
                    const numSecondaries = (this.level === 0) ? (Math.floor(Math.random() * 3) + 3) : (Math.floor(Math.random() * 5) + 4);
                    
                    for (let i = 0; i < numSecondaries; i++) {
                        let spread = (Math.random() - 0.5) * (this.level === 0 ? 3 : 6);
                        let speedY = this.vy * (0.8 + Math.random() * 0.4);
                        particles.push(new Particle(this.x, this.y, this.vx + spread, speedY, this.level + 1));
                    }
                }

                if (this.y > height + 100) this.dead = true;
            }

            draw() {
                ctx.beginPath();
                for (let i = 0; i < this.history.length; i++) {
                    const point = this.history[i];
                    if (i === 0) ctx.moveTo(point.x, point.y);
                    else ctx.lineTo(point.x, point.y);
                }
                ctx.lineTo(this.x, this.y);
                ctx.strokeStyle = this.color;
                ctx.lineWidth = this.size;
                ctx.lineCap = 'round';
                ctx.stroke();
                
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        let particles = [];
        let lastSpawnTime = 0;
        let nextSpawnDelay = Math.random() * 5000 + 5000; // 5 to 10 seconds

        function animate(currentTime) {
            requestAnimationFrame(animate);
            if (!currentTime) currentTime = 0;

            if (document.body.classList.contains('light-mode')) {
                ctx.clearRect(0, 0, width, height);
                return;
            }

            ctx.clearRect(0, 0, width, height);

            // Very rare bombardment: 1 particle every 5 to 10 seconds
            if (currentTime - lastSpawnTime > nextSpawnDelay) {
                particles.push(new Particle(Math.random() * (width * 0.8) + (width * 0.1), -10, (Math.random() - 0.5) * 1.0, Math.random() * 3 + 5, 0));
                lastSpawnTime = currentTime;
                nextSpawnDelay = Math.random() * 5000 + 5000;
            }

            particles = particles.filter(p => !p.dead || p.history.length > 1);
            
            particles.forEach(p => {
                if (!p.dead) p.update();
                else if (p.history.length > 0) p.history.shift();
                
                if (p.history.length > 0) p.draw();
            });
        }
        animate();
    }
});
