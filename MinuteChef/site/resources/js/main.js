const pages = ["restaurants", "deliveryPolicy", "feedback", "signUp"]
const restaurantsSubPages = ["restaurants", "listOfRestaurant", "Menu", "paymentPage", "donePage"]

let currentPage = "restaurants"
let currentRestaurantSubPage = "restaurants"

function getNavButtonId(id) {
    if(restaurantsSubPages.includes(id)) {
        return "restaurantsNavButton"
    } else {
        return id + "NavButton"
    }
}

function showPageRaw(id, goToPaymentPageFromLogin) {
    const searchAddress = document.getElementById('searchaddress').value.trim()
    if(id == "listOfRestaurant" && searchAddress.length == 0) {
        // Don't let the user not enter a search address
        swal('Please enter the address to continue...')
        return;
    }

    //checking
    if(id =='Menu')
    {
        document.getElementById("listOfRestaurant").style.display = "none"  
    }

    document.getElementById("header").className = id + "Header"

    // Hide all pages and unselect all nav buttons
    for(pageId of pages) {
        document.getElementById(pageId).style.display = "none"
        document.getElementById(getNavButtonId(pageId)).setAttribute("selected", "false")
    }
    for(pageId of restaurantsSubPages) {
        document.getElementById(pageId).style.display = "none"
    }

    // Show the passed page and its proper nav button
    document.getElementById(id).style.display = "block"
    document.getElementById(getNavButtonId(id)).setAttribute("selected", "true")

    if(id == "feedback") {
        displayFeedback();
    } else if(id == 'listOfRestaurant') {
        address(searchAddress);
    } else if(id == "paymentPage") {
        displayPaymentPage()
    } else if(id == "signUp") {
        displayLoginPage(goToPaymentPageFromLogin)
    }

    if(restaurantsSubPages.includes(id)) {
        currentRestaurantSubPage = id
        currentPage = "restaurants"
    } else {
        currentPage = id
    }
}

function showPage(id, goToPaymentPageFromLogin=false) {
    if(id === "restaurants") {
        showPageRaw(currentRestaurantSubPage, goToPaymentPageFromLogin)
    } else {
        showPageRaw(id, goToPaymentPageFromLogin)
    }
}

function initializeWebsite() {
    showPage("restaurants")
    displayRestaurantList()
    initializeCarts()
    displayCategories()
    selectCategory("Chicken")
    displayCarts()
    displayTopBar()
    displayFeedback()
    document.getElementById("searchaddress").value = ""
}

function displayFeedback() {
    document.getElementById("feedbackForm").style.display = "block"
    document.getElementById("feedback-thanks").style.display = "none"
    document.getElementById("feedbackActualForm").reset()
}

window.onload = function() {
    initializeWebsite()

    document.getElementById("searchaddress").onkeydown = function(event) {
        if(event.key === "Enter") {
            showPage("listOfRestaurant")
        }
    }

    function backToFirstPage() {
        carts = []
        unpaidCarts = []
        currentRestaurantSubPage = "restaurants"
        initializeWebsite()
    }
    document.getElementById("logo-button").onclick = backToFirstPage
    document.getElementById("continue-shop-button").onclick = backToFirstPage

    document.getElementById("feedbackActualForm").onsubmit = function(event) {
        event.preventDefault()

        document.getElementById("feedbackForm").style.display = "none"
        document.getElementById("feedback-thanks").style.display = "block"
    }
}

/* JS for list of Restaurant*/
function address(searchAddress)
{
    document.getElementById('inputtaker').innerHTML=searchAddress;
    document.getElementById('inputForAddress').innerHTML=searchAddress;
}

const restaurants = [
    {
        name: "Restaurant 1",
        rating: 7.2,
        distance: "within 5 km - 6 km",
        deliveryPrice: 6,
        image: "resources/css/image/restaurant1.png"
    },
    {
        name: "Restaurant 2",
        rating: 5.2,
        distance: "within 7 km - 8 km",
        deliveryPrice: 10,
        image: "resources/css/image/restaurant2.png"
    },
    {
        name: "Restaurant 3",
        rating: 8.2,
        distance: "within 2 km - 3 km",
        deliveryPrice: 0,
        image: "resources/css/image/restaurant3.png"
    }
]

