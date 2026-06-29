let exploreIndex = 0;
const exploreItemWidth = 340;
const exploreVisibleCount = 5;

function slideMenu(direction) {
  const track = document.getElementById("exploreTrack");
  if (!track) return;

  const totalItems = track.children.length;
  const maxIndex = Math.max(0, totalItems - exploreVisibleCount);

  exploreIndex += direction;

  if (exploreIndex < 0) exploreIndex = 0;
  if (exploreIndex > maxIndex) exploreIndex = maxIndex;

  track.style.transform = `translateX(-${exploreIndex * exploreItemWidth}px)`;
}

function toggleSideMenu() {
  const sideMenu = document.getElementById("sideMenu");
  const overlay = document.getElementById("overlay");

  sideMenu.classList.toggle("open");
  overlay.classList.toggle("show");
}

function closeSideMenu() {
  const sideMenu = document.getElementById("sideMenu");
  const overlay = document.getElementById("overlay");

  sideMenu.classList.remove("open");
  overlay.classList.remove("show");
}

/* HERO SLIDER */

let heroIndex = 0;

function showHeroImage() {
  const slides = document.getElementById("slides");
  if (!slides) return;

  const totalSlides = slides.children.length;
  if (heroIndex < 0) heroIndex = totalSlides - 1;
  if (heroIndex >= totalSlides) heroIndex = 0;

  slides.style.transform = `translateX(-${heroIndex * 100}vw)`;
}

function nextImage() {
  heroIndex++;
  showHeroImage();
}

function previousImage() {
  heroIndex--;
  showHeroImage();
}

/* BEST SELLER CUSTOM SCROLLBAR */

window.addEventListener("load", function () {
  const bestsellerTrack = document.getElementById("bestsellerTrack");
  const scrollThumb = document.getElementById("scrollThumb");
  const bestsellerScrollbar = document.getElementById("bestsellerScrollbar");

  if (!bestsellerTrack || !scrollThumb || !bestsellerScrollbar) return;

  function updateScrollbarThumb() {
    const visibleWidth = bestsellerTrack.clientWidth;
    const totalWidth = bestsellerTrack.scrollWidth;
    const maxScrollLeft = totalWidth - visibleWidth;

    if (maxScrollLeft <= 0) {
      scrollThumb.style.width = "100%";
      scrollThumb.style.left = "0px";
      return;
    }

    const thumbWidth = (visibleWidth / totalWidth) * bestsellerScrollbar.clientWidth;
    const maxThumbLeft = bestsellerScrollbar.clientWidth - thumbWidth;
    const thumbLeft = (bestsellerTrack.scrollLeft / maxScrollLeft) * maxThumbLeft;

    scrollThumb.style.width = thumbWidth + "px";
    scrollThumb.style.left = thumbLeft + "px";
  }

  bestsellerTrack.addEventListener("scroll", updateScrollbarThumb);
  window.addEventListener("resize", updateScrollbarThumb);

  let isDragging = false;

  scrollThumb.addEventListener("mousedown", function (e) {
    isDragging = true;
    document.body.style.userSelect = "none";
    e.preventDefault();
  });

  document.addEventListener("mouseup", function () {
    isDragging = false;
    document.body.style.userSelect = "auto";
  });

  document.addEventListener("mousemove", function (e) {
    if (!isDragging) return;

    const barRect = bestsellerScrollbar.getBoundingClientRect();
    const thumbWidth = scrollThumb.offsetWidth;
    const maxThumbLeft = bestsellerScrollbar.clientWidth - thumbWidth;

    let thumbLeft = e.clientX - barRect.left - thumbWidth / 2;

    if (thumbLeft < 0) thumbLeft = 0;
    if (thumbLeft > maxThumbLeft) thumbLeft = maxThumbLeft;

    const scrollPercent = thumbLeft / maxThumbLeft;
    const maxScrollLeft = bestsellerTrack.scrollWidth - bestsellerTrack.clientWidth;

    bestsellerTrack.scrollLeft = scrollPercent * maxScrollLeft;
  });

  bestsellerScrollbar.addEventListener("click", function (e) {
    if (e.target === scrollThumb) return;

    const barRect = bestsellerScrollbar.getBoundingClientRect();
    const clickX = e.clientX - barRect.left;
    const scrollPercent = clickX / bestsellerScrollbar.clientWidth;
    const maxScrollLeft = bestsellerTrack.scrollWidth - bestsellerTrack.clientWidth;

    bestsellerTrack.scrollLeft = scrollPercent * maxScrollLeft;
  });

  updateScrollbarThumb();
});
/* TOP DEALS POPUP */

window.addEventListener("load", function () {
  const dealImages = document.querySelectorAll(".deal-img");

  const popupOverlay = document.getElementById("popupOverlay");
  const popupClose = document.getElementById("popupClose");
  const popupImg = document.getElementById("popupImg");
  const popupTitle = document.getElementById("popupTitle");
  const popupText = document.getElementById("popupText");
  const popupPrice = document.getElementById("popupPrice");

  if (!popupOverlay || !popupClose || !popupImg || !popupTitle || !popupText || !popupPrice) {
    return;
  }

  dealImages.forEach(function (image) {
    image.addEventListener("click", function (event) {
      event.stopPropagation();

      const card = image.closest(".deal-card");

      popupImg.src = image.src;
      popupTitle.innerText = card.querySelector("h3").innerText;
      popupText.innerText = card.querySelector("p").innerText;
      popupPrice.innerText = card.querySelector("h4").innerText;

      popupOverlay.classList.add("show");
    });
  });

  popupClose.addEventListener("click", function () {
    popupOverlay.classList.remove("show");
  });

  popupOverlay.addEventListener("click", function (event) {
    if (event.target === popupOverlay) {
      popupOverlay.classList.remove("show");
    }
  });
});
// Social icon click animation
document.querySelectorAll('.footer-social a').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    this.style.transform = 'scale(0.9)';
    setTimeout(() => { this.style.transform = 'scale(1)'; }, 150);
  });
});

// App badge click animation
document.querySelectorAll('.app-badge-img').forEach(badge => {
  badge.addEventListener('click', function(e) {
    e.preventDefault();
    this.style.opacity = '0.5';
    setTimeout(() => { this.style.opacity = '1'; }, 400);
  });
});