(() => {
  const filtersContainer = document.querySelector('#category-filters');
  const productsContainer = document.querySelector('#catalog-products');
  const searchInput = document.querySelector('#product-search');
  const title = document.querySelector('#catalog-title');
  const count = document.querySelector('#product-count');
  if (!filtersContainer || !productsContainer) return;
  let activeCategory = '';
  let searchTerm = '';
  let categories = [];
  function renderFilters() {
    const all = [{ slug: '', name: 'Todos' }, ...categories];
    filtersContainer.innerHTML = all.map((category) => `<button class="filter-chip ${activeCategory === category.slug ? 'is-active' : ''}" type="button" data-category="${window.escapeHTML(category.slug)}" aria-pressed="${activeCategory === category.slug}">${window.escapeHTML(category.name)}</button>`).join('');
  }
  async function loadProducts() {
    productsContainer.innerHTML = '<p class="loading-message">Buscando produtos...</p>';
    try {
      const products = await window.StoreAPI.getProducts({ category: activeCategory, search: searchTerm });
      window.currentProducts = products;
      title.textContent = activeCategory ? categories.find((category) => category.slug === activeCategory)?.name || 'Produtos' : 'Todos os produtos';
      count.textContent = `${products.length} ${products.length === 1 ? 'produto' : 'produtos'}`;
      productsContainer.innerHTML = products.length ? products.map(window.renderProductCard).join('') : '<p class="empty-state">Não encontramos produtos com esses filtros. Experimente outra busca.</p>';
    } catch (error) {
      productsContainer.innerHTML = `<p class="empty-state">${window.escapeHTML(error.message)} Tente novamente.</p>`;
    }
  }
  filtersContainer.addEventListener('click', (event) => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    activeCategory = button.dataset.category;
    renderFilters();
    loadProducts();
  });
  let searchTimeout;
  searchInput.addEventListener('input', () => {
    window.clearTimeout(searchTimeout);
    searchTimeout = window.setTimeout(() => { searchTerm = searchInput.value.trim(); loadProducts(); }, 250);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) { event.preventDefault(); searchInput.focus(); }
  });
  async function initialize() {
    try { categories = await window.StoreAPI.getCategories(); renderFilters(); await loadProducts(); }
    catch (error) { filtersContainer.innerHTML = ''; productsContainer.innerHTML = `<p class="empty-state">${window.escapeHTML(error.message)} Verifique se o servidor está ativo.</p>`; }
  }
  initialize();
})();
