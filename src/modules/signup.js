import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCtEmZsU0h87bDhhTevj7TL4d48VQNk8uo"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


const createAccountData = async(e) => {
    e.preventDefault();

    const email = document.querySelector('#email');
    const password = document.querySelector('#pass');
    const name = document.querySelector('#name');

    const user = {
        "email": email.value,
        "password": password.value,
        "displayName": name.value
    }
    try {
        const userData = await fetch('http://localhost:80/createUser', {
            method: "post",
            body: JSON.stringify(user),
            headers: { "Content-Type": "application/json;charset=UTF-8"}
        })

        const data = userData.json();

        if (data.code){
            throw new Error('auth/email-already-exists');
        } else {
            signInWithEmailAndPassword(auth, user.email, user.password)
            .then(() => window.location.href = '/');
        }

      } catch (e) {
        if (e.message === 'auth/email-already-exists'){
            const errorMessage = document.querySelector('.error__message')
            errorMessage.style = 'display: block'
            errorMessage.innerText = 'Данная почта уже используется'

            setTimeout(() => {
                errorMessage.style = 'display: none'
                errorMessage.innerText = ''
            }, 5000);
        }
      }


}




export {createAccountData}
