 // js/features/popularProducts.js

// Min-Heap implementation tailored for Top-K objects
class MinHeap {
  constructor(compareFn) {
    this.heap = [];
    this.compare = compareFn;
  }

  size() {
    return this.heap.length;
  }

  peek() {
    return this.heap[0] || null;
  }

  push(val) {
    this.heap.push(val);
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    const top = this.heap[0];
    const bottom = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = bottom;
      this._bubbleDown(0);
    }
    return top;
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.compare(this.heap[index], this.heap[parentIndex]) < 0) {
        [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  _bubbleDown(index) {
    const length = this.heap.length;
    while (true) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (left < length && this.compare(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }
      if (right < length && this.compare(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }

      if (smallest !== index) {
        [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
        index = smallest;
      } else {
        break;
      }
    }
  }
}

const PopularProducts = {
  // Helper to fetch products without creating conflicting global variables
  getProducts() {
    // Reuses allProducts from priceFinder.js if present, or extracts directly from storeData
    if (typeof allProducts !== "undefined") {
      return allProducts;
    }
    return storeData.categories.flatMap(category =>
      category.subcategories.flatMap(subcategory => subcategory.products)
    );
  },

  // Calculate product score: popularity = rating * reviews
  getScore(product) {
    return (product.rating || 0) * (product.reviews || 0);
  },

  // Extract Top K products in O(N log K) time
  getTopK(k = 3) {
    const products = this.getProducts();
    const minHeap = new MinHeap((a, b) => this.getScore(a) - this.getScore(b));

    for (const product of products) {
      const score = this.getScore(product);

      if (minHeap.size() < k) {
        minHeap.push(product);
      } else if (score > this.getScore(minHeap.peek())) {
        minHeap.pop();
        minHeap.push(product);
      }
    }

    // Drain the heap (ascending order) and reverse to descending order
    const result = [];
    while (minHeap.size() > 0) {
      result.push(minHeap.pop());
    }

    return result.reverse();
  }
};