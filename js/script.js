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

// Shopping cart data (persisted using localStorage)
//let cart = JSON.parse(localStorage.getItem("cart")) || [];

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
   SMOOTH SCROLL FOR NAVIGATION LINKS
   ========================================================= */
document.querySelectorAll(".nav-link").forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        // Get target section
        const target = document.querySelector(this.getAttribute("href"));
        if (!target) return;

        // Smooth scroll with offset for fixed header
        window.scrollTo({
            top: target.offsetTop - 80,
            behavior: "smooth"
        });

        // Close mobile menu after navigation
        navList.classList.remove("active");
    });
});

/* =========================================================
   DOM CONTENT LOADED
   ========================================================= */
// Initialize application once DOM is ready
document.addEventListener("DOMContentLoaded", init);