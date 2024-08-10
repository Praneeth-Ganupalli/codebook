import { PRODUCTS_LIST_URL, PRODUCTS_BASEURL, CART_URL, STRIPE_CHECKOUT_SESSION_URL, STRIPE_SECRET_KEY,CART_PATH, ORDER_CONFIRMATION_PATH,ORDERS_URL } from "./constants.js";
export async function fetchProductsList() {
    try {
        const data = await makeServerRequest(PRODUCTS_LIST_URL)
        if (data && typeof data === "object") {
            const productsFromResponse = [];
            for (const key in data) {
                productsFromResponse.push(data[key]);
            }
            return productsFromResponse;
        }
        return [];
    }
    catch (e) {
        throw e;
    }
}
export async function fetchProductDetails(productId) {
    try {
        const url = `${PRODUCTS_BASEURL}/${productId}.json`;
        const data = await makeServerRequest(url);
        return data;
    }
    catch (e) {
        throw e;
    }
}
export async function makeServerRequest(url, options = { method: "GET" }) {
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data?.error?.message || 'Something went wrong.');
        }
        return data;
    }
    catch (e) {
        throw e;
    }
}
export async function saveUserCart(userId, token, cart) {
    try {
        const url = `${CART_URL}/${userId}.json?auth=${token}`;
        await makeServerRequest(url, {
            method: 'PUT',
            body: JSON.stringify(cart)
        })
    }
    catch (e) {
        console.log(e.message, "cart saving failed...");
        throw e;
    }
}


export async function saveOrderToUserAccount(userId,orderId,token,orderInfo){
    try{
       const url = `${ORDERS_URL}/${userId}/${orderId}.json?auth=${token}`;
       await makeServerRequest(url,{
        method:"PUT",
        body:JSON.stringify(orderInfo)
       })
    }   
    catch(e)
    {
        console.log(e.message, "Order saving failed");
        throw e;
    }
}


export async function getCartFromServer(userId, token) {
    try {
        const url = `${CART_URL}/${userId}.json?auth=${token}`;
        const response = await makeServerRequest(url, {
            method: "GET"
        });
        return response;
    }
    catch (e) {
        throw e;
    }
}
export async function createStripeSession(cartItems) {
    const formattedLineItems = cartItems.map((cartItem,index)=>{
        return {
            [`line_items[${index}][price_data[currency]]`]: "usd",
            [`line_items[${index}][price_data[product_data[name]]]`]: cartItem.productName,
            [`line_items[${index}][price_data[product_data[description]]]`]: `For Learning you can use ${cartItem.productName}`,
            [`line_items[${index}][price_data[product_data[images[0]]]]`]: cartItem.productImg,
            [`line_items[${index}][price_data[unit_amount]]`]: (cartItem.productPrice * 1) * 100,
            [`line_items[${index}][quantity]`]: 1,
        }
    }).reduce((acc,cur)=>{
        return {...acc,...cur};
    },{})
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const orderRefId = `Order_${userInfo.userId}_${Date.now()}`;
    const hashedRefId = dcodeIO.bcrypt.hashSync(orderRefId,10);
    sessionStorage.setItem('orderRefId',hashedRefId);
    const payload = new URLSearchParams({
        ...formattedLineItems,
        mode: 'payment',
        success_url:`${window.location.origin}/${ORDER_CONFIRMATION_PATH}?orderRefId=${orderRefId}`,
        cancel_url: `${window.location.origin}/${CART_PATH}`,
        customer_email: userInfo?.email || 'admin@codebook.io'
    }).toString()
    try {
        const response = await fetch(STRIPE_CHECKOUT_SESSION_URL, {
            method: "POST",
            body: payload,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${STRIPE_SECRET_KEY}`
            }
        })
        if (!response.ok) {
            throw new Error('Unable to create Session')
        }
        const data = await response.json();
        const sessionId = data.id;
        return sessionId;
    }
    catch (e) {
        throw e;
    }
}

export async function fetchOrdersFromServer(userId,token)
{   
    try{
        const url = `${ORDERS_URL}/${userId}.json?auth=${token}`;
        const response = await makeServerRequest(url,{
            method:"GET"
        })
        return response;
    }
    catch(e)
    {
        console.log('error fetching orderss',e.message);
        throw e;
    }
}
