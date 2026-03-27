/* ===================================================
   VELOURS CORTINAS — main.js
   Lógica principal de la página
   =================================================== */

/* ---- Navbar scroll ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ---- Render productos ---- */
const grid = document.getElementById('products-grid');

function renderProducts(filter = 'todos') {
  grid.innerHTML = '';
  const filtered = filter === 'todos'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === filter);

  filtered.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${i * 80}ms`;
    card.dataset.id = p.id;
    card.innerHTML = `
      <div class="product-img">
        <div class="product-swatch" style="background:${p.bg}">
          ${p.emoji}
        </div>
      </div>
      <div class="product-info">
        <div class="product-tag">${p.tag}</div>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-footer">
          <span class="product-price">${p.price}</span>
          <button class="product-btn" data-id="${p.id}">Ver más</button>
        </div>
      </div>
    `;
    card.addEventListener('click', () => openModal(p.id));
    grid.appendChild(card);
  });
}

renderProducts();

/* ---- Filtros ---- */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts(btn.dataset.filter);
  });
});

/* ---- Modal ---- */
const overlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');

function openModal(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  const featuresList = p.features
    .map(f => `<div class="modal-feature">${f}</div>`)
    .join('');

  modalContent.innerHTML = `
    <div class="modal-swatch" style="background:${p.bg}">${p.emoji}</div>
    <span class="modal-tag">${p.tag}</span>
    <h2>${p.name}</h2>
    <p>${p.desc}</p>
    <div class="modal-features">${featuresList}</div>
    <div class="modal-price">${p.price} <small style="font-size:0.9rem;color:#888">/ metro cuadrado</small></div>
    <button class="btn-primary full" onclick="cotizar('${p.name}')">Cotizar esta cortina</button>
  `;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function cotizar(nombre) {
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  const contacto = document.getElementById('contacto');
  contacto.scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    const sel = document.getElementById('tipo');
    // Pre-seleccionar el tipo si coincide
    for (let i = 0; i < sel.options.length; i++) {
      if (sel.options[i].text.toLowerCase().includes(nombre.split(' ')[1]?.toLowerCase() || '')) {
        sel.selectedIndex = i;
        break;
      }
    }
    document.getElementById('mensaje').value = `Hola, estoy interesado/a en la cortina "${nombre}". ¿Podrían enviarme una cotización?`;
  }, 600);
}

document.getElementById('modal-close').addEventListener('click', () => {
  overlay.classList.remove('active');
  document.body.style.overflow = '';
});
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
});

/* ---- Animaciones de estadísticas ---- */
function animateCount(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target.toLocaleString('es-CO');
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start).toLocaleString('es-CO');
    }
  }, 16);
}

/* ---- Intersection Observer para reveal y stats ---- */
const revealEls = document.querySelectorAll('.stat-item, .reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const numEl = entry.target.querySelector('.stat-number');
    if (numEl && !numEl.dataset.animated) {
      numEl.dataset.animated = '1';
      animateCount(numEl, parseInt(numEl.dataset.target));
    }
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.3 });

revealEls.forEach(el => observer.observe(el));

// Aplicar clase reveal a secciones
document.querySelectorAll('.tipo-card, .step, .testimonio, .product-card').forEach(el => {
  if (!el.classList.contains('product-card')) el.classList.add('reveal');
  observer.observe(el);
});

/* ---- Formulario de contacto ---- */
const form = document.getElementById('contacto-form');
const formSuccess = document.getElementById('form-success');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!nombre || !email) {
    alert('Por favor completa al menos tu nombre y correo.');
    return;
  }

  // Simular envío
  const btn = form.querySelector('.btn-primary');
  btn.textContent = 'Enviando...';
  btn.disabled = true;

  setTimeout(() => {
    form.reset();
    btn.textContent = 'Enviar Consulta';
    btn.disabled = false;
    formSuccess.style.display = 'block';
    setTimeout(() => formSuccess.style.display = 'none', 5000);
  }, 1200);
});

/* ---- Botón cotizar navbar ---- */
document.querySelector('.nav-cta').addEventListener('click', () => {
  document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
});

/* ---- Hamburger (móvil) ---- */
const hamburger = document.getElementById('hamburger');
hamburger.addEventListener('click', () => {
  const navLinks = document.querySelector('.nav-links');
  navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
  navLinks.style.flexDirection = 'column';
  navLinks.style.position = 'fixed';
  navLinks.style.top = '0';
  navLinks.style.left = '0';
  navLinks.style.right = '0';
  navLinks.style.background = '#1a1612';
  navLinks.style.padding = '80px 40px 40px';
  navLinks.style.gap = '28px';
  navLinks.style.zIndex = '99';
});
