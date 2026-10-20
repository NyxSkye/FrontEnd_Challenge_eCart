// js/app.js

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Tab Switching & Missing Panel Fallback ---
  const pills = document.querySelectorAll(".challenge-pill");
  const placeholderPanel = document.getElementById("challenge-placeholder");
  const placeholderTitle = document.getElementById("placeholder-title");
  const placeholderTargetBadge = document.getElementById("placeholder-target-badge");
  const progressPill = document.querySelector(".progress-pill");

  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const targetId = pill.dataset.target;
      const pillNumber = pill.querySelector(".pill-number")?.textContent.trim() || "--";
      const pillTitle = pill.querySelector(".pill-title")?.textContent.trim() || targetId;

      pills.forEach((p) => {
        p.classList.remove("active");
        p.setAttribute("aria-selected", "false");
      });
      pill.classList.add("active");
      pill.setAttribute("aria-selected", "true");

      if (progressPill) {
        progressPill.textContent = `${pillNumber} / 10`;
      }

      const allPanels = document.querySelectorAll(".challenge-panel");
      allPanels.forEach((panel) => panel.classList.add("hidden"));

      const targetPanel = document.getElementById(targetId);

      if (targetPanel) {
        targetPanel.classList.remove("hidden");
      } else {
        if (placeholderPanel) {
          if (placeholderTitle) {
            placeholderTitle.textContent = `${pillTitle} is Under Construction`;
          }
          if (placeholderTargetBadge) {
            placeholderTargetBadge.textContent = `#${targetId}`;
          }
          placeholderPanel.classList.remove("hidden");
        }
      }
    });
  });

  // --- 2. Challenge 1: Price Finder Execution ---
  const searchPriceBtn = document.getElementById("search-price-btn");
  const targetPriceInput = document.getElementById("target-price");

  function executePriceSearch() {
    const rawVal = targetPriceInput.value.trim();
    if (!rawVal) {
      alert("Please enter a target price.");
      return;
    }

    const targetPrice = Number(rawVal);
    if (isNaN(targetPrice) || targetPrice <= 0) {
      alert("Please enter a valid positive number.");
      return;
    }

    const closestItems = PriceFinder.getClosestProducts(targetPrice, 3);
    UI.renderProducts("price-results-container", closestItems);
  }

  if (searchPriceBtn && targetPriceInput) {
    searchPriceBtn.addEventListener("click", executePriceSearch);

    targetPriceInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        executePriceSearch();
      }
    });
  }

  // --- Challenge 2: Popular Products Controller ---
  const topKSelect = document.getElementById("top-k-select");
  const showPopularBtn = document.getElementById("show-popular-btn");

  function loadPopularProducts() {
    if (!topKSelect) return;
    const k = parseInt(topKSelect.value, 10) || 3;
    const popularItems = PopularProducts.getTopK(k);
    UI.renderPopularProducts("popular-results-container", popularItems);
  }

  if (showPopularBtn) {
    showPopularBtn.addEventListener("click", loadPopularProducts);
  }

  // --- Challenge 5: Searchable Dropdown & Recommendations Controller ---
  const recSearchInput = document.getElementById("rec-search-input");
  const recSelectedId = document.getElementById("rec-selected-id");
  const recDropdownList = document.getElementById("rec-dropdown-list");
  const getRecsBtn = document.getElementById("get-recommendations-btn");

  let allRecProductsList = [];

  function initSearchableRecDropdown() {
    if (allRecProductsList.length > 0) return;
    allRecProductsList = RecommendationEngine.getAllProductsList();
  }

  function renderDropdownOptions(searchTerm = "") {
    if (!recDropdownList) return;
    recDropdownList.innerHTML = "";

    const query = searchTerm.toLowerCase().trim();
    const filtered = allRecProductsList.filter((item) =>
      item.name.toLowerCase().includes(query) ||
      item.brand.toLowerCase().includes(query) ||
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(query)))
    );

    if (filtered.length === 0) {
      const emptyLi = document.createElement("li");
      emptyLi.className = "searchable-empty-item";
      emptyLi.textContent = "No matching products found";
      recDropdownList.appendChild(emptyLi);
      recDropdownList.classList.remove("hidden");
      return;
    }

    filtered.forEach((product) => {
      const li = document.createElement("li");
      li.className = "searchable-dropdown-item";
      li.setAttribute("role", "option");
      li.dataset.id = product.id;
      li.innerHTML = `
        <span>${product.name}</span>
        <span class="item-price">₹${product.price.toLocaleString("en-IN")}</span>
      `;

      li.addEventListener("click", () => {
        selectProduct(product);
      });

      recDropdownList.appendChild(li);
    });

    recDropdownList.classList.remove("hidden");
  }

  function selectProduct(product) {
    recSelectedId.value = product.id;
    recSearchInput.value = `${product.name} (₹${product.price.toLocaleString("en-IN")})`;
    recDropdownList.classList.add("hidden");
  }

  if (recSearchInput) {
    recSearchInput.addEventListener("focus", () => {
      renderDropdownOptions(recSearchInput.value);
    });

    recSearchInput.addEventListener("input", (e) => {
      renderDropdownOptions(e.target.value);
    });
  }

  document.addEventListener("click", (e) => {
    if (recSearchInput && recDropdownList) {
      if (!recSearchInput.contains(e.target) && !recDropdownList.contains(e.target)) {
        recDropdownList.classList.add("hidden");
      }
    }
  });

  function handleGetRecommendations() {
    const targetId = recSelectedId ? recSelectedId.value : "";
    if (!targetId) {
      alert("Please select a product from the list first.");
      return;
    }

    const recommendations = RecommendationEngine.getRecommendations(targetId, 3);
    UI.renderRecommendations("recommendations-results-container", recommendations);
  }

  if (getRecsBtn) {
    getRecsBtn.addEventListener("click", handleGetRecommendations);
  }

  const challenge5Pill = document.querySelector('[data-target="challenge-5"]');
  if (challenge5Pill) {
    challenge5Pill.addEventListener("click", () => {
      initSearchableRecDropdown();
    });
  }

  // --- Challenge 10: Warehouse Knapsack Controller ---
  const capacityInput = document.getElementById("warehouse-capacity-input");
  const optimizeCapacityBtn = document.getElementById("optimize-capacity-btn");

  function runWarehouseOptimization() {
    if (!capacityInput) return;
    const rawCapacity = capacityInput.value.trim();
    if (!rawCapacity) {
      alert("Please enter a warehouse capacity.");
      return;
    }

    const capacity = parseInt(rawCapacity, 10);
    if (isNaN(capacity) || capacity <= 0) {
      alert("Please enter a valid positive capacity in kg.");
      return;
    }

    const candidateProducts = WarehouseOptimizer.getAllCandidateProducts();
    const result = WarehouseOptimizer.solveKnapsack(candidateProducts, capacity);

    UI.renderKnapsackResults(
      "knapsack-summary-container",
      "knapsack-results-container",
      result
    );
  }

  if (optimizeCapacityBtn) {
    optimizeCapacityBtn.addEventListener("click", runWarehouseOptimization);
  }

  if (capacityInput) {
    capacityInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        runWarehouseOptimization();
      }
    });
  }
});