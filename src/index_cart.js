import { getCart, createOrder } from "./modules/cart";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { validateMail, validatePhone } from "./modules/validate";
import { userSignOut } from "./modules/login";
import "./scss/cart.scss";

const auth = getAuth();

const checkAuthState = async() => {
    onAuthStateChanged(auth, user => {
        if (user) {
            document.querySelector('#user').innerText = `Здравствуйте, ${user.displayName}!`;
        } else {
            window.location.href = 'login.html';
        }
    })
}

checkAuthState();
getCart()

if (document.querySelector('#singOut')){
    const signOut = document.querySelector('#singOut')
    signOut.addEventListener('click', (e) => userSignOut(e))
}

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

if(document.querySelector('#offcanvasOpen') && document.querySelector('#offcanvasClose')){
    const offcanvasOpenBtn = document.querySelector('#offcanvasOpen');
    const offcanvasCloseBtn = document.querySelector('#offcanvasClose')

    offcanvasOpenBtn.addEventListener('click', () => document.querySelector('#offcanvas').classList.add('show'))
    offcanvasCloseBtn.addEventListener('click', () => document.querySelector('#offcanvas').classList.remove('show'))
    
}
