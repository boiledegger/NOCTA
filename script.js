function showPage() {
    var id = location.hash.replace("#", "") || "home";
    var target = document.getElementById(id);

    if (!target || !target.classList.contains("page")) {
        id = "home";
    }

    document.querySelectorAll(".page").forEach(function(page) {
        page.classList.toggle("active", page.id === id);
    });

    window.scrollTo(0, 0);
}

window.addEventListener("hashchange", showPage);
showPage();


/* PRODUCT SEARCH */

function searchProducts() {
    var searchText = document.getElementById("productSearch")
        .value.toLowerCase().trim();

    var products = document.querySelectorAll("#productList .category");
    var dropdown = document.getElementById("searchDropdown");
    var found = false;

    dropdown.innerHTML = "";

    products.forEach(function(product) {
        var productName = product.querySelector("h3").textContent;

        // Filter products on the Categories page
        if (productName.toLowerCase().includes(searchText)) {
            product.style.display = "flex";

            // Show matching suggestions in the dropdown
            if (searchText !== "") {
                var option = document.createElement("div");
                option.className = "search-option";
                option.textContent = productName;

                option.onclick = function() {
                    document.getElementById("productSearch").value =
                        productName;

                    dropdown.style.display = "none";
                    location.hash = "categories";
                    searchProducts();
                };

                dropdown.appendChild(option);
            }

            found = true;
        } else {
            product.style.display = "none";
        }
    });

    // Display the dropdown only when searching
    if (searchText !== "") {
        dropdown.style.display = "block";

        if (!found) {
            dropdown.innerHTML =
                '<div class="search-empty">No products found.</div>';
        }
    } else {
        dropdown.style.display = "none";
    }

    document.getElementById("noProducts").style.display =
        found ? "none" : "block";
}


/* SIGN-UP FORM */

document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var name = document.getElementById("fullName").value.trim();
    var email = document.getElementById("email").value.trim();
    var password = document.getElementById("password").value;

    if (name === "" || email === "" || password.length < 6) {
        document.getElementById("signupMessage").textContent =
            "Please complete all fields. Password must be at least 6 characters.";
        return;
    }

    // Save the user's name and email, not their password.
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);

    document.getElementById("signupMessage").textContent =
        "Account registered successfully!";

    document.getElementById("profileName").textContent = "Name: " + name;
    document.getElementById("profileEmail").textContent = "Email: " + email;

    document.getElementById("signupForm").reset();
});


/* LOAD SAVED PROFILE */

function loadProfile() {
    var name = localStorage.getItem("userName");
    var email = localStorage.getItem("userEmail");

    if (name && email) {
        document.getElementById("profileName").textContent = "Name: " + name;
        document.getElementById("profileEmail").textContent = "Email: " + email;
    }
}

loadProfile();


/* LOG OUT */

function logout() {
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    document.getElementById("profileName").textContent =
        "Name: Not registered";

    document.getElementById("profileEmail").textContent =
        "Email: Not registered";

    alert("You have logged out.");
}

/* SHOPPING CART */
var cart = JSON.parse(localStorage.getItem("noctaCart")) || [];

function saveCart() {
    localStorage.setItem("noctaCart", JSON.stringify(cart));
}

function formatMoney(amount) {
    return "₱" + amount.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


function addToCart(name, price) {
    alert(name + " added to cart!");

    var existingItem = cart.find(function(item) {
        return item.name === name;
    });

    if (existingItem) {
        existingItem.quantity = (Number(existingItem.quantity) || 1) + 1;
    } else {
        cart.push({
            name: name,
            price: Number(price),
            quantity: 1
        });
    }

    saveCart();
    displayCart();
}


function changeQuantity(index, amount) {
    cart[index].quantity += amount;

    // Remove the item if its quantity reaches zero
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    displayCart();
}

function displayCart() {
    var cartItems = document.getElementById("cartItems");
    cartItems.innerHTML = "";

    cart.forEach(function(item, index) {
        // Support items saved by the older cart code
        if (!item.quantity || item.quantity < 1) {
            item.quantity = 1;
        }

        var product = document.createElement("div");
        product.className = "product cart-product";

        var name = document.createElement("span");
        name.textContent = item.name + " - " +
            formatMoney(item.price);

        var quantityControls = document.createElement("div");
        quantityControls.className = "quantity-controls";

        var decreaseButton = document.createElement("button");
        decreaseButton.textContent = "−";
        decreaseButton.type = "button";
        decreaseButton.setAttribute("aria-label", "Decrease quantity");
        decreaseButton.onclick = function() {
            changeQuantity(index, -1);
        };

        var quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        var increaseButton = document.createElement("button");
        increaseButton.textContent = "+";
        increaseButton.type = "button";
        increaseButton.setAttribute("aria-label", "Increase quantity");
        increaseButton.onclick = function() {
            changeQuantity(index, 1);
        };

        var removeButton = document.createElement("button");
        removeButton.textContent = "REMOVE";
        removeButton.type = "button";
        removeButton.onclick = function() {
            cart.splice(index, 1);
            saveCart();
            displayCart();
        };

        quantityControls.appendChild(decreaseButton);
        quantityControls.appendChild(quantity);
        quantityControls.appendChild(increaseButton);

        product.appendChild(name);
        product.appendChild(quantityControls);
        product.appendChild(removeButton);

        cartItems.appendChild(product);
    });

    saveCart();
    updateCart();
}

displayCart();


/* CONTACT FORM */

document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var name = document.getElementById("contactName").value.trim();
    var message = document.getElementById("contactMessage").value.trim();

    if (name === "" || message === "") {
        document.getElementById("contactResult").textContent =
            "Please complete all fields.";
        return;
    }

    document.getElementById("contactResult").textContent =
        "Thank you, " + name + "! Your message has been checked.";

    document.getElementById("contactForm").reset();
});

/* CANCEL SEARCH DROP DOWN MENU */
document.addEventListener("click", function(event) {
    var container = document.querySelector(".search-container");
    var dropdown = document.getElementById("searchDropdown");

    if (!container.contains(event.target)) {
        dropdown.style.display = "none";
    }
});
