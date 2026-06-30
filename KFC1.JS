/* ============================================
   EXPLORE MENU SLIDER
   ============================================ */

let exploreIndex = 0;

function getExploreItemStep() {
  const track = document.getElementById("exploreTrack");
  if (!track || !track.firstElementChild) return 340; // fallback

  const item = track.firstElementChild;
  const itemWidth = item.getBoundingClientRect().width;
  const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 0);

  return itemWidth + gap;
}

function getExploreMaxIndex() {
  const track = document.getElementById("exploreTrack");
  const container = document.querySelector(".explore-track-container");
  if (!track || !container) return 0;

  const step = getExploreItemStep();
  const totalItems = track.children.length;
  const visibleCount = Math.max(1, Math.floor(container.clientWidth / step));

  return Math.max(0, totalItems - visibleCount);
}

function slideMenu(direction) {
  const track = document.getElementById("exploreTrack");
  if (!track) return;

  const step = getExploreItemStep();
  const maxIndex = getExploreMaxIndex();

  exploreIndex += direction;

  if (exploreIndex < 0) exploreIndex = 0;
  if (exploreIndex > maxIndex) exploreIndex = maxIndex;

  track.style.transform = `translateX(-${exploreIndex * step}px)`;
}

window.addEventListener("resize", function () {
  const maxIndex = getExploreMaxIndex();
  if (exploreIndex > maxIndex) {
    exploreIndex = maxIndex;
  }
  const track = document.getElementById("exploreTrack");
  if (track) {
    const step = getExploreItemStep();
    track.style.transform = `translateX(-${exploreIndex * step}px)`;
  }
});

/* ============================================
   SIDE MENU
   ============================================ */

function toggleSideMenu() {
  const sideMenu = document.getElementById("sideMenu");
  const overlay = document.getElementById("overlay");
  if (!sideMenu || !overlay) return;

  sideMenu.classList.toggle("open");
  overlay.classList.toggle("show");
}

function closeSideMenu() {
  const sideMenu = document.getElementById("sideMenu");
  const overlay = document.getElementById("overlay");
  if (!sideMenu || !overlay) return;

  sideMenu.classList.remove("open");
  overlay.classList.remove("show");
}

/* ============================================
   HERO SLIDER
   ============================================ */

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

/* ============================================
   BEST SELLER CUSTOM SCROLLBAR
   ============================================ */

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

  function getClientX(e) {
    return e.touches ? e.touches[0].clientX : e.clientX;
  }

  function startDrag(e) {
    isDragging = true;
    document.body.style.userSelect = "none";
    if (e.cancelable) e.preventDefault();
  }

  function stopDrag() {
    isDragging = false;
    document.body.style.userSelect = "auto";
  }

  function onDrag(e) {
    if (!isDragging) return;

    const barRect = bestsellerScrollbar.getBoundingClientRect();
    const thumbWidth = scrollThumb.offsetWidth;
    const maxThumbLeft = bestsellerScrollbar.clientWidth - thumbWidth;

    if (maxThumbLeft <= 0) return;

    let thumbLeft = getClientX(e) - barRect.left - thumbWidth / 2;

    if (thumbLeft < 0) thumbLeft = 0;
    if (thumbLeft > maxThumbLeft) thumbLeft = maxThumbLeft;

    const scrollPercent = thumbLeft / maxThumbLeft;
    const maxScrollLeft = bestsellerTrack.scrollWidth - bestsellerTrack.clientWidth;

    bestsellerTrack.scrollLeft = scrollPercent * maxScrollLeft;
  }

  scrollThumb.addEventListener("mousedown", startDrag);
  scrollThumb.addEventListener("touchstart", startDrag, { passive: false });

  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchend", stopDrag);

  document.addEventListener("mousemove", onDrag);
  document.addEventListener("touchmove", onDrag, { passive: false });

  bestsellerScrollbar.addEventListener("click", function (e) {
    if (e.target === scrollThumb) return;

    const barRect = bestsellerScrollbar.getBoundingClientRect();
    const thumbWidth = scrollThumb.offsetWidth;
    const maxThumbLeft = bestsellerScrollbar.clientWidth - thumbWidth;

    if (maxThumbLeft <= 0) return;

    let thumbLeft = e.clientX - barRect.left - thumbWidth / 2;
    if (thumbLeft < 0) thumbLeft = 0;
    if (thumbLeft > maxThumbLeft) thumbLeft = maxThumbLeft;

    const scrollPercent = thumbLeft / maxThumbLeft;
    const maxScrollLeft = bestsellerTrack.scrollWidth - bestsellerTrack.clientWidth;

    bestsellerTrack.scrollLeft = scrollPercent * maxScrollLeft;
  });

  updateScrollbarThumb();
});

/* ============================================
   TOP DEALS POPUP
   ============================================ */

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

/* ============================================
   FOOTER MICRO-ANIMATIONS
   ============================================ */

document.querySelectorAll('.footer-social a').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    this.style.transform = 'scale(0.9)';
    setTimeout(() => { this.style.transform = 'scale(1)'; }, 150);
  });
});

document.querySelectorAll('.footer-badges img').forEach(badge => {
  badge.addEventListener('click', function (e) {
    e.preventDefault();
    this.style.opacity = '0.5';
    setTimeout(() => { this.style.opacity = '1'; }, 400);
  });
});