function displayRestaurantList() {
    const restaurantList = document.getElementById("listOfRestaurant")
    const restaurantDivs = Array.from(restaurantList.getElementsByClassName("localRestaurant"))

    var restaurantDiv = restaurantDivs[0]

    // Remove all restaurants
    for(restaurant of restaurantDivs) {
        restaurantList.removeChild(restaurant)
    }

    // Add the correct restaurants
    for(const restaurant of restaurants) {
        const image = restaurantDiv.getElementsByClassName("restaurantImage")[0]
        image.src = restaurant.image

        const nameDiv = restaurantDiv.getElementsByClassName("restaurantName")[0]
        nameDiv.textContent = restaurant.name

        const reviewDiv = restaurantDiv.getElementsByClassName("restaurantReview")[0]
        reviewDiv.innerHTML = `${restaurant.rating}<i class="fa fa-star" aria-hidden="true" style="color: darkorange; margin-left: 5px"></i>`

        const deliveryInfoDiv = restaurantDiv.getElementsByClassName("sub1-thirdBox")[0]
        const deliveryString = restaurant.deliveryPrice == 0 ? "Free" : `$${restaurant.deliveryPrice} per`
        deliveryInfoDiv.innerHTML = `<p> ${restaurant.distance} <br><br> ${deliveryString} delivery</p>`

        const menuButton = restaurantDiv.getElementsByClassName("button")[0]
        menuButton.onclick = function() {
            document.getElementById("restaurantTitle").textContent = restaurant.name
            showPage("Menu")
        }

        restaurantList.appendChild(restaurantDiv)

        restaurantDiv = restaurantDiv.cloneNode(true)
    }
}



// JS for the chat box 
function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
    document.getElementById('changer').innerHTML = "Let us know what's troubling you?"
    document.getElementById("chat-message-area").value=""
    document.getElementById("chat-message-area").style.display = "block"
    document.getElementById("chat-message-area-label").style.display = "block"
    document.getElementById("chat-send-button").style.display = "block"
}

function sendForm()
{
    var message = document.getElementById("chat-message-area");
    var sending = document.getElementById("chat-send-button");
    if(message.value ==="" )
        {
            sending.style.display="block";
        }
    else
        {
            sending.style.display="none";
            message.style.display="none"
            document.getElementById("chat-message-area-label").style.display = "none"
            document.getElementById('changer').innerHTML = "We will get back to you soon!"
        }
}



/* JS for menu/carts */

// List of the top bar items (specials, combos, etc.)
// ONLY THREE ARE SUPPORTED CURRENTLY
const topBarItems = [
    {
        name: "Three Meat Special",
        description: "Deal includes: Dutch Style Beef Tartare, Pork and Porridge, Christmas Rabbit. Your choice of one of three desserts and a bottle of wine or 4 beers.",
        price: 25,
        quantity: 1,
        image: "resources/css/image/food-img1.jpg",
    },
    {
        name: "Burger Combo",
        description: "Brisket & chuck patty (cooked medium, no exceptions), old cheddar, melted onions, dill pickle aioli, Martin&#39;s potato roll.",
        price: 25,
        quantity: 1,
        image: "resources/css/image/food-img2.jpg",
    },
    {
        name: "Chicken Combo",
        description: "Tossed in your choice of 101 sauces accompanied by a 1/2 rack of fall-off-the-bone baby back ribs smothered in BBQ sauce. Served with our signature seasoned fries.",
        price: 25,
        quantity: 1,
        image: "resources/css/image/food-img3.jpg",
    }
]

// List of categories, each of which contains the category name, and a list of items
const menu = [
    {
        name: "Chicken",
        items: [
            {
                name: "Chicken Cordon Bleu",
                description: "Chicken breast stuffed with imported Swiss cheese and ham, breaded and baked; served in our famous alfredo sauce.",
                price: 20,
                likes: 123,
                quantity: 1,
                image: "resources/css/image/fancy-chicken.jpg",
            },
            {
                name: "Chicken Tenders",
                description: "Five succulent all- white chicken tenders. Served with plum sauce and our signature seasoned fries.",
                price: 8,
                likes: 64,
                quantity: 1,
                image: "resources/css/image/normal-chicken.jpg",
            }
        ]
    },
    {
        name: "Sandwiches",
        items: [
            {
                name: "Classic Wild",
                description: "A breaded all-white seasoned chicken breast fillet fried to a crispy golden brown, topped with our Ultimate BBQ sauce, romaine lettuce, plum tomatoes and ranch dressing on a garlic buttered ACE Bakery&reg; burger bun. Served with our signature seasoned fries",
                price: 10,
                likes: 97,
                quantity: 1,
                image: "resources/css/image/Crispy_Chicken_Sandwich.jpg",
            },
            {
                name: "Club Sandwich",
                description: "Grilled chicken breast, crispy bacon, plum tomatoes, romaine lettuce, cheddar cheese and our Signature Gar Par&trade; sauce on a garlic buttered ACE Bakery&reg; burger bun. Served with our signature seasoned fries",
                price: 12,
                likes: 89,
                quantity: 1,
                image: "resources/css/image/Grilled-Ham-Cheese-and-Tomato.jpg",
            },
        ]
    }
]

