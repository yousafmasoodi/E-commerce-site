//  DOM Element References
const productList = document.getElementById("product-list");
const categoryFilter = document.getElementById("categoryFilter");
const currencySelector = document.getElementById("currencySelector");
const cartCountElem = document.getElementById("cart-count");

//  State Variables
let allProducts = []; // All fetched products
let exchangeRates = {}; // Fetched currency exchange rates
let currentCurrency = "USD"; // Default currency

//  Currency Symbols for Display
const currencySymbols = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  AFG: "؋",
};

//  Fetch Products and Exchange Rates
fetch("https://fakestoreapi.com/products")
  .then((res) => res.json())
  .then((products) => {
    allProducts = products;
    populateCategoryFilter(products); // Populate category filter dropdown
    displayProducts(products); // Display products in UI
    return fetchExchangeRates(); // Fetch currency rates
  })
  .then(() => {
    convertPrices(); // Convert all prices to current currency
  })
  .catch((error) => {
    console.error("Failed to fetch products:", error);
    productList.innerHTML = "<p>Failed to load products.</p>";
  });

//  Populate Category Dropdown from Products
function populateCategoryFilter(products) {
  const categories = [...new Set(products.map((p) => p.category))];
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoryFilter.appendChild(option);
  });
}

//  Render Products to Page
function displayProducts(products) {
  productList.innerHTML = ""; // Clear list first

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className =
      "flex flex-col justify-between border rounded p-4 shadow hover:shadow-lg transition cursor-pointer min-h-[400px]";

    // Create HTML inside each product card
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" class="w-full h-48 object-contain mb-4" />
      <h3 class="text-lg font-bold mb-2 line-clamp-2">${product.title}</h3>
      <p class="text-green-600 font-semibold mb-2 product-price" data-usd="${product.price}">
        ${currentCurrency} ${product.price}
      </p>
      <div class="mt-auto">
        <button class="bg-blue-500 text-white px-3 py-1 rounded hover:opacity-75 w-full sm:w-auto">
          Add to Cart
        </button>
      </div>
    `;

    //  Handle Add to Cart Button Click
    card.querySelector("button").addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent triggering modal

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existing = cart.find((item) => item.id === product.id);

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Added to cart!");
      updateCartCount(); // Refresh cart count UI
    });

    //  Show Product Detail Modal on Card Click
    card.addEventListener("click", () => showProductDetail(product));
    productList.appendChild(card); // Add card to DOM
  });
}

//  Filter Products by Category
categoryFilter.addEventListener("change", () => {
  const selectedCategory = categoryFilter.value;
  const filtered = selectedCategory
    ? allProducts.filter((p) => p.category === selectedCategory)
    : allProducts;

  displayProducts(filtered); // Show filtered list
  convertPrices(); // Update price display
});

//  Show Product Detail in Modal
function showProductDetail(product) {
  document.getElementById("modalImage").src = product.image;
  document.getElementById("modalImage").alt = product.title;
  document.getElementById("modalTitle").textContent = product.title;
  document.getElementById("modalDescription").textContent = product.description;
  document.getElementById("modalPrice").textContent = `${
    currencySymbols[currentCurrency]
  } ${convertCurrency(product.price)}`;
  document.getElementById("productModal").classList.remove("hidden");
}

//  Close Modal on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("productModal").classList.add("hidden");
  });

  updateCartCount(); // Initial cart count
});

//  Update Cart Count in Navbar
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElem.textContent = count;
}

//  Convert All Displayed Prices to Selected Currency
function convertPrices() {
  const rate = exchangeRates[currentCurrency] || 1;
  document.querySelectorAll(".product-price").forEach((el) => {
    const usdPrice = parseFloat(el.getAttribute("data-usd"));
    const converted = (usdPrice * rate).toFixed(2);
    const symbol = currencySymbols[currentCurrency] || "$";
    el.textContent = `${symbol} ${converted}`;
  });
}

//  Convert Single Price (used in modal)
function convertCurrency(amountUSD) {
  const rate = exchangeRates[currentCurrency] || 1;
  return (amountUSD * rate).toFixed(2);
}

//  Fetch Currency Exchange Rates
async function fetchExchangeRates() {
  try {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const data = await res.json();
    exchangeRates = data.rates;
  } catch (error) {
    console.error("Exchange rate error:", error);
  }
}

//  Handle Currency Change
currencySelector.addEventListener("change", (e) => {
  currentCurrency = e.target.value;
  displayProducts(allProducts); // Re-render product cards
  convertPrices(); // Update prices
  updateCartCount(); // Refresh cart count (not strictly needed here)
});
