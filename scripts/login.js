import { loadGlobalHeaderFooter, initializeSearch, showToastMessage } from "./utilities/helpers.js";
import { createOrSignInUser } from "./utilities/auth.js";
import { CART_PATH, PLP_PATH } from "./utilities/constants.js";
const formLoginInfoTextEle = document.querySelector(".form-login-info");
const formHeaderTextEle = document.querySelector(".form-header-text");
const formSubmitBtn = document.querySelector(".form-action>button");
const formNameInputEle = document.querySelector(".form-name-input");
const loginSignupFormEle = document.getElementById('codebook-login-signup-form');
const inputEmailEle = document.getElementById('email');
const inputPasswordEle = document.getElementById('password');
const inputNameEle = document.getElementById('name');
const inputValidationElements = document.querySelectorAll('input[data-require-input-validation]');
const formActionEle = document.querySelector(".form-action");
const formFeedbackEle = document.querySelector('.form-feedback');
let isSignUpForm = false;
let isFormTouched = false;
formLoginInfoTextEle.addEventListener('click', function (e) {
    if (e.target.tagName === "STRONG") {
        isSignUpForm = !isSignUpForm;
        this.classList.toggle("signup-form");
        formNameInputEle.classList.toggle('d-none');
        if (isSignUpForm) {
            formHeaderTextEle.innerText = 'Sign Up';
            formSubmitBtn.innerText = 'Sign up';
        }
        else {
            formHeaderTextEle.innerText = 'Login';
            formSubmitBtn.innerText = 'Login';
            inputNameEle.classList.remove('error');
            inputNameEle.nextElementSibling.innerText = '';
            ;
        }
    }
});
inputValidationElements.forEach(inputEle => {
    inputEle.addEventListener("input", function () {
        if (isFormTouched) {
            validateFormErrors(this);
        }
    })
});
loginSignupFormEle.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSubmit();
});
function handleSubmit() {
    isFormTouched = true;
    const formFields = [inputEmailEle, inputPasswordEle];
    if (isSignUpForm) {
        formFields.push(inputNameEle);
    }
    formFields.forEach(field => {
        validateFormErrors(field);
    })
    const formErrors = document.querySelectorAll(".error");
    if (formErrors.length > 0) {
        return false
    }
    else {
        const name = inputNameEle.value;
        const email = inputEmailEle.value;
        const password = inputPasswordEle.value;
        handleFormServerReq(name, email, password);
    }
}
function navigateToNext() {
    const query = new URLSearchParams(window.location.search).get('redirectTo');
    if (query && query === 'cart') {
        window.location.href = `/${CART_PATH}`;
    }
    else {
        window.location.href = `/${PLP_PATH}`;
    }
}
async function handleFormServerReq(name, email, password) {
    try {
        formActionEle.classList.add("is-submitting");
        await createOrSignInUser(isSignUpForm, name, email, password);
        const feedbackMsg = isSignUpForm ? 'Account Created SuccessFully' : 'Login Successful';
        showToastMessage({
            message: feedbackMsg,
            variant: 'success',
            closeCallback: navigateToNext,
            duration: 1000
        })
    }
    catch (er) {
        formFeedbackEle.style.color = 'red';
        formFeedbackEle.innerText = er;
        setTimeout(() => {
            formFeedbackEle.innerText = '';
        }, 3000)
    }
    finally {
        formActionEle.classList.remove("is-submitting");
    }
}
function validateFormErrors(field) {
    const fieldValue = field.value.trim();
    const fieldName = field.name;
    switch (fieldName) {
        case 'name': {
            if (!fieldValue) {
                field.classList.add('error');
                field.nextElementSibling.innerText = 'Name is required'
            }
            else {
                field.classList.remove('error');
                field.nextElementSibling.innerText = ''
            }
            break;
        }
        case 'email': {
            if (!fieldValue) {
                field.classList.add('error');
                field.nextElementSibling.innerText = 'Email is required'
            }
            else if (fieldValue && !fieldValue.includes('@')) {
                field.classList.add('error');
                field.nextElementSibling.innerText = 'Please include @ symbol'
            }
            else {
                field.classList.remove('error');
                field.nextElementSibling.innerText = ''
            }
            break;
        }
        case 'password': {
            if (!fieldValue) {
                field.classList.add('error');
                field.nextElementSibling.innerText = 'Password is required'
            }
            else if (fieldValue && fieldValue.length < 8) {
                field.classList.add('error');
                field.nextElementSibling.innerText = 'Password must be atleast 8 characters'
            }
            else {
                field.classList.remove('error');
                field.nextElementSibling.innerText = ''
            }
            break;
        }
        default: ''
    }
}
(function init() {
    loadGlobalHeaderFooter();
    initializeSearch(true);
})()


/// local ,session <5MB