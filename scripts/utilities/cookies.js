export function setCookie(cookieInfo) {
    const { name, value, expirationTime } = cookieInfo;
    document.cookie = `${name}=${value};path=/;expires=${expirationTime};`;
}

export function getCookie(name) {
    const cookieCollection = document.cookie.split(';');
    let result = null;
    for (let i = 0; i < cookieCollection.length; i++) {
        const [cookieName, cookieValue] = cookieCollection[i].trim().split('=');
        if (cookieName.trim() === name) {
            result = cookieValue;
            break;
        }
    }
    return result;
}

export function deleteCookie(name)
{
    document.cookie = `${name}=;expires=${new Date(0)};path=/`;
}