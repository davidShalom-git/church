const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const auth = require('./router/User')


app.use(bodyParser.json())
app.use(cors({
    origin: 'https://church-rosy-rho.vercel.app', // Replace with your frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Include credentials (like cookies) if needed
}));

mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("MongoDB Connected")
}).catch((error)=> {
    console.log(error)
})


app.use('/api/auth',auth);

app.listen(2000,()=> {
    console.log("Jesus")
})