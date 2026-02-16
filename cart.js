// Initialize cart in localStorage if not exists
if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify({ items: [], counter: 0 }))
}

// Update badge with cart counter
function updateBadge() {
    const cart = JSON.parse(localStorage.getItem('cart'))
    document.getElementById("badge").innerHTML = cart.counter
}

updateBadge()

const cartContainer = document.getElementById('cartContainer')

const boxContainerDiv = document.createElement('div')
boxContainerDiv.id = 'boxContainer'

// DYNAMIC CODE TO SHOW THE SELECTED ITEMS IN YOUR CART
function dynamicCartSection(ob, itemCounter)
{
    const boxDiv = document.createElement('div')
    boxDiv.id = 'box'
    boxContainerDiv.appendChild(boxDiv)

    const boxImg = document.createElement('img')
    boxImg.src = ob.preview
    boxDiv.appendChild(boxImg)

    const boxh3 = document.createElement('h3')
    const h3Text = document.createTextNode(ob.name + ' × ' + itemCounter)
    boxh3.appendChild(h3Text)
    boxDiv.appendChild(boxh3)

    const boxh4 = document.createElement('h4')
    const h4Text = document.createTextNode('Amount: Rs' + ob.price)
    boxh4.appendChild(h4Text)
    boxDiv.appendChild(boxh4)

    cartContainer.appendChild(boxContainerDiv)
    cartContainer.appendChild(totalContainerDiv)

    return cartContainer
}

const totalContainerDiv = document.createElement('div')
totalContainerDiv.id = 'totalContainer'

const totalDiv = document.createElement('div')
totalDiv.id = 'total'
totalContainerDiv.appendChild(totalDiv)

const totalh2 = document.createElement('h2')
const h2Text = document.createTextNode('Total Amount')
totalh2.appendChild(h2Text)
totalDiv.appendChild(totalh2)

// TO UPDATE THE TOTAL AMOUNT
function amountUpdate(amount)
{
    const totalh4 = document.createElement('h4')
    const totalh4Text = document.createTextNode('Amount: Rs ' + amount)
    totalh4Text.id = 'toth4'
    totalh4.appendChild(totalh4Text)
    totalDiv.appendChild(totalh4)
}

const buttonDiv = document.createElement('div')
buttonDiv.id = 'button'
totalDiv.appendChild(buttonDiv)

const buttonTag = document.createElement('button')
buttonDiv.appendChild(buttonTag)

const buttonLink = document.createElement('a')
buttonLink.href = '/orderPlaced.html?'
buttonTag.appendChild(buttonLink)

const buttonText = document.createTextNode('Place Order')
buttonLink.appendChild(buttonText)

// Validate product object has required fields
function isValidProduct(product) {
    return product && 
           typeof product.id === 'number' && product.id > 0 &&
           typeof product.name === 'string' && product.name.trim() !== '' &&
           typeof product.preview === 'string' && product.preview !== '' &&
           typeof product.price === 'number' && product.price >= 0;
}

// BACKEND CALL - Try remote API then fallback to local data
const REMOTE_PRODUCTS_URL = 'https://5d76bf96515d1a0014085cf9.mockapi.io/product';
const LOCAL_PRODUCTS_URL = 'data/products.json';

async function loadCartProducts() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const counter = cart.counter;
    document.getElementById("totalItem").innerHTML = ('Total Items: ' + counter);

    const items = cart.items;
    let totalAmount = 0;

    // Count occurrences of each item
    const itemCount = {};
    for (let i = 0; i < items.length; i++) {
        itemCount[items[i]] = (itemCount[items[i]] || 0) + 1;
    }

    let products = null;

    // Try remote first
    try {
        const res = await fetch(REMOTE_PRODUCTS_URL);
        if (!res.ok) throw new Error('Remote fetch failed: ' + res.status);
        products = await res.json();
    } catch (err) {
        console.warn('Remote fetch failed, attempting local fallback:', err);
    }

    // Fall back to local if remote failed
    if (!products) {
        try {
            const localRes = await fetch(LOCAL_PRODUCTS_URL);
            if (!localRes.ok) throw new Error('Local fetch failed: ' + localRes.status);
            products = await localRes.json();
        } catch (localErr) {
            console.error('Failed to load products from both remote and local:', localErr);
            return;
        }
    }

    // Display items and calculate total
    for (const itemId in itemCount) {
        const itemCounter = itemCount[itemId];
        const product = products[itemId - 1];
        if (isValidProduct(product)) {
            totalAmount += Number(product.price) * itemCounter;
            dynamicCartSection(product, itemCounter);
        } else {
            console.warn('Skipping invalid product in cart:', itemId);
        }
    }
    amountUpdate(totalAmount);
}

// Load products for cart
loadCartProducts();




