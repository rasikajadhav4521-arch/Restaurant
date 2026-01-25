/* =========================================================
   IMPORTS
   - fetchMenuData : Fetches menu data from data source (API / JSON)
   - renderMenu   : Renders menu items dynamically into the DOM
   ========================================================= */
import { fetchMenuData } from "./dataService.js";
import { renderMenu } from "./renderMenu.js";

/* =========================================================
   GLOBAL STATE (SINGLE SOURCE OF TRUTH)
   ========================================================= */
// Stores all menu items fetched from data source
let menuItems = [];

// Tracks currently selected category
let activeCategory = "all";

let currentItemPrice = 0; // base price of selected item

let isManualScroll = false;

// Shopping cart data (persisted using localStorage)
//let cart = JSON.parse(localStorage.getItem("cart")) || [];

// MOBILE SAFETY: Disable reveal animations on small screens
if (window.innerWidth <= 768) {
  document.querySelectorAll(".reveal").forEach(el => {
    el.classList.add("reveal-active");
  });
}


/* =========================================================
   DOM ELEMENT REFERENCES
   ========================================================= */
// Menu items container
const menuContainer = document.getElementById("menuContainer");

// Category filter buttons
const filterButtons = document.querySelectorAll(".filter-btn");

// Mobile navigation toggle button
const mobileToggle = document.querySelector(".mobile-nav-toggle");

// Navigation links list
const navList = document.querySelector(".nav-list");

// Search input field
const searchInput = document.getElementById("searchInput");

// Book table button in navbar
const bookTableBtn = document.querySelector(".nav-actions .primary");

// Book table modal elements
const bookTableModal = document.getElementById("bookTableModal");
const closeBookTable = document.getElementById("closeBookTable");

// Order modal elements
const orderModal = document.getElementById("orderModal");
const closeOrder = document.getElementById("closeOrder");
const orderItemName = document.getElementById("orderItemName");

// Quantity controls
const qtyInput = document.getElementById("orderQty");
const incBtn = document.getElementById("increaseQty");
const decBtn = document.getElementById("decreaseQty");

// Designer intro modal
const designerModal = document.getElementById("designerModal");
const closeDesignerModal = document.getElementById("closeDesignerModal");

// Active navbar section-wise
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

// Cart count badge
//const cartCountEl = document.getElementById("cartCount");

// Add to cart button inside order modal
//const addToCartBtn = document.querySelector("#orderModal .btn.primary");

/* =========================================================
   1. MOBILE NAVIGATION TOGGLE
   - Toggles mobile menu visibility
   - Switches icon between hamburger and close
   ========================================================= */
mobileToggle.addEventListener("click", () => {
    // Toggle navigation visibility
    navList.classList.toggle("active");

    // Change icon state
    const icon = mobileToggle.querySelector("i");
    icon.classList.toggle("fa-bars");
    icon.classList.toggle("fa-times");
});

/* =========================================================
   2. INITIALIZE MENU
   - Fetches menu data on page load
   - Renders menu items
   - Triggers animations
   ========================================================= */
async function init() {
    try {
        // Fetch menu data
        menuItems = await fetchMenuData();

        // Render menu if data exists
        if (menuItems.length) {
            renderMenu(menuItems, menuContainer);
            animateCards();
        }
    } catch (error) {
        // Log error if fetch fails
        console.error("Failed to load menu", error);
    }
}

/* =========================================================
   3. SEARCH + CATEGORY FILTER (COMBINED LOGIC)
   ========================================================= */
function applyFilters() {
    // Convert search text to lowercase
    const searchTerm = searchInput.value.toLowerCase();

    // Filter menu items based on category & search term
    const filteredItems = menuItems.filter(item => {
        const matchesCategory =
            activeCategory === "all" || item.category === activeCategory;

        const matchesSearch =
            item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesSearch;
    });

    // Render filtered menu
    renderMenu(filteredItems, menuContainer);
    animateCards();
}

/* =========================================================
   4. CATEGORY FILTER BUTTONS
   ========================================================= */
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {

        // Remove active class from all buttons
        filterButtons.forEach(b => b.classList.remove("active"));

        // Add active class to clicked button
        btn.classList.add("active");

        // Update selected category
        activeCategory = btn.dataset.category;

        // Apply filters
        applyFilters();
    });
});

/* =========================================================
   5. SEARCH INPUT HANDLER
   ========================================================= */
// Apply filters on every keystroke
searchInput.addEventListener("input", applyFilters);

/* =========================================================
   MENU CARD ANIMATION
   - Adds staggered fade-in effect
   ========================================================= */
function animateCards() {
    const cards = document.querySelectorAll(".menu-card");

    cards.forEach((card, index) => {
        // Reset animation
        card.classList.remove("fade-in");

        // Apply animation with delay
        setTimeout(() => {
            card.classList.add("fade-in");
        }, index * 100);
    });
}

/* =========================================================
   SMOOTH SCROLL FOR NAVIGATION LINKS (WITH FIXED NAV OFFSET)
   ========================================================= */
document.querySelectorAll(".nav-link").forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));
    if (!target) return;

    isManualScroll = true;

    const yOffset = -90; // height of fixed navbar
    const y =
      target.getBoundingClientRect().top +
      window.pageYOffset +
      yOffset;

    window.scrollTo({
      top: y,
      behavior: "smooth"
    });

    // Manually set active link
    navLinks.forEach(link => link.classList.remove("active"));
    this.classList.add("active");

    // Close mobile menu
    navList.classList.remove("active");

    // Re-enable observer after scroll finishes
    setTimeout(() => {
      isManualScroll = false;
    }, 800);
  });
});


