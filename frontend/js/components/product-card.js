(() => {
  const imagensMap = {
    'chocolate': '/frontend/assets/bolo1.jpeg', 
    'laranja': '/frontend/assets/bolo2.jpeg',
    'morango': '/frontend/assets/bolo3.jpeg',
    'brigadeiro': '/frontend/assets/brigadeiros.jpeg',
    'fatia1': '/frontend/assets/fatia1.jpeg', 
    'fatia2': '/frontend/assets/fatia2.jpeg',
    'fatia3': '/frontend/assets/fatia3.jpeg',
    'torta': '/frontend/assets/tortadelimao.jpeg'
  };

  window.renderProductCard = (product) => {
    const name = window.escapeHTML(product.name);
    const description = window.escapeHTML(product.description);
    const category = window.escapeHTML(product.categoryName);
    const tone = tones[product.categorySlug] || 1;
    
    const nomeMinusculo = product.name.toLowerCase();
    let caminhoImagem = '/frontend/assets/bolo1.jpeg'; 
    
    for (const chave in imagensMap) {
      if (nomeMinusculo.includes(chave)) {
        caminhoImagem = imagensMap[chave];
        break;
      }
    }

    return `<article class="product-card">
      <div class="product-card__visual" data-tone="${tone}">
        ${product.featured ? '<span class="product-card__tag">QUERIDINHO</span>' : ''}
        <img class="product-card__image" src="${caminhoImagem}" alt="${name}" loading="lazy">
      </div>
      <div class="product-card__body">
        <span class="product-card__category">${category}</span>
        <h3>${name}</h3>
        <p class="product-card__description">${description}</p>
        <div class="product-card__bottom">
          <span class="product-card__price">${window.formatCurrency(product.price)}</span>
          <button class="add-button" type="button" data-add-product="${product.id}" aria-label="Adicionar ${name} ao carrinho">+</button>
        </div>
      </div>
    </article>`;
  };

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-add-product]');
    if (!button) return;
    const product = window.currentProducts?.find((item) => item.id === Number(button.dataset.addProduct));
    if (product) window.StoreCart.add(product);
  });
})();