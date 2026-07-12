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
   TOP DEALS POPUP (legacy - only runs if popup markup exists)
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

/* ============================================
   USER AUTH + CART + CHECKOUT SYSTEM
   ============================================ */

const KFC_USERS_KEY = "kfc_users";
const KFC_SESSION_KEY = "kfc_current_user";
const KFC_CART_KEY = "kfc_cart";
const KFC_GUEST_KEY = "kfc_guest_name";

function getGuestName() {
  return sessionStorage.getItem(KFC_GUEST_KEY);
}

function setGuestName(name) {
  if (name) {
    sessionStorage.setItem(KFC_GUEST_KEY, name);
  } else {
    sessionStorage.removeItem(KFC_GUEST_KEY);
  }
}

/* ---------- storage helpers ---------- */
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(KFC_USERS_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(KFC_USERS_KEY, JSON.stringify(users));
}

function getCurrentUserEmail() {
  return localStorage.getItem(KFC_SESSION_KEY);
}

function setCurrentUserEmail(email) {
  if (email) {
    localStorage.setItem(KFC_SESSION_KEY, email);
  } else {
    localStorage.removeItem(KFC_SESSION_KEY);
  }
}

function getCurrentUser() {
  const email = getCurrentUserEmail();
  if (!email) return null;
  return getUsers().find(u => u.email === email) || null;
}

function updateCurrentUser(patch) {
  const email = getCurrentUserEmail();
  if (!email) return;
  const users = getUsers();
  const idx = users.findIndex(u => u.email === email);
  if (idx === -1) return;
  users[idx] = Object.assign({}, users[idx], patch);
  saveUsers(users);
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(KFC_CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(KFC_CART_KEY, JSON.stringify(cart));
  renderCartBadge();
}
/* ---------- toast ---------- */
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById("toastMsg");
  if (!toast) return;
  toast.innerText = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}   

