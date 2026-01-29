let contentTitle;
function dynamicClothingSection(ob) {
  let boxDiv = document.createElement("div");
  boxDiv.id = "box";

  let boxLink = document.createElement("a");
  boxLink.href = "/contentDetails.html?" + ob.id;

  let imgTag = document.createElement("img");
  imgTag.src = ob.preview;

  let detailsDiv = document.createElement("div");
  detailsDiv.id = "details";

  let h3 = document.createElement("h3");
  let h3Text = document.createTextNode(ob.name);
  h3.appendChild(h3Text);

  let h4 = document.createElement("h4");
  let h4Text = document.createTextNode(ob.brand);
  h4.appendChild(h4Text);

  let h2 = document.createElement("h2");
  let h2Text = document.createTextNode("rs  " + ob.price);
  h2.appendChild(h2Text);

  boxDiv.appendChild(boxLink);
  boxLink.appendChild(imgTag);
  boxLink.appendChild(detailsDiv);
  detailsDiv.appendChild(h3);
  detailsDiv.appendChild(h4);
  detailsDiv.appendChild(h2);

  return boxDiv;
}

let mainContainer = document.getElementById("mainContainer");
let containerClothing = document.getElementById("containerClothing");
let containerAccessories = document.getElementById("containerAccessories");

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
      if (contentTitle[i].isAccessory) {
        containerAccessories.appendChild(
          dynamicClothingSection(contentTitle[i])
        );
      } else {
        containerClothing.appendChild(
          dynamicClothingSection(contentTitle[i])
        );
      }
    }
  })
  .catch(error => {
    console.error('Error fetching products:', error);
  });
