(() => {
  const API_BASE = '/api';

  async function request(endpoint) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: { Accept: 'application/json' }
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || 'Não foi possível carregar os dados.');
    return payload.data ?? payload;
  }

  window.StoreAPI = {
    getCategories: () => request('/categorias'),
    getProducts: (filters = {}) => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') params.set(key, value);
      });
      const query = params.toString();
      return request(`/produtos${query ? `?${query}` : ''}`);
    },
    getProduct: (id) => request(`/produtos/${encodeURIComponent(id)}`)
  };

  window.escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);

  window.formatCurrency = (value) => new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL'
  }).format(value);
})();
