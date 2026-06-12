/* ===========================
   EcoReward AI — app.js
=========================== */

// ── Scroll-reveal animations ────────────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(
  '.step, .feature-card, .reward-item, .impact-row, .story__quote'
).forEach((el) => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ── Nav scroll shadow ───────────────────────────────────────────────────────
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('nav--scrolled', window.scrollY > 40);
});

// ── Animated counter for hero stats ────────────────────────────────────────
function animateCounter(el, target, suffix = '', duration = 1800) {
  const start = performance.now();
  const isFloat = target % 1 !== 0;

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = isFloat
      ? (eased * target).toFixed(1)
      : Math.floor(eased * target).toLocaleString('ru-RU');
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      const nums = document.querySelectorAll('.stat__num');
      const data = [
        { target: 12000, suffix: '+' },
        { target: 48, suffix: ' т' },
        { target: 3200, suffix: '' },
      ];
      nums.forEach((el, i) => animateCounter(el, data[i].target, data[i].suffix));
      statsObserver.disconnect();
    }
  },
  { threshold: 0.5 }
);

const statsEl = document.querySelector('.hero__stats');
if (statsEl) statsObserver.observe(statsEl);

// ── Smooth nav link scroll with offset ─────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── EcoPoints live ticker in phone mockup ──────────────────────────────────
const pointsEl = document.querySelector('.points__num');
if (pointsEl) {
  let pts = 1240;
  setInterval(() => {
    pts += Math.floor(Math.random() * 5);
    pointsEl.textContent = pts.toLocaleString('ru-RU');
  }, 3000);
}

// ── Task card progress bar shimmer on hover ────────────────────────────────
document.querySelectorAll('.app__task-card').forEach((card) => {
  card.addEventListener('mouseenter', () => {
    const bar = card.querySelector('.task__bar-fill');
    if (bar) {
      bar.style.transition = 'width 0.6s ease';
      bar.style.width = '100%';
    }
  });
  card.addEventListener('mouseleave', () => {
    const bar = card.querySelector('.task__bar-fill');
    if (bar) {
      bar.style.width = '65%';
    }
  });
});

// ── Download button ripple ─────────────────────────────────────────────────
document.querySelectorAll('.btn--primary').forEach((btn) => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top: ${e.clientY - rect.top - size / 2}px;
      background: rgba(255,255,255,0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple-anim 0.5s linear;
      pointer-events: none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Inject ripple keyframe dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple-anim {
    to { transform: scale(2.5); opacity: 0; }
  }
  .reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.55s ease, transform 0.55s ease;
  }
  .reveal.visible {
    opacity: 1;
    transform: none;
  }
  .nav--scrolled {
    box-shadow: 0 2px 16px rgba(26,58,42,0.10);
  }
`;
document.head.appendChild(style);
