let contentTitle = [];

// Validate product object has required fields
function isValidProduct(product) {
    return product && 
           typeof product.id === 'number' && product.id > 0 &&
           typeof product.name === 'string' && product.name.trim() !== '' &&
           typeof product.preview === 'string' && product.preview !== '' &&
           typeof product.price === 'number' && product.price >= 0;
}

function dynamicClothingSection(ob) {
  const boxDiv = document.createElement("div");
  boxDiv.id = "box";

  const boxLink = document.createElement("a");
  boxLink.href = "/contentDetails.html?" + ob.id;

  const imgTag = document.createElement("img");
  imgTag.src = ob.preview;

  const detailsDiv = document.createElement("div");
  detailsDiv.id = "details";

  const h3 = document.createElement("h3");
  const h3Text = document.createTextNode(ob.name);
  h3.appendChild(h3Text);

  const h4 = document.createElement("h4");
  const h4Text = document.createTextNode(ob.brand);
  h4.appendChild(h4Text);

  const h2 = document.createElement("h2");
  const h2Text = document.createTextNode("rs  " + ob.price);
  h2.appendChild(h2Text);

  boxDiv.appendChild(boxLink);
  boxLink.appendChild(imgTag);
  boxLink.appendChild(detailsDiv);
  detailsDiv.appendChild(h3);
  detailsDiv.appendChild(h4);
  detailsDiv.appendChild(h2);

  return boxDiv;
}

const mainContainer = document.getElementById("mainContainer");
const containerClothing = document.getElementById("containerClothing");
const containerAccessories = document.getElementById("containerAccessories");

// BACKEND CALLING - Using Fetch API
const REMOTE_PRODUCTS_URL = "https://5d76bf96515d1a0014085cf9.mockapi.io/product";
const LOCAL_PRODUCTS_URL = "data/products.json";

function processProducts(data) {
  contentTitle = data;

  // Update badge from localStorage cart (fallback to cookie for compatibility)
  let badgeCount = 0;
  if (localStorage.getItem('cart')) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    badgeCount = cart.counter || 0;
  } else if (document.cookie.indexOf(",counter=") >= 0) {
    badgeCount = Number(document.cookie.split(",")[1].split("=")[1]) || 0;
  }
  document.getElementById("badge").innerHTML = badgeCount;

  for (let i = 0; i < contentTitle.length; i++) {
    if (isValidProduct(contentTitle[i])) {
      if (contentTitle[i].isAccessory) {
        containerAccessories.appendChild(
          dynamicClothingSection(contentTitle[i])
        );
      } else {
        containerClothing.appendChild(
          dynamicClothingSection(contentTitle[i])
        );
      }
    } else {
      console.warn('Skipping invalid product:', contentTitle[i]);
    }
  }
}

async function loadProducts() {
  try {
    const res = await fetch(REMOTE_PRODUCTS_URL);
    if (!res.ok) throw new Error('Remote fetch failed: ' + res.status);
    const data = await res.json();
    processProducts(data);
  } catch (err) {
    console.warn('Remote fetch failed, attempting local fallback:', err);
    try {
      const localRes = await fetch(LOCAL_PRODUCTS_URL);
      if (!localRes.ok) throw new Error('Local fetch failed: ' + localRes.status);
      const localData = await localRes.json();
      processProducts(localData);
    } catch (localErr) {
      console.error('Failed to load products from both remote and local:', localErr);
    }
  }
}

// Start loading products
loadProducts();
