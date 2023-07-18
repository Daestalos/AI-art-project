// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCtEmZsU0h87bDhhTevj7TL4d48VQNk8uo"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const userSignIn = async (e) => {
    e.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#pass').value;
    signInWithEmailAndPassword(auth, email, password)
    .then(() => window.location.href = '/')
    .catch((error) => {
        if (error.code == 'auth/user-not-found'){
            const errorMessage = document.querySelector('.error__message')
            errorMessage.style = 'display: block'
            errorMessage.innerText = 'Пользователя с данным email не существует.'

            setTimeout(() => {
                errorMessage.style = 'display: none'
                errorMessage.innerText = ''
            }, 5000);
        }
    });
}

const userSignOut = async (e) => {
    e.preventDefault();
    await signOut(auth);
    window.location.href = 'login.html';
}

export {userSignIn, userSignOut}