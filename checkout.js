//  Event Listener for Form Submission
document
  .getElementById("checkoutForm") //  Target the form element by ID
  .addEventListener("submit", function (e) {
    e.preventDefault(); //  Prevent default form submit (page reload)

    //  Accessing Input Fields
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const addressInput = document.getElementById("address");

    //  Getting trimmed values from form fields
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const address = addressInput.value.trim();

    let isValid = true; //  Flag to track if form is valid

    //  Remove any old error messages before re-validating
    document.querySelectorAll(".error-msg").forEach((el) => el.remove());

    //  Name Validation: Must be at least 2 characters
    if (name.length < 2) {
      showError(nameInput, "Full name must be at least 2 characters.");
      isValid = false;
    }

    //  Email Validation: Uses regex for proper format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError(emailInput, "Please enter a valid email address.");
      isValid = false;
    }

    //  Address Validation: Must be at least 5 characters
    if (address.length < 5) {
      showError(addressInput, "Address must be at least 5 characters.");
      isValid = false;
    }

    //  If any field is invalid, stop form submission
    if (!isValid) return;

    //  If form is valid: Clear the cart
    localStorage.removeItem("cart");

    //  Display order confirmation message
    const message = document.getElementById("confirmationMessage");
    message.textContent = `Thank you, ${name}! Your order has been placed successfully.`;
    message.classList.remove("hidden");

    //  Reset form fields after successful submission
    document.getElementById("checkoutForm").reset();
  });

//  Helper Function to Show Error Message Under Inputs
function showError(inputElement, message) {
  const error = document.createElement("p"); //  Create a paragraph element
  error.textContent = message; //  Add the error message text
  error.className = "error-msg text-red-500 text-sm mt-1"; //  Tailwind for styling
  inputElement.insertAdjacentElement("afterend", error); //  Place error below input
}
