import { userSignIn } from "./modules/login";
import { validateMail, validatePassword } from "./modules/validate";
import "./scss/login.scss";

if(document.querySelector('#login')){
    document.querySelector('#login').addEventListener('submit', userSignIn);
}

if(document.querySelector('#email') && document.querySelector('#pass')){
    const loginEmail = document.querySelector('#email')
    const loginPass = document.querySelector('#pass')

    loginEmail.addEventListener('input', () => validateMail(loginEmail))
    loginPass.addEventListener('input', () => validatePassword(loginPass))
}