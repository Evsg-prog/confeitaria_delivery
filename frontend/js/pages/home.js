(() => {
  const container = document.querySelector('#featured-products');
  if (!container) return;
  async function loadFeatured() {
    try {
      const products = await window.StoreAPI.getProducts({ featured: true });
      window.currentProducts = products;
      container.innerHTML = products.length ? products.slice(0, 4).map(window.renderProductCard).join('') : '<p class="empty-state">Ainda estamos preparando nossos destaques. Volte em breve.</p>';
    } catch (error) {
      container.innerHTML = `<p class="empty-state">${window.escapeHTML(error.message)} Tente atualizar a página.</p>`;
    }
  }
  loadFeatured();
})();
