// Note: the 'http://' or "https://" is required

const apiUrl = "http://localhost:3000/api/products";

axios
  .get(apiUrl)
  .then((response) => {
    const products = response.data;

    for (const product of products) {
      console.log(product.name);

      const listElement = document.getElementById("productList");
      const newListElement = document.createElement("li");
      newListElement.classList.add("product");
      const newImageElement = document.createElement("img");
      newImageElement.src = `./thumbnails/${product.imageUrl}`;
      newImageElement.alt = product.name;
      const nameElement = document.createElement("div");
      nameElement.innerText = product.name;
      const categoryElement = document.createElement("div");
      categoryElement.innerText = product.category;
      const priceElement = document.createElement("div");
      priceElement.innerTet = `/$${product.price}`;

      newListElement.appendChild(newImageElement);
      newListElement.appendChild(nameElement);
      newListElement.appendChild(categoryElement);
      newListElement.appendChild(priceElement);

      listElement.appendChild(newListItemElement);
    }
  })
  .catch((error) => {
    debugger;
  });