function displayCategories() {
    const categoryElements = Array.from(document.getElementsByClassName("category"))
    const categoriesParent = categoryElements[0].parentNode
    for (element of categoryElements) {
        categoriesParent.removeChild(element)
    }

    var categoryElement = categoryElements[0]
    categoryElement.classList.remove("active")

    for(category of menu) {
        const link = categoryElement.getElementsByTagName("a")[0]
        const name = category.name
        link.onclick = function(event) {
            // Prevent scrolling to the top of the page
            event.preventDefault()

            selectCategory(name)
        }
        link.textContent = category.name
        link.setAttribute("selected", "false")

        categoriesParent.appendChild(categoryElement)
        categoryElement = categoryElement.cloneNode(true)
    }
}

function selectCategory(name) {
    var selectedCategory = null
    for(category of menu) {
        if(category.name === name) {
            selectedCategory = category
            break
        }
    }

    if(!selectedCategory) swal(`BUG! TRIED TO SELECT NONEXISTENT CATEGORY "${name}"`)

    const categoryElements = document.getElementsByClassName("category")
    for(categoryElement of categoryElements) {
        const link = categoryElement.getElementsByTagName("a")[0]
        if(link.textContent === name) {
            categoryElement.classList.add("active")
            link.setAttribute("selected", "true")
            displayFoodItems(selectedCategory.items)
        } else {
            categoryElement.classList.remove("active")
            link.setAttribute("selected", "false")
        }
    }
}

// Takes in a string quantity that the user entered.
// If the quantity is valid (i.e. it's a non-negative int), returns the integer value.
// If it's invalid, returns null.
function validateQuantity(qty) {
    // Remove whitespace and change to lowercase, to simplify checks
    const processed = qty.trim().toLowerCase()

    // The Number() constructor used below accepts hex numbers and decimals. We disallow them here:
    if(processed.includes("x") || processed.includes(".")) return null;

    // Parse the string into a number
    const parsed = Number(processed)

    // Make sure the parse succeeded, that the number is non-negative, and that it fits the given space
    if(Number.isNaN(parsed) || parsed < 0 || parsed > 99) {
        return null
    } else {
        return parsed
    }
}

function handleNewQuantityGeneral(target, item) {
    const newValue = validateQuantity(target.value)
    if(newValue != null) {
        item.quantity = newValue
    } else {
        target.style.color = "red"
        setTimeout(function() {
            target.style.color = "black"
        }, 100)
    }
    target.value = item.quantity
}

// Takes in an item. If the new quantity is valid, replace the old quantity
// Otherwise, maintain the old quantity. Also, handle disabling and re-enabling
// of the quantity +/- buttons
function handleNewQuantity(target, item, qtyButtons, addToCartButton) {
    handleNewQuantityGeneral(target, item)
    qtyButtons[0].disabled = (item.quantity === 99)
    qtyButtons[1].disabled = (item.quantity === 0)
    // Hack to disable a link
    if(item.quantity === 0) {
        addToCartButton.removeAttribute("href")
    } else {
        addToCartButton.href = "#"
    }
}


function displayTopBar() {
    for(let i = 0; i < 3; i++) {
        const comboBox = document.getElementsByClassName(`comboBox${i+1}`)[0]
        const item = topBarItems[i]

        const nameElement = comboBox.getElementsByClassName(`comboBox${i+1}-itemName`)[0]
        nameElement.textContent = item.name

        const priceElement = comboBox.getElementsByClassName(`comboBox${i+1}-itemPrice`)[0]
        priceElement.textContent = `$${item.price}`

        const descElement = comboBox.getElementsByClassName(`comboBox${i+1}-Description`)[0].getElementsByTagName("p")[0]
        descElement.innerHTML = item.description

        const imageElement = comboBox.getElementsByClassName("foodImage")[0]
        imageElement.src = item.image

        setupInteractivityForFoodItem(comboBox, topBarItems[i])
    }
}

