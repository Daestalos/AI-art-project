import { getAuth, onAuthStateChanged } from "firebase/auth";
const auth = getAuth();

const validatePromptInput = () => {
    const promptInput = document.querySelector('#prompt').value;
    const generateArtBtn = document.querySelector('.art-container__button');

    promptInput.length <= 3 ? generateArtBtn.disabled = true : generateArtBtn.disabled = false;
}

const generateArt = async () => {
    const artOrderDiv = document.querySelector('.art-order');
    const promptInput = document.querySelector('#prompt');
    const load = document.querySelector('.art-container__load');
    const image = document.querySelector('.art-container__content img');
    const orderImg = document.querySelector('.art-order__middle img')



    onAuthStateChanged(auth, async user => {
        if (user) {

            const prompt = {
                prompt: promptInput.value,
                date: new Date().toLocaleString(),
                uid: user.uid
            }
            
            console.log(user);
            console.log(prompt);
            try {

                image.style = 'display: none';
                load.style = 'display: block';


                const imageData = await fetch('http://localhost:80/generate', {
                    method: "post",
                    body: JSON.stringify(prompt),
                    headers: { "Content-Type": "application/json;charset=UTF-8"}
                })

                const data = await imageData.json();

                if (data){
                    artOrderDiv.style = 'display: block';
                    load.style = 'display: none';
                    image.src = data;
                    orderImg.src = data;
                    image.style = 'display: block';

                    setTimeout( () => {
                        orderImg.scrollIntoView();
                    }, 2000)
                }

                localStorage.setItem('data', JSON.stringify({
                    image: data,
                    prompt: promptInput.value,
                    date: new Date().toLocaleString(),
                    uid: user.uid
                }))
            } catch (error) {
                alert(`Возникла ошибка! ${error.message} : ${error.message}`)
            }


        } else {
            window.location.href = 'login.html';
        }
    })
    
}



export {generateArt, validatePromptInput}