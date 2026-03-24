/* ─────────────────────────────────────────────
   SAFRON BIRYANI — main.js
   ───────────────────────────────────────────── */

/* ─── NAVBAR SCROLL EFFECT ─── */
(function () {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

/* ─── HAMBURGER / MOBILE MENU ─── */
(function () {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  const links = menu.querySelectorAll('.mob-link');

  function toggle() {
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  btn.addEventListener('click', toggle);
  links.forEach(l => l.addEventListener('click', () => {
    menu.classList.remove('open');
    btn.classList.remove('open');
    document.body.style.overflow = '';
  }));
})();

/* ─── SCROLL REVEAL ─── */
(function () {
  const targets = document.querySelectorAll(
    '.glass-card, .menu-card, .about-text, .about-image-wrap, .contact-wrap, .section-title, .section-label'
  );

  targets.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => io.observe(el));
})();

/* ─── COUNTER ANIMATION (Why Us section) ─── */
(function () {
  const counters = document.querySelectorAll('.why-num[data-target]');

  function animateCounter(el) {
    const target = +el.getAttribute('data-target');
    const duration = 1800;
    const step = 16;
    const steps = duration / step;
    let current = 0;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target.toLocaleString() + (target >= 1000 ? '+' : '+');
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current).toLocaleString();
      }
    }, step);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(el => io.observe(el));
})();

/* ─── CART ─── */
const cart = (function () {
  const items   = [];
  const floatEl = document.getElementById('cartFloat');
  const modalEl = document.getElementById('cartModal');
  const toggleBtn  = document.getElementById('cartToggle');
  const closeBtn   = document.getElementById('cartClose');
  const countEl    = document.getElementById('cartCount');
  const totalEl    = document.getElementById('cartTotal');
  const itemsEl    = document.getElementById('cartItems');
  const modalTotalEl = document.getElementById('cartModalTotal');
  const waBtn      = document.getElementById('cartWhatsapp');

  function getTotal() {
    return items.reduce((s, i) => s + i.price, 0);
  }

  function render() {
    const total = getTotal();
    const count = items.length;

    // Float button
    floatEl.classList.toggle('visible', count > 0);
    countEl.textContent = count;
    totalEl.textContent = '₹' + total;
    modalTotalEl.textContent = '₹' + total;

    // Items list
    itemsEl.innerHTML = items.length
      ? items.map((item, idx) => `
          <div class="cart-item">
            <span class="cart-item-name">${item.name}</span>
            <div style="display:flex;align-items:center;gap:0.5rem">
              <span class="cart-item-price">₹${item.price}</span>
              <button class="cart-item-remove" data-idx="${idx}" aria-label="Remove">✕</button>
            </div>
          </div>
        `).join('')
      : '<p style="color:var(--muted);font-size:0.88rem;text-align:center;padding:1rem 0">Your cart is empty.</p>';

    // WhatsApp message
    if (count > 0) {
      const msg = encodeURIComponent(
        '🍚 *Safron Biryani Order*\n\n' +
        items.map(i => `• ${i.name} — ₹${i.price}`).join('\n') +
        `\n\n*Total: ₹${total}*\n\nPlease confirm my order. Thank you!`
      );
      waBtn.href = `https://wa.me/919000000000?text=${msg}`;
    }

    // Remove buttons
    itemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        items.splice(+btn.dataset.idx, 1);
        render();
      });
    });
  }

  function add(name, price) {
    items.push({ name, price });
    render();
    // flash the float button
    floatEl.querySelector('.cart-btn').animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }],
      { duration: 350, easing: 'ease-in-out' }
    );
  }

  toggleBtn.addEventListener('click', () => modalEl.classList.add('open'));
  closeBtn.addEventListener('click',  () => modalEl.classList.remove('open'));
  modalEl.addEventListener('click', e => { if (e.target === modalEl) modalEl.classList.remove('open'); });

  return { add };
})();

/* expose to inline onclick handlers */
function addToOrder(name, price) {
  cart.add(name, price);
}

/* ─── RESERVATION FORM ─── */
(function () {
  const form    = document.getElementById('reservationForm');
  const success = document.getElementById('formSuccess');

  // Set min date to today
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    dateInput.value = today;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name  = document.getElementById('fname').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const date  = document.getElementById('date').value;
    const time  = document.getElementById('time').value;

    if (!name || !phone || !date || !time) {
      shakeForm(form);
      return;
    }

    // Compose WhatsApp message
    const guests   = document.getElementById('guests').value;
    const occasion = document.getElementById('occasion').value;
    const notes    = document.getElementById('notes').value.trim();

    const msg = encodeURIComponent(
      `🍽️ *Table Reservation — Safron Biryani*\n\n` +
      `👤 Name: ${name}\n` +
      `📞 Phone: ${phone}\n` +
      `📅 Date: ${formatDate(date)}\n` +
      `🕐 Time: ${formatTime(time)}\n` +
      `👥 Guests: ${guests}\n` +
      (occasion ? `🎉 Occasion: ${occasion}\n` : '') +
      (notes    ? `📝 Notes: ${notes}\n`    : '') +
      `\nPlease confirm our reservation. Thank you!`
    );

    // Open WhatsApp with reservation details
    window.open(`https://wa.me/919000000000?text=${msg}`, '_blank');

    // Show success message
    success.classList.add('visible');
    form.reset();
    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

    setTimeout(() => success.classList.remove('visible'), 6000);
  });

  function formatDate(d) {
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
  }
  function formatTime(t) {
    const [h, min] = t.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12  = h % 12 || 12;
    return `${h12}:${String(min).padStart(2, '0')} ${ampm}`;
  }
  function shakeForm(el) {
    el.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-6px)' },
        { transform: 'translateX(6px)' },
        { transform: 'translateX(-4px)' },
        { transform: 'translateX(4px)' },
        { transform: 'translateX(0)' }
      ],
      { duration: 400, easing: 'ease-in-out' }
    );
  }
})();

/* ─── ACTIVE NAV LINK ON SCROLL ─── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');

  function setActive() {
    const scrollY = window.scrollY + 100;
    sections.forEach(sec => {
      const top    = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      const link   = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
      if (link) link.style.color = (scrollY >= top && scrollY < bottom) ? 'var(--gold)' : '';
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();
