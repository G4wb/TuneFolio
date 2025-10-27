let currentAudio = null;
let currentProgress = null;
let progressTimer = null;

/* Scroll buttons */
function scrollGenre(btn, direction) {
  const box = btn.parentElement.querySelector(".genre-row");
  const scrollAmount = box.clientWidth * 0.8;
  box.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
}

/* Arrow visibility logic */
document.addEventListener("DOMContentLoaded", () => {
  const boxes = document.querySelectorAll(".genre-box");
  boxes.forEach((box) => {
    const row = box.querySelector(".genre-row");
    const leftBtn = box.querySelector(".genre-scroll-btn.left");
    const rightBtn = box.querySelector(".genre-scroll-btn.right");

    const updateArrows = () => {
      leftBtn.style.display = row.scrollLeft > 5 ? "block" : "none";
      rightBtn.style.display =
        row.scrollWidth - row.clientWidth - row.scrollLeft > 5 ? "block" : "none";
    };

    row.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);
    updateArrows();
  });
});