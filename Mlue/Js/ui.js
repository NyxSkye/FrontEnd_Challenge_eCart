// js/ui.js
const UI = {
  // Challenge 1: Price Finder Controller
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
  },

  // Challenge 2: Popular Products Controller
  createPopularProductCard(product, rank) {
    const card = document.createElement("article");
    card.className = "product-card popular-card";
    const popularityScore = Math.round((product.rating || 0) * (product.reviews || 0));

    card.innerHTML = `
      <div class="rank-badge">#${rank}</div>
      <h3>${product.name}</h3>
      <p class="brand">Brand: ${product.brand}</p>
      <p class="price">₹${product.price.toLocaleString("en-IN")}</p>
      <p class="rating">⭐ ${product.rating} (${product.reviews.toLocaleString("en-IN")} reviews)</p>
      <p class="popularity-metric">🔥 Score: <strong>${popularityScore.toLocaleString("en-IN")}</strong></p>
      <button class="btn-view" data-id="${product.id}">View Product</button>
    `;
    return card;
  },

  renderPopularProducts(containerId, products) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    if (!products || products.length === 0) {
      container.innerHTML = `<p class="empty-msg">No popular products found.</p>`;
      return;
    }

    products.forEach((item, index) => {
      container.appendChild(this.createPopularProductCard(item, index + 1));
    });
  },

  // Challenge 5: Recommendations Controller
  createRecommendationCard(product) {
    const card = document.createElement("article");
    card.className = "product-card rec-card";
    card.innerHTML = `
      <span class="rec-badge">Often viewed with ${product.targetProductName}</span>
      <h3>${product.name}</h3>
      <p class="brand">Brand: ${product.brand}</p>
      <p class="price">₹${product.price.toLocaleString("en-IN")}</p>
      <p class="rating">⭐ ${product.rating} (${product.reviews} reviews)</p>
      <p class="frequency-indicator">👥 ${product.coOccurrenceCount} other buyers viewed this together</p>
      <button class="btn-view" data-id="${product.id}">View Product</button>
    `;
    return card;
  },

  renderRecommendations(containerId, products) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    if (!products || products.length === 0) {
      container.innerHTML = `<p class="empty-msg">No shared viewing history found for this product.</p>`;
      return;
    }

    products.forEach((item) => {
      container.appendChild(this.createRecommendationCard(item));
    });
  },

  // Challenge 10: Warehouse Optimizer Controller
  renderKnapsackResults(summaryContainerId, listContainerId, result) {
    const summaryEl = document.getElementById(summaryContainerId);
    const listEl = document.getElementById(listContainerId);

    if (!summaryEl || !listEl) return;

    summaryEl.innerHTML = `
      <div class="knapsack-stat-card">
        <span class="stat-label">Total Value</span>
        <strong class="stat-val text-primary">₹${result.totalValue.toLocaleString("en-IN")}</strong>
      </div>
      <div class="knapsack-stat-card">
        <span class="stat-label">Total Weight</span>
        <strong class="stat-val">${result.totalWeight} / ${result.capacity} kg</strong>
      </div>
      <div class="knapsack-stat-card">
        <span class="stat-label">Remaining Space</span>
        <strong class="stat-val">${result.remainingCapacity} kg</strong>
      </div>
      <div class="knapsack-stat-card">
        <span class="stat-label">Selected Items</span>
        <strong class="stat-val">${result.selectedProducts.length}</strong>
      </div>
    `;

    listEl.innerHTML = "";
    if (result.selectedProducts.length === 0) {
      listEl.innerHTML = `<p class="empty-msg">No items could fit into the specified capacity.</p>`;
      return;
    }

    result.selectedProducts.forEach((item) => {
      const card = document.createElement("article");
      card.className = "product-card knapsack-item-card";
      card.innerHTML = `
        <div class="knapsack-badge">✓ Selected</div>
        <h3>${item.name}</h3>
        <p class="brand">Brand: ${item.brand}</p>
        <p class="price">Value: ₹${item.value.toLocaleString("en-IN")}</p>
        <p class="weight-metric">⚖️ Weight: <strong>${item.weight} kg</strong></p>
      `;
      listEl.appendChild(card);
    });
  }
};