import { isAuthorized } from "./utilities/auth.js";
import { loadGlobalHeaderFooter, initializeSearch } from "./utilities/helpers.js";
import { fetchOrdersFromServer } from "./utilities/services.js";
const loaderElement = document.querySelector('.loading-container');
const ordersListElement = document.getElementById('codebook-orders-list');
async function fetchUserOrders() {
    try {
        loaderElement.classList.remove("d-none");
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = isAuthorized();
        const ordersData = await fetchOrdersFromServer(userInfo.userId, token);
        const ordersList = [];
        for (const key in ordersData) {
            ordersList.push(ordersData[key]);
        }
        renderOrdersDataToUI(ordersList);
    }
    catch (e) {
        ordersListElement.innerText = 'Sorry Unable to fetch your orders';
        ordersListElement.style.color = 'red';
    }
    finally {
        loaderElement.classList.add("d-none");
    }
}
function renderOrdersDataToUI(orderList) {
    if (orderList.length === 0) {
        ordersListElement.innerText = "No Orders found!!!";
    }
    else {
        ordersListElement.innerHTML = '';
        orderList.forEach(order => {
            const orderInfoHTML = `
        <li class="codebook-order-item mb-4">
                <header class="codebook-order-header d-flex justify-content-between">
                    <strong>Order Id: ${order.orderId}</strong>
                    <strong>Total: $${order.orderTotal}</strong>
                </header>
                <ul class="codebook-order-item-products-list ps-0 my-2" type="none">
                    ${order.orderItems.map((orderItem) => {
                return `<li class="codebook-order-item-product-item d-flex gap-2 mb-1">
                        <div class="product-img">
                            <img src="${orderItem.productImg}" alt="${orderItem.productName}">
                        </div>
                        <div class="product-info">
                            <p class="product-title mb-0">${orderItem.productName}</p>
                            <p class="product-price mb-0">$${orderItem.productPrice}</p>
                        </div>
                    </li>`
            })}
                </ul>
            </li>
        `
            ordersListElement.innerHTML += orderInfoHTML;
        })
    }

}

(function init() {
    loadGlobalHeaderFooter();
    initializeSearch(true);
    fetchUserOrders();
})()
