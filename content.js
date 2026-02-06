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
fetch("https://5d76bf96515d1a0014085cf9.mockapi.io/product")
  .then(response => response.json())
  .then(data => {
    contentTitle = data;
    if (document.cookie.indexOf(",counter=") >= 0) {
      const counter = document.cookie.split(",")[1].split("=")[1];
      document.getElementById("badge").innerHTML = counter;
    }
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
  })
  .catch(error => {
    console.error('Error fetching products:', error);
  });
