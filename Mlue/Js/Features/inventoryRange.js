// Js/Features/inventoryRange.js

const InventoryRange = {
  sortedProducts: [],
  prefixValue: [], // prefixValue[i] = sum of (price * stock) for first i items
  prefixCount: [], // prefixCount[i] = count of first i items
  isInitialized: false,

  init() {
    if (this.isInitialized) return;

    // Retrieve and flatten all products safely
    const rawProducts = typeof allProducts !== "undefined"
      ? allProducts
      : storeData.categories.flatMap(c => c.subcategories.flatMap(s => s.products));

    // Calculate each item's total inventory value and sort ascending by price
    this.sortedProducts = rawProducts
      .map(p => ({
        ...p,
        inventoryValue: (p.price || 0) * (p.stock || 0)
      }))
      .sort((a, b) => a.price - b.price);

    const n = this.sortedProducts.length;
    this.prefixValue = new Array(n + 1).fill(0);
    this.prefixCount = new Array(n + 1).fill(0);

    for (let i = 0; i < n; i++) {
      this.prefixValue[i + 1] = this.prefixValue[i] + this.sortedProducts[i].inventoryValue;
      this.prefixCount[i + 1] = this.prefixCount[i] + 1;
    }

    this.isInitialized = true;
  },

  // Binary search for first index with price >= minPrice
  findLowerBound(minPrice) {
    let low = 0;
    let high = this.sortedProducts.length - 1;
    let ans = this.sortedProducts.length;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (this.sortedProducts[mid].price >= minPrice) {
        ans = mid;
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }
    return ans;
  },

  // Binary search for last index with price <= maxPrice
  findUpperBound(maxPrice) {
    let low = 0;
    let high = this.sortedProducts.length - 1;
    let ans = -1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (this.sortedProducts[mid].price <= maxPrice) {
        ans = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return ans;
  },

  // Query range in O(log N) search + O(1) prefix aggregation
  queryRange(minPrice, maxPrice) {
    this.init();

    if (minPrice > maxPrice) {
      return {
        count: 0,
        totalInventoryValue: 0,
        products: [],
        minPrice,
        maxPrice
      };
    }

    const leftIdx = this.findLowerBound(minPrice);
    const rightIdx = this.findUpperBound(maxPrice);

    if (leftIdx > rightIdx || leftIdx >= this.sortedProducts.length || rightIdx < 0) {
      return {
        count: 0,
        totalInventoryValue: 0,
        products: [],
        minPrice,
        maxPrice
      };
    }

    // O(1) calculation using prefix sums
    const totalInventoryValue = this.prefixValue[rightIdx + 1] - this.prefixValue[leftIdx];
    const count = this.prefixCount[rightIdx + 1] - this.prefixCount[leftIdx];
    const products = this.sortedProducts.slice(leftIdx, rightIdx + 1);

    return {
      count,
      totalInventoryValue,
      products,
      minPrice,
      maxPrice
    };
  },

  getMinMaxPriceBounds() {
    this.init();
    if (this.sortedProducts.length === 0) return { min: 0, max: 0 };
    return {
      min: this.sortedProducts[0].price,
      max: this.sortedProducts[this.sortedProducts.length - 1].price
    };
  }
};