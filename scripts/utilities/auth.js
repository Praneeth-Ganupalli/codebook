import { CREATE_NEW_USER_API, SIGN_IN_USER_API, UPDATE_USER_API } from "./constants.js";
import { getCookie, setCookie,deleteCookie } from "./cookies.js";
import { makeServerRequest, saveUserCart, getCartFromServer } from "./services.js";
import { getCartItems } from "../cart.js";
export async function createOrSignInUser(isCreate, name, email, password) {
    const payload = {
        email: email,
        password: password,
        returnSecureToken: true
    }
    const options = {
        method: "POST",
        body: JSON.stringify(payload)
    }
    try {
        const url = isCreate ? CREATE_NEW_USER_API : SIGN_IN_USER_API
        const response = await makeServerRequest(url, options);
        let updateResponse = null;
        if (isCreate) {
            const updatePayload = {
                idToken: response.idToken,
                displayName: name,
                returnSecureToken: true
            }
            const updateOptions = {
                method: "POST",
                body: JSON.stringify(updatePayload)
            }
            updateResponse = await makeServerRequest(UPDATE_USER_API, updateOptions);
        }
        const finalServerResponse = updateResponse ?? response;
        finalServerResponse.idToken = response.idToken;
        finalServerResponse.refreshToken = response.refreshToken;
        if (isCreate) {
            /// New User
            await syncLocalCartToServer(finalServerResponse);
        }
        else {
            // Logged in user
            await handleExistingUserCart(finalServerResponse);
        }
        saveLoginInfo(finalServerResponse);
    }
    catch (er) {
        throw er;
    }
}
async function syncLocalCartToServer(loginInfo) {
    const cartItems = getCartItems(); ///localStorage
    if (cartItems.length > 0) {
        await saveUserCart(loginInfo.localId, loginInfo.idToken, cartItems);
    }
}
async function handleExistingUserCart(loginInfo) {
    const localCart = getCartItems();
    const serverCart = await getCartFromServer(loginInfo.localId, loginInfo.idToken) || [];
    if (serverCart.length > 0 && localCart.length === 0) {
        // user added while logged in and opened after logout or new browser
        localStorage.setItem("cart", JSON.stringify(serverCart));
    }
    else if(localCart.length>0 && serverCart.length===0)
    {
        // Guest user added and then logged in later
        await syncLocalCartToServer(loginInfo);
    }
    else if(localCart.length >0 && serverCart.length>0)
    {
        // data exists in both local and server
        const mergedCart = localCart.concat(serverCart);
        const productIds = mergedCart.map(cartItem=>cartItem.productId);
        const uniqueIds = [...new Set(productIds)];
        const finalCart = [];
        uniqueIds.forEach(id=>{
            const cartItem = mergedCart.find(tmpCartItem =>tmpCartItem.productId === id);
            if(cartItem)
            {
                finalCart.push(cartItem);
            }
        })
        localStorage.setItem('cart',JSON.stringify(finalCart));
        await saveUserCart(loginInfo.localId,loginInfo.idToken,finalCart);
    }
}
function saveLoginInfo(loginInfo) {
    const { displayName, email, idToken, refreshToken, expiresIn, localId } = loginInfo;
    const userInfo = {
        name: displayName,
        email: email,
        userId: localId
    }
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    const idTokenExpirationTime = new Date();
    const tokenTime = idTokenExpirationTime.getTime() + (parseInt(expiresIn) * 1000);
    idTokenExpirationTime.setTime(tokenTime);
    const refreshTokenExpirationTime = new Date();
    refreshTokenExpirationTime.setFullYear(refreshTokenExpirationTime.getFullYear() + 1);
    setCookie({
        name: '_idToken',
        value: idToken,
        expirationTime: idTokenExpirationTime
    })
    setCookie({
        name: '_refreshToken',
        value: refreshToken,
        expirationTime: refreshTokenExpirationTime
    })
}

export function clearUserInfo()
{
    localStorage.clear();
    sessionStorage.clear();
    deleteCookie('_idToken');
    deleteCookie('_refreshToken');
}
export function isAuthorized() {
    return getCookie('_idToken');
}
