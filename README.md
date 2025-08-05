 Yousaf Shop Project - Full Explanation (Beginner-Friendly)
 Overview:
 This is a basic frontend e-commerce project using HTML, Tailwind CSS, and JavaScript.
 It lets users view products, filter by category, switch currency, add to cart, and checkout.
 1. index.html (Home Page):- Navbar with links: Home, Contact, Cart, Checkout, Currency selector.- Hero Section: Welcome message.- Category Filter: Dropdown to filter products.- Product List: Products dynamically loaded using script.js.- Modal: Shows product detail when clicked.- Footer: Copyright notice.
 script.js (Home Logic):- Fetches products from fakestoreapi.com.- Displays them dynamically.- Adds to cart using localStorage.- Filters by category.- Converts prices to selected currency.- Opens product modal with details.
 2. cart.html (Cart Page):- Displays all added products.- Allows quantity changes or removal.
- Currency dropdown to convert total.- Proceed to Checkout button.
 cart.js (Cart Logic):- Reads cart from localStorage.- Displays each item with quantity and price.- Updates total with selected currency.- Uses exchange rate API for conversion.
 3. checkout.html (Checkout Page):- Form: Name, Email, Address, Submit.- Shows confirmation after successful order.
 checkout.js (Checkout Logic):- Validates form inputs.- Shows errors if invalid.- Clears cart and form on success.- Shows success message.
 4. contact.html (Contact Page):- Form: Name, Email, Message.- Validates inputs.- Shows simulated success message.
 Tailwind CSS Classes Explained:- sm:text-base: On small and larger screens, set base text size.
- inset-0: Stretch element to cover full screen.- overflow-y-auto: Enable vertical scroll if needed.
 Summary:
 An online shop with filtering, currency conversion, cart management, form validation,
 and responsive design. A great beginner frontend project using modern tools.
