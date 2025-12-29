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

      <button>Add to cart</button>
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
