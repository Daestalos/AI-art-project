const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
const PORT = 80;
const { Configuration, OpenAIApi } = require("openai");
const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://art-project-db-default-rtdb.firebaseio.com"
});


const configuration = new Configuration({
    apiKey: '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',
});

const app = express();
const db = admin.firestore();

app.use(cors({credentials:true}))
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({ 
    parameterLimit: 100000,
    extended: false,
    limit: '50mb'
 }))

app.get('/', (req, res) =>{
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send("<h1>Hi</h1>")
})

// user

app.post('/createUser', async (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password,
        displayName: req.body.displayName
    }
    const userResponse = await admin.auth().createUser({
        email: user.email,
        password: user.password,
        displayName: user.displayName,
        emailVerified: false,
        disabled: false
    })
    .then(data => {
        db.collection("users").doc(data.uid).set(user);
        res.json(data);
    })
    .catch((error) => {
        res.json(401, {code: 'auth/email-already-exists'})
    });
    
    res.json(userResponse);
})

// image

app.post('/generate', async (req, res) => {
    const prompt = {
        prompt: req.body.prompt,
        n: 1,
        size: "256x256"
    }
    const imgUrl = 'images/photo_2023-07-06_22-02-37.jpg'
    res.json(imgUrl)

    // const openai = new OpenAIApi(configuration);
    // const response = await openai.createImage(prompt)
    // .then(data=> {
    //     console.log(data.data.data[0].url);
    //     return data.data.data[0].url
    // })
    // .then(async img => {
    //     const image = await axios.get(img, {responseType: 'arraybuffer'});
    //     const raw = Buffer.from(image.data).toString('base64');
    //     const base64Image = "data:" + image.headers["content-type"] + ";base64,"+raw;
    //     res.json(base64Image)
    // })

})



// cart

app.post('/cart', async (req, res) => {
    try{
        const cart = {
            amount: req.body.amount,
            date: req.body.date,
            frame: req.body.frame,
            image: req.body.image,
            paspartColor: req.body.paspartColor,
            paspartSize: req.body.paspartSize,
            price: req.body.price,
            prompt: req.body.prompt,
            size: req.body.size,
            uid: req.body.uid
        }
        const response = db.collection(`users/${req.body.uid}/cart`).add(cart)
        res.json(response)
    } catch(error){
        res.json(error)
    }
})

app.post('/cart/all', async (req, res) => {
    try {
        const response = await db.collection(`users/${req.body.uid}/cart`).get();
        let cartData = [];
        response.forEach(doc => cartData.push({
            id: doc.id,
            data: doc.data()
        }));
        res.json(cartData);
    } catch (error) {
        res.json(error)
    }
})

app.post('/cartDelete', async (req, res) => {
    try {
        const response = await db.collection(`users/${req.body.uid}/cart`).get();
        response.forEach(doc => 
            db.collection(`users/${req.body.uid}/cart`).doc(doc.id).delete()
        )
        res.json('cartDeleted');
    } catch (error) {
        res.json(error)
    }
})

app.post('/delete/:id', async (req, res) => {
    try {
        const response = await db.collection(`users/${req.body.uid}/cart`).doc(req.params.id).delete();
        res.json(response);
    } catch (error) {
        res.json(error)
    }
})

// blog

app.post('/upload', async (req, res) => {
    try{
        const uploadImg = {
            name: req.body.name,
            uid: req.body.uid,
            image: req.body.image,
            prompt: req.body.prompt,
            date: req.body.date
        }
        const response = db.collection(`blog/`).add(uploadImg)
        res.json(response)
    } catch(error){
        res.json(error)
    }
})

app.get('/blog/all', async (req, res) => {
    try {
        const response = await db.collection('blog').get();
        let blogArr = [];
        response.forEach(doc => blogArr.push({
            id: doc.id,
            data: doc.data()
        }));
        res.json(blogArr);
    } catch (error) {
        res.json(error)
    }
})

app.post('/search', async (req, res) => {
    try {
        const response = await db.collection('blog').get();
        let blogArr = [];
        response.forEach(doc => {
            const data = doc.data();
            
            if(data.prompt.includes(`${req.body.prompt}`)){
                blogArr.push({
                    id: doc.id,
                    data: doc.data()
                })
            }
        })
        res.json(blogArr);
    } catch (error) {
        res.json(error)
    }
})


app.post('/email', (req, res) =>{
    async function main() {
        let emailData = {
            payment: req.body.payment,
            email: req.body.email,
            phone: req.body.phone,
            uid: req.body.uid,
            data: req.body.data
        };

        let transporter = nodemailer.createTransport({
            host: "smtp.mail.ru", 
            port: 465, 
            secure: true, 
            auth: {
              user: "bordyug.alex@mail.ru", 
              pass: 'FJCeqTHNh3cQVAa9rspc', 
            },
        });

        emailData.data.forEach(async data => {
            let info = await transporter.sendMail({
                from: `ART Project <bordyug.alex@mail.ru>`,
                to: "bordyug.alex@mail.ru",
                subject: `Заказ с сайта AI IS WONDERFUL =`,
                text: `
                Email пользователя: ${emailData.email}
                Телефон для связи: ${emailData.phone}
                Оплата через: ${emailData.payment}
                Рамка: ${data.data.frame}
                Цвет паспару: ${data.data.paspartColor}
                Глубина паспарту: ${data.data.paspartSize}
                Размер: ${data.data.size}х${data.data.size}
                Количество: ${data.data.amount}
                Итоговая цена: ${data.data.price}
                ID заказа: ${data.id}`
            });

            console.log(info.messageId);
        })
        }
        
        
    main().catch(err => res.status(400).send({ error: 'Something failed!' }));
})

app.post('/order', async (req, res) => {
    try{
        // const cart = {
        //     amount: req.body.amount,
        //     date: req.body.date,
        //     frame: req.body.frame,
        //     image: req.body.image,
        //     paspartColor: req.body.paspartColor,
        //     paspartSize: req.body.paspartSize,
        //     price: req.body.price,
        //     prompt: req.body.prompt,
        //     size: req.body.size,
        //     uid: req.body.uid
        // }

        const order = {
            uid: req.body.uid,
            email: req.body.email,
            phone: req.body.phone,
            data: req.body.data
        }
        const response = db.collection(`order/`).add(order)
        res.json(response)
    } catch(error){
        res.json(error)
    }
})


app.listen(PORT, () => {
    console.log(`Backend is running on ${PORT}`);
})
// apiFunc()
