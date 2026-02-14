const id = location.search.split('?')[1]

// Validate product ID (must be a positive integer)
function isValidProductId(id) {
    if (!id) return false;
    const numId = Number(id);
    return Number.isInteger(numId) && numId > 0;
}

// Validate product object has required fields
function isValidProduct(product) {
    return product && 
           typeof product.name === 'string' && product.name.trim() !== '' &&
           typeof product.preview === 'string' && product.preview !== '' &&
           typeof product.price === 'number' && product.price >= 0;
}

if (!isValidProductId(id)) {
    console.error('Invalid product ID:', id);
    document.getElementById('containerProduct').innerHTML = '<p style="color: red;">Invalid product ID. Please go back and try again.</p>';
}

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

function dynamicContentDetails(ob)
{
    const mainContainer = document.createElement('div')
    mainContainer.id = 'containerD'
    document.getElementById('containerProduct').appendChild(mainContainer);

    const imageSectionDiv = document.createElement('div')
    imageSectionDiv.id = 'imageSection'

    const imgTag = document.createElement('img')
    imgTag.id = 'imgDetails'
    imgTag.src = ob.preview

    imageSectionDiv.appendChild(imgTag)

    const productDetailsDiv = document.createElement('div')
    productDetailsDiv.id = 'productDetails'

    const h1 = document.createElement('h1')
    const h1Text = document.createTextNode(ob.name)
    h1.appendChild(h1Text)

    const h4 = document.createElement('h4')
    const h4Text = document.createTextNode(ob.brand)
    h4.appendChild(h4Text)

    const detailsDiv = document.createElement('div')
    detailsDiv.id = 'details'

    const h3DetailsDiv = document.createElement('h3')
    const h3DetailsText = document.createTextNode('Rs ' + ob.price)
    h3DetailsDiv.appendChild(h3DetailsText)

    const h3 = document.createElement('h3')
    const h3Text = document.createTextNode('Description')
    h3.appendChild(h3Text)

    const para = document.createElement('p')
    const paraText = document.createTextNode(ob.description)
    para.appendChild(paraText)

    const productPreviewDiv = document.createElement('div')
    productPreviewDiv.id = 'productPreview'

    const h3ProductPreviewDiv = document.createElement('h3')
    const h3ProductPreviewText = document.createTextNode('Product Preview')
    h3ProductPreviewDiv.appendChild(h3ProductPreviewText)
    productPreviewDiv.appendChild(h3ProductPreviewDiv)

    for(let i = 0; i < ob.photos.length; i++)
    {
        const imgTagProductPreviewDiv = document.createElement('img')
        imgTagProductPreviewDiv.id = 'previewImg'
        imgTagProductPreviewDiv.src = ob.photos[i]
        imgTagProductPreviewDiv.onclick = function(event)
        {
            imgTag.src = this.src
            document.getElementById("imgDetails").src = this.src 
            
        }
        productPreviewDiv.appendChild(imgTagProductPreviewDiv)
    }

    const buttonDiv = document.createElement('div')
    buttonDiv.id = 'button'

    const buttonTag = document.createElement('button')
    buttonDiv.appendChild(buttonTag)

    const buttonText = document.createTextNode('Add to Cart')
    buttonTag.onclick = function()
    {
        const cart = JSON.parse(localStorage.getItem('cart'))
        cart.items.push(Number(id))
        cart.counter += 1
        localStorage.setItem('cart', JSON.stringify(cart))
        updateBadge()
    }
    buttonTag.appendChild(buttonText)

    mainContainer.appendChild(imageSectionDiv)
    mainContainer.appendChild(productDetailsDiv)
    productDetailsDiv.appendChild(h1)
    productDetailsDiv.appendChild(h4)
    productDetailsDiv.appendChild(detailsDiv)
    detailsDiv.appendChild(h3DetailsDiv)
    detailsDiv.appendChild(h3)
    detailsDiv.appendChild(para)
    productDetailsDiv.appendChild(productPreviewDiv)
    
    
    productDetailsDiv.appendChild(buttonDiv)


    return mainContainer
} 

// BACKEND CALLING - Try remote API then fallback to local data
const REMOTE_PRODUCT_URL = 'https://5d76bf96515d1a0014085cf9.mockapi.io/product/';
const LOCAL_PRODUCTS_URL = 'data/products.json';

async function loadProductDetails() {
    if (!isValidProductId(id)) return;

    try {
        const res = await fetch(REMOTE_PRODUCT_URL + id);
        if (!res.ok) throw new Error('Remote fetch failed: ' + res.status);
        const data = await res.json();
        if (isValidProduct(data)) {
            dynamicContentDetails(data);
            return;
        }
        throw new Error('Invalid product data from remote');
    } catch (err) {
        console.warn('Remote fetch failed, attempting local fallback:', err);
    }

    // Local fallback: load full products list and find the id
    try {
        const localRes = await fetch(LOCAL_PRODUCTS_URL);
        if (!localRes.ok) throw new Error('Local fetch failed: ' + localRes.status);
        const list = await localRes.json();
        const found = list.find(p => Number(p.id) === Number(id));
        if (isValidProduct(found)) {
            dynamicContentDetails(found);
            return;
        }
        console.error('Product not found in local fallback or invalid:', found);
        document.getElementById('containerProduct').innerHTML = '<p style="color: red;">Failed to load product details. Product not found.</p>';
    } catch (localErr) {
        console.error('Failed to load product details from both remote and local:', localErr);
        document.getElementById('containerProduct').innerHTML = '<p style="color: red;">Failed to load product details. Please try again later.</p>';
    }
}

loadProductDetails();
