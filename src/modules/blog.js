import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { closePreloader } from "./preloader";


const firebaseConfig = {
    apiKey: "AIzaSyCtEmZsU0h87bDhhTevj7TL4d48VQNk8uo"
};

const app = initializeApp(firebaseConfig);
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

const renderBlog = async () => {
    const itemListDiv = document.querySelector('.blog__item-list');

    try {

        const response = await fetch('http://localhost:80/blog/all', {
                method: "get",
                headers: { "Content-Type": "application/json;charset=UTF-8"}
        })
        .then(data => data.json())
        .then(data => {
            data.forEach(elem => {
                itemListDiv.insertAdjacentHTML('beforeend', `
                    <div class="blog__div m-4 col-6 d-flex flex-column">
                        <div class="blog__img col-12">
                            <img src="${elem.data.image}">
                        </div>
                        <div class="col-12">
                            <label class="col-form-label">Автор: <a>${elem.data.name}</a></label>
                            <label class="align-self-end col-form-label">Запрос: <a>${elem.data.prompt}</a></label>
                        </div>
                    </div>
                `)
            })
        })
        .then(() => closePreloader())



    } catch (error) {
        
    }
}

const searchArt = async () => {
    try {
        const searchInput = document.querySelector("#textSearch").value.trim();
        const itemListDiv = document.querySelector('.blog__item-list');

        if(searchInput === ''){
            itemListDiv.innerText = '';
            renderBlog();
            return;
        }


        const data = {
            prompt: searchInput
        }

    

        const response = await fetch('http://localhost:80/search', {
            method: "post",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json;charset=UTF-8"}
        })
        .then(data => data.json())
        .then(data => {
            itemListDiv.innerText = ''
            data.forEach(elem => {
                itemListDiv.insertAdjacentHTML('beforeend', `
                    <div class="blog__div m-4 col-6 d-flex flex-column">
                        <div class="blog__img col-12">
                            <img src="${elem.data.image}">
                        </div>
                        <div class="col-12">
                            <label class="col-form-label">Автор: <a>${elem.data.name}</a></label>
                            <label class="align-self-end col-form-label">Запрос: <a>${elem.data.prompt}</a></label>
                        </div>
                    </div>
                `)
            })
        })
    } 
    catch (error){
        alert(`Возникла ошибка при поиске! Свяжитесь с администратором!`)
    }
}

export {publicImg, renderBlog, searchArt}