// js/features/recommendations.js

const RecommendationEngine = {
  // Mock dataset simulating multiple users' viewing histories as described in the README
  userHistorySessions: [
    { userId: "User A", views: ["p-101", "p-301", "p-302", "p-303"] }, // MacBook, MX Master 3S, Keychron K2, Sony WH-1000XM5
    { userId: "User B", views: ["p-101", "p-301", "p-302", "p-104"] }, // MacBook, MX Master 3S, Keychron K2, ThinkPad
    { userId: "User C", views: ["p-101", "p-301", "p-304"] },          // MacBook, MX Master 3S, Anker 65W
    { userId: "User D", views: ["p-102", "p-301", "p-302"] },          // Dell, MX Master 3S, Keychron K2
    { userId: "User E", views: ["p-401", "p-402", "p-501"] },          // JS Definitive, YDKJS, Intro to Algo
    { userId: "User F", views: ["p-401", "p-403", "p-502"] },          // JS Definitive, Clean Code, Cracking CI
    { userId: "User G", views: ["p-601", "p-602", "p-603", "p-105"] }, // Gaming accessories + ROG Laptop
    { userId: "User H", views: ["p-101", "p-303", "p-301"] }           // MacBook, Sony Headphones, MX Master 3S
  ],

  // Cache lookup map: productId -> Product object
  productLookup: null,

  initLookup() {
    if (!this.productLookup) {
      const products = typeof allProducts !== "undefined"
        ? allProducts
        : storeData.categories.flatMap(c => c.subcategories.flatMap(s => s.products));
      this.productLookup = new Map(products.map(p => [p.id, p]));
    }
  },

  getAllProductsList() {
    this.initLookup();
    return Array.from(this.productLookup.values());
  },

  // Collaborative filtering recommendation algorithm
  getRecommendations(targetProductId, limit = 3) {
    this.initLookup();

    // 1. Find all users who also viewed targetProductId
    const relevantSessions = this.userHistorySessions.filter(session =>
      session.views.includes(targetProductId)
    );

    // 2. Frequency map for co-occurring products
    const frequencyMap = new Map();

    for (const session of relevantSessions) {
      for (const prodId of session.views) {
        // Exclude the currently viewed product
        if (prodId === targetProductId) continue;

        const count = frequencyMap.get(prodId) || 0;
        frequencyMap.set(prodId, count + 1);
      }
    }

    // 3. Sort products by co-occurrence frequency descending
    const sortedRecommendations = Array.from(frequencyMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([prodId, count]) => {
        const item = this.productLookup.get(prodId);
        return {
          ...item,
          coOccurrenceCount: count,
          targetProductName: this.productLookup.get(targetProductId)?.name || "selected product"
        };
      })
      .filter(item => Boolean(item.id));

    return sortedRecommendations;
  }
};