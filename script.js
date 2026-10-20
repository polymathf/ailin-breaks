"use strict";

const STORE = {
  name: "Кондитерлік үйі",
  phone: "77789807983",
  whatsapp: "77789807983",
  currency: "₸",
  workingHours: "10:00–23:00"
};

const CATEGORIES = [
  { id: "cakes", title: "Торттар" },
  { id: "pastries", title: "Пирожныйлар" },
  { id: "pies", title: "Пирогтар" },
  { id: "cupcakes", title: "Капкейктер" },
  { id: "eskimo", title: "Эскимо" },
  { id: "large-cakes", title: "Үлкен торттар" },
  { id: "traifl", title: "Трайфл" },
  { id: "samsa", title: "Самса, Чебурек" },
  { id: "tea", title: "Чайный набор" },
  { id: "buns", title: "Булочки" },
  { id: "chicken", title: "Голень и крылья" },
];


const PRODUCTS = [
  { id: "cake-red-velvet", name: "Красный бархат", price: 5000, category: "cakes", image: "2.jpeg" },
  { id: "cake-pistachio", name: "Фисташковый торт", price: 5000, category: "cakes", image: "3.jpeg" },
  { id: "cake-cream", name: "Кілегей", price: 5000, category: "cakes", image: "cake-01.jpg" },
  { id: "cake-chocolate", name: "Шоколадный торт", price: 5000, category: "cakes", image: "4.jpeg" },
  { id: "cake-snickers", name: "Сникерс", price: 5000, category: "cakes", image: "1.jpeg" },

  { id: "pastry-whoopie-pie", name: "Ассорти «Красный бархат, Фисташковый, Ванильный»", price: 5000, category: "pastries", image: "12.jpeg" },

  { id: "pie-pistachio", name: "Фисташковый пирог", price: 4000, category: "pies", image: "6.jpeg" },
  { id: "pie-snickers", name: "Сникерс", price: 4000, category: "pies", image: "7.jpeg" },
  { id: "pie-cottage-cheese", name: "Творожный пирог", price: 4000, category: "pies", image: "8.jpeg" },
  { id: "pie-banana", name: "Банановый пирог", price: 4000, category: "pies", image: "9.jpeg" },
  { id: "pie-yogurt", name: "Йогуртовый пирог", price: 4000, category: "pies", image: "10.jpeg" },
  { id: "pie-assorti", name: "Ассорти пирог", price: 4000, category: "pies", image: "5.jpeg" },

  { id: "cupcake-vanilla", name: "Ванильді капкейк", price: 500, category: "cupcakes", image: "cupcake-01.jpg" },
  { id: "cupcake-chocolate", name: "Шоколадты капкейк", price: 500, category: "cupcakes", image: "cupcake-02.jpg" },
  { id: "cupcake-assorted", name: "Капкейк", price: 500, category: "cupcakes", image: "11.jpeg" },

  { id: "eskimo-assorted-1", name: "Эскимо", price: 700, category: "eskimo", image: "13.jpeg" },
  { id: "eskimo-assorted-2", name: "Эскимо", price: 700, category: "eskimo", image: "14.jpeg" },

  { id: "large-cake-1", name: "Заказной №1", price: 10000, category: "large-cakes", image: "16.jpeg" },
  { id: "large-cake-2", name: "Заказной №2", price: 10000, category: "large-cakes", image: "17.jpeg" },
  { id: "large-cake-3", name: "Заказной №3", price: 10000, category: "large-cakes", image: "15.jpeg" },
  { id: "large-cake-4", name: "Заказной №4", price: 10000, category: "large-cakes", image: "18.jpeg" },

  { id: "traifl-1", name: "Трайфл Ассорти", price: 600, category: "traifl", image: "19.jpeg" },
  
  { id: "samsa-1", name: "Самса", price: 250, category: "samsa", image: "21.jpeg" },
  { id: "samsa-2", name: "Чебурек", price: 250, category: "samsa", image: "20.jpeg" },

  { id: "tea-1", name: "Трубочки, Сочник, Профитроли, Кекс", price: 200, category: "tea", image: "22.jpeg" },
  { id: "tea-2", name: "Чайный набор №2", price: 200, category: "tea", image: "23.jpeg" },

  { id: "buns-1", name: "Булочки", price: 100, category: "buns", image: "24.jpeg" },

  { id: "chicken-1", name: "Крылья", price: 400, category: "chicken", image: "26.jpeg" },
  { id: "chicken-2", name: "Голень", price: 400, category: "chicken", image: "25.jpeg" },

];