// /* =========================================================
//    SMOOTH SCROLL FOR NAVIGATION LINKS
//    ========================================================= */
// document.querySelectorAll(".nav-link").forEach(anchor => {
//   anchor.addEventListener("click", function (e) {
//     e.preventDefault();

//     const target = document.querySelector(this.getAttribute("href"));
//     if (!target) return;

//     isManualScroll = true;

//     // window.scrollTo({
//     //   top: target.offsetTop - 80,
//     //   behavior: "smooth"
//     // });

//     target.scrollIntoView({
//       behavior: "smooth",
//       block: "start"
//     });

//     // Manually set active link
//     navLinks.forEach(link => link.classList.remove("active"));
//     this.classList.add("active");

//     navList.classList.remove("active");

//     // Re-enable observer after scroll finishes
//     setTimeout(() => {
//       isManualScroll = false;
//     }, 800);
//   });
// });

/* =========================================================
   BOOK TABLE MODAL LOGIC
   ========================================================= */
bookTableBtn.addEventListener("click", (e) => {
  e.preventDefault();
  //bookTableModal.style.display = "flex";
  bookTableModal.classList.add("active");
});

closeBookTable.addEventListener("click", () => {
  // bookTableModal.style.display = "none";
  bookTableModal.classList.remove("active");
});

window.addEventListener("click", (e) => {
  if (e.target === bookTableModal) {
    // bookTableModal.style.display = "none";
    bookTableModal.classList.remove("active");
  }
});

/* =========================================================
   ORDER MODAL LOGIC
   - Opens modal when "Order" button is clicked
   ========================================================= */
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-to-order");
  if (!btn) return;

  currentItemPrice = Number(btn.dataset.price);

  orderItemName.textContent = btn.dataset.name;
  //orderItemPrice.textContent = ₹${btn.dataset.price};
  qtyInput.value = 1;

  orderItemPrice.textContent = `₹${currentItemPrice}`;

  //orderModal.style.display = "flex";
  orderModal.classList.add("active");

});

/* =========================================================
   ORDER MODAL CONTROLS
   ========================================================= */
closeOrder.addEventListener("click", () => {
  //orderModal.style.display = "none";
  orderModal.classList.remove("active");
});

window.addEventListener("click", (e) => {
  if (e.target === orderModal) {
    orderModal.classList.remove("active");
  }
});

/*  Helper function for order modal  */
function updateTotalPrice() {
  const quantity = Number(qtyInput.value);
  const total = currentItemPrice * quantity;
  orderItemPrice.textContent = `₹${total}`;
}

incBtn.addEventListener("click", () => {
  qtyInput.value = +qtyInput.value + 1;
  updateTotalPrice();
});

decBtn.addEventListener("click", () => {
  if (qtyInput.value > 1) {
    qtyInput.value = +qtyInput.value - 1;
    updateTotalPrice();
  }
});

/* =========================================================
   DESIGNER INTRO MODAL
   - Shown only once using localStorage
   ========================================================= */
closeDesignerModal.addEventListener("click", () => {
  //designerModal.style.display = "none";
  designerModal.classList.remove("active");
});

window.addEventListener("click", (e) => {
  if (e.target === designerModal) {
    //designerModal.style.display = "none";
    designerModal.classList.remove("active");
  }
});

/* =========================================================
   SCROLL REVEAL ANIMATION
   ========================================================= */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-active");
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".reveal").forEach(section => {
  revealObserver.observe(section);
});

/* =========================================================
   ACTIVE NAV LINK ON SCROLL
   ========================================================= */
// const sections = document.querySelectorAll("section[id]");
// const navLinks = document.querySelectorAll(".nav-link");

const navObserver = new IntersectionObserver(entries => {
  if (isManualScroll) return;

  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove("active");

        if (link.getAttribute("href") === `#${entry.target.id}`) {
          link.classList.add("active");
        }
      });
    }
  });
}, {
  rootMargin: "-90px 0px -60% 0px",
  threshold: 0
});

sections.forEach(section => navObserver.observe(section));

// const navObserver = new IntersectionObserver(
//   entries => {
//     entries.forEach(entry => {
//       if (entry.isIntersecting) {
//         navLinks.forEach(link => {
//           link.classList.remove("active");

//           if (link.getAttribute("href") === #${entry.target.id}) {
//             link.classList.add("active");
//           }
//         });
//       }
//     });
//   },
//   {
//     rootMargin: "-90px 0px -60% 0px",
//     threshold: 0
//   }
// );

// const navObserver = new IntersectionObserver(
//   entries => {
//     entries.forEach(entry => {
//       if (entry.isIntersecting) {
//         navLinks.forEach(link => {
//           link.classList.remove("active");

//           if (link.getAttribute("href") === #${entry.target.id}) {
//             link.classList.add("active");
//           }
//         });
//       }
//     });
//   },
//   {
//     threshold: 0.6
//   }
// );

// sections.forEach(section => navObserver.observe(section));



/* =========================================================
   DOM CONTENT LOADED
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {

  // Show designer intro only once
  const hasSeenDesignerIntro = localStorage.getItem("designerIntroSeen");

  if (!hasSeenDesignerIntro) {
    //designerModal.style.display = "flex";
    designerModal.classList.add("active");
    localStorage.setItem("designerIntroSeen", "true");
  }

  init(); // Initialize menu and filters
});

