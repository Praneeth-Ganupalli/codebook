export const  FEATURED_PRODUCTS = [
    {
        "id": 10004,
        "name": "The Complete Guide to Backend Development",
        "overview": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error unde quisquam magni vel eligendi nam.",
        "long_description": "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta aut, vel ipsum maxime quam quia, quaerat tempore minus odio exercitationem illum et eos, quas ipsa aperiam magnam officiis libero expedita quo voluptas deleniti sit dolore? Praesentium tempora cumque facere consectetur quia, molestiae quam, accusamus eius corrupti laudantium aliquid! Tempore laudantium unde labore voluptates repellat, dignissimos aperiam ad ipsum laborum recusandae voluptatem non dolore. Reiciendis cum quo illum. Dolorem, molestiae corporis.",
        "price": 99,
        "poster": "https://images.unsplash.com/photo-1595617795501-9661aafda72a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=650&q=40",
        "image_local": "/assets/images/10004.avif",
        "rating": 5,
        "in_stock": true,
        "size": 7,
        "best_seller": true
    },
    {
        "id": 10006,
        "name": "Frontend Fastlane Plan With Projects",
        "overview": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error unde quisquam magni vel eligendi nam.",
        "long_description": "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta aut, vel ipsum maxime quam quia, quaerat tempore minus odio exercitationem illum et eos, quas ipsa aperiam magnam officiis libero expedita quo voluptas deleniti sit dolore? Praesentium tempora cumque facere consectetur quia, molestiae quam, accusamus eius corrupti laudantium aliquid! Tempore laudantium unde labore voluptates repellat, dignissimos aperiam ad ipsum laborum recusandae voluptatem non dolore. Reiciendis cum quo illum. Dolorem, molestiae corporis.",
        "price": 99,
        "poster": "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=650&q=40",
        "image_local": "/assets/images/10006.avif",
        "rating": 5,
        "in_stock": true,
        "size": 10,
        "best_seller": false
    },
    {
        "id": 10008,
        "name": "JavaScript Basics To Advance With Shubham",
        "overview": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error unde quisquam magni vel eligendi nam.",
        "long_description": "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta aut, vel ipsum maxime quam quia, quaerat tempore minus odio exercitationem illum et eos, quas ipsa aperiam magnam officiis libero expedita quo voluptas deleniti sit dolore? Praesentium tempora cumque facere consectetur quia, molestiae quam, accusamus eius corrupti laudantium aliquid! Tempore laudantium unde labore voluptates repellat, dignissimos aperiam ad ipsum laborum recusandae voluptatem non dolore. Reiciendis cum quo illum. Dolorem, molestiae corporis.",
        "price": 29,
        "poster": "https://images.unsplash.com/photo-1613490900233-141c5560d75d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=650&q=40",
        "image_local": "/assets/images/10008.avif",
        "rating": 5,
        "in_stock": true,
        "size": 3,
        "best_seller": true
    }
]
export const MAX_RATING = 5;
//export const PRODUCTS_LIST_URL = 'https://run.mocky.io/v3/886bf2c8-957a-4474-b0cd-e95f0fc30543';
export const PRODUCTS_BASEURL = 'https://praneeth836-codebook-default-rtdb.firebaseio.com/products';
export const CART_URL = 'https://praneeth836-codebook-default-rtdb.firebaseio.com/carts';
export const ORDERS_URL = 'https://praneeth836-codebook-default-rtdb.firebaseio.com/orders';
export const PRODUCTS_LIST_URL = `${PRODUCTS_BASEURL}.json`;
export const PLP_PATH = "pages/products.html";
export const PDP_PATH= "pages/productDetails.html";
export const LOGIN_PATH= "pages/login.html";
export const ACCOUNTPAGE_PATH = "pages/account.html";
export const ORDER_CONFIRMATION_PATH = "pages/orderConfirmation.html";
export const ORDER_HISTORY_PATH = "pages/orderHistory.html";
export const CART_PATH = "pages/cart.html";
const FIREBASE_API_KEY = 'AIzaSyBNdOoFRRA9dVOuDrl7_2rmBwIqMQg5TxA'
export const CREATE_NEW_USER_API =`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`;
export const SIGN_IN_USER_API = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;
export const UPDATE_USER_API = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${FIREBASE_API_KEY}`;
export const STRIPE_PUBLIC_KEY ='pk_test_51Pgz94G5yC4rHNYSom3BpfdplQo8ImsMd5iYomei7RDPtZ7YkNf3WGKoD5Qwxbbqsy1vcx09inzVbd8ZekhD2RQ300GBfhUyui';
export const STRIPE_SECRET_KEY='sk_test_51Pgz94G5yC4rHNYSqhVNuAiAOBxBRJACDeSmIBIC2UdIDmHSRsuAo2aL2HioqDpiLuYBsQjeMif8NVDiU9GLluNA003j8nfpi5';
export const STRIPE_CHECKOUT_SESSION_URL='https://api.stripe.com/v1/checkout/sessions';
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyBNdOoFRRA9dVOuDrl7_2rmBwIqMQg5TxA",
    authDomain: "praneeth836-codebook.firebaseapp.com",
    projectId: "praneeth836-codebook",
    storageBucket: "praneeth836-codebook.appspot.com",
    messagingSenderId: "37739511519",
    appId: "1:37739511519:web:849ea2e4ef8adf7ff2736a"
  };