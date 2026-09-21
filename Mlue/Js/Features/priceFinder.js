// js/features/priceFinder.js

// 1. Flatten all products from nested storeData without altering data.js
const allProducts = storeData.categories.flatMap(category =>
  category.subcategories.flatMap(subcategory => subcategory.products)
);

const PriceFinder = {
  // Pre-sort products ascending by price: O(N log N)
  sortedProducts: [...allProducts].sort((a, b) => a.price - b.price),

  // Binary search to find the closest price index: O(log N)
  findClosestIndex(target) {
    let low = 0;
    let high = this.sortedProducts.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (this.sortedProducts[mid].price === target) return mid;
      if (this.sortedProducts[mid].price < target) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    // Boundary edge cases
    if (low >= this.sortedProducts.length) return this.sortedProducts.length - 1;
    if (high < 0) return 0;

    const diffLow = Math.abs(this.sortedProducts[low].price - target);
    const diffHigh = Math.abs(this.sortedProducts[high].price - target);
    return diffLow < diffHigh ? low : high;
  },

  // Collect the closest k products around the target price
  getClosestProducts(targetPrice, count = 3) {
    const centerIdx = this.findClosestIndex(targetPrice);
    let left = centerIdx;
    let right = centerIdx + 1;
    const results = [];

    while (results.length < count && (left >= 0 || right < this.sortedProducts.length)) {
      if (left >= 0 && right < this.sortedProducts.length) {
        const leftDiff = Math.abs(this.sortedProducts[left].price - targetPrice);
        const rightDiff = Math.abs(this.sortedProducts[right].price - targetPrice);

        if (leftDiff <= rightDiff) {
          results.push(this.sortedProducts[left--]);
        } else {
          results.push(this.sortedProducts[right++]);
        }
      } else if (left >= 0) {
        results.push(this.sortedProducts[left--]);
      } else {
        results.push(this.sortedProducts[right++]);
      }
    }
    return results;
  },

  // Range query implementation for the follow-up requirement
  getProductsInRange(minPrice, maxPrice) {
    // Binary search for first index >= minPrice
    let low = 0;
    let high = this.sortedProducts.length - 1;
    let startIdx = this.sortedProducts.length;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (this.sortedProducts[mid].price >= minPrice) {
        startIdx = mid;
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    const inRange = [];
    for (let i = startIdx; i < this.sortedProducts.length; i++) {
      if (this.sortedProducts[i].price <= maxPrice) {
        inRange.push(this.sortedProducts[i]);
      } else {
        break; // Sorted order allows early exit
      }
    }
    return inRange;
  }
};