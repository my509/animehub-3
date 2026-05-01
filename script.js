// ==================== DOM ELEMENTS ====================
const loadingScreen = document.getElementById('loadingScreen');
const loadingBar = document.getElementById('loadingBar');
const loadingPercent = document.getElementById('loadingPercent');
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
const mouseGlow = document.getElementById('mouseGlow');
const heroCharacter = document.getElementById('heroCharacter');
const typingText = document.getElementById('typingText');
const animeGrid = document.getElementById('animeGrid');
const carouselContainer = document.getElementById('carouselContainer');
const musicToggle = document.getElementById('musicToggle');
const musicWaves = document.getElementById('musicWaves');
const particleCanvas = document.getElementById('particleCanvas');
const ctx = particleCanvas.getContext('2d');

// ==================== LOADING ANIMATION ====================
let loadProgress = 0;
const loadInterval = setInterval(() => {
    loadProgress += Math.floor(Math.random() * 5) + 1;
    if (loadProgress >= 100) {
        loadProgress = 100;
        clearInterval(loadInterval);
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            document.body.style.overflow = 'visible';
            startIntroAnimations();
        }, 400);
    }
    loadingBar.style.width = loadProgress + '%';
    loadingPercent.textContent = loadProgress + '%';
}, 50);

// ==================== PARTICLES BACKGROUND ====================
particleCanvas.width = window.innerWidth;
particleCanvas.height = window.innerHeight;
const particles = [];
const particleCount = 150;

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * particleCanvas.width;
        this.y = Math.random() * particleCanvas.height;
        this.size = Math.random() * 2.5 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.7 + 0.3;
        this.color = `rgba(${Math.random() > 0.5 ? '0, 240, 255' : '179, 0, 255'}, ${this.opacity})`;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > particleCanvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > particleCanvas.height) this.speedY *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    // Vẽ đường nối giữa các hạt gần nhau
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - dist / 100)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

window.addEventListener('resize', () => {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
});

// ==================== CUSTOM CURSOR ====================
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
    cursorFollower.style.left = (mouseX - 15) + 'px';
    cursorFollower.style.top = (mouseY - 15) + 'px';
    // Mouse glow trong hero
    if (mouseGlow) {
        mouseGlow.style.left = mouseX + 'px';
        mouseGlow.style.top = mouseY + 'px';
        mouseGlow.style.opacity = '0.7';
    }
});

document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorFollower.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorFollower.style.opacity = '1';
});

// Thêm hiệu ứng cursor active khi hover vào link/button
const interactiveElements = document.querySelectorAll('a, button, .anime-card, .carousel-card, .social-icon');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
});

// ==================== NAVBAR SCROLL EFFECT ====================
window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    // Active nav link dựa trên scroll position
    const sections = document.querySelectorAll('section[id]');
    let current = 'home';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Hamburger menu mobile
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});
// Đóng menu khi click link
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// ==================== HERO 3D TILT EFFECT ====================
heroCharacter.addEventListener('mousemove', (e) => {
    const rect = heroCharacter.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 20;
    const character3d = document.getElementById('character3d');
    character3d.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
});
heroCharacter.addEventListener('mouseleave', () => {
    const character3d = document.getElementById('character3d');
    character3d.style.transform = 'rotateX(0) rotateY(0) scale(1)';
});

// ==================== TYPING TEXT EFFECT ====================
const typingStrings = [
    'Đắm chìm trong thế giới ảo...',
    'Chiến đấu vì tương lai...',
    'Neon Genesis 2099...',
    'Huyền thoại thức tỉnh...'
];
let stringIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentString = typingStrings[stringIndex];
    if (isDeleting) {
        typingText.textContent = currentString.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            stringIndex = (stringIndex + 1) % typingStrings.length;
            setTimeout(typeEffect, 300);
            return;
        }
    } else {
        typingText.textContent = currentString.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentString.length) {
            isDeleting = true;
            setTimeout(typeEffect, 2000);
            return;
        }
    }
    setTimeout(typeEffect, isDeleting ? 50 : 100);
}
typeEffect();

// ==================== ANIME CARDS DATA ====================
const animeData = [
    { title: 'Neon Genesis', desc: 'Cuộc chiến giữa các mecha khổng lồ trong thành phố neon.', badge: 'HOT', gradient: 'linear-gradient(135deg, #0a0a2e, #1a1a4e)' },
    { title: 'Cyber Angels', desc: 'Những thiên thần chiến binh bảo vệ thế giới mạng.', badge: 'NEW', gradient: 'linear-gradient(135deg, #2e0a2e, #4e1a4e)' },
    { title: 'Ghost Protocol', desc: 'Điệp viên bóng ma trong thế giới cyberpunk.', badge: 'TOP', gradient: 'linear-gradient(135deg, #0a2e2e, #1a4e4e)' },
    { title: 'Data Blade', desc: 'Kiếm sĩ dữ liệu chiến đấu chống lại AI.', badge: 'TREND', gradient: 'linear-gradient(135deg, #2e2e0a, #4e4e1a)' },
    { title: 'Neon Samurai', desc: 'Samurai tương lai với thanh kiếm plasma.', badge: 'EPIC', gradient: 'linear-gradient(135deg, #1a0a2e, #2e1a4e)' },
    { title: 'Void Walker', desc: 'Người du hành không gian trong vũ trụ neon.', badge: 'LEGEND', gradient: 'linear-gradient(135deg, #0a1a2e, #1a2e4e)' }
];

