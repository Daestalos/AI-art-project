const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const PORT = 80;
const { Configuration, OpenAIApi } = require("openai");
const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");
const { async } = require('regenerator-runtime');

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
    console.log(req.body);
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
        console.log(req.params.id);
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



app.listen(PORT, () => {
    console.log(`Backend is running on ${PORT}`);
})
// apiFunc()
