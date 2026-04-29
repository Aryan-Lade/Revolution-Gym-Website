// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.style.background = window.scrollY > 40
      ? 'rgba(10,10,10,0.98)' : 'rgba(10,10,10,0.85)';
  });
}

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
}
function closeMobileMenu() {
  if (mobileMenu) mobileMenu.classList.remove('open');
}

// ===== STATS COUNT-UP =====
function animateCountUp(el) {
  const target = parseInt(el.dataset.target);
  if (isNaN(target)) return;
  const duration = 1800;
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// ===== SCROLL REVEAL SETUP =====
// First add the reveal class to all target elements
const revealTargets = document.querySelectorAll(
  '.program-card, .coach-card, .testimonial-card, .pricing-card, .section-header'
);
revealTargets.forEach(el => el.classList.add('reveal'));

// Then set up the observer
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

revealTargets.forEach(el => revealObserver.observe(el));

// ===== STATS COUNT-UP OBSERVER =====
const statNums = document.querySelectorAll('.stat-num[data-target]');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCountUp(e.target);
      statsObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => statsObserver.observe(el));

// ===== BEFORE / AFTER TRANSFORMATIONS =====
(function () {
  const slider = document.querySelector('[data-ba]');
  if (!slider) return;

  // --- Transformation data set (add more objects to extend) ---
  const DATA = [
    {
      before: '/assets/transformations/before1.jpg',
      after: '/assets/transformations/after1.jpg',
      name: 'John Smith',
      result: 'Lost 18 kg',
      duration: '6 Months',
      goal: 'Body Fat 32% → 14%'
    },
    {
      before: '/assets/transformations/before2.jpg',
      after: '/assets/transformations/after2.jpg',
      name: 'Priya Sharma',
      result: 'Gained 8 kg muscle',
      duration: '9 Months',
      goal: 'Strength +140%'
    },
    {
      before: '/assets/transformations/before3.jpg',
      after: '/assets/transformations/after3.jpg',
      name: 'Marcus Lee',
      result: 'Lost 24 kg',
      duration: '12 Months',
      goal: 'Body Fat 36% → 12%'
    }
  ];

  const beforeImg = slider.querySelector('.ba-before .ba-img');
  const afterImg = slider.querySelector('.ba-after .ba-img');
  const beforePane = slider.querySelector('.ba-before');
  const handle = slider.querySelector('.ba-handle');
  const card = document.querySelector('[data-ba-card]');
  const dotsWrap = document.querySelector('[data-ba-dots]');
  const nameEl = card.querySelector('[data-name]');
  const resultEl = card.querySelector('[data-result]');
  const durationEl = card.querySelector('[data-duration]');
  const goalEl = card.querySelector('[data-goal]');

  let index = 0;
  let pos = 50;            // slider position %
  let rafId = null;

  // --- Render a transformation into the slider + card ---
  // Placeholder generated when a real image is missing
  function placeholder(label, bg, fg) {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>
      <rect width='100%' height='100%' fill='${bg}'/>
      <text x='50%' y='50%' fill='${fg}' font-family='sans-serif' font-size='120'
        font-weight='700' text-anchor='middle' dominant-baseline='middle'
        opacity='0.25'>${label}</text></svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  function render(i) {
    const d = DATA[i];
    beforeImg.onerror = () => { beforeImg.onerror = null; beforeImg.src = placeholder('BEFORE', '#111', '#fff'); };
    afterImg.onerror = () => { afterImg.onerror = null; afterImg.src = placeholder('AFTER', '#ffff00', '#000'); };
    beforeImg.src = d.before;
    afterImg.src = d.after;
    nameEl.textContent = d.name;
    resultEl.textContent = d.result;
    durationEl.textContent = d.duration;
    goalEl.textContent = d.goal;
    card.classList.remove('ba-fade', 'in');
    void card.offsetWidth;          // restart animation
    card.classList.add('ba-fade', 'in');
    dotsWrap.querySelectorAll('.ba-dot').forEach((dot, di) =>
      dot.classList.toggle('active', di === i));
  }

  // --- Build dot navigation ---
  DATA.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'ba-dot';
    dot.setAttribute('aria-label', `Go to transformation ${i + 1}`);
    dot.addEventListener('click', () => { go(i); });
    dotsWrap.appendChild(dot);
  });

  function go(i) {
    index = (i + DATA.length) % DATA.length;
    render(index);
    resetAutoplay();
  }

  // --- Slider drag position (rAF-throttled) ---
  function apply() {
    beforePane.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
    handle.style.left = pos + '%';
    slider.setAttribute('aria-valuenow', Math.round(pos));
    rafId = null;
  }
  function setPos(clientX) {
    const rect = slider.getBoundingClientRect();
    pos = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    if (!rafId) rafId = requestAnimationFrame(apply);
  }

  let dragging = false;
  const getX = (e) => (e.touches ? e.touches[0] : e).clientX;
  const start = (e) => { dragging = true; setPos(getX(e)); };
  const move = (e) => { if (dragging) setPos(getX(e)); };
  const end = () => { dragging = false; };

  slider.addEventListener('mousedown', start);
  window.addEventListener('mousemove', move);
  window.addEventListener('mouseup', end);
  slider.addEventListener('touchstart', start, { passive: true });
  window.addEventListener('touchmove', move, { passive: true });
  window.addEventListener('touchend', end);

  // --- Keyboard accessibility ---
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { pos = Math.max(0, pos - 5); apply(); }
    else if (e.key === 'ArrowRight') { pos = Math.min(100, pos + 5); apply(); }
    else if (e.key === 'Home') { pos = 0; apply(); }
    else if (e.key === 'End') { pos = 100; apply(); }
  });

  // --- Prev / Next buttons ---
  document.querySelector('.ba-prev').addEventListener('click', () => go(index - 1));
  document.querySelector('.ba-next').addEventListener('click', () => go(index + 1));

  // --- Autoplay every 6s, pause on hover ---
  let timer = null;
  function resetAutoplay() {
    clearInterval(timer);
    timer = setInterval(() => go(index + 1), 6000);
  }
  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', resetAutoplay);

  // --- Fade-in when section enters viewport ---
  const section = document.getElementById('transformations');
  if (section) {
    section.querySelectorAll('.ba-slider, .ba-info, .ba-dots').forEach(el => el.classList.add('ba-fade'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.15 });
    section.querySelectorAll('.ba-fade').forEach(el => io.observe(el));
  }

  // Init
  render(0);
  apply();
  resetAutoplay();
})();
