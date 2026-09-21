// js/app.js

document.addEventListener("DOMContentLoaded", () => {
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

      // 1. Update pill active states & accessibility attributes
      pills.forEach((p) => {
        p.classList.remove("active");
        p.setAttribute("aria-selected", "false");
      });
      pill.classList.add("active");
      pill.setAttribute("aria-selected", "true");

      // Update progress indicator (e.g., "03 / 10")
      if (progressPill) {
        progressPill.textContent = `${pillNumber} / 10`;
      }

      // 2. Hide all existing challenge panels first
      const allPanels = document.querySelectorAll(".challenge-panel");
      allPanels.forEach((panel) => panel.classList.add("hidden"));

      // 3. Check if the target panel exists in DOM
      const targetPanel = document.getElementById(targetId);

      if (targetPanel) {
        // Panel exists -> show it safely
        targetPanel.classList.remove("hidden");
      } else {
        // Panel missing -> display the fallback error/under-construction panel
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
});