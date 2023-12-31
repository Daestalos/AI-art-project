import './scss/styles.scss';
import { closePreloader } from "./modules/preloader";
import { userSignOut} from './modules/login';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {validateArtLength, selectFrame, calculateCost, validatePaspartAndColor} from './modules/calculate';
import { addToCart } from './modules/cart';
import { generateArt, validatePromptInput } from './modules/generate';
import { publicImg } from './modules/blog';


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
setTimeout(closePreloader, 1000);


if (document.querySelector('#singOut')){
    const signOut = document.querySelector('#singOut')
    signOut.addEventListener('click', (e) => userSignOut(e))
}

if (document.querySelector('#artLength') && document.querySelector('#artLengthRepeat')) {
    const artLength = document.querySelector('#artLength'); 

    artLength.addEventListener('change', validateArtLength)
}

if (document.querySelectorAll('.art-order__frame')){
    const frames = document.querySelectorAll('.art-order__frame');
    [...frames].forEach(item => {
        item.addEventListener('click', selectFrame)
    })
}

if (document.querySelector('#calculateBtn')){
    const calculateBtn = document.querySelector('#calculateBtn');
    calculateBtn.addEventListener('click', calculateCost)
}

if (document.querySelector('#paspart') && document.querySelector('#paspartColor')){
    const paspartInput = document.querySelector('#paspart');
    const paspartInputColor = document.querySelector('#paspartColor');

    paspartInput.addEventListener('change', validatePaspartAndColor);
    paspartInputColor.addEventListener('change', validatePaspartAndColor);
}

if (document.querySelector('#addToCart')){
    const addToCartBtn = document.querySelector('#addToCart');
    addToCartBtn.addEventListener('click', addToCart)
}

if(document.querySelector('#publicImg')){
    const publicImgAtBlog = document.querySelector('#publicImg')
    publicImgAtBlog.addEventListener('click', publicImg)
}

if (document.querySelector('.art-container__button')){
    const generateArtBtn = document.querySelector('.art-container__button')
    generateArtBtn.addEventListener('click', generateArt);
}

if (document.querySelector('#prompt')){
    const promptInput = document.querySelector('#prompt')
    promptInput.addEventListener('input', validatePromptInput)
}

if(document.querySelector('#offcanvasOpen') && document.querySelector('#offcanvasClose')){
    const offcanvasOpenBtn = document.querySelector('#offcanvasOpen');
    const offcanvasCloseBtn = document.querySelector('#offcanvasClose')

    offcanvasOpenBtn.addEventListener('click', () => document.querySelector('#offcanvas').classList.add('show'))
    offcanvasCloseBtn.addEventListener('click', () => document.querySelector('#offcanvas').classList.remove('show'))
    
}

