import { getAuth, onAuthStateChanged } from "firebase/auth";
import { async } from "regenerator-runtime";


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


const publicImg = () => {

    
    onAuthStateChanged(auth, async user => {
        try {
            const imageData = localStorage.getItem("data");

            const data = {
                name: user.displayName,
                ...JSON.parse(imageData)
            }

            const response = await fetch('http://localhost:80/upload', {
                method: "post",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json;charset=UTF-8"}
            })
            
    
            if(response.status != 200){
                throw new Error('error');
            }
    
        } 
        catch (error){
            alert(`Возникла ошибка при публиковании изображения! Свяжитесь с администратором!`)
        }
    })
    
    
}

export {publicImg}