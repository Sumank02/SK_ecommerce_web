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

let cartContainer = document.getElementById('cartContainer')

let boxContainerDiv = document.createElement('div')
boxContainerDiv.id = 'boxContainer'

// DYNAMIC CODE TO SHOW THE SELECTED ITEMS IN YOUR CART
function dynamicCartSection(ob, itemCounter)
{
    let boxDiv = document.createElement('div')
    boxDiv.id = 'box'
    boxContainerDiv.appendChild(boxDiv)

    let boxImg = document.createElement('img')
    boxImg.src = ob.preview
    boxDiv.appendChild(boxImg)

    let boxh3 = document.createElement('h3')
    let h3Text = document.createTextNode(ob.name + ' × ' + itemCounter)
    boxh3.appendChild(h3Text)
    boxDiv.appendChild(boxh3)

    let boxh4 = document.createElement('h4')
    let h4Text = document.createTextNode('Amount: Rs' + ob.price)
    boxh4.appendChild(h4Text)
    boxDiv.appendChild(boxh4)

    cartContainer.appendChild(boxContainerDiv)
    cartContainer.appendChild(totalContainerDiv)

    return cartContainer
}

let totalContainerDiv = document.createElement('div')
totalContainerDiv.id = 'totalContainer'

let totalDiv = document.createElement('div')
totalDiv.id = 'total'
totalContainerDiv.appendChild(totalDiv)

let totalh2 = document.createElement('h2')
let h2Text = document.createTextNode('Total Amount')
totalh2.appendChild(h2Text)
totalDiv.appendChild(totalh2)

// TO UPDATE THE TOTAL AMOUNT
function amountUpdate(amount)
{
    let totalh4 = document.createElement('h4')
    let totalh4Text = document.createTextNode('Amount: Rs ' + amount)
    totalh4Text.id = 'toth4'
    totalh4.appendChild(totalh4Text)
    totalDiv.appendChild(totalh4)
}

let buttonDiv = document.createElement('div')
buttonDiv.id = 'button'
totalDiv.appendChild(buttonDiv)

let buttonTag = document.createElement('button')
buttonDiv.appendChild(buttonTag)

let buttonLink = document.createElement('a')
buttonLink.href = '/orderPlaced.html?'
buttonTag.appendChild(buttonLink)

const buttonText = document.createTextNode('Place Order')
buttonLink.appendChild(buttonText)

// BACKEND CALL - Using Fetch API
let totalAmount = 0
fetch('https://5d76bf96515d1a0014085cf9.mockapi.io/product')
    .then(response => response.json())
    .then(contentTitle => {
        const cart = JSON.parse(localStorage.getItem('cart'))
        const counter = cart.counter
        document.getElementById("totalItem").innerHTML = ('Total Items: ' + counter)

        const items = cart.items
        let totalAmount = 0
        
        // Count occurrences of each item
        const itemCount = {}
        for (let i = 0; i < items.length; i++) {
            itemCount[items[i]] = (itemCount[items[i]] || 0) + 1
        }

        // Display items and calculate total
        for (const itemId in itemCount) {
            const itemCounter = itemCount[itemId]
            totalAmount += Number(contentTitle[itemId - 1].price) * itemCounter
            dynamicCartSection(contentTitle[itemId - 1], itemCounter)
        }
        amountUpdate(totalAmount)
    })
    .catch(error => {
        console.error('Error fetching products:', error)
    })




