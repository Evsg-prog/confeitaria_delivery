(function () {
  'use strict';

  // ---------------------------------------------------------
  // MODO DE TESTE (MOCK)
  // Se o backend não estiver rodando, usamos esses dados falsos
  // ---------------------------------------------------------
  const USE_MOCK = true; // Mude para false quando o backend estiver pronto

  const MOCK_CATEGORIES = [
    { name: 'Bolos', slug: 'bolos' },
    { name: 'Doces', slug: 'doces' },
    { name: 'Tortas', slug: 'tortas' }
  ];

      const MOCK_PRODUCTS = [
    { id: 1, name: 'Bolo de Chocolate', description: 'Massa fofinha com cobertura cremosa.', price: 45.90, categoryName: 'Bolos', categorySlug: 'bolos', featured: true, image: 'bolo1.jpeg' },
    { id: 2, name: 'Bolo de Cenoura', description: 'Clássico com calda de chocolate meio amargo.', price: 35.00, categoryName: 'Bolos', categorySlug: 'bolos', featured: true, image: 'bolo2.jpeg' },
    { id: 3, name: 'Torta de Morango', description: 'Recheio de creme e morangos frescos.', price: 60.00, categoryName: 'Tortas', categorySlug: 'tortas', featured: true, image: 'bolo3.jpeg' },
    { id: 4, name: 'Brigadeiro Tradicional', description: 'Feito com chocolate belga.', price: 3.50, categoryName: 'Doces', categorySlug: 'doces', featured: true, image: 'brigadeiros.jpeg' },
    { id: 5, name: 'Beijinho', description: 'Doce de coco com cravo.', price: 3.50, categoryName: 'Doces', categorySlug: 'doces', featured: false, image: 'brigadeiros.jpeg' },
    { id: 6, name: 'Brownie Clássico', description: 'Casquinha crocante e interior úmido.', price: 12.00, categoryName: 'Doces', categorySlug: 'doces', featured: false, image: 'fatia1.jpeg' },
    { id: 7, name: 'Brownie com doce de leite', description: 'Recheado com muito doce de leite.', price: 15.00, categoryName: 'Doces', categorySlug: 'doces', featured: false, image: 'fatia2.jpeg' },
    { id: 8, name: 'Torta de Limão', description: 'Azedinho na medida certa com merengue.', price: 50.00, categoryName: 'Tortas', categorySlug: 'tortas', featured: false, image: 'tortadelimao.jpeg' }
  ];

  // ---------------------------------------------------------
  // Configuração
  // ---------------------------------------------------------
  const API_BASE = 'http://localhost:3000/api';
  const IMG_DIR = './frontend/img/';
  const CART_KEY = 'doceAtelieCart';
  const FALLBACK_IMG = IMG_DIR + 'bolo1.jpeg';

  let products = [];
  let categories = [];
  let selectedCategory = '';
  let searchTerm = '';
  let cart = readCart();

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  function readCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function normalize(value) {
    return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  function brl(value) {
    return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function debounce(fn, ms = 220) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  }

  function getImage(product) {
    const raw = String(product.image || '').trim();
    if (raw) {
      const file = raw.split(/[\\/]/).pop();
      if (/^[\w.-]+\.(jpe?g|png|webp)$/i.test(file)) {
        return IMG_DIR + encodeURIComponent(file);
      }
    }
    return FALLBACK_IMG;
  }

  function imageHTML(product, cls = 'product-image') {
    return `<img class="${cls}" src="${escapeHTML(getImage(product))}" alt="${escapeHTML(product.name)}" loading="lazy" data-fallback="0">`;
  }

  function showToast(message) {
    const root = $('#toast-root');
    if (!root) return;
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    root.appendChild(el);
    setTimeout(() => {
      el.style.transition = 'opacity .2s';
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 220);
    }, 1800);
  }

  document.addEventListener('error', (event) => {
    const el = event.target;
    if (el.tagName === 'IMG' && el.dataset.fallback !== '1') {
      el.dataset.fallback = '1';
      el.src = FALLBACK_IMG;
    }
  }, true);

  function showPage(page) {
    $$('.page').forEach((section) => {
      section.classList.toggle('active', section.id === `page-${page}`);
    });
    $$('button[data-page]').forEach((btn) => {
      if (!btn.classList.contains('cart-nav')) {
        btn.classList.toggle('active', btn.dataset.page === page);
      }
    });
    if (page === 'cart') renderCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ---------------------------------------------------------
  // Carregamento de Dados (AQUI ESTÁ A MÁGICA DO MOCK)
  // ---------------------------------------------------------
  async function loadStore() {
    try {
      if (USE_MOCK) {
        // Simula um pequeno atraso da internet
        await new Promise(resolve => setTimeout(resolve, 400));
        products = MOCK_PRODUCTS;
        categories = MOCK_CATEGORIES;
      } else {
        // Busca do backend real
        const [prodRes, catRes] = await Promise.all([
          fetch(API_BASE + '/produtos').then(r => r.json()),
          fetch(API_BASE + '/categorias').then(r => r.json())
        ]);
        products = Array.isArray(prodRes.data) ? prodRes.data : [];
        categories = Array.isArray(catRes.data) ? catRes.data : [];
      }

      renderFeatured();
      renderFilters();
      renderCatalog();
    } catch (err) {
      console.error('Falha ao carregar catálogo:', err);
      const msg = '<p class="notice">Não foi possível carregar os produtos.</p>';
      $('#featured-products').innerHTML = msg;
      $('#catalog-products').innerHTML = msg;
    }
  }

  function productCard(product) {
    return `
      <article class="product-card">
        ${imageHTML(product)}
        <div class="product-body">
          ${product.featured ? '<span class="badge">QUERIDINHO</span>' : ''}
          <span class="product-category">${escapeHTML(product.categoryName)}</span>
          <h3>${escapeHTML(product.name)}</h3>
          <p class="product-description">${escapeHTML(product.description)}</p>
          <div class="product-bottom">
            <span class="price">${brl(product.price)}</span>
            <button class="add-button" data-add="${Number(product.id)}" aria-label="Adicionar ${escapeHTML(product.name)}" type="button">+</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderFeatured() {
    const featured = products.filter((p) => p.featured).slice(0, 4);
    $('#featured-products').innerHTML = featured.length
      ? featured.map(productCard).join('')
      : '<p class="notice">Nenhum produto em destaque.</p>';
  }

  function renderFilters() {
    const all = [{ name: 'Todos', slug: '' }, ...categories];
    $('#category-filters').innerHTML = all.map((c) => `
      <button class="filter ${selectedCategory === c.slug ? 'active' : ''}" data-category="${escapeHTML(c.slug)}" type="button">
        ${escapeHTML(c.name)}
      </button>
    `).join('');
  }

  function renderCatalog() {
    const term = normalize(searchTerm);
    const list = products.filter((p) => {
      const catOk = !selectedCategory || p.categorySlug === selectedCategory;
      const haystack = normalize(`${p.name} ${p.description} ${p.categoryName}`);
      return catOk && haystack.includes(term);
    });

    const cat = categories.find((c) => c.slug === selectedCategory);
    $('#catalog-title').textContent = cat ? cat.name : 'Todos os produtos';
    $('#product-count').textContent = `${list.length} ${list.length === 1 ? 'produto' : 'produtos'}`;
    $('#catalog-products').innerHTML = list.length
      ? list.map(productCard).join('')
      : '<p class="notice">Nenhum produto encontrado.</p>';
  }

  function saveCart() {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (err) {}
    updateCartCount();
  }

  function updateCartCount() {
    const count = cart.reduce((sum, i) => sum + i.quantity, 0);
    $('#cart-count').textContent = count;
  }

  function addToCart(id) {
    const product = products.find((p) => Number(p.id) === id);
    if (!product) return;
    const existing = cart.find((i) => Number(i.id) === id);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: getImage(product),
        quantity: 1
      });
    }
    saveCart();
    showToast(`${product.name} adicionado ao carrinho`);
  }

  function changeQuantity(id, delta) {
    const item = cart.find((i) => Number(i.id) === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) cart = cart.filter((i) => Number(i.id) !== id);
    saveCart();
    renderCart();
  }

  function removeFromCart(id) {
    cart = cart.filter((i) => Number(i.id) !== id);
    saveCart();
    renderCart();
  }

  function renderCart() {
    const container = $('#cart-content');
    if (!cart.length) {
      container.innerHTML = `
        <div class="empty">
          <h2>Seu carrinho está vazio.</h2>
          <p>Que tal escolher algo especial?</p>
          <button class="button" data-page="catalog">Explorar cardápio</button>
        </div>
      `;
      return;
    }

    const subtotal = cart.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);

    container.innerHTML = `
      <div class="cart-list">
        ${cart.map((item) => `
          <article class="cart-item">
            <img src="${escapeHTML(item.image || FALLBACK_IMG)}" alt="${escapeHTML(item.name)}" data-fallback="0">
            <div>
              <h3>${escapeHTML(item.name)}</h3>
              <p>${brl(item.price)} por unidade</p>
              <div class="quantity">
                <button data-id="${Number(item.id)}" data-quantity="-1" aria-label="Diminuir">−</button>
                <strong>${item.quantity}</strong>
                <button data-id="${Number(item.id)}" data-quantity="1" aria-label="Aumentar">+</button>
              </div>
            </div>
            <div class="cart-item-total">
              <strong>${brl(item.price * item.quantity)}</strong><br>
              <button class="remove-button" data-remove="${Number(item.id)}">Remover</button>
            </div>
          </article>
        `).join('')}
      </div>

      <div class="cart-summary">
        <div class="summary-row"><span>Subtotal</span><strong>${brl(subtotal)}</strong></div>
        <div class="summary-row summary-total"><span>Total</span><strong>${brl(subtotal)}</strong></div>
        <p class="summary-note">Frete e condições de entrega serão combinados no atendimento.</p>
        <button class="button button-block" id="checkout-button">Continuar pedido</button>
      </div>
    `;

    $('#checkout-button').addEventListener('click', () => {
      showToast('O carrinho está pronto. Finalização em breve.');
    });
  }

  document.addEventListener('click', (event) => {
    const nav = event.target.closest('[data-page]');
    if (nav) return showPage(nav.dataset.page);
    const add = event.target.closest('[data-add]');
    if (add) return addToCart(Number(add.dataset.add));
    const cat = event.target.closest('[data-category]');
    if (cat) {
      selectedCategory = cat.dataset.category;
      renderFilters();
      renderCatalog();
      return;
    }
    const qty = event.target.closest('[data-quantity]');
    if (qty) return changeQuantity(Number(qty.dataset.id), Number(qty.dataset.quantity));
    const rem = event.target.closest('[data-remove]');
    if (rem) removeFromCart(Number(rem.dataset.remove));
  });

  $('#product-search').addEventListener('input', debounce((event) => {
    searchTerm = event.target.value;
    renderCatalog();
  }));

  window.addEventListener('storage', (event) => {
    if (event.key !== CART_KEY) return;
    cart = readCart();
    updateCartCount();
    if ($('#page-cart').classList.contains('active')) renderCart();
  });

  updateCartCount();
  loadStore();
})();