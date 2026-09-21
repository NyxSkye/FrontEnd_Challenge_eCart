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

    // Call the feature method
    const closestItems = PriceFinder.getClosestProducts(targetPrice, 3);

    // Render results to the grid container
    UI.renderProducts("price-results-container", closestItems);
  }

  if (searchPriceBtn && targetPriceInput) {
    searchPriceBtn.addEventListener("click", executePriceSearch);

    // Allow pressing "Enter" inside the input
    targetPriceInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        executePriceSearch();
      }
    });
  }
});