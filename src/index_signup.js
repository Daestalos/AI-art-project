import { validateMail, validatePassword, validatePasswordConfirm, validateName } from "./modules/validate";
import { createAccountData } from "./modules/signup";
import "./scss/login.scss";

if (document.querySelector('#signin')){
    const signin = document.querySelector('#signin')
    signin.addEventListener('submit', createAccountData);
}

if (document.querySelector('#email')){
    const emailInput = document.querySelector('#email');
    emailInput.addEventListener('input', () => validateMail(emailInput))
}

if(document.querySelector('#pass') && document.querySelector('#passConfirm')){
    const password = document.querySelector('#pass');
    const passwordConfirm = document.querySelector('#passConfirm')
    password.addEventListener('input', () => validatePassword(password))
    passwordConfirm.addEventListener('keyup', ()=> validatePasswordConfirm(password, passwordConfirm))
}

if (document.querySelector('#name')){
    const userName = document.querySelector('#name');
    userName.addEventListener('input', () => validateName(userName))
}