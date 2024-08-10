import { MAX_RATING, PLP_PATH, PDP_PATH, LOGIN_PATH, ORDER_HISTORY_PATH, CART_PATH } from "./constants.js";
import { isAuthorized,clearUserInfo } from "./auth.js";
import { attachCartEventListeners, getCartItems } from "../cart.js";
export function getProductRatings(rating) {
    const filledStars = rating;
    const unfilledStars = MAX_RATING - rating;
    let result = '';
    for (let i = 1; i <= filledStars; i++) {
        result += '<span class="bi bi-star-fill text-warning me-1"></span>'
    }
    for (let i = 1; i <= unfilledStars; i++) {
        result += '<span class="bi bi-star text-warning me-1"></span>'
    }
    return result;
}
function getProductURL(productId) {
    return `/${PDP_PATH}?p=${productId}`
}

export function loadProductsToUI(products, uiContainer) {
    uiContainer.innerHTML = '';
    const cartItems = getCartItems();
    products.forEach((product, index) => {
        const productUrl = getProductURL(product.id);
        const isAddedToCart = cartItems.some(cartItem => (cartItem.productId * 1) === product.id);
        const productCardHTML = `<li class="codebook--book-card">
        <article>
            ${product['best_seller'] ? '<div class="best-seller-tag">Best Seller</div>' : ''}
            <a href="${productUrl}"> <img class="img img-fluid product-img"
                src='${product.poster}'
                alt="${product.name}" /> </a>
            <div class="codebook-book-details p-3">
                <a href="${productUrl}" class='text-black text-decoration-none'><h4 class="product-title">${product.name}</h4></a>
                <p>${product.overview}</p>
                <div class="product-ratings">
                    ${getProductRatings(product.rating)}
                </div>
                <div class="d-flex align-items-center">
                    <span><strong>$${product.price}</strong></span>
                    <button class="btn btn-primary ms-auto btn-atc ${isAddedToCart ? 'd-none' : ''}" id='atc-${product.id}'   data-id='${product.id}'
                     data-name='${product.name}'  data-img='${product.poster}' data-price='${product.price}' ${!product.in_stock && 'disabled'}  >
                        Add to Cart +
                    </button>
                    <button class="btn btn-danger ms-auto ${isAddedToCart ? '' : 'd-none'} btn-rfc" id='rfc-${product.id}'  data-id='${product.id}'>Remove Item</button>
                     <button class="btn btn-primary ms-auto d-none" id='loading-atc-${product.id}'  type="button" disabled>
                        <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        <span role="status">Loading</span>
                    </button>
                </div>
            </div>
        </article>
    </li>`
        uiContainer.innerHTML += productCardHTML;
    });
    attachCartEventListeners();
}

export function loadCopyRightYear(ele) {
    const currentYear = new Date().getFullYear();
    ele.innerText = currentYear;
}

export function initializeSearch(redirect, callbackFn) {
    const searchInputEle = document.getElementById("search-input");
    const searchForm = document.getElementById('search-form');
    const handleSearch = () => {
        const searchText = searchInputEle.value;
        if (!searchText) {
            searchInputEle.focus();
            return;
        }
        if (redirect) {
            location.href = `/${PLP_PATH}?q=${searchText}`;
        }
        else {
            callbackFn(searchText);
        }
    }
    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        handleSearch();
    })
}
window.logoutUser = function () {
    clearUserInfo();
    window.location.href='/index.html';
}
function getLogoUrl() {
    const redirectUrl = window.location.pathname === "/" ? "#" : "/";
    return redirectUrl;
}
function getHeaderContent() {
    const cartCount = getCartItems().length;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return `<nav class="codebook-navigation-bar d-flex align-items-center">
    <a href=${getLogoUrl()} class="text-decoration-none text-black">
        <div class="codebook--logo-container d-flex gap-2">
            <img src="/assets/app-logo.png" alt="codebook" />
            <h3>CodeBook</h3>
        </div>
    </a>
    <div class="codebook-global-search ms-auto">
        <form id="search-form" action="#" class="d-flex gap-2">
            <input type="search" class="form-control" placeholder="Search" id="search-input" />
            <button class="btn btn-primary" id="search-btn" type="submit">
                <span class="bi bi-search codebook--icon"></span>
            </button>
        </form>
    </div>
    <div class="codebook-icons-container ms-auto d-flex align-items-center">
        <div class="codebook-minicart-container">
            <a href='/${CART_PATH}' class='text-black'><span class="bi bi-cart-fill codebook--icon me-2"></span></a>
            <span class="bg-danger text-white" id="minicart--count">${cartCount}</span> 
        </div>
        ${isAuthorized() ? `
            <div class='codebook-user-header-info'>
                <span>Hi ${userInfo.name},</span>
                 <a href='/${ORDER_HISTORY_PATH}' class='text-black text-decoration-none me-2'>Orders</a>
                 <a onclick='logoutUser()' class="btn">Logout</a>
            </div>
            `:
            `<a href='/${LOGIN_PATH}' class='text-black'><span class="bi bi-person-circle codebook--icon me-2"></span></a>`
        }
    </div>
</nav>
<hr class="hr" />`
}
function getFooterContent() {
    return ` <p>©<span id="copyright-year">${new Date().getFullYear()}</span> CodeBook. All Rights Reserved.</p>
    <div class="codebook-contact-icons">
        <i class="bi bi-instagram me-2"></i>
        <i class="bi bi-twitter me-2"></i>
        <i class="bi bi-github"></i>
    </div>`
}
export function loadGlobalHeaderFooter() {
    const globalHeaderEle = document.getElementById("codebook-global-header");
    const globalFooterEle = document.getElementById('codebook-global-footer');
    if (globalHeaderEle !== null) {
        globalHeaderEle.innerHTML = getHeaderContent();
    }
    if (globalFooterEle !== null) {
        globalFooterEle.innerHTML = getFooterContent();
    }
}

export function showToastMessage(toastOptions) {
    const { message, variant, closeCallback = () => { }, duration = 3000 } = toastOptions;
    const toastElement = document.createElement('div');
    toastElement.classList.add('codebook--toast');
    if (variant) {
        toastElement.classList.add(variant);
    }
    toastElement.innerHTML = `<p class='toast-msg'>${message}</p> <div class='toast-close'>&times;</div>`;
    document.body.appendChild(toastElement);
    const closeTimer = setTimeout(() => {
        document.body.removeChild(toastElement);
        closeCallback();
    }, duration);
    toastElement.querySelector('.toast-close').addEventListener('click', () => {
        clearTimeout(closeTimer);
        document.body.removeChild(toastElement);
        closeCallback();
    })

}