/* ---------- price parsing helper ---------- */
function parsePriceText(text) {
  const digits = (text || "").replace(/[^0-9]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}
/* ============================================
   AUTH UI
   ============================================ */

function openAuthModal(defaultTab) {
  const overlay = document.getElementById("authOverlay");
  if (!overlay) return;
  overlay.classList.add("show");
  switchAuthTab(defaultTab || "login");
  document.getElementById("loginError").innerText = "";
  document.getElementById("registerError").innerText = "";
}

function closeAuthModal() {
  const overlay = document.getElementById("authOverlay");
  if (!overlay) return;
  overlay.classList.remove("show");
}

function switchAuthTab(tab) {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const guestForm = document.getElementById("guestForm");
  const tabLoginBtn = document.getElementById("tabLoginBtn");
  const tabRegisterBtn = document.getElementById("tabRegisterBtn");
  const tabGuestBtn = document.getElementById("tabGuestBtn");

  loginForm.style.display = "none";
  registerForm.style.display = "none";
  guestForm.style.display = "none";
  tabLoginBtn.classList.remove("active");
  tabRegisterBtn.classList.remove("active");
  tabGuestBtn.classList.remove("active");

  if (tab === "register") {
    registerForm.style.display = "flex";
    tabRegisterBtn.classList.add("active");
  } else if (tab === "guest") {
    guestForm.style.display = "flex";
    tabGuestBtn.classList.add("active");
  } else {
    loginForm.style.display = "flex";
    tabLoginBtn.classList.add("active");
  }
}

function refreshUserUI() {
  const user = getCurrentUser();
  const guestName = getGuestName();
  const displayName = user ? user.name : guestName;

  const chips = [
    { chip: document.getElementById("userChipTop"), avatar: document.getElementById("userAvatarTop"), name: document.getElementById("userNameTop") },
    { chip: document.getElementById("userChipSide"), avatar: document.getElementById("userAvatarSide"), name: document.getElementById("userNameSide") }
  ];

  document.querySelectorAll(".login-button").forEach(btn => {
    btn.style.display = displayName ? "none" : "inline-block";
  });

  chips.forEach(({ chip, avatar, name }) => {
    if (!chip) return;
    if (displayName) {
      chip.classList.add("show");
      const firstName = displayName.split(" ")[0];
      name.innerText = firstName + (user ? "" : " (Guest)");
      if (avatar) avatar.innerText = firstName.charAt(0).toUpperCase();
    } else {
      chip.classList.remove("show");
    }
  });
}

function logoutUser() {
  setCurrentUserEmail(null);
  setGuestName(null);
  refreshUserUI();
  showToast("You've been logged out");
  closeSideMenu();
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;
  const errorEl = document.getElementById("loginError");

  const user = getUsers().find(u => u.email === email);

  if (!user || user.password !== password) {
    errorEl.innerText = "Incorrect email or password.";
    return;
  }

  setCurrentUserEmail(email);
  errorEl.innerText = "";
  closeAuthModal();
  refreshUserUI();
  showToast(`Welcome back, ${user.name.split(" ")[0]}!`);

  if (window._resumeCheckoutAfterLogin) {
    window._resumeCheckoutAfterLogin = false;
    openCheckoutModal();
  }
}

function handleRegisterSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim().toLowerCase();
  const phone = document.getElementById("regPhone").value.trim();
  const password = document.getElementById("regPassword").value;
  const errorEl = document.getElementById("registerError");

  if (!name || !email || !phone || !password) {
    errorEl.innerText = "Please fill in all fields.";
    return;
  }
  if (password.length < 6) {
    errorEl.innerText = "Password must be at least 6 characters.";
    return;
  }

  const users = getUsers();
  if (users.some(u => u.email === email)) {
    errorEl.innerText = "An account with this email already exists.";
    return;
  }

  users.push({ name, email, phone, password, address: "", city: "" });
  saveUsers(users);
  setCurrentUserEmail(email);
  errorEl.innerText = "";
  closeAuthModal();
  refreshUserUI();
  showToast(`Account created — welcome, ${name.split(" ")[0]}!`);

  if (window._resumeCheckoutAfterLogin) {
    window._resumeCheckoutAfterLogin = false;
    openCheckoutModal();
  }
}

function handleGuestSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("guestName").value.trim();
  const errorEl = document.getElementById("guestError");

  if (!name) {
    errorEl.innerText = "Please enter your name.";
    return;
  }

  errorEl.innerText = "";
  setGuestName(name);
  closeAuthModal();
  refreshUserUI();
  showToast(`Welcome, ${name.split(" ")[0]}!`);

  if (window._resumeCheckoutAfterLogin) {
    window._resumeCheckoutAfterLogin = false;
    isGuestCheckout = true;
    openCheckoutModal();
  }
}

/* ============================================
   CART
   ============================================ */

function addToCart(item) {
  const cart = getCart();
  const existing = cart.find(c => c.name === item.name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: Date.now() + Math.random(), name: item.name, price: item.price, img: item.img, qty: 1 });
  }
  saveCart(cart);
  renderCartDrawer();
  showToast(`${item.name} added to your bucket`);
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(c => c.id !== id);
  saveCart(cart);
  renderCartDrawer();
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }
  saveCart(cart);
  renderCartDrawer();
}

function getCartSubtotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function renderCartBadge() {
  const badge = document.getElementById("cartCountBadge");
  if (!badge) return;
  const totalQty = getCart().reduce((sum, item) => sum + item.qty, 0);
  badge.innerText = totalQty;
  badge.classList.toggle("show", totalQty > 0);
}

