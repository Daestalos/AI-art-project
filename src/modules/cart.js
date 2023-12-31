import { calculateCost } from "./calculate";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { closePreloader } from "./preloader";
import { sendMail } from "./mail";


const firebaseConfig = {
    apiKey: "AIzaSyCtEmZsU0h87bDhhTevj7TL4d48VQNk8uo"
};

let dataForOrder = ''

const app = initializeApp(firebaseConfig);
const auth = getAuth();
console.log(auth);

const addToCart = async () => {
    calculateCost();

    const message = document.querySelector('.message');
    const price = document.querySelector('.art-order__order h2').innerText;
    const activeFrame = document.querySelector('.activeFrame').dataset.img;
    const size = document.querySelector('#artLength').value;
    const paspartColor = document.querySelector('#paspartColor').value
    const paspartSize = document.querySelector('#paspart').value;
    const amount = document.querySelector('#amount').value;
    const imageData = localStorage.getItem("data") 

    const cart = {
        price: price,
        frame: activeFrame,
        size: size,
        paspartColor: paspartColor,
        paspartSize: paspartSize,
        amount: amount,
        ...JSON.parse(imageData)
    }

    try {
        const cartData = await fetch('http://localhost:80/cart', {
            method: "post",
            body: JSON.stringify(cart),
            headers: { "Content-Type": "application/json;charset=UTF-8"}
        })
        if(cartData.status != 200){
            throw new Error('error');
        } else {
            message.style = "display: block";
            message.classList.add('success')
            message.innerText = "Успешно добавлено в корзину!"
            setTimeout(() => {
                window.location = '/cart.html'
            }, 2000)
        }
    } 
    catch (error){
        message.style = "display: block";
        message.classList.add('error')
        message.innerText = "Произошла ошибка! Свяжитесь с администратором"
    }
}

const getCart = () => {
    onAuthStateChanged(auth, user => {
        if (user) {
            const uid = {uid: user.uid}
            fetch('http://localhost:80/cart/all', {
                method: "post",
                body: JSON.stringify(uid),
                headers: { "Content-Type": "application/json;charset=UTF-8"}
            })
            .then(data => data.json())
            .then(data => {
                if(!data.length) {
                    document.querySelector('#cartOrder').disabled = true
                    document.querySelector('.cart__header h2').innerText = 'Ожидаем ваши картины'
                    renderCart(data);
                } else {
                    document.querySelector('.cart__header h2').innerText = 'Корзина пользователя'
                    document.querySelector('#cartOrder').disabled = false   
                    dataForOrder = {
                        uid: user.uid,
                        data: data
                    }

                    console.log(dataForOrder);
                    renderCart(data)
                }
            })
        } else {
            window.location.href = 'login.html';
        }
    })
}


const deleteCartElement = (id) => {
    onAuthStateChanged(auth, async user => {
        try {
            const uid = {uid: user.uid}
            fetch(`http://localhost:80/delete/${id}`, {
                method: "post",
                body: JSON.stringify(uid),
                headers: { "Content-Type": "application/json;charset=UTF-8"}
            })
            .then(() => getCart())
        } catch (error) {
           alert('Произошла ошибка при удалении элемента из корзины, свяжитесь с администратором!') 
        }

    })
}



const renderCart = (data) => {
    const cartContent = document.querySelector('.cart__content');
    const fullPrice = document.querySelector('.cart__form h2');
    let price = 0;
    cartContent.innerText = ''

    data.forEach(item => {
        price += parseInt(item.data.price);

        cartContent.insertAdjacentHTML('afterbegin', `
            <div class="cart__block col-12 d-flex flex-column flex-lg-row">
                <div class="col-12 col-lg-6 mt-3 mt-lg-0 d-flex justify-content-center justify-content-lg-start">
                    <div class="cart-art__upper" style="background-image: url(${item.data.frame});">
                        <div class="cart-art__middle" style="background: ${item.data.paspartColor}; padding: ${item.data.paspartSize}px">
                        <img src="${item.data.image}"></img>
                        </div>
                    </div>
                </div>
                <div class="cart__info col-12 col-lg-6 justify-content-evenly justify-content-lg-start  mt-5">
                    <div class=" row">
                        <label class="col-5 col-form-label">Размер (см):</label>
                        <div class="col-6">
                            <input type="text" disabled class="form-control-plaintext" value="${item.data.size}x${item.data.size}см">
                        </div>
                    </div>
                    <div class="row mt-1">
                        <label class="col-5 col-form-label">Цвет паспарту:</label>
                        <div class="col-6">
                            <input type="color" disabled class="form-control-plaintext" value="${item.data.paspartColor}">
                        </div>
                    </div>
                    <div class="row mt-1">
                        <label class="col-5 col-form-label">Глубина паспарту:</label>
                        <div class="col-6">
                            <input type="text" disabled class="form-control-plaintext" value="${item.data.paspartSize}см">
                        </div>
                    </div>
                    <div class="row mt-1">
                        <label class="col-5 col-form-label">Количество:</label>
                        <div class="col-6">
                            <input type="text" disabled class="form-control-plaintext" value="${item.data.amount}">
                        </div>
                    </div>

                    <div class="row mt-1">
                        <label class="col-5 col-form-label">Стоимость:</label>
                        <div class="col-6">
                            <input type="text" disabled class="form-control-plaintext" value="${item.data.price}">
                        </div>
                    </div>

                    <div class="cart__delete mb-3 mb-lg-0 col-11 d-flex justify-content-center mr-1">
                        <button class="deleteCartBtn" data-id="${item.id}">Удалить</button>
                    </div>
                </div>

            </div>
        `)
    })

    closePreloader();
    deleteEventSet();

    fullPrice.innerText = `Итоговая стоимость: ${price} BYN`
}

const deleteEventSet = () => {
    const deleteCartBtns = document.getElementsByClassName('deleteCartBtn');

    [...deleteCartBtns].forEach(elem => {
        elem.addEventListener('click', () => deleteCartElement(elem.dataset.id))
    })
}

const deleteCartAfterOrder = (uid) => {
    try {
        const user = {uid: uid}
        fetch(`http://localhost:80/cartDelete`, {
            method: "post",
            body: JSON.stringify(user),
            headers: { "Content-Type": "application/json;charset=UTF-8"}
        })
        .then(() => getCart())
    } catch (error) {
        alert('Произошла ошибка при очистке корзины, свяжитесь с администратором!')
    }

}

const createOrder =  async(e) => {
    e.preventDefault();

    const emailOrder = document.querySelector('#emailOrder');
    const phoneOrder = document.querySelector('#phoneOrder');
    const paymentMethod = document.querySelector('input[name="flexRadioDefault"]:checked');
    const message = document.querySelector('.cart__message')

    const data = {
        payment: paymentMethod.value,
        email: emailOrder.value,
        phone: phoneOrder.value,
        ...dataForOrder
    }

    try {
        const cartData = await fetch('http://localhost:80/order', {
            method: "post",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json;charset=UTF-8"}
        })
        
        if(cartData.status != 200){
            throw new Error('error');
        } else {
            sendMail(data);

            message.style = 'display: block'
            message.innerText = 'Успешно! С вами скоро свяжутся.'
    
            setTimeout(() => {
                message.style = 'display: none'
                message.innerText = ''
                deleteCartAfterOrder(data.uid);
                window.location = '/';
            }, 5000);
        }
    } 
    catch (error){
        alert(`Возникла ошибка при добавлении заказа! Свяжитесь с администратором!`)
    }
}

export {addToCart, getCart, createOrder};