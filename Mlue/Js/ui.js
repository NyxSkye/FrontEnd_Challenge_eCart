// js/ui.js
const UI = {
  createProductCard(product) {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <h3>${product.name}</h3>
      <p class="brand">Brand: ${product.brand}</p>
      <p class="price">₹${product.price.toLocaleString("en-IN")}</p>
      <p class="rating">⭐ ${product.rating} (${product.reviews} reviews)</p>
      <button class="btn-view" data-id="${product.id}">View Product</button>
    `;
    return card;
  },

  renderProducts(containerId, products) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    if (!products || products.length === 0) {
      container.innerHTML = `<p class="empty-msg">No matching products found.</p>`;
      return;
    }

    products.forEach((item) => {
      container.appendChild(this.createProductCard(item));
    });
  }
};