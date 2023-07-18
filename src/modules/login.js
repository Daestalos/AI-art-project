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





















// const generateToken = () => {
//     let length = 8,
//         charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
//         retVal = "";
//     for (let i = 0, n = charset.length; i < length; ++i) {
//         retVal += charset.charAt(Math.floor(Math.random() * n));
//     }
//     return retVal;
// };

// const isAuthorization = () => {
//     if(!sessionStorage.getItem('user-token')){
//         sessionStorage.setItem('user-token', '');
//         window.location.href = 'login.html';
//     }
// }

// const writeAccountData = (event) => {
//     event.preventDefault();
//     const userName = document.querySelector('#userName');
//     const userPassword = document.querySelector('#userPw');

//     sessionStorage.setItem('u-name', userName);
//     sessionStorage.setItem('u-password', userPassword);

//     let currentAccounts = JSON.parse(localStorage.getItem('accounts'));

//     const currentUser = {
//         userEmail: userName.value,
//         userPassword: userPassword.value
//     }

//     findUser(currentAccounts, currentUser);
// }

// const findUser = (allUsers, user) => {
//     const checkUser = allUsers.filter((userItem) => {
//         return (
//             user.userEmail === userItem.userEmail &&
//             user.userPassword === userItem.userPassword
//         )
//     })

//     if(checkUser.length === 0){
//         alert('emter another data');
//         return false;
//     } else{
//         window.location.href = 'index.html';
//         sessionStorage.setItem('user-token', generateToken());
//         return true;
//     }
// }

// export {isAuthorization, writeAccountData};