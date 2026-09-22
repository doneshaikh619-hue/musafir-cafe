/**
 * MUSAFIR CAFE - CORE SCRIPT
 * Dynamic Product Catalog, Cart Engine, WhatsApp Checkout,
 * Google Maps Paste Parser, and UI Interactions.
 */

// ==========================================================================
// 1. BUSINESS CONFIGURATION
// ==========================================================================
// WhatsApp number in international format without leading +
const WHATSAPP_NUMBER = "923343648222";
const BUSINESS_NAME = "Musafir Cafe";
const BUSINESS_ADDRESS = "R98G+VC2, Kamra Rd, Attock, Pakistan";
const BUSINESS_PHONE = "+92 334 3648222";

// ==========================================================================
// 2. PRODUCT CATALOG DATA
// ==========================================================================
const PRODUCTS = [
  {
    id: "card-cheesecake",
    name: "Royal Velvet Layered Cheesecake",
    shortName: "Aatis",
    scriptTag: "Nud",
    category: "patisserie",
    categoryLabel: "Gourmet Patisserie",
    price: 480,
    image: "./assets/card-cheesecake.jpg",
    description: "Multi-layered vanilla sponge with silky caramel ganache, white chocolate mirror glaze, and glazed wild raspberry.",
    cardTheme: "rose",
    featuredCard: true,
    badge: "Patisserie Best-Seller"
  },
  {
    id: "card-fudge",
    name: "Belgian Dark Ganache Fudge Cube",
    shortName: "Lermi",
    scriptTag: "Jamo",
    category: "patisserie",
    categoryLabel: "Artisan Chocolate",
    price: 390,
    image: "./assets/card-fudge.jpg",
    description: "Dense 70% dark Belgian cocoa fudge brownie crowned with mirror ganache and handcrafted white chocolate heart.",
    cardTheme: "peach",
    featuredCard: true,
    badge: "Chef's Special"
  },
  {
    id: "card-lavender",
    name: "Lavender Almond Sponge Pastry",
    shortName: "Flitre",
    scriptTag: "Tind",
    category: "patisserie",
    categoryLabel: "Herbal Patisserie",
    price: 410,
    image: "./assets/card-lavender.jpg",
    description: "Golden honey-almond sponge layered with lavender infused cream and coated in crunchy chocolate pearls.",
    cardTheme: "lavender",
    featuredCard: true,
    badge: "Botanical Infusion"
  },
  {
    id: "drink-dragon-mojito",
    name: "Dragon Mango Mojito",
    shortName: "Mango Mojito",
    category: "beverages",
    categoryLabel: "Signature Mojitos",
    price: 450,
    image: "./assets/dragon-mojito.jpg",
    description: "Fresh Alphonso mango nectar muddled with garden mint, sparkling soda, lime zest, and vibrant dragon fruit cubes.",
    badge: "Customer Favorite ★★★★★"
  },
  {
    id: "drink-karak-chai",
    name: "Musafir Special Karak Chai",
    shortName: "Karak Chai",
    category: "chai",
    categoryLabel: "Signature Teas",
    price: 180,
    image: "./assets/karak-chai.jpg",
    description: "Traditional slow-simmered whole milk tea with green cardamom, star anise, and cinnamon. Served hot in clay ceramic.",
    badge: "Authentic Blend"
  },
  {
    id: "coffee-hero",
    name: "Berry Whipped Cream Cappuccino",
    shortName: "Berry Cappuccino",
    category: "coffee",
    categoryLabel: "Artisan Coffee",
    price: 420,
    image: "./assets/hero-coffee.jpg",
    description: "Velvety double espresso topped with tall clouds of whipped sweet cream, cocoa dusting, and fresh raspberry.",
    badge: "Hero Special"
  },
  {
    id: "coffee-showcase",
    name: "Artisan Rosetta Flat White",
    shortName: "Rosetta Flat White",
    category: "coffee",
    categoryLabel: "Artisan Coffee",
    price: 380,
    image: "./assets/showcase-latte.jpg",
    description: "Double ristretto blend expertly paired with silky micro-foam adorned with signature heart and rosetta latte art.",
    badge: "Barista Pride"
  },
  {
    id: "drink-iced-spanish",
    name: "Iced Caramel Spanish Latte",
    shortName: "Spanish Latte",
    category: "coffee",
    categoryLabel: "Chilled Brews",
    price: 460,
    image: "./assets/showcase-latte.jpg",
    description: "Chilled espresso sweetened with velvety condensed milk, cold poured over hand-cut ice blocks.",
    badge: "Chilled Perfection"
  }
];

