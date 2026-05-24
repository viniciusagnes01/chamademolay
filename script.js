const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

const topbar = document.querySelector('.topbar');
const menuButton = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav a');

function closeMenu() {
  document.body.classList.remove('nav-open');
  nav?.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    document.body.classList.toggle('nav-open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });
}

window.addEventListener('scroll', () => {
  topbar?.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

const sections = document.querySelectorAll('[data-section]');
if ('IntersectionObserver' in window && sections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const activeLink = document.querySelector(`.nav a[href="#${entry.target.id}"]`);
      if (!activeLink) {
        return;
      }

      navLinks.forEach((link) => link.classList.remove('active'));
      activeLink.classList.add('active');
    });
  }, { rootMargin: '-42% 0px -52% 0px', threshold: 0.01 });

  sections.forEach((section) => sectionObserver.observe(section));
}

const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow && !prefersReducedMotion) {
  window.addEventListener('pointermove', (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

const canvas = document.getElementById('particleCanvas');
if (canvas && !prefersReducedMotion) {
  const context = canvas.getContext('2d');
  const particles = [];
  const particleCount = 72;

  function resizeCanvas() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function createParticle() {
    return {
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + Math.random() * 120,
      radius: 1 + Math.random() * 2.6,
      speed: 0.25 + Math.random() * 0.85,
      drift: -0.25 + Math.random() * 0.5,
      alpha: 0.18 + Math.random() * 0.44
    };
  }

  function resetParticle(particle) {
    Object.assign(particle, createParticle());
    particle.y = window.innerHeight + 10;
  }

  function drawParticles() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach((particle) => {
      particle.y -= particle.speed;
      particle.x += particle.drift;
      particle.alpha *= 0.998;

      if (particle.y < -20 || particle.alpha < 0.05) {
        resetParticle(particle);
      }

      const gradient = context.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.radius * 6
      );
      gradient.addColorStop(0, `rgba(255, 214, 111, ${particle.alpha})`);
      gradient.addColorStop(0.5, `rgba(239, 90, 36, ${particle.alpha * 0.55})`);
      gradient.addColorStop(1, 'rgba(239, 90, 36, 0)');

      context.fillStyle = gradient;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius * 6, 0, Math.PI * 2);
      context.fill();
    });

    requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  for (let index = 0; index < particleCount; index += 1) {
    particles.push(createParticle());
  }
  drawParticles();

  window.addEventListener('resize', resizeCanvas, { passive: true });
}
