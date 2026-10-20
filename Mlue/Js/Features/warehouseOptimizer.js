// js/features/warehouseOptimizer.js

const WarehouseOptimizer = {
  // Deterministic weight assignment helper (since storeData doesn't carry explicit weights)
  // Maps categories/subcategories to realistic weights in kg (integers for standard knapsack)
  getProductWeight(product) {
    if (product.subcategory === "Laptops") return 3;
    if (product.subcategory === "Mobiles") return 1;
    if (product.subcategory === "Accessories") {
      if (product.name.toLowerCase().includes("keyboard")) return 1;
      if (product.name.toLowerCase().includes("headphone")) return 2;
      return 1;
    }
    if (product.category === "Books") return 1;
    if (product.category === "Gaming") return 2;
    return 1;
  },

  getAllCandidateProducts() {
    const products = typeof allProducts !== "undefined"
      ? allProducts
      : storeData.categories.flatMap(c => c.subcategories.flatMap(s => s.products));

    return products.map(p => ({
      ...p,
      weight: this.getProductWeight(p),
      value: p.price
    }));
  },

  // 0/1 Knapsack optimization algorithm
  solveKnapsack(products, capacity) {
    const N = products.length;
    const W = capacity;

    // dp[i][w] stores maximum value with first i items and capacity w
    const dp = Array.from({ length: N + 1 }, () => new Array(W + 1).fill(0));

    // Fill DP table
    for (let i = 1; i <= N; i++) {
      const wt = products[i - 1].weight;
      const val = products[i - 1].value;

      for (let w = 0; w <= W; w++) {
        if (wt <= w) {
          dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - wt] + val);
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }
    }

    // Backtrack to find which products were included
    const selectedProducts = [];
    let curW = W;

    for (let i = N; i > 0 && curW > 0; i--) {
      // If value is different from cell directly above, item (i - 1) was included
      if (dp[i][curW] !== dp[i - 1][curW]) {
        const item = products[i - 1];
        selectedProducts.push(item);
        curW -= item.weight;
      }
    }

    selectedProducts.sort((a, b) => b.weight - a.weight);

    const totalWeight = selectedProducts.reduce((sum, item) => sum + item.weight, 0);
    const totalValue = dp[N][W];
    const remainingCapacity = W - totalWeight;

    return {
      selectedProducts,
      totalWeight,
      totalValue,
      remainingCapacity,
      capacity
    };
  }
};