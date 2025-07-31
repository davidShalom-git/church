const express = require('express')
const router = express.Router()
const English = require('../models/EnglishVideo')

router.post('/engupload', async(req,res)=> {
    const {url} = req.body;

    try {
        if(!url){
            return res.status(400).json({message: "Url is missing"})
        }

        const data = await English.create({url})
        // Remove the redundant .save() call since .create() already saves to DB
        
        res.status(201).json({message: "Successfully uploaded", data})
        
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
})

router.get('/engAudio',async(req,res)=> {
    try{
        const getAudio = await English.find({})
        
        // Check array length instead of truthy/falsy
        if(getAudio.length === 0){
            return res.status(404).json({message: "No Data Available..."})
        }
        
        res.status(200).json({message: "Successfully fetched", getAudio})

    }catch(error){
        return res.status(500).json({message: error.message})
    }
})

module.exports = router;