// ==========================================================================
// 3. CART SYSTEM (LocalStorage)
// ==========================================================================
const CART_STORAGE_KEY = "musafir_cafe_cart_v1";

function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Cart retrieval error", e);
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartCountBadges();
  } catch (e) {
    console.error("Cart save error", e);
  }
}

function addToCart(productId, quantity = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.categoryLabel,
      quantity: quantity
    });
  }

  saveCart(cart);
  showToastNotification(`Added ${quantity}x "${product.name}" to cart!`);

  // If we are currently on add-to-cart.html, refresh the list
  if (document.getElementById("cart-items-container")) {
    renderCartPage();
  }
}

function updateItemQuantity(productId, delta) {
  let cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }

  saveCart(cart);
  if (document.getElementById("cart-items-container")) {
    renderCartPage();
  }
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== productId);
  saveCart(cart);
  if (document.getElementById("cart-items-container")) {
    renderCartPage();
  }
}

function clearCart() {
  saveCart([]);
  if (document.getElementById("cart-items-container")) {
    renderCartPage();
  }
}

function getCartTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  return { subtotal, totalItems };
}

function updateCartCountBadges() {
  const { totalItems } = getCartTotals();
  const badges = document.querySelectorAll(".cart-badge");
  badges.forEach(badge => {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? "inline-flex" : "none";
  });
}

// Toast Feedback Notification
function showToastNotification(message) {
  let toast = document.getElementById("site-toast-notice");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "site-toast-notice";
    toast.className = "toast-notice";
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span class="toast-badge">✓</span>
    <span class="toast-msg">${message}</span>
  `;
  toast.classList.add("show");

  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

// ==========================================================================
// 4. WHATSAPP DYNAMIC ORDER GENERATOR
// ==========================================================================
function generateWhatsAppOrderUrl() {
  const cart = getCart();
  if (cart.length === 0) {
    alert("Your cart is empty! Please add some delicious items before placing an order.");
    return null;
  }

  const { subtotal } = getCartTotals();
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  let message = `*Hello ${BUSINESS_NAME}!* ☕\n`;
  message += `I would like to place an order from your website.\n\n`;
  message += `📅 *Date:* ${dateStr}\n`;
  message += `📍 *Location:* ${BUSINESS_ADDRESS}\n`;
  message += `------------------------------------\n`;
  message += `*ORDER ITEMS:*\n`;

  cart.forEach((item, index) => {
    const lineTotal = item.price * item.quantity;
    message += `${index + 1}. *${item.name}*\n   Qty: ${item.quantity} × Rs ${item.price.toLocaleString()} = *Rs ${lineTotal.toLocaleString()}*\n`;
  });

  message += `------------------------------------\n`;
  message += `💰 *OVERALL TOTAL: Rs ${subtotal.toLocaleString()}*\n\n`;
  message += `👤 *Customer Note:* Please confirm availability and preparation time. Thank you!`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

// ==========================================================================
// 5. RENDER CART PAGE (add-to-cart.html)
// ==========================================================================
function renderCartPage() {
  const container = document.getElementById("cart-items-container");
  const summarySubtotal = document.getElementById("summary-subtotal");
  const summaryTotal = document.getElementById("summary-total");
  const summaryCount = document.getElementById("summary-item-count");
  const checkoutBtn = document.getElementById("btn-whatsapp-order");

  if (!container) return;

  const cart = getCart();
  const { subtotal, totalItems } = getCartTotals();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart-state">
        <div class="empty-cart-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>
        <h4>Your Cart is Empty</h4>
        <p>You haven't added any sweet moments or artisanal drinks yet.</p>
        <a href="index.html#menu-section" class="btn-pill-dark">Explore Our Menu</a>
      </div>
    `;

    if (summarySubtotal) summarySubtotal.textContent = "Rs 0";
    if (summaryTotal) summaryTotal.textContent = "Rs 0";
    if (summaryCount) summaryCount.textContent = "0 items";
    if (checkoutBtn) {
      checkoutBtn.style.opacity = "0.5";
      checkoutBtn.style.pointerEvents = "none";
    }
    return;
  }

  if (checkoutBtn) {
    checkoutBtn.style.opacity = "1";
    checkoutBtn.style.pointerEvents = "auto";
  }

  let html = `<div class="cart-list">`;
  cart.forEach(item => {
    const lineTotal = item.price * item.quantity;
    html += `
      <div class="cart-item-row" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div>
          <h4 class="cart-item-title">${item.name}</h4>
          <div class="cart-item-unit-price">Rs ${item.price.toLocaleString()} each</div>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="updateItemQuantity('${item.id}', -1)" aria-label="Decrease quantity">−</button>
          <span class="qty-number">${item.quantity}</span>
          <button class="qty-btn" onclick="updateItemQuantity('${item.id}', 1)" aria-label="Increase quantity">+</button>
        </div>
        <div class="cart-item-subtotal">Rs ${lineTotal.toLocaleString()}</div>
        <button class="btn-remove-item" onclick="removeFromCart('${item.id}')" title="Remove item" aria-label="Remove item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    `;
  });
  html += `</div>`;

  container.innerHTML = html;
  if (summarySubtotal) summarySubtotal.textContent = `Rs ${subtotal.toLocaleString()}`;
  if (summaryTotal) summaryTotal.textContent = `Rs ${subtotal.toLocaleString()}`;
  if (summaryCount) summaryCount.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`;
}

// ==========================================================================
// 6. GOOGLE MAPS PASTE INSPECTOR ENGINE (contact.html)
// ==========================================================================
const DEFAULT_GOOGLE_MAPS_PASTE = `Musafir Cafe
4.9(31)
·Rs 1–1,000
Bar / Cafe
Overview
Reviews
About
Directions

