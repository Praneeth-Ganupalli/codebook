import { initializeSearch, loadGlobalHeaderFooter, getProductRatings } from "./utilities/helpers.js";
import { PLP_PATH } from "./utilities/constants.js";
import { fetchProductDetails } from "./utilities/services.js";
import { getCartItems,attachCartEventListeners } from "./cart.js";
const pdpMainELe = document.querySelector("#codebook-pdp-main>section");
const loadingContainer = document.querySelector(".loading-container");
function loadProductDetailsToUI(productInfo) {
    const { name, overview, poster, price, rating, size, in_stock, best_seller, long_description,id } = productInfo;
    const cartItems = getCartItems();
    const isAddedToCart = cartItems.some(cartItem=>(cartItem.productId * 1 ) === id);
    pdpMainELe.innerHTML = `
       <header class='text-center product-title-info'>
            <h1>${name}</h1>
            <p>${overview}</p>
       </header>
       <section class='d-flex product-main-content'>
            <article class='product-img'>
                <img src='${poster}' class='img img-fluid' alt='${name}'>
            </article>
            <article class='product-information'>
                <h4>$${price}</h4>
                <div class='product-ratings'>
                    ${getProductRatings(rating)}
                </div>
                <div class='product-badges'>
                    ${best_seller ? '<span class="badge bg-warning">BEST SELLER</span>' : '<span></span>'}
                    ${in_stock ? '<span class="badge bg-success">In Stock</span>' : '<span class="badge bg-danger">Out of stock</span>'}
                    <span class="badge bg-dark">${size}MB</span>
                </div>
                <div class='product-atc-container'>
                    <button class="btn btn-primary ms-auto btn-atc ${isAddedToCart?'d-none':''}" id='atc-${id}'   data-id='${id}'
                     data-name='${name}'  data-img='${poster}' data-price='${price}' ${!in_stock && 'disabled'} >
                        Add to Cart +
                    </button>
                    <button class="btn btn-danger ms-auto ${isAddedToCart?'':'d-none'} btn-rfc" id='rfc-${id}'  data-id='${id}'>Remove Item</button>
                    <button class="btn btn-primary ms-auto d-none" id='loading-atc-${id}'  type="button" disabled>
                        <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        <span role="status">Loading</span>
                    </button>
                </div>
                <p class='product-description'>
                    ${long_description}
                </p>
            </article>
       </section>
    `
    attachCartEventListeners();
}
async function getProductDetails(productId)
{
    try{
        loadingContainer.classList.remove('d-none');
        const productResponse = await fetchProductDetails(productId);
        document.title = productResponse.name;
        loadProductDetailsToUI(productResponse);
    }
    catch(e)
    {
        pdpMainELe.innerText = 'Sorry Unable fetch product details';
        pdpMainELe.style.color = 'red';
        console.error(e);
    }   
    finally{
       loadingContainer.classList.add('d-none');
    }
}
(function init() {
    const productId = new URLSearchParams(window.location.search).get("p");
    if (productId) {
        loadGlobalHeaderFooter();
        initializeSearch(true);
        getProductDetails(productId);
    }
    else{
        window.location.href = `/${PLP_PATH}`
    }

})()
