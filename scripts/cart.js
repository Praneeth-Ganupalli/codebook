import { showToastMessage, loadGlobalHeaderFooter, initializeSearch } from "./utilities/helpers.js";
import { isAuthorized } from "./utilities/auth.js";
import { saveUserCart,createStripeSession } from "./utilities/services.js";
import { LOGIN_PATH, STRIPE_PUBLIC_KEY } from "./utilities/constants.js";
const cartCountEle = document.getElementById('cart-count');
const emptyCart = document.getElementById('empty-cart');
const userCart = document.getElementById('user-cart');
const cartItemsContainer = document.querySelector("ul.cart-items-container");
export function attachCartEventListeners() {
    document.querySelectorAll(".btn-atc").forEach(ele => {
        ele.addEventListener("click", function () {
            cartClickHandler(ele, 'atc');
        })
    })
    document.querySelectorAll(".btn-rfc").forEach(ele => {
        ele.addEventListener("click", function () {
            cartClickHandler(ele, 'rfc');
        })
    })
}

function cartClickHandler(ele, action) {
    const { id } = ele.dataset;
    const toggleAction = action === 'atc' ? 'rfc' : 'atc';
    const toggleButton = document.getElementById(`${toggleAction}-${id}`);
    const loadingBtn = document.getElementById(`loading-atc-${id}`);
    ele.classList.add("d-none"); // hiding
    loadingBtn.classList.remove('d-none'); //showing
    if (action === 'atc') {
        addToCart(ele.dataset);
    }
    else {
        removeFromCart(id);
    }
    setTimeout(() => {
        loadingBtn.classList.add('d-none') // hiding
        toggleButton.classList.remove('d-none'); //showing
        if (action === 'atc') {
            showToastMessage({
                message: 'Product added to cart',
                variant: 'success'
            })
        }
        else {
            showToastMessage({
                message: 'Product removed from cart',
                variant: 'error'
            })
        }
    }, 1000)
}
export function getCartItems() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}
function updateMiniCart() {
    const cartItems = getCartItems();
    document.getElementById('minicart--count').innerText = cartItems.length;
}
function saveCartToServer(cart)
{
    const token = isAuthorized();
    const userId = JSON.parse(localStorage.getItem("userInfo"))?.userId;
    if(!token || !userId) return;
    saveUserCart(userId,token,cart);
}
function addToCart(productInfo) {
    const { id, name, price, img } = productInfo;
    const newCartItem = {
        productName: name,
        productId: id,
        productPrice: price,
        productImg: img
    }
    const existingCart = getCartItems();
    existingCart.push(newCartItem);
    const modifiedCart = [...existingCart];
    localStorage.setItem('cart', JSON.stringify(modifiedCart));
    updateMiniCart();
    saveCartToServer(modifiedCart);
}

function removeFromCart(id) {
    const existingCart = getCartItems();
    const itemIndex = existingCart.findIndex(product => product.productId === id);
    existingCart.splice(itemIndex, 1);
    const modifiedCart = [...existingCart];
    if (modifiedCart.length === 0) {
        localStorage.removeItem("cart");
    }
    else {
        localStorage.setItem('cart', JSON.stringify(modifiedCart));
    }
    updateMiniCart();
    saveCartToServer(modifiedCart);
}

function removeBtnClickHandler(id){
    removeFromCart(id);
    const cartItems = getCartItems();
    if (cartItems.length > 0) {
        renderCartData(cartItems);
    }
    else {
        showEmptyCart();
    }
    showToastMessage({
        message: 'Product removed from cart',
        variant: 'error'
    })
}
if (window.location.pathname === "/pages/cart.html")
{
    cartItemsContainer.addEventListener("click",function(e){
        if(e.target.classList.contains('btn-remove-cart-item'))
        {
            const productId = e.target.getAttribute("data-productid");
            removeBtnClickHandler(productId);
        }
    })
}
function renderCartData(cartData) {
    userCart.classList.remove('d-none');
    cartItemsContainer.innerHTML='';
    cartCountEle.innerText = cartData.length;
    let cartTotal = 0;
    cartData.forEach((cartItem) => {
        cartTotal = cartTotal + (cartItem.productPrice * 1);
        const cartItemHtml = `<li class="cart-item d-flex" id="cart-item-${cartItem.productId}"> 
                        <img class="cart-item-img" src="${cartItem.productImg}" alt="${cartItem.productName}">
                        <div class="cart-item-info">
                            <h4 class="cart-item-title">${cartItem.productName}</h4>
                            <button class="btn btn-link btn-remove-cart-item text-decoration-none text-danger p-0" data-productid=${cartItem.productId}>Remove</button>
                        </div>
                        <div class="cart-item-price ms-auto">$${cartItem.productPrice}</div>
                    </li>
                     <hr class="divider">
                    `
        cartItemsContainer.innerHTML += cartItemHtml;
    })
    cartItemsContainer.innerHTML += `<li class="cart-item">
                        <div class="cart-total-info d-flex justify-content-between">
                            <p><strong>Total Amount</strong></p>
                            <p id="cart-total-amt">$${cartTotal}</p>
                        </div>
                        <hr class="divider">
                    </li>`
}
function showEmptyCart() {
    emptyCart.classList.remove('d-none');
    cartItemsContainer.innerHTML='';
    userCart.classList.add('d-none');
}

async function handlePlaceOrder(){
    try{
        this.innerText = "Processing..";
        this.disabled= true;
        const stripe = Stripe(STRIPE_PUBLIC_KEY);
        const cartItems = getCartItems();
        const sessionId = await createStripeSession(cartItems);
        
        stripe.redirectToCheckout({sessionId:sessionId});
    }
    catch(e)
    {
        showToastMessage({
            message:e.message,
            variant:'error'
        })
    }
    finally{
        this.innerText = "Placeorder";
        this.disabled= false;
    }
}

(function init() {
    if (window.location.pathname === "/pages/cart.html") {
        /// cart page
        const placeOrderBtn = document.getElementById('placeOrderBtn');
        const loginToCheckoutBtn = document.getElementById("loginToCheckoutBtn");
        loadGlobalHeaderFooter();
        initializeSearch(true);
        const cartItems = getCartItems();
        if (cartItems.length > 0) {
            renderCartData(cartItems);
        }
        else {
            showEmptyCart();
        }
        const isLoggedIn = isAuthorized();
        if(isLoggedIn)
        {
            loginToCheckoutBtn.classList.add('d-none');
            placeOrderBtn.addEventListener('click',handlePlaceOrder);
        }
        else{
            placeOrderBtn.classList.add('d-none');
            loginToCheckoutBtn.addEventListener('click',function(){
                window.location.href = `/${LOGIN_PATH}?redirectTo=cart`;
            })
        }
    }
})();