function renderCartDrawer() {
  const list = document.getElementById("cartItemsList");
  const emptyMsg = document.getElementById("cartEmptyMsg");
  const subtotalEl = document.getElementById("cartSubtotal");
  const goToCheckoutBtn = document.getElementById("goToCheckoutBtn");
  if (!list) return;

  const cart = getCart();
  list.innerHTML = "";

  if (cart.length === 0) {
    emptyMsg.classList.add("show");
    goToCheckoutBtn.disabled = true;
  } else {
    emptyMsg.classList.remove("show");
    goToCheckoutBtn.disabled = false;
  }

  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${item.img || ''}" alt="${item.name}" onerror="this.style.visibility='hidden'">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <div class="unit-price">Rs ${item.price} each</div>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" data-action="dec" data-id="${item.id}">-</button>
        <span class="cart-item-qty">${item.qty}</span>
        <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
      </div>
      <div class="cart-item-line-price">Rs ${item.price * item.qty}</div>
      <button class="cart-item-remove" data-action="remove" data-id="${item.id}">&times;</button>
    `;
    list.appendChild(row);
  });

  subtotalEl.innerText = `Rs ${getCartSubtotal()}`;
}

document.addEventListener("click", function (e) {
  const target = e.target.closest("[data-action]");
  if (!target) return;
  const action = target.getAttribute("data-action");
  const id = parseFloat(target.getAttribute("data-id"));

  if (action === "inc") changeQty(id, 1);
  if (action === "dec") changeQty(id, -1);
  if (action === "remove") removeFromCart(id);
});

function openCartDrawer() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartOverlay").classList.add("show");
  renderCartDrawer();
}

function closeCartDrawer() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("show");
}

/* ============================================
   CHECKOUT FLOW
   ============================================ */

const DELIVERY_FEE = 150;
let checkoutStep = 1;
let selectedPayMethod = "cod";
let isGuestCheckout = false;

function goToCheckoutFromCart() {
  if (getCart().length === 0) return;

  const user = getCurrentUser();
  const guest = getGuestName();

  if (!user && !guest) {
    closeCartDrawer();
    window._resumeCheckoutAfterLogin = true;
    openAuthModal("login");
    return;
  }

  isGuestCheckout = !user;
  closeCartDrawer();
  openCheckoutModal();
}

function openCheckoutModal() {
  const overlay = document.getElementById("checkoutOverlay");
  if (!overlay) return;

  const user = getCurrentUser();
  const guestName = getGuestName();

  if (user) {
    document.getElementById("chkName").value = user.name || "";
    document.getElementById("chkPhone").value = user.phone || "";
    document.getElementById("chkAddress").value = user.address || "";
    document.getElementById("chkCity").value = user.city || "Karachi";
  } else {
    document.getElementById("chkName").value = guestName || "";
    document.getElementById("chkPhone").value = "";
    document.getElementById("chkAddress").value = "";
    document.getElementById("chkCity").value = "Karachi";
  }

  const phoneLabel = document.getElementById("chkPhone").previousElementSibling;
  if (phoneLabel) {
    phoneLabel.innerText = isGuestCheckout ? "Phone Number (optional)" : "Phone Number";
  }

  overlay.classList.add("show");
  goToCheckoutStep(1);
}

function closeCheckoutModal() {
  document.getElementById("checkoutOverlay").classList.remove("show");
}

function goToCheckoutStep(step) {
  checkoutStep = step;

  const panels = {
    1: document.getElementById("panelDelivery"),
    2: document.getElementById("panelPayment"),
    3: document.getElementById("panelReview"),
    4: document.getElementById("panelDone")
  };

  Object.keys(panels).forEach(key => {
    panels[key].style.display = (parseInt(key, 10) === step) ? "block" : "none";
  });

  for (let i = 1; i <= 4; i++) {
    const indicator = document.getElementById("stepIndicator" + i);
    indicator.classList.remove("active", "done");
    if (i < step) indicator.classList.add("done");
    if (i === step) indicator.classList.add("active");
  }

  if (step === 3) renderReviewStep();
}

function validateDeliveryStep() {
  const name = document.getElementById("chkName").value.trim();
  const phone = document.getElementById("chkPhone").value.trim();
  const address = document.getElementById("chkAddress").value.trim();
  const city = document.getElementById("chkCity").value.trim();
  const errorEl = document.getElementById("deliveryError");

  if (!name || !address || !city) {
    errorEl.innerText = "Please fill in all delivery details.";
    return false;
  }

  if (!isGuestCheckout) {
    if (!phone) {
      errorEl.innerText = "Please fill in all delivery details.";
      return false;
    }
    if (!/^[0-9+\-\s]{7,15}$/.test(phone)) {
      errorEl.innerText = "Please enter a valid phone number.";
      return false;
    }
  } else if (phone && !/^[0-9+\-\s]{7,15}$/.test(phone)) {
    errorEl.innerText = "Please enter a valid phone number.";
    return false;
  }

  errorEl.innerText = "";
  if (!isGuestCheckout) {
    updateCurrentUser({ name, phone, address, city });
  }
  return true;
}

function validatePaymentStep() {
  const errorEl = document.getElementById("paymentError");
  selectedPayMethod = document.querySelector('input[name="payMethod"]:checked').value;

  if (selectedPayMethod === "card") {
    const cardNumber = document.getElementById("chkCardNumber").value.replace(/\s/g, "");
    const expiry = document.getElementById("chkCardExpiry").value.trim();
    const cvv = document.getElementById("chkCardCvv").value.trim();

    if (!/^[0-9]{16}$/.test(cardNumber)) {
      errorEl.innerText = "Enter a valid 16-digit card number.";
      return false;
    }
    if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(expiry)) {
      errorEl.innerText = "Enter expiry in MM/YY format.";
      return false;
    }
    if (!/^[0-9]{3}$/.test(cvv)) {
      errorEl.innerText = "Enter a valid 3-digit CVV.";
      return false;
    }
  }

  errorEl.innerText = "";
  return true;
}

function renderReviewStep() {
  const reviewItems = document.getElementById("reviewItems");
  const cart = getCart();
  reviewItems.innerHTML = "";

  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "review-item-row";
    row.innerHTML = `
      <span><span class="ri-name">${item.name}</span><span class="ri-qty">x${item.qty}</span></span>
      <span>Rs ${item.price * item.qty}</span>
    `;
    reviewItems.appendChild(row);
  });

  const subtotal = getCartSubtotal();
  const total = subtotal + DELIVERY_FEE;

  document.getElementById("reviewSubtotal").innerText = `Rs ${subtotal}`;
  document.getElementById("reviewDelivery").innerText = `Rs ${DELIVERY_FEE}`;
  document.getElementById("reviewTotal").innerText = `Rs ${total}`;

  const name = document.getElementById("chkName").value.trim();
  const phone = document.getElementById("chkPhone").value.trim();
  const address = document.getElementById("chkAddress").value.trim();
  const city = document.getElementById("chkCity").value.trim();
  const payLabel = selectedPayMethod === "card" ? "Credit / Debit Card" : "Cash on Delivery";
  const phoneLine = phone ? ` - ${phone}` : "";

  document.getElementById("reviewAddress").innerHTML = `
    <strong>${name}</strong>${phoneLine}<br>
    ${address}, ${city}<br>
    Payment: ${payLabel}
  `;
}

function placeOrder() {
  const user = getCurrentUser();
  const cart = getCart();
  if (cart.length === 0) return;

  const orderNumber = "KFC" + Math.floor(100000 + Math.random() * 900000);
  const order = {
    orderNumber,
    date: new Date().toISOString(),
    items: cart,
    subtotal: getCartSubtotal(),
    deliveryFee: DELIVERY_FEE,
    total: getCartSubtotal() + DELIVERY_FEE,
    paymentMethod: selectedPayMethod,
    guest: !user,
    address: {
      name: document.getElementById("chkName").value.trim(),
      phone: document.getElementById("chkPhone").value.trim(),
      address: document.getElementById("chkAddress").value.trim(),
      city: document.getElementById("chkCity").value.trim()
    }
  };

  const orderKey = user ? ("kfc_orders_" + user.email) : "kfc_orders_guest";
  const orders = JSON.parse(localStorage.getItem(orderKey) || "[]");
  orders.push(order);
  localStorage.setItem(orderKey, JSON.stringify(orders));

  saveCart([]);
  renderCartBadge();
  renderCartDrawer();
  isGuestCheckout = false;

  document.getElementById("orderNumberDisplay").innerText = orderNumber;
  goToCheckoutStep(4);
}
/* ============================================
   WIRE UP EVENTS (missing bindings)
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  // init
  refreshUserUI();
  renderCartBadge();

  // --- Auth modal open/close ---
  document.querySelectorAll(".login-button").forEach(btn => {
    btn.addEventListener("click", () => openAuthModal("login"));
  });
  document.getElementById("authClose").addEventListener("click", closeAuthModal);
  document.getElementById("authOverlay").addEventListener("click", (e) => {
    if (e.target.id === "authOverlay") closeAuthModal();
  });

  // --- Auth tabs ---
  document.getElementById("tabLoginBtn").addEventListener("click", () => switchAuthTab("login"));
  document.getElementById("tabRegisterBtn").addEventListener("click", () => switchAuthTab("register"));
  document.getElementById("tabGuestBtn").addEventListener("click", () => switchAuthTab("guest"));

  // --- Auth form submits ---
  document.getElementById("loginForm").addEventListener("submit", handleLoginSubmit);
  document.getElementById("registerForm").addEventListener("submit", handleRegisterSubmit);
  document.getElementById("guestForm").addEventListener("submit", handleGuestSubmit);

  // --- Cart drawer ---
  document.getElementById("cartButton").addEventListener("click", openCartDrawer);
  document.getElementById("cartDrawerClose").addEventListener("click", closeCartDrawer);
  document.getElementById("cartOverlay").addEventListener("click", closeCartDrawer);
  document.getElementById("goToCheckoutBtn").addEventListener("click", goToCheckoutFromCart);

  // --- Checkout modal ---
  document.getElementById("checkoutClose").addEventListener("click", closeCheckoutModal);
  document.getElementById("checkoutOverlay").addEventListener("click", (e) => {
    if (e.target.id === "checkoutOverlay") closeCheckoutModal();
  });

  document.getElementById("toPaymentBtn").addEventListener("click", () => {
    if (validateDeliveryStep()) goToCheckoutStep(2);
  });
  document.getElementById("toReviewBtn").addEventListener("click", () => {
    if (validatePaymentStep()) goToCheckoutStep(3);
  });
  document.getElementById("placeOrderBtn").addEventListener("click", placeOrder);
  document.getElementById("closeCheckoutDone").addEventListener("click", closeCheckoutModal);

  document.querySelectorAll(".checkout-back").forEach(btn => {
    btn.addEventListener("click", () => {
      goToCheckoutStep(parseInt(btn.getAttribute("data-back"), 10));
    });
  });

  // --- Payment method toggle (show/hide card fields) ---
  document.querySelectorAll('input[name="payMethod"]').forEach(radio => {
    radio.addEventListener("change", function () {
      document.getElementById("cardFields").style.display =
        this.value === "card" ? "block" : "none";
    });
  });

  // --- Add to cart: Best Sellers ---
  document.querySelectorAll(".bestseller-card").forEach(card => {
  card.addEventListener("click", function (e) {
    // if the click came from the add button, do nothing here —
    // that button already handles itself and stops propagation
    if (e.target.closest(".bs-add-btn")) return;

    const name = card.querySelector("h3").innerText;
    showToast(`${name} tapped`);
    card.classList.add("card-clicked");
    setTimeout(() => card.classList.remove("card-clicked"), 300);
  });
});

  // --- Add to cart: Top Deals ---
  document.querySelectorAll(".deal-card").forEach(card => {
    const btn = card.querySelector(".add-btn");
    btn.addEventListener("click", () => {
      addToCart({
        name: card.querySelector("h3").innerText,
        price: parsePriceText(card.querySelector("h4").innerText),
        img: card.querySelector("img").src
      });
    });
  });
});