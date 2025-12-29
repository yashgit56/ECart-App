document.querySelector(".dropdown-btn").addEventListener("click", () => {
  document.querySelector(".dropdown").classList.toggle("open");
});

const products_container = document.querySelector("#products");

function renderProducts(items) {
  products_container.innerHTML = "";
  items.forEach((product) => {
    products_container.innerHTML += `<div class="product">
      <img src="${product.image}" class="cardImage" alt="${product.name}">

      <h3 class="productName">${product.name}</h3>
      <p class="productPrice">₹ ${product.price}</p>

      <button onclick="addToCart(${product.id})">Add to cart</button>
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
let cart = [];

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
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const badge = document.getElementById("badge-count");
  const cartItems = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (count > 0) {
    badge.innerText = count;
  } else {
    badge.style.display = "none";
  }
}

function addToCart(productId) {
  // find product from products array
  const product = products.find((p) => p.id === productId);

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
      quantity: 1,
    });
  }

  saveCart(cart);
  renderCart();
}

function renderCart() {
  const emptyCart = document.getElementById("empty-cart");
  const billing_items = document.getElementById("billing-items");
  const billing_total = document.getElementById("billing-total-wrapper");
  const cart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];

  console.log("Cart: ", cart);

  if (cart.length === 0) {
    billing_items.style.display = "none";
    billing_total.style.display = "none";
    return;
  }

  emptyCart.style.display = "none";
  billing_items.style.display = "block";
  billing_items.innerHTML = "";

  let total = 0;

  cart.forEach((item) => {
    if (item.quantity <= 0) return;

    total += item.price * item.quantity;

    billing_items.innerHTML += `
      <div class="billing-item">
        <span>${item.id}</span>
        <span>${item.name}</span>
        <span>₹${item.price}</span>

        <div class="qty-controls">
          <button onclick="decrementQty(${item.id})">−</button>
          <span>${item.quantity}</span>
          <button onclick="incrementQty(${item.id})">+</button>
        </div>

        <span>₹${item.price * item.quantity}</span>
      </div>
    `;
  });

  document.getElementById("billing-total").innerText = total;
}

function incrementQty(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const item = cart.find((p) => p.id === productId);
  if (!item) return;

  item.quantity += 1;

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();
  renderCart();
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
}
