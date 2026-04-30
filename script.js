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
  const frame = document.querySelector('[data-ba]');
  if (!frame) return;

  // --- Transformation data set (add more objects to extend) ---
  // `image` = a single combo photo showing before + after together.
  const DATA = [
    {
      image: 'BeforeAfter.jpg',
      name: 'John Smith',
      result: 'Lost 18 kg',
      duration: '6 Months',
      goal: 'Body Fat 32% → 14%'
    }
  ];

  const img = frame.querySelector('.ba-frame-img');
  const card = document.querySelector('[data-ba-card]');
  const dotsWrap = document.querySelector('[data-ba-dots]');
  const nameEl = card.querySelector('[data-name]');
  const resultEl = card.querySelector('[data-result]');
  const durationEl = card.querySelector('[data-duration]');
  const goalEl = card.querySelector('[data-goal]');

  let index = 0;
  let timer = null;

  // Styled placeholder shown until a real image is dropped in
  function placeholder() {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>
      <rect width='50%' height='100%' fill='#111'/>
      <rect x='50%' width='50%' height='100%' fill='#ffff00'/>
      <text x='25%' y='50%' fill='#fff' font-family='sans-serif' font-size='90'
        font-weight='700' text-anchor='middle' dominant-baseline='middle' opacity='0.25'>BEFORE</text>
      <text x='75%' y='50%' fill='#000' font-family='sans-serif' font-size='90'
        font-weight='700' text-anchor='middle' dominant-baseline='middle' opacity='0.25'>AFTER</text></svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  function render(i) {
    const d = DATA[i];
    img.onerror = () => { img.onerror = null; img.src = placeholder(); };
    img.src = d.image;
    nameEl.textContent = d.name;
    resultEl.textContent = d.result;
    durationEl.textContent = d.duration;
    goalEl.textContent = d.goal;
    card.classList.remove('ba-fade', 'in');
    void card.offsetWidth;          // restart fade animation
    card.classList.add('ba-fade', 'in');
    dotsWrap.querySelectorAll('.ba-dot').forEach((dot, di) =>
      dot.classList.toggle('active', di === i));
  }

  // --- Build dot navigation ---
  DATA.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'ba-dot';
    dot.setAttribute('aria-label', `Go to transformation ${i + 1}`);
    dot.addEventListener('click', () => go(i));
    dotsWrap.appendChild(dot);
  });

  function go(i) {
    index = (i + DATA.length) % DATA.length;
    render(index);
    resetAutoplay();
  }

  // --- Prev / Next buttons ---
  document.querySelector('.ba-prev').addEventListener('click', () => go(index - 1));
  document.querySelector('.ba-next').addEventListener('click', () => go(index + 1));

  // --- Autoplay every 6s, pause on hover (only cycles with 2+ entries) ---
  function resetAutoplay() {
    clearInterval(timer);
    if (DATA.length > 1) timer = setInterval(() => go(index + 1), 6000);
  }
  frame.addEventListener('mouseenter', () => clearInterval(timer));
  frame.addEventListener('mouseleave', resetAutoplay);

  // --- Fade-in when section enters viewport ---
  const section = document.getElementById('transformations');
  if (section) {
    section.querySelectorAll('.ba-frame, .ba-info, .ba-dots').forEach(el => el.classList.add('ba-fade'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15 });
    section.querySelectorAll('.ba-fade').forEach(el => io.observe(el));
  }

  // Init
  render(0);
  resetAutoplay();
})();
