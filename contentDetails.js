const id = location.search.split('?')[1]

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

// BACKEND CALLING - Using Fetch API
fetch('https://5d76bf96515d1a0014085cf9.mockapi.io/product/' + id)
    .then(response => response.json())
    .then(contentDetails => {
        dynamicContentDetails(contentDetails)
    })
    .catch(error => {
        console.error('Error fetching product details:', error)
    })  
