const express = require('express')
const router = express.Router()
const Tamil = require('../models/TamilAudio')

router.post('/tamupload', async(req,res)=> {
    const {url} = req.body;

    try {
        if(!url){
            return res.status(400).json({message: "Url is missing"})
        }

        const data = await Tamil.create({url})
       
        res.status(201).json({message: "Successfully uploaded", data})
        
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
})

router.get('/tamAudio',async(req,res)=> {
    try{
        const getAudio = await Tamil.find({})

        if(getAudio.length === 0){
            return res.status(404).json({message: "No Data Available..."})
        }
        
        res.status(200).json({message: "Successfully fetched", getAudio})

    }catch(error){
        return res.status(500).json({message: error.message})
    }
})

module.exports = router;