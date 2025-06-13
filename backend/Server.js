const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const event = require('./Router/EventRouter')
const Tamil = require('./Router/TamilRouter')
const English = require('./Router/EnglishRoute')
const fs = require('fs')
const cors = require('cors')


 mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log('MongoDB Connected ....')
}).catch((error)=>{
    console.log('Some error', error)
})


const uploadDirs = ['uploads/general', 'uploads/tamil', 'uploads/english'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }))


app.use('/api/church',event)
app.use('/api/church',Tamil)
app.use('/api/church',English)

app.listen(4100,()=>{
    console.log('Server Connected')
})