const CART_KEY = "ailin-bakery-cart-v1";
const cart = loadCart();
const overlays = ["cart-overlay", "menu-overlay"];
let returnFocus = null;
let savedScrollY = 0;
let toastTimer = 0;
let activeCategoryId = null;
let categoryScrollFrame = 0;
let categoryScrollEndTimer = 0;
let manualCategoryTarget = null;

function formatPrice(value) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " " + STORE.currency;
}

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "{}");
    return Object.fromEntries(Object.entries(saved).filter(([id, qty]) =>
      PRODUCTS.some(product => product.id === id) && Number.isInteger(qty) && qty > 0
    ));
  } catch {
    return {};
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function quantityInCart() {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function totalInCart() {
  return PRODUCTS.reduce((sum, product) => sum + product.price * (cart[product.id] || 0), 0);
}

function getProduct(id) {
  return PRODUCTS.find(product => product.id === id);
}

function getDisplayPrice(product) {
  if (product.category === "large-cakes") {
    return "6 000–10 000 ₸ / кг";
  }
  return formatPrice(product.price);
}

function renderStoreDetails() {
  document.getElementById("store-hours").textContent = STORE.workingHours;
}

function productCard(product) {
  return '<article class="product-card" data-product-card="' + product.id + '">' +
    '<figure class="product-photo"><img src="assets/products/' + product.image + '" alt="' + product.name + '" loading="lazy" width="520" height="520"></figure>' +
    '<h3 class="product-name">' + product.name + '</h3>' +
    '<div class="product-bottom"><p class="product-price">' + getDisplayPrice(product) + '</p>' +
    '<button class="add-button" type="button" data-add="' + product.id + '" aria-label="' + product.name + ' — себетке қосу">' +
    '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4v12M4 10h12"/></svg><span class="add-quantity" hidden></span></button></div></article>';
}

function renderCatalog() {
  const host = document.getElementById("catalog-sections");
  host.innerHTML = CATEGORIES.map((category, index) => {
    const cards = PRODUCTS.filter(product => product.category === category.id).map(productCard).join("");
    const divider = index ? '<div class="section-divider" aria-hidden="true"></div>' : "";
    return '<section class="product-section" id="' + category.id + '" data-section="' + category.id + '">' +
      divider + '<h2 class="section-title">' + category.title + '</h2><div class="product-grid">' + cards + '</div></section>';
  }).join("");
  updateProductQuantities();
  observeCategories();
}

function updateProductQuantities() {
  document.querySelectorAll("[data-add]").forEach(button => {
    const product = getProduct(button.dataset.add);
    const qty = cart[button.dataset.add] || 0;
    const badge = button.querySelector(".add-quantity");
    button.classList.toggle("has-items", qty > 0);
    badge.hidden = qty === 0;
    badge.textContent = qty;
    button.setAttribute("aria-label", qty ? product.name + " — себетте " + qty : product.name + " — себетке қосу");
  });
  document.getElementById("cart-count").textContent = quantityInCart();
}

function changeProductQuantity(id, delta) {
  const next = (cart[id] || 0) + delta;
  if (next > 0) cart[id] = next;
  else delete cart[id];
  saveCart();
  updateProductQuantities();
  renderCart();
}

function renderCart() {
  const empty = Object.keys(cart).length === 0;
  document.getElementById("cart-empty").hidden = !empty;
  document.getElementById("cart-footer").hidden = empty;
  document.getElementById("checkout-button").disabled = empty;
  document.getElementById("cart-items").innerHTML = empty ? "" : PRODUCTS.filter(product => cart[product.id]).map(product =>
    '<article class="cart-row" data-cart-row="' + product.id + '">' +
      '<div class="cart-row-main"><h3>' + product.name + '</h3><p class="unit-price">' + formatPrice(product.price) + ' / дана</p></div>' +
      '<strong class="cart-row-total">' + formatPrice(product.price * cart[product.id]) + '</strong>' +
      '<div class="cart-controls" aria-label="' + product.name + ' санын өзгерту">' +
        '<button class="quantity-button" type="button" data-qty="' + product.id + '" data-delta="-1" aria-label="Бір данасын азайту">−</button>' +
        '<span class="quantity" aria-live="polite">' + cart[product.id] + '</span>' +
        '<button class="quantity-button" type="button" data-qty="' + product.id + '" data-delta="1" aria-label="Бір данасын қосу">+</button>' +
        '<button class="remove-button" type="button" data-remove="' + product.id + '">Алып тастау</button></div></article>'
  ).join("");
  document.getElementById("cart-total").textContent = formatPrice(totalInCart());
  updateProductQuantities();
}

function lockPage() {
  if (document.body.classList.contains("is-locked")) return;
  savedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
  document.body.style.top = "-" + savedScrollY + "px";
  document.body.classList.add("is-locked");
}

function unlockPage() {
  if (!document.body.classList.contains("is-locked")) return;
  const lockedTop = Number.parseFloat(document.body.style.top);
  const restoreScrollY = Number.isFinite(lockedTop) ? Math.abs(lockedTop) : savedScrollY;
  document.body.classList.remove("is-locked");
  document.body.style.top = "";
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo(0, restoreScrollY);
  root.style.scrollBehavior = previousScrollBehavior;
}

function closeAllOverlays() {
  const wasOpen = overlays.some(id => !document.getElementById(id).hidden);
  overlays.forEach(id => { document.getElementById(id).hidden = true; });
  if (wasOpen) {
    unlockPage();
    if (returnFocus && document.contains(returnFocus)) returnFocus.focus({ preventScroll: true });
  }
}

function openOverlay(id, opener) {
  closeAllOverlays();
  returnFocus = opener || document.activeElement;
  lockPage();
  const overlay = document.getElementById(id);
  overlay.hidden = false;
  const panel = overlay.querySelector('[role="dialog"]');
  if (panel) requestAnimationFrame(() => panel.focus({ preventScroll: true }));
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

function setActiveCategory(id) {
  const changed = activeCategoryId !== id;
  activeCategoryId = id;
  const container = document.getElementById("category-tabs");
  document.querySelectorAll(".category-tab").forEach(tab => {
    const active = tab.dataset.category === id;
    tab.classList.toggle("is-active", active);
    if (active) {
      tab.setAttribute("aria-current", "location");
      if (!changed) return;
      const tabBounds = tab.getBoundingClientRect();
      const navBounds = container.getBoundingClientRect();
      if (tabBounds.left < navBounds.left || tabBounds.right > navBounds.right) {
        const nextLeft = container.scrollLeft + tabBounds.left - navBounds.left - (navBounds.width - tabBounds.width) / 2;
        container.scrollTo({ left: nextLeft, behavior: "smooth" });
      }
    } else tab.removeAttribute("aria-current");
  });
}

function getCategoryAtScrollPosition() {
  const headerHeight = document.querySelector(".site-header").getBoundingClientRect().height;
  const navHeight = document.querySelector(".category-nav").getBoundingClientRect().height;
  const activationLine = headerHeight + navHeight + 12;
  let activeId = "all";
  for (const section of document.querySelectorAll("[data-section]")) {
    if (section.getBoundingClientRect().top > activationLine) break;
    activeId = section.dataset.section;
  }
  return activeId;
}

function syncCategoryFromScroll() {
  if (manualCategoryTarget) {
    window.clearTimeout(categoryScrollEndTimer);
    categoryScrollEndTimer = window.setTimeout(() => {
      manualCategoryTarget = null;
      categoryScrollEndTimer = 0;
    }, 160);
    return;
  }
  if (categoryScrollFrame) return;
  categoryScrollFrame = window.requestAnimationFrame(() => {
    categoryScrollFrame = 0;
    setActiveCategory(getCategoryAtScrollPosition());
  });
}

function releaseManualCategoryTarget() {
  if (!manualCategoryTarget) return;
  window.clearTimeout(categoryScrollEndTimer);
  categoryScrollEndTimer = 0;
  manualCategoryTarget = null;
  syncCategoryFromScroll();
}

function observeCategories() {
  window.addEventListener("scroll", syncCategoryFromScroll, { passive: true });
  window.addEventListener("resize", syncCategoryFromScroll);
  window.addEventListener("wheel", releaseManualCategoryTarget, { passive: true });
  window.addEventListener("touchstart", releaseManualCategoryTarget, { passive: true });
  document.querySelectorAll(".category-tab").forEach(tab => tab.addEventListener("click", event => {
    event.preventDefault();
    const id = tab.dataset.category;
    const target = id === "all"
      ? document.querySelector(".catalog-heading")
      : document.querySelector("#" + id + " .section-title");
    if (categoryScrollFrame) {
      window.cancelAnimationFrame(categoryScrollFrame);
      categoryScrollFrame = 0;
    }
    manualCategoryTarget = id;
    setActiveCategory(id);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.clearTimeout(categoryScrollEndTimer);
    categoryScrollEndTimer = window.setTimeout(() => {
      manualCategoryTarget = null;
      categoryScrollEndTimer = 0;
    }, 300);
  }));
  syncCategoryFromScroll();
}

function initializeMotion() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

  const targets = document.querySelectorAll(
    ".feature, .catalog-heading, .product-section .section-title, .product-card, .site-footer"
  );
  document.documentElement.classList.add("motion-ready");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -5% 0px", threshold: 0.05 });

  targets.forEach((target, index) => {
    if (target.matches(".product-card")) {
      target.style.setProperty("--reveal-delay", (index % 4) * 45 + "ms");
    }
    target.classList.add("scroll-reveal");
    observer.observe(target);
  });
}

function buildCartWhatsAppMessage() {
  const lines = PRODUCTS.filter(product => cart[product.id]).map(product =>
    product.name + " × " + cart[product.id] + " — " + formatPrice(product.price * cart[product.id])
  );
  return [STORE.name + " — тапсырыс", ...lines, "Жалпы сома: " + formatPrice(totalInCart())].join("\n");
}

function sendWhatsApp(message = "") {
  const number = STORE.whatsapp.replace(/\D/g, "");
  if (!number) return false;
  const text = message ? "?text=" + encodeURIComponent(message) : "";
  window.location.href = "https://wa.me/" + number + text;
  return true;
}

document.addEventListener("click", event => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;
  const action = target.closest("[data-action]");
  const close = target.closest("[data-close]");
  const qty = target.closest("[data-qty]");
  const remove = target.closest("[data-remove]");
  const add = target.closest("[data-add]");
  if (close) { closeAllOverlays(); return; }
  if (qty) { changeProductQuantity(qty.dataset.qty, Number(qty.dataset.delta)); return; }
  if (remove) { delete cart[remove.dataset.remove]; saveCart(); renderCart(); return; }
  if (add) { changeProductQuantity(add.dataset.add, 1); return; }
  if (!action) return;
  const key = action.dataset.action;
  if (key === "cart") { renderCart(); openOverlay("cart-overlay", action); }
  if (key === "menu") openOverlay("menu-overlay", action);
  if (key === "checkout" && quantityInCart() > 0 && !sendWhatsApp(buildCartWhatsAppMessage())) {
    showToast("WhatsApp нөмірі әзірге енгізілмеген.");
  }
  if (key === "continue-shopping") closeAllOverlays();
  if (key === "phone") {
    if (STORE.phone) window.location.href = "tel:" + STORE.phone.replace(/\s/g, "");
    else showToast("Байланыс нөмірі әзірге енгізілмеген.");
  }
  if (key === "whatsapp") {
    if (!sendWhatsApp()) showToast("WhatsApp нөмірі әзірге енгізілмеген.");
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeAllOverlays();
  if (event.key !== "Tab") return;
  const overlay = overlays.map(id => document.getElementById(id)).find(item => !item.hidden);
  if (!overlay) return;
  const focusable = [...overlay.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled])')].filter(item => item.offsetParent !== null);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});
document.getElementById("menu-overlay").addEventListener("click", event => {
  if (event.target.closest(".menu-links a, .menu-panel > a.button")) closeAllOverlays();
});

renderStoreDetails();
renderCatalog();
renderCart();
document.getElementById("year").textContent = new Date().getFullYear();
initializeMotion();
