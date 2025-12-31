document.querySelector(".dropdown-btn").addEventListener("click", (e) => {
  document.querySelector(".dropdown").classList.toggle("open");
  document.querySelector(".image-wrapper").classList.remove("open");
});

document.querySelector(".cartButton").addEventListener("click", (e) => {
  document.querySelector(".image-wrapper").classList.toggle("open");
  document.querySelector(".dropdown").classList.remove("open");
  renderCartDropdown();
});

document.addEventListener("click", (e) => {
  const dropdown = document.querySelector(".dropdown");
  // const cartDropdown = document.querySelector(".cart-dropdown");
  // const image_wrapper = document.querySelector(".image-wrapper");
  if (!dropdown.contains(e.target)) {
    dropdown.classList.remove("open");
  }
  // if (!cartDropdown.contains(e.target)) {
  //   image_wrapper.classList.remove("open");
  // }
});

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
const navActions = document.getElementById("nav-actions");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("show");
  navActions.classList.toggle("show");
});

document.querySelectorAll(".dropdown-content a").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();

    document
      .querySelectorAll(".dropdown-content a")
      .forEach((a) => a.classList.remove("active"));

    if (e.target.innerText != "Clear") {
      e.target.classList.add("active");
    }

    const sortType = e.target.innerText.trim();

    const sortingCriteria = sortType.split(" ")[1];

    if (sortingCriteria === undefined) {
      sortCart(sortType);
    }

    sortCart(sortingCriteria);
  });
});

function sortCart(sortingCriteria) {
  const cart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];
  const activeCategory = document
    .querySelector(".list-item.active")
    .innerText.toLowerCase();
  const filteredCategory = normalize(activeCategory);
  let filteredProducts = products;
  if (filteredCategory !== "all") {
    filteredProducts = products.filter(
      (product) => product.category === filteredCategory
    );
  }

  if (cart.length === 0) {
    return;
  }

  switch (sortingCriteria) {
    case "Title":
      cart.sort((a, b) => a.name.localeCompare(b.name));
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;

    case "Price":
      cart.sort((a, b) => a.price - b.price);
      filteredProducts.sort((a, b) => a.price - b.price);
      break;

    case "Category":
      cart.sort((a, b) => a.category.localeCompare(b.category));
      filteredProducts.sort((a, b) => a.category.localeCompare(b.category));
      break;

    case "Clear":
      // optional: restore original order if you store it
      cart = cart;
      break;
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  renderProducts(filteredProducts);
  renderCartDropdown();
}

function formatPrice(el) {
  const value = parseFloat(el.innerText) || 0;

  el.innerText = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// format on load
document.querySelectorAll(".price-value").forEach(formatPrice);

const products_container = document.querySelector("#products");

function renderProducts(items) {
  products_container.innerHTML = "";
  items.forEach((product) => {
    products_container.innerHTML += `<div class="product">
      <div class="image-wrapper"> 
        <img src="${product.image}" class="cardImage" alt="${product.name}">
      </div>

      <h3 class="productName">${product.name}</h3>
      <p class="productPrice">₹ ${product.price}</p>

      <button onclick="addToCart(${product.id})" class="addToCartBtn">Add to cart</button>
    </div>`;
  });
}

renderProducts(products);

function normalize(str) {
  return str.toLowerCase().replace(/s$/, "");
}

const categoryLinks = document.querySelectorAll(".list-item");

categoryLinks.forEach((link) => {
  link.addEventListener("click", () => {
    categoryLinks.forEach((link) => link.classList.remove("active"));
    link.classList.add("active");

    const category = link.textContent;

    if (category === "All") {
      renderProducts(products);
    } else if (category === "Fruits") {
      const filteredProducts = products.filter(
        (product) =>
          product.category.toLowerCase() === normalize(category.toLowerCase())
      );
      renderProducts(filteredProducts);
    } else if (category === "Vegetables") {
      const filteredProducts = products.filter(
        (product) =>
          product.category.toLowerCase() === normalize(category.toLowerCase())
      );
      renderProducts(filteredProducts);
    } else if (category === "Seeds") {
      const filteredProducts = products.filter(
        (product) =>
          product.category.toLowerCase() === normalize(category.toLowerCase())
      );
      renderProducts(filteredProducts);
    }
  });
});

// cart related operations

document.addEventListener("DOMContentLoaded", () => {
  const storedCart = localStorage.getItem("cart");

  if (storedCart) {
    cart = JSON.parse(storedCart);
  } else {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart)); // ✅ store empty cart
  }
  updateCartCount();
  renderCart();
});

