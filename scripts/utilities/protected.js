import { isAuthorized } from "./auth.js";
import { LOGIN_PATH,ACCOUNTPAGE_PATH } from "./constants.js";
const isUserAuthenticated = isAuthorized();
if (window.location.pathname === `/${LOGIN_PATH}`) {
    if(isUserAuthenticated)
    {
        window.location.href =`/${ACCOUNTPAGE_PATH}`
    }
}
else {
    if (!isUserAuthenticated) {
        window.location.href = `/${LOGIN_PATH}`;
    }
}
