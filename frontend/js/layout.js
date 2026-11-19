(() => {
  const app = document.querySelector('#app');
  const template = document.querySelector('#page-content');
  if (!app || !template) {
    console.error('Estrutura principal da página não encontrada.');
    return;
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navItems = [
    { href: './index.html', label: 'Início', page: 'index.html' },
    { href: './cardapio.html', label: 'Cardápio', page: 'cardapio.html' }
  ];

  app.innerHTML = `
    <header class="site-header">
      <a class="brand" href="./index.html" aria-label="Doce Ateliê, página inicial">
        <span class="brand__mark" aria-hidden="true">✿</span>
        <span class="brand__name">Doce Ateliê<small>confeitaria artesanal</small></span>
      </a>
      <nav class="main-nav" id="main-nav" aria-label="Navegação principal">
        ${navItems.map((item) => `<a href="${item.href}" ${currentPage === item.page ? 'aria-current="page"' : ''}>${item.label}</a>`).join('')}
      </nav>
      <div class="header-actions">
        <a class="cart-link" href="./carrinho.html" aria-label="Carrinho, ${window.StoreCart?.getCount() ?? 0} itens">
          <span aria-hidden="true">🛍</span> Carrinho <span class="cart-count" id="cart-count">${window.StoreCart?.getCount() ?? 0}</span>
        </a>
        <button class="menu-toggle" id="menu-toggle" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="main-nav">☰</button>
      </div>
    </header>
    <div id="page-content"></div>
    <footer class="site-footer"><strong>Doce Ateliê</strong><p>Confeitaria artesanal feita com carinho. © ${new Date().getFullYear()}</p></footer>
  `;

  app.querySelector('#page-content').append(template.content.cloneNode(true));

  const menuButton = app.querySelector('#menu-toggle');
  const navigation = app.querySelector('#main-nav');
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(expanded));
    menuButton.setAttribute('aria-label', expanded ? 'Fechar menu' : 'Abrir menu');
    navigation.classList.toggle('is-open', expanded);
  });

  function updateCartCount() {
    const count = window.StoreCart?.getCount() ?? 0;
    const badge = app.querySelector('#cart-count');
    const link = app.querySelector('.cart-link');
    if (badge) badge.textContent = count;
    if (link) link.setAttribute('aria-label', `Carrinho, ${count} itens`);
  }

  window.addEventListener('cart:updated', updateCartCount);
})();