// Sets up the input validation of the quantity interface on an item,
// as well as the behaviour of the "add to cart" button.
// This function is used for the top bar items and the main food items.
function setupInteractivityForFoodItem(element, item) {
    const qtyButtons = element.getElementsByClassName("plusMinusButton")

    const addToCartButton = element.querySelector("[name='addbutton']")

    const qty = element.getElementsByClassName("ItemQty")[0]
    qty.value = item.quantity
    function handleQuantity() {
        handleNewQuantity(qty, item, qtyButtons, addToCartButton)
    }
    qty.addEventListener("input", handleQuantity)

    qtyButtons[0].addEventListener("click", function() {
        qty.value++
        handleQuantity()
    })
    qtyButtons[1].addEventListener("click", function() {
        qty.value--
        handleQuantity()
    })

    function onFocus(event) {
        event.target.select()
    }
    qty.addEventListener("focus", onFocus)
    qty.addEventListener("click", onFocus)

    const dropdownContent = element.getElementsByClassName("dropdown-content")[0]

    function addToCart(cartIndex) {
        customizeItem(cloneObject(item), cartIndex)

        // After adding item, reset quantity to 1 to prevent
        // user from accidentally adding a bunch of items when
        // they meant to add one
        qty.value = "1"
        handleNewQuantity(qty, item, qtyButtons, addToCartButton)
    }

    addToCartButton.onclick = function(event) {
        event.preventDefault()

        // If quantity is 0 or there are multiple carts, do not add to 0th cart
        if(item.quantity === 0 || carts.length > 1) return

        addToCart(0)
    }
    addToCartButton.onmouseenter = function() {
        // Remove all cart links
        dropdownContent.textContent = ""

        // If the quantity is zero, don't show the dropdown

        // If there's only one cart or the quantity is zero, don't show the dropdown
        if(carts.length == 1 || item.quantity == 0) return

        // Add the current cart links
        for(let cartIndex = 0; cartIndex < carts.length; cartIndex++) {
            const button = document.createElement("a")
            button.textContent = `Cart ${cartIndex+1}`
            button.href = "#"
            button.onclick = function(event) {
                event.preventDefault()
                addToCart(cartIndex)
            }
            dropdownContent.appendChild(button)
        }
    }
}

function displayFoodItems(items) {
    const foodElements = Array.from(document.getElementsByClassName("Item"))
    const foodParent = foodElements[0].parentNode
    for (element of foodElements) {
        foodParent.removeChild(element)
    }

    for(const item of items) {
        const foodElement = foodElements[0].cloneNode(true)

        const nameElement = foodElement.getElementsByClassName("Item-Name")[0]
        nameElement.textContent = item.name

        const priceElement = foodElement.getElementsByClassName("Item-Price")[0]
        priceElement.textContent = `$${item.price}`

        const descriptionElement = foodElement.getElementsByClassName("Item-Information")[0]
        descriptionElement.innerHTML = item.description

        const likesElement = foodElement.getElementsByClassName("Item-Review")[0].getElementsByTagName("span")[0]
        likesElement.textContent = `${item.likes} likes`

        const imageElement = foodElement.getElementsByClassName("foodImage")[0]
        imageElement.src = item.image

        setupInteractivityForFoodItem(foodElement, item)

        foodParent.appendChild(foodElement)
    }
}


/* Begin code for carts, adding items */
var carts = []

// This is a terrible hack. But it works.
function cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj))
}

function initializeCarts() {
    const cartElems = Array.from(document.getElementsByClassName("Cart"))
    for(let i = 1; i < cartElems.length; i++) cartElems[i].remove()

    createCart()
}

function createCart() {
    const index = carts.length
    const newCart = {
        items: [],
        total: 0.0,
    }
    carts.push(newCart)

    const cartsContainer = document.getElementsByClassName("Carts")[0]
    const cartElems = cartsContainer.getElementsByClassName("Cart")
    if(index !== 0) {
        const cartElem = cartElems[0].cloneNode(true)
        const purchaseButton = cartsContainer.getElementsByClassName("btn-purchase")[0]
        cartsContainer.insertBefore(cartElem, purchaseButton)
    }

    displayCarts()
}

function deleteCart(cartIndex) {
    carts.splice(cartIndex, 1)
    document.getElementsByClassName("Cart")[cartIndex].remove()

    displayCarts()
}

