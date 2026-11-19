(() => {
  const STORAGE_KEY = 'doce-atelie-cart';

  function readCart() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
  }

  function add(product) {
    const cart = readCart();
    const existing = cart.find((item) => item.id === product.id);
    if (existing) existing.quantity += 1;
    else cart.push({
      id: product.id,
      name: product.name,
      priceInCents: product.priceInCents,
      quantity: 1
    });
    saveCart(cart);
    showToast(`${product.name} adicionado ao carrinho.`);
  }

  function updateQuantity(id, delta) {
    const cart = readCart()
      .map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
      .filter((item) => item.quantity > 0);
    saveCart(cart);
    return cart;
  }

  function remove(id) {
    const cart = readCart().filter((item) => item.id !== id);
    saveCart(cart);
    return cart;
  }

  function getCount() {
    return readCart().reduce((total, item) => total + item.quantity, 0);
  }

  function getTotal() {
    return readCart().reduce((total, item) => total + item.priceInCents * item.quantity, 0) / 100;
  }

  function showToast(message) {
    document.querySelector('.toast')?.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    document.body.append(toast);
    window.setTimeout(() => toast.remove(), 2400);
  }

  window.StoreCart = { read: readCart, add, updateQuantity, remove, getCount, getTotal };
})();
