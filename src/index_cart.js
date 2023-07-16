import { getCart, createOrder } from "./modules/cart";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { validateMail, validatePhone } from "./modules/validate";
import "./scss/cart.scss";

const auth = getAuth();

const checkAuthState = async() => {
    onAuthStateChanged(auth, user => {
        if (user) {
            document.querySelector('#user').innerText = `Hello, ${user.displayName}`;
        } else {
            window.location.href = 'login.html';
        }
    })
}

checkAuthState();
getCart()

if(document.querySelector('#phoneOrder') && document.querySelector('#emailOrder')){
    const emailCart = document.querySelector('#emailOrder');
    const phoneCart = document.querySelector('#phoneOrder');

    emailCart.addEventListener('input', () => validateMail(emailCart));
    phoneCart.addEventListener('input', () => validatePhone(phoneCart));
}

if(document.querySelector('#createOrder')){
    const createOrderForm = document.querySelector('#createOrder');

    createOrderForm.addEventListener('submit', createOrder)
}