function handleDeleteCart(cartIndex) {
    swal({
        title: "Are you sure?",
        text: `Delete cart ${cartIndex+1}?`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then((remove) => {
        if(remove) {
            deleteCart(cartIndex)
        }
    })
}

function matchItems(a, b, customization) {
    return a.name === b.name && a.spiciness === customization.spiciness && a.specialInstructions === customization.specialInstructions
}

function addFoodItem(item, customizations, cartIndex) {
    const cart = carts[cartIndex]
    for(const customization of customizations) {
        const existingItem = cart.items.find(element => matchItems(element, item, customization))
        let itemAdded;
        if(typeof existingItem !== 'undefined') {
            if(existingItem.quantity < 99) {
                existingItem.quantity += 1
                itemAdded = true
            } else {
                itemAdded = false
            }
        } else {
            const clonedItem = cloneObject(item)
            clonedItem.quantity = 1
            clonedItem.spiciness = customization.spiciness
            clonedItem.specialInstructions = customization.specialInstructions.trim()
            cart.items.push(clonedItem)
            itemAdded = true
        }
        if(itemAdded) {
            cart.total += item.price
        }
    }
    console.assert(item.quantity === customizations.length)

    displayCart(cartIndex)
}

function removeFoodItem(item, cartIndex) {
    const cart = carts[cartIndex]
    const itemIndex = cart.items.findIndex(element => matchItems(element, item, item))
    if(itemIndex !== -1) {
        const item_ = cart.items[itemIndex]
        cart.total -= item_.quantity * item_.price
        cart.items.splice(itemIndex, 1)
    } else {
        swal("BUG! Failed to find item")
    }

    displayCart(cartIndex)
}

function handleRemoveItem(item, cartIndex) {
    const s = item.quantity > 1 ? "s" : ""
    swal({
        title: "Are you sure?",
        text: `Remove ${item.quantity} "${item.name}"${s} from cart ${cartIndex+1}?`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then((remove) => {
        if(remove) {
            removeFoodItem(item, cartIndex)
        }
    })
}

function displayCarts() {
    const addToCartButtons = document.querySelectorAll("[name=addbutton]")
    const nohover = carts.length > 1
    for(button of addToCartButtons) {
        button.setAttribute("nohover", nohover)
    }

    const purchaseButton = document.getElementsByClassName("btn-purchase")[0]
    purchaseButton.onclick = function() {
        // Validate carts
        let emptyCarts = 0
        for(const cart of carts) {
            if(cart.total === 0) emptyCarts++
        }

        if(emptyCarts > 0) {
            let title;
            if(emptyCarts > 1) {
                title = `${emptyCarts} empty carts`
            } else {
                title = "Empty cart"
            }
            const suggestion = carts.length > 1 ? "make sure every cart has at least one item" : "add add at least one item to your cart"
            swal({
                title: title,
                text: `Please ${suggestion} to continue`,
                icon: "error",
                buttons: {
                    confirm: true,
                    cancel: false,
                },
            })
        } else {
            if(loginState === "none") {
                showPage("signUp", true)
            } else {
                showPage("paymentPage")
            }
        }
    }

    for(let i = 0; i < carts.length; i++) displayCart(i)
}

function displayCart(cartIndex) {
    const cart = carts[cartIndex]
    const cartElem = document.getElementsByClassName("Cart")[cartIndex]

    const cartTitle = cartElem.getElementsByClassName("Cart-Title")[0]
    cartTitle.textContent = `Cart ${cartIndex+1}`

    const plusMinusButtons = cartElem.getElementsByClassName("plusMinusButton")
    const deleteCartButton = plusMinusButtons[0]
    deleteCartButton.disabled = carts.length === 1
    deleteCartButton.onclick = function() {
        handleDeleteCart(cartIndex)
    }
    const newCartButton = plusMinusButtons[1]
    newCartButton.style.display = cartIndex === 0 ? "block" : "none"
    newCartButton.onclick = function() {
        createCart()
    }

    const cartItems = cartElem.getElementsByClassName("cart-items")[0]
    const cartNoItems = cartElem.getElementsByClassName("cart-noitems")[0]
    const cartColumnNames = cartElem.getElementsByClassName("cart-column-names")[0]

    const totalElem = cartElem.getElementsByClassName("cart-total-price")[0]
    totalElem.textContent = `$${cart.total}`

    if(cart.items.length === 0) {
        cartNoItems.style.display = "block"

        cartColumnNames.style.display = "none"
        cartItems.style.display = "none"
    } else {
        cartItems.style.display = "block"
        cartColumnNames.style.display = "flex"

        cartNoItems.style.display = "none"

        const itemElemArray = Array.from(cartItems.getElementsByClassName("cart-food-item"))

        let template = itemElemArray[0].cloneNode(true)
        for(elem of itemElemArray) {
            cartItems.removeChild(elem)
        }

        for(const item of cart.items) {
            const titleElem = template.getElementsByClassName("cart-item-title")[0]
            titleElem.textContent = item.name

            const priceElem = template.getElementsByClassName("cart-price")[0]
            priceElem.textContent = `$${item.price}`

            const quantityElem = template.getElementsByClassName("cart-quantity-input")[0]
            quantityElem.value = item.quantity

            function updateTotal(diff) {
                cart.total += diff * item.price
                if(cart.total < 0) {
                    cart.total = 0
                }
                totalElem.textContent = `$${cart.total}`
            }

            quantityElem.oninput = function(event) {
                const oldQuantity = item.quantity
                handleNewQuantityGeneral(quantityElem, item)
                if(item.quantity === 0) {
                    // Don't prompt the user to remove the item if all they want to do is
                    // change the quantity
                    if(event.inputType !== "deleteContentBackward" || oldQuantity == 0) {
                        const quantity = oldQuantity === 0 ? 1 : oldQuantity
                        item.quantity = quantity
                        quantityElem.value = quantity
                        handleRemoveItem(item, cartIndex)
                    }
                }
                updateTotal(quantityElem.value - oldQuantity)
            }
            quantityElem.onkeydown = function(event) {
                const rejectedKeys = [
                    ".", "e", "-", "+", 
                ]
                return !rejectedKeys.includes(event.key)
            }
            quantityElem.onchange = function() {
                if(quantityElem.value === "0") {
                    item.quantity = 1
                    quantityElem.value = 1
                    updateTotal(item.quantity)
                    handleRemoveItem(item, cartIndex)
                }
            }

            const imageElem = template.getElementsByClassName("cart-item-image")[0]
            imageElem.src = item.image

            const removeButton = template.getElementsByClassName("btn-danger")[0]
            removeButton.onclick = function() {
                handleRemoveItem(item, cartIndex)
            }

            displayCustomization(template, item)

            cartItems.appendChild(template)
            template = template.cloneNode(true)
        }
    }
}


// Begin JS for item customization
function customizeItem(item, cartIndex) {
    const customizeModal = document.getElementById("customize-modal")
    customizeModal.style.display = "block"

    window.onmousedown = function(event) {
        if(event.target == customizeModal) {
            customizeModal.style.display = "none"
        }
    }

    const heading = customizeModal.getElementsByClassName("customize-item-heading")[0].firstElementChild
    heading.textContent = `Item: ${item.name}`

    const qty = customizeModal.getElementsByClassName("customize-item-qty")[0].firstElementChild
    qty.textContent = `QTY: ${item.quantity}`

    const price = customizeModal.getElementsByClassName("customize-item-price")[0].firstElementChild
    price.textContent = `Price: $${item.price}`

    const container = customizeModal.getElementsByClassName("customize-asperqty")[0]
    container.scrollTop = 0

    const qtys = Array.from(container.getElementsByClassName("customize-as-qty-box"))
    for(let i = 0; i < qtys.length; i++) {
        qtys[i].remove()
    }

    let customizeControls = qtys[0]

    const addAndCancelButtons = container.getElementsByClassName("customize-box-button")[0]

    function submit() {
        const qtys = container.getElementsByClassName("customize-as-qty-box")
        const customizations = []
        for(const qty of qtys) {
            const spicinesses = ["less", "medium", "more"]
            let spiciness = -1
            for(let i = 0; i < 3; i++) {
                if(qty.querySelector(`[name=taste][value=${spicinesses[i]}]`).checked) {
                    spiciness = i
                }
            }

            const specialInstructions = qty.getElementsByClassName("special-instruction")[0]
            customizations.push({
                spiciness: spiciness,
                specialInstructions: specialInstructions.value
            })
        }
        addFoodItem(item, customizations, cartIndex)
        customizeModal.style.display = "none"
    }

    const addButton = addAndCancelButtons.getElementsByClassName("customize-add-button")[0]
    addButton.onclick = submit

    const cancelButton = addAndCancelButtons.getElementsByClassName("customize-cancel-button")[0]
    cancelButton.onclick = function() {
        customizeModal.style.display = "none"
    }

    const firstQtyBoxHeading = customizeControls.getElementsByClassName("customize-as-qty-box-heading")[0]
    if(item.quantity === 1) {
        firstQtyBoxHeading.style.display = "none"
    } else {
        firstQtyBoxHeading.style.display = "block"
    }
    for(let i = 0; i < item.quantity; i++) {
        const qtyBoxHeading = customizeControls.getElementsByClassName("customize-as-qty-box-heading")[0]
        qtyBoxHeading.textContent = `For QTY: ${i+1}`

        const mediumSpicy = customizeControls.querySelector("[name=taste][value=medium]")
        mediumSpicy.checked = true

        const specialInstructions = customizeControls.getElementsByClassName("special-instruction")[0]
        specialInstructions.value = ""

        const form = customizeControls.getElementsByClassName("customize-form")[0]
        form.onsubmit = function(event) {
            event.preventDefault()
            submit()
        }

        container.insertBefore(customizeControls, addAndCancelButtons)
        customizeControls = customizeControls.cloneNode(true)
    }
}

function displayCustomization(container, item) {
    const spiciness = container.getElementsByClassName("cart-item-spiciness")[0]
    const spicinesses = ["Less", "", "Extra"]
    spiciness.textContent = `${spicinesses[item.spiciness]} spicy`
    spiciness.style.display = item.spiciness === 1 ? "none" : "block"

    const specialInstructions = container.getElementsByClassName("cart-item-special-instructions")[0]
    const specialInstructionsText = item.specialInstructions.trim()
    if(specialInstructionsText !== "") {
        specialInstructions.textContent = "Special instructions: "
        const specialInstructionsContainer = document.createElement("i")
        specialInstructionsContainer.textContent = specialInstructionsText
        specialInstructions.appendChild(specialInstructionsContainer)
        specialInstructions.style.display = "block"
    } else {
        specialInstructions.style.display = "none"
    }
}

/* JS for payment page */
function validateTextInput(input, validator) {
    input.addEventListener("input", function(event) {
        input.setCustomValidity(validator(input.value))
    })
    input.setCustomValidity(validator(input.value))
}
var unpaidCarts = []
function displayPaymentPage() {
    if(loginState === "none") {
        swal({
            title: "Logout detected",
            text: `Please log back in to continue`,
            icon: "warning",
            buttons: {
                confirm: true,
            },
            closeOnClickOutside: false
        })
        .then(() => {
            showPage("signUp", true)
        })
    }

    if(unpaidCarts.length === 0) {
        for(let i = 0; i < carts.length; i++) {
            unpaidCarts.push(i)
        }
    }

    const paymentPage = document.getElementById("paymentPage")
    const deliveryAddrForm = document.getElementById("delivery-address-form")
    function validateName(element) {
        validateTextInput(element, function(input) {
            const val = input.trim()
            if(val === "") {
                return "Name can't be blank"
            } else if((val.split(" ").length - 1) < 1) {
                return "Please enter a last name and surname, e.g. \"Zeel Khokhariya\""
            } else {
                return ""
            }
        })
    }
    validateName(document.getElementById("fname"))

    const deliveryAddrInputs = document.getElementById("delivery-addr-inputs")
    function updateSameAsPreviousOrderCheckbox(val) {
        for(const id of ["fname", "email", "adr", "city", "province", "postal"]) {
            document.getElementById(id).disabled = val
        }
        deliveryAddrInputs.style.display = val ? "none" : "block"
    }

    const sameAdr = deliveryAddrForm.querySelector("[name=sameadr]")
    const sameAdrExplanation = document.getElementById("sameadr-explanation")
    sameAdrExplanation.textContent = "Delivery address same as previous order"
    if(loginState === "guest") {
        sameAdr.disabled = true
        sameAdr.checked = false
        sameAdrExplanation.textContent = sameAdrExplanation.textContent.concat(" (disabled for guest orders)")
    } else {
        sameAdr.disabled = false
    }
    sameAdr.addEventListener("input", function() {
        updateSameAsPreviousOrderCheckbox(sameAdr.checked)
    })
    updateSameAsPreviousOrderCheckbox(sameAdr.checked)

    const rows = Array.from(paymentPage.getElementsByClassName("payment-cart"))

    for(const row of rows) {
        row.remove()
    }

    let template = rows[0].cloneNode(true)
    for(let cartIndex = 0; cartIndex < carts.length; cartIndex++) {
        const cart = carts[cartIndex]
        const unpaid = unpaidCarts.includes(cartIndex)

        const paymentForm = template.getElementsByClassName("payment-form")[0]
        paymentForm.style.display = unpaid ? "block" : "none"
        
        const cardName = template.querySelector("[name=cardname]")
        validateName(cardName)

        const cardNumber = template.querySelector("[name=cardnumber]")
        validateTextInput(cardNumber, function(input) {
            return /^(\s)*([0-9](\s)*){4}[-](\s)*([0-9](\s)*){4}[-](\s)*([0-9](\s)*){4}[-](\s)*([0-9](\s)*){4}$/.test(input) ? "" : "Please enter a valid credit card, in the form 1111-2222-3333-4444"
        })

        const expMonth = template.querySelector("[name=expmonth]")
        const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]
        validateTextInput(expMonth, function(input) {
            const val = input.trim().toLowerCase()
            return months.includes(val) ? "" : "Please enter a valid month, e.g. \"December\""
        })

        const expYear = template.querySelector("[name=expyear]")
        validateTextInput(expYear, function(input) {
            const error = "Please enter a year greater than or equal to 2020"
            const val = input.trim().toLowerCase()
            // The Number() constructor used below accepts hex numbers and decimals. We disallow them here:
            if(val.includes("x") || val.includes(".")) return error

            // Parse the string into a number
            const parsed = Number(val)

            // Make sure the parse succeeded, that the number is non-negative, and that it fits the given space
            if(Number.isNaN(parsed) || parsed < 2020) {
                return error
            } else {
                return ""
            }
        })

        const cvv = template.querySelector("[name=cvv]")
        validateTextInput(cvv, function(input) {
            return /^(\s)*([0-9](\s)*){3}$/.test(input) ? "" : "Please enter your 3-digit CVV"
        })

        const paymentSuccessful = template.getElementsByClassName("payment-successful")[0]
        paymentSuccessful.style.display = unpaid ? "none" : "block"
        paymentForm.onsubmit = function(event) {
            event.preventDefault()
            if(unpaidCarts.length === 1 && !deliveryAddrForm.reportValidity()) {
                return
            }

            const index = unpaidCarts.indexOf(cartIndex)
            unpaidCarts.splice(index, 1)
            paymentForm.style.display = "none"
            paymentSuccessful.style.display = "block"
            if(unpaidCarts.length === 0) {
                showPage("donePage")
            }
        }

        const cartColumn = template.getElementsByClassName("payment-col-25")[0]
        
        const payItemName = cartColumn.getElementsByClassName("pay-item-name")[0]
        payItemName.textContent = `Cart ${cartIndex+1}`

        const numItems = cartColumn.getElementsByClassName("payment-number-of-items")[0]
        numItems.textContent = cart.items.length

        const total = cartColumn.getElementsByClassName("total-price")[0]
        total.textContent = `$${cart.total}`

        const itemList = cartColumn.getElementsByClassName("pay-item-list")[0]
        
        const items = Array.from(itemList.getElementsByClassName("pay-item-individual"))
        let templateItem = items[0].cloneNode(true)

        for(const item of items) {
            item.remove()
        }

        for(let itemIndex = 0; itemIndex < cart.items.length; itemIndex++) {
            const item = cart.items[itemIndex]

            const name = templateItem.getElementsByClassName("pay-item-name")[0]
            name.innerHTML = `${item.name} &times; <i>${item.quantity}</i>`

            const price = templateItem.getElementsByClassName("price")[0]
            price.textContent = `$${item.price * item.quantity}`

            displayCustomization(templateItem, item)

            itemList.appendChild(templateItem)
            templateItem = templateItem.cloneNode(true)
        }

        paymentPage.appendChild(template)
        template = template.cloneNode(true)
    }
}

// JS for login state/page

// "none" | "guest" | "loggedIn"
var loginState = "none"

function displayLoginPage(showPaymentPage) {
    const loginPage = document.getElementById("loginPage")
    const loggedInPage = document.getElementById("loggedin-page")

    document.getElementById("username").value = ""
    document.getElementById("password").value = ""

    function transitionToState(newState) {
        loginState = newState
        if(showPaymentPage) showPage("paymentPage");
        displayLoginPage(false)
    }

    const loginForm = document.getElementById("loginForm")
    loginForm.onsubmit = function(event) {
        event.preventDefault()
        transitionToState("loggedIn")
    }
   
    const guestButton = document.getElementById("guest")
    guestButton.onclick = function() {
        transitionToState("guest")
    }

    const loggedinMessage = document.getElementById("loggedin-message")
    const loggedinLogoutLink = document.getElementById("loggedin-logout-link")
    if(loginState === "guest") {
        loggedinLogoutLink.textContent = "Log in with account"
        loggedinMessage.textContent = "You are logged in as a guest"
    } else {
        loggedinLogoutLink.textContent = "Log out"
        loggedinMessage.textContent = "You are logged in"
    }
    loggedinLogoutLink.onclick = function() {
        transitionToState("none")
    }

    const loggedIn = loginState !== "none"
    loginPage.style.display = loggedIn ? "none" : "block"
    loggedInPage.style.display = loggedIn ? "block" : "none"
}