R98G+VC2, Kamra Rd, Attock, Pakistan

Rs 1–1,000 per personReported by 4 people

+92 334 3648222

Photos & videos
Menu
Food & drink
Review summary
4.9
31 reviews

Recent Reviews:
- Mahnoor Khann: "Had a great experience at Musafir Cafe! I tried their Dragon Mango Mojito, and it was absolutely delicious. The ambiance was so aesthetic, with beautiful paintings and books for reading. The service was also excellent, with polite and friendly environment."
- Ubaid Ur Rehman: "10/10 Highly recommend. A good addition in Attock's food space. Reasonable prices as compared to ISLAMABAD and other big cities."
- Muneeza Arshad: "Its an amazing spot for quick hangouts and outing plans in the city. Attock really needed a place like this."`;

function parseGoogleMapsText(text) {
  if (!text || text.trim().length === 0) return null;

  const result = {
    name: "Musafir Cafe",
    rating: "4.9 ★",
    reviewsCount: "31 Verified Reviews",
    priceRange: "Rs 1 – 1,000",
    phone: "+92 334 3648222",
    address: "R98G+VC2, Kamra Rd, Attock, Pakistan",
    category: "Cafe & Artisan Beverage Bar",
    specialties: "Dragon Mango Mojito, Karak Chai, Art & Reading Nook"
  };

  // Extract Business Name
  const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length > 0) {
    result.name = lines[0];
  }

  // Extract Rating (e.g. 4.9(31))
  const ratingMatch = text.match(/([0-5]\.[0-9])\s*\(?(\d+)\)?/);
  if (ratingMatch) {
    result.rating = `${ratingMatch[1]} ★`;
    result.reviewsCount = `${ratingMatch[2]} Verified Reviews`;
  }

  // Extract Phone (+92 ...)
  const phoneMatch = text.match(/(\+92\s*[0-9\s-]{9,13})/);
  if (phoneMatch) {
    result.phone = phoneMatch[1].trim();
  }

  // Extract Address (Look for Plus code or Attock)
  const addrMatch = text.match(/([A-Z0-9]{4}\+[A-Z0-9]{3,4}[^,\n]*,[^\n]+Attock[^\n]*)/i);
  if (addrMatch) {
    result.address = addrMatch[1].trim();
  }

  // Extract Price Range
  const priceMatch = text.match(/(Rs\s*[0-9]+[–-][0-9,]+)/i);
  if (priceMatch) {
    result.priceRange = priceMatch[1].trim();
  }

  return result;
}

function setupGoogleMapsInspector() {
  const textarea = document.getElementById("gmaps-paste-input");
  const parseBtn = document.getElementById("btn-parse-gmaps");
  const resetBtn = document.getElementById("btn-reset-gmaps");
  const resultsContainer = document.getElementById("gmaps-parsed-output");

  if (!textarea || !resultsContainer) return;

  // Set default paste if empty
  if (!textarea.value.trim()) {
    textarea.value = DEFAULT_GOOGLE_MAPS_PASTE;
  }

  function renderParsedData() {
    const raw = textarea.value;
    const data = parseGoogleMapsText(raw);
    if (!data) return;

    resultsContainer.innerHTML = `
      <div class="parsed-card">
        <div class="parsed-card-label">Business Name</div>
        <div class="parsed-card-value">${data.name}</div>
      </div>
      <div class="parsed-card">
        <div class="parsed-card-label">Google Rating</div>
        <div class="parsed-card-value">${data.rating} (${data.reviewsCount})</div>
      </div>
      <div class="parsed-card">
        <div class="parsed-card-label">Official Phone</div>
        <div class="parsed-card-value">${data.phone}</div>
      </div>
      <div class="parsed-card">
        <div class="parsed-card-label">Google Maps Address</div>
        <div class="parsed-card-value">${data.address}</div>
      </div>
      <div class="parsed-card">
        <div class="parsed-card-label">Price Range</div>
        <div class="parsed-card-value">${data.priceRange} / person</div>
      </div>
      <div class="parsed-card">
        <div class="parsed-card-label">Customer Mentioned Favorites</div>
        <div class="parsed-card-value">${data.specialties}</div>
      </div>
    `;
  }

  if (parseBtn) {
    parseBtn.addEventListener("click", () => {
      renderParsedData();
      showToastNotification("Google Maps business data successfully parsed & synced!");
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      textarea.value = DEFAULT_GOOGLE_MAPS_PASTE;
      renderParsedData();
      showToastNotification("Reset to verified Google Maps data.");
    });
  }

  // Initial render
  renderParsedData();
}

// ==========================================================================
// 7. DYNAMIC MENU FILTERING (Homepage & Catalog)
// ==========================================================================
function setupMenuFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const productCards = document.querySelectorAll(".product-item-card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.getAttribute("data-category");
      productCards.forEach(card => {
        if (category === "all" || card.getAttribute("data-category") === category) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// ==========================================================================
// 8. SITE INITIALIZATION
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Update Header Cart Count Badge
  updateCartCountBadges();

  // Scroll Header Effect
  const header = document.querySelector(".site-header");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  // Mobile Navigation Toggle & Auto-Close
  const mobileToggle = document.querySelector(".mobile-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      navLinks.classList.toggle("open");
    });

    // Close when a link inside the nav is clicked
    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
      });
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        navLinks.classList.remove("open");
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        navLinks.classList.remove("open");
      }
    });
  }

  // Render Cart Page if on add-to-cart.html
  if (document.getElementById("cart-items-container")) {
    renderCartPage();

    const checkoutBtn = document.getElementById("btn-whatsapp-order");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const url = generateWhatsAppOrderUrl();
        if (url) {
          window.open(url, "_blank");
        }
      });
    }

    const clearBtn = document.getElementById("btn-clear-cart");
    if (clearBtn) {
      clearBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (confirm("Are you sure you want to clear your cart?")) {
          clearCart();
        }
      });
    }
  }

  // Setup Google Maps Inspector if on contact.html
  if (document.getElementById("gmaps-paste-input")) {
    setupGoogleMapsInspector();
  }

  // Setup Menu Filters if on homepage
  setupMenuFilters();
});