function saveCart(cartItems) {
  localStorage.setItem("cart", JSON.stringify(cartItems));
  updateCartCount();
}

function updateCartCount() {
  const badge = document.getElementById("badge-count");
  const cartItems = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];
  const count = cartItems.length;

  if (count > 0) {
    badge.style.display = "block";
    badge.innerText = count;
  } else {
    badge.style.display = "none";
  }
}

function addToCart(productId) {
  // find product from products array
  const product = products.find((p) => p.id === productId);

  const cart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];

  // check if product already exists in cart
  const cartItem = cart.find((item) => item.id === productId);

  if (cartItem) {
    // ✔ already exists → increment quantity
    cartItem.quantity += 1;
  } else {
    // ✔ not exists → add new object with quantity
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: 1,
    });
  }

  saveCart(cart);
  renderCartDropdown();
  renderCart();
}

function renderCartDropdown() {
  const emptyCartDropdown = document.getElementById("empty-cart-dropdown");
  const cartDropdownTotal = document.getElementById("cart-dropdown-total");
  const cartItems = document.getElementById("cart-items");

  const cart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];

  if (cart.length === 0) {
    emptyCartDropdown.style.display = "block";
    cartDropdownTotal.style.display = "none";
    return;
  }

  emptyCartDropdown.style.display = "none";
  cartDropdownTotal.style.display = "flex";
  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    if (item.quantity <= 0) return;

    total += item.price * item.quantity;

    cartItems.innerHTML += `
      <div class="cart-item">
        <div class="billing-item-first">
          <span>${index + 1}.</span>
          <div class="billing-item-inner">
            <div>
              <span class="billing-item-name">${item.name} /</span>
              <span class="billing-item-price">₹${item.price}</span>
            </div>

            <div class="qty-controls">
              <button onclick="decrementQty(${
                item.id
              })" class="decrementBtn">−</button>
              <span class="quantity">${item.quantity}</span>
              <button onclick="incrementQty(${
                item.id
              })" class="incrementBtn">+</button>
            </div>
          </div>
        </div>

        <span class="price-value">₹${item.price * item.quantity}</span>
      </div>
    `;
  });

  document.getElementById("cart-total").innerText = "₹" + total;
}

function renderCart() {
  const emptyCart = document.getElementById("empty-cart");
  const billing_items = document.getElementById("billing-items");
  const billing_total = document.getElementById("billing-total-wrapper");
  const separator = document.getElementById("separator");
  const cart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];

  console.log("Cart: ", cart);

  if (cart.length === 0) {
    billing_items.style.display = "none";
    billing_total.style.display = "none";
    separator.style.display = "none";
    emptyCart.style.display = "block";
    return;
  }

  emptyCart.style.display = "none";
  billing_items.style.display = "block";
  billing_items.innerHTML = "";
  billing_total.style.display = "flex";

  let total = 0;

  cart.forEach((item, index) => {
    if (item.quantity <= 0) return;

    total += item.price * item.quantity;

    billing_items.innerHTML += `
      <div class="billing-item">
        <div class="billing-item-first">
          <span>${index + 1}.</span>
          <div class="billing-item-inner">
            <div>
              <span class="billing-item-name">${item.name} /</span>
              <span class="billing-item-price">₹${item.price}</span>
            </div>

            <div class="qty-controls">
              <button onclick="decrementQty(${
                item.id
              })" class="decrementBtn">−</button>
              <span class="quantity">${item.quantity}</span>
              <button onclick="incrementQty(${
                item.id
              })" class="incrementBtn">+</button>
            </div>
          </div>
        </div>

        <span class="price-value">₹${item.price * item.quantity}</span>
      </div>
    `;
  });

  document.getElementById("billing-total").innerText = "₹" + total;
}

function incrementQty(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const item = cart.find((p) => p.id === productId);
  if (!item) return;

  item.quantity += 1;

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();
  renderCart();
  renderCartDropdown();
}

function decrementQty(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const item = cart.find((p) => p.id === productId);
  if (!item) return;

  item.quantity -= 1;

  // Remove item completely if quantity becomes 0 or less
  if (item.quantity <= 0) {
    cart = cart.filter((p) => p.id !== productId);
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();
  renderCart();
  renderCartDropdown();
}
