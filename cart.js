//  Get DOM Elements
const cartItemsContainer = document.getElementById("cart-items"); // Where cart items will be rendered
const totalElement = document.getElementById("total"); // Where total amount will be displayed
const currencySelector = document.getElementById("currencySelector"); // Dropdown to select currency

//  Initialize exchange rates and currency state
let exchangeRates = {};
let currentCurrency = "USD";

//  Currency symbols for display
const currencySymbols = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  INR: "₹",
};

//  Main logic: Wait for DOM to load, fetch exchange rates, and render the cart
document.addEventListener("DOMContentLoaded", async () => {
  await fetchExchangeRates(); // Get latest currency rates
  renderCart(); // Render cart on page load

  //  Update cart when user changes currency
  currencySelector.addEventListener("change", () => {
    currentCurrency = currencySelector.value;
    renderCart(); // Re-render with new currency
  });
});

//  Render all cart items and total
function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || []; // Get cart from localStorage
  cartItemsContainer.innerHTML = ""; // Clear current items
  let totalUSD = 0; // Base total in USD

  cart.forEach((item, index) => {
    totalUSD += item.price * item.quantity; // Sum total in USD

    //  Create cart item UI
    const div = document.createElement("div");
    div.className =
      "flex flex-col sm:flex-row items-center gap-4 border p-4 rounded shadow bg-white justify-between";

    //  Convert item price to selected currency
    const convertedPrice = convertCurrency(item.price);
    const symbol = currencySymbols[currentCurrency] || "$";

    //  Cart item template
    div.innerHTML = `
      <div class="flex items-center gap-4 w-full sm:w-auto">
        <img src="${item.image}" alt="${item.title}" class="w-24 h-24 object-contain rounded" />
        <div class="flex flex-col">
          <h3 class="font-bold mb-1">${item.title}</h3>
          <p class="text-gray-700">${symbol} ${convertedPrice} × <span class="font-semibold">${item.quantity}</span></p>
          <div class="flex items-center gap-2 mt-2">
            <button class="decrease bg-gray-200 px-2 py-1 rounded">−</button>
            <button class="increase bg-gray-200 px-2 py-1 rounded">+</button>
            <button class="remove bg-red-500 text-white px-2 py-1 rounded">Remove</button>
          </div>
        </div>
      </div>
    `;

    //  Quantity − Button Logic
    div.querySelector(".decrease").addEventListener("click", () => {
      if (item.quantity > 1) {
        item.quantity--; // Decrease quantity
      } else {
        cart.splice(index, 1); // Remove item if quantity is 1
      }
      localStorage.setItem("cart", JSON.stringify(cart)); // Save changes
      renderCart(); // Refresh UI
    });

    //  Quantity + Button Logic
    div.querySelector(".increase").addEventListener("click", () => {
      item.quantity++; // Increase quantity
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    });

    //  Remove Button Logic
    div.querySelector(".remove").addEventListener("click", () => {
      cart.splice(index, 1); // Remove item from cart
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    });

    //  Add the card to the page
    cartItemsContainer.appendChild(div);
  });

  //  Update total amount in selected currency
  const totalConverted = convertCurrency(totalUSD);
  const symbol = currencySymbols[currentCurrency] || "$";
  totalElement.textContent = `${symbol} ${totalConverted}`;
}

//  Convert USD to selected currency
function convertCurrency(amountUSD) {
  const rate = exchangeRates[currentCurrency] || 1;
  return (amountUSD * rate).toFixed(2);
}

//  Fetch exchange rates from API
async function fetchExchangeRates() {
  try {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const data = await res.json();
    exchangeRates = data.rates;
  } catch (error) {
    console.error("Exchange rate error:", error); // Log error if fetch fails
  }
}
