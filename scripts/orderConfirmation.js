import { getCartItems } from "./cart.js";
import { isAuthorized } from "./utilities/auth.js";
import { loadGlobalHeaderFooter, initializeSearch } from "./utilities/helpers.js";
import { saveOrderToUserAccount, saveUserCart } from "./utilities/services.js";
const loadingContainer = document.querySelector('.loading-container');
const orderConfirmationEle = document.querySelector('.codebook-order-confirmation');
const orderFailureEle = document.querySelector('.codebook-order-failure');
async function handlePostPaymentSteps(orderId) {
    try {
        loadingContainer.classList.remove('d-none'); // showing the loader
        const cartItems = getCartItems();
        const token = isAuthorized();
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const orderInfo = {
            orderId: orderId,
            orderTotal: cartItems.reduce((acc, cur) => {
                return acc + Number(cur.productPrice)
            }, 0),
            orderItems: cartItems
        }
        await saveUserCart(userInfo.userId, token, null);
        await saveOrderToUserAccount(userInfo.userId, orderId, token, orderInfo);
        showConfirmationDetails(orderId);
    }
    catch (e) {
        console.log("Order Processing failed",e.message);
        orderFailureEle.classList.remove('d-none'); // showing failed message
    }
    finally {
        loadingContainer.classList.add('d-none'); // removing the loader
        const miniCartCountEle = document.getElementById('minicart--count');
        miniCartCountEle.innerText = 0;
        localStorage.removeItem('cart');
        sessionStorage.removeItem('orderRefId');
    }
}
function showConfirmationDetails(orderRefId) {
    orderConfirmationEle.classList.remove('d-none');
    const userEmailEle = document.getElementById('userEmail');
    const orderIdEle = document.getElementById("orderId");
    const userNameEle = document.getElementById('userName');
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    orderIdEle.innerText = orderRefId;
    userEmailEle.innerText = userInfo.email;
    userNameEle.innerText = userInfo.name;
  
}

function validateOrderRefIdAndPopulateDetails() {
    const orderRefId = new URLSearchParams(window.location.search).get("orderRefId");
    const storedRefId = sessionStorage.getItem("orderRefId");
    if (orderRefId && storedRefId) {
        const isValidRefId = dcodeIO.bcrypt.compareSync(orderRefId, storedRefId);
        if (isValidRefId) {
            handlePostPaymentSteps(orderRefId);

            // sessionStorage.removeItem('orderRefId');
            /// clear the cart on local
            // clear the cart on server
            /// create an order to account
        }
        else {
            // executes if refid are not matching
            console.log("Redirection because of not matching")
            window.location.href = "/"
        }
    }
    else {
        console.log("Redirection because of refid is not there")
        //executes if refid are not present
        window.location.href = "/"
    }
}
(function init() {
    loadGlobalHeaderFooter();
    initializeSearch(true);
    validateOrderRefIdAndPopulateDetails();
})()