function createAnimeCards() {
    animeGrid.innerHTML = '';
    animeData.forEach((anime, index) => {
        const card = document.createElement('div');
        card.className = 'anime-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <div class="anime-card-image" style="background: ${anime.gradient}; display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-play-circle" style="font-size: 3rem; color: var(--neon-blue); opacity: 0.7; filter: drop-shadow(0 0 20px var(--neon-blue));"></i>
            </div>
            <span class="anime-card-badge">${anime.badge}</span>
            <div class="anime-card-info">
                <h3 class="anime-card-title">${anime.title}</h3>
                <p class="anime-card-desc">${anime.desc}</p>
            </div>
        `;
        animeGrid.appendChild(card);
    });
}
createAnimeCards();

// ==================== CAROUSEL 3D ====================
const charactersData = [
    { name: 'Raven X', icon: '🖤', color: '#ff00aa' },
    { name: 'Neon Blade', icon: '⚔️', color: '#00f0ff' },
    { name: 'Cipher', icon: '🌀', color: '#b300ff' },
    { name: 'Luna Star', icon: '🌙', color: '#00ffd5' },
    { name: 'Ghost-9', icon: '👻', color: '#ff00aa' }
];

let currentCarouselIndex = 2; // Bắt đầu ở giữa
function renderCarousel() {
    carouselContainer.innerHTML = '';
    const total = charactersData.length;
    charactersData.forEach((char, index) => {
        const card = document.createElement('div');
        card.className = 'carousel-card';
        // Tính toán vị trí dựa trên khoảng cách tới index trung tâm
        let offset = index - currentCarouselIndex;
        // Wrap around cho carousel vòng
        if (offset > total / 2) offset -= total;
        if (offset < -total / 2) offset += total;
        
        const translateX = offset * 180;
        const scale = offset === 0 ? 1.1 : 0.8;
        const zIndex = offset === 0 ? 5 : 1;
        const opacity = offset === 0 ? 1 : 0.5;
        
        card.style.transform = `translateX(${translateX}px) scale(${scale})`;
        card.style.zIndex = zIndex;
        card.style.opacity = opacity;
        if (offset === 0) card.classList.add('center');
        
        card.innerHTML = `
            <span class="char-avatar" style="color: ${char.color};">${char.icon}</span>
            <h3>${char.name}</h3>
        `;
        carouselContainer.appendChild(card);
    });
}

function nextCarousel() {
    currentCarouselIndex = (currentCarouselIndex + 1) % charactersData.length;
    renderCarousel();
}
function prevCarousel() {
    currentCarouselIndex = (currentCarouselIndex - 1 + charactersData.length) % charactersData.length;
    renderCarousel();
}
document.getElementById('carouselPrev').addEventListener('click', prevCarousel);
document.getElementById('carouselNext').addEventListener('click', nextCarousel);
renderCarousel();
// Auto rotate carousel
setInterval(() => {
    nextCarousel();
}, 4000);

// ==================== COUNTER ANIMATION ====================
const statNumbers = document.querySelectorAll('.stat-number');
const statsSection = document.getElementById('stats');
let statsAnimated = false;

function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            el.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Intersection Observer cho stats và fade-in elements
const observerOptions = { threshold: 0.3 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target === statsSection && !statsAnimated) {
                statNumbers.forEach(num => animateCounter(num));
                statsAnimated = true;
            }
            entry.target.classList.add('fade-in-visible');
        }
    });
}, observerOptions);

observer.observe(statsSection);

// Quan sát tất cả section để fade-in
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in-section');
    observer.observe(section);
});

// ==================== MUSIC TOGGLE (giả lập) ====================
let musicPlaying = false;
musicToggle.addEventListener('click', () => {
    musicPlaying = !musicPlaying;
    if (musicPlaying) {
        musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        musicWaves.classList.add('active');
    } else {
        musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        musicWaves.classList.remove('active');
    }
});

// ==================== SMOOTH SCROLLING PARALLAX ====================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    // Parallax nhẹ cho hero character
    if (heroCharacter) {
        heroCharacter.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
    // Di chuyển mouse glow khi scroll (ẩn nếu scroll quá hero)
    if (mouseGlow && scrolled > window.innerHeight) {
        mouseGlow.style.opacity = '0';
    }
});

// ==================== INTRO ANIMATIONS SAU LOADING ====================
function startIntroAnimations() {
    document.querySelectorAll('.hero-content > *').forEach((el, i) => {
        el.style.animation = `fadeInUp 0.8s ${i * 0.2}s both`;
    });
}

// Thêm style cho fade-in sections và keyframes (được thêm vào head bằng JS)
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .fade-in-section {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    .fade-in-visible {
        opacity: 1;
        transform: translateY(0);
    }
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(40px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes glitchText {
        0%, 100% { text-shadow: 0 0 10px #00f0ff, 0 0 20px #b300ff; }
        25% { text-shadow: -2px 0 #ff00aa, 2px 0 #00f0ff; }
        50% { text-shadow: 2px 0 #b300ff, -2px 0 #00f0ff; }
        75% { text-shadow: -1px 0 #00ffd5, 1px 0 #ff00aa; }
    }
`;
document.head.appendChild(styleSheet);

// ==================== INITIAL SETUP ====================
document.body.style.overflow = 'hidden'; // Ẩn scroll khi loading
// Kích hoạt fade-in cho section đầu tiên ngay khi load
setTimeout(() => {
    document.querySelectorAll('.fade-in-section').forEach(section => {
        if (section.getBoundingClientRect().top < window.innerHeight) {
            section.classList.add('fade-in-visible');
        }
    });
}, 1000);

console.log('🌟 Neon Genesis 2099 - Website Anime 3D sẵn sàng!');
console.log('🚀 Trải nghiệm thế giới cyberpunk tương lai.');
