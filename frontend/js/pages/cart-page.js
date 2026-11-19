(() => {
  const container = document.querySelector('#cart-content');
  if (!container) return;
  function render() {
    const cart = window.StoreCart.read();
    if (!cart.length) {
      container.innerHTML = '<div class="cart-empty"><h2>Seu carrinho está vazio.</h2><p>Que tal escolher alguma delícia para começar?</p><a class="button button--primary" href="./cardapio.html">Ver cardápio <span aria-hidden="true">→</span></a></div>';
      return;
    }
    container.innerHTML = `<div class="cart-list">${cart.map((item) => `<article class="cart-row"><div><h3>${window.escapeHTML(item.name)}</h3><p>${window.formatCurrency(item.priceInCents / 100)} por unidade</p></div><strong class="cart-row__price">${window.formatCurrency((item.priceInCents * item.quantity) / 100)}</strong><div class="quantity-control" aria-label="Quantidade de ${window.escapeHTML(item.name)}"><button type="button" data-quantity="-1" data-id="${item.id}" aria-label="Diminuir quantidade">−</button><span>${item.quantity}</span><button type="button" data-quantity="1" data-id="${item.id}" aria-label="Aumentar quantidade">+</button><button type="button" data-remove="${item.id}" aria-label="Remover ${window.escapeHTML(item.name)}" title="Remover">×</button></div></article>`).join('')}</div><div class="cart-summary"><div class="cart-summary__line"><span>Subtotal</span><span>${window.formatCurrency(window.StoreCart.getTotal())}</span></div><p class="muted" style="margin-bottom:16px">Entrega ou retirada serão definidos na próxima etapa.</p><button class="button button--primary" type="button" disabled aria-disabled="true" title="Checkout será implementado na próxima etapa">Continuar para o checkout (em breve)</button></div>`;
  }
  container.addEventListener('click', (event) => {
    const quantityButton = event.target.closest('[data-quantity]');
    const removeButton = event.target.closest('[data-remove]');
    if (quantityButton) window.StoreCart.updateQuantity(Number(quantityButton.dataset.id), Number(quantityButton.dataset.quantity));
    if (removeButton) window.StoreCart.remove(Number(removeButton.dataset.remove));
    render();
  });
  window.addEventListener('cart:updated', render);
  render();
})();
