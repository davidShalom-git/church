const express = require('express')
const router = express.Router()
// Fix the import to match your schema file name
const Tamil = require('../models/TamilAudio') // or whatever your actual file is named

// Add input validation and better error handling
router.post('/tamupload', async(req,res)=> {
    const {url, title, type} = req.body;

    try {
        // Enhanced validation
        if(!url || url.trim() === ''){
            return res.status(400).json({
                success: false,
                message: "URL is required and cannot be empty"
            })
        }

        // Basic URL format validation
        const urlPattern = /^(https?:\/\/)|(www\.)|((youtube\.com|youtu\.be))/i;
        if (!urlPattern.test(url.trim())) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid URL"
            })
        }

        // Create the record with optional fields
        const data = await Tamil.create({
            url: url.trim(),
            title: title?.trim() || 'Tamil Audio/Video',
            type: type || 'video'
        })
       
        res.status(201).json({
            success: true,
            message: "Successfully uploaded", 
            data
        })
        
    } catch (error) {
        // Handle mongoose validation errors specifically
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: Object.values(error.errors).map(err => err.message)
            })
        }
        
        return res.status(500).json({
            success: false,
            message: "Server error occurred",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        })
    }
})

// Get latest/most recent video (what your frontend needs)
router.get('/tamAudio',async(req,res)=> {
    try{
        // Get the most recent active video
        const latestVideo = await Tamil.findOne({ isActive: true })
            .sort({ createdAt: -1 })
            .select('url title type createdAt updatedAt');

        if(!latestVideo){
            return res.status(404).json({
                success: false,
                message: "No active videos available"
            })
        }
        
        res.status(200).json({
            success: true,
            message: "Latest video fetched successfully", 
            data: latestVideo,
            timestamp: new Date().toISOString()
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error fetching video",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        })
    }
})

// Get all videos (optional - for admin purposes)
router.get('/tamAudio/all',async(req,res)=> {
    try{
        const { page = 1, limit = 10, type } = req.query;
        const skip = (page - 1) * limit;
        
        // Build query filter
        const filter = { isActive: true };
        if (type && ['video', 'audio'].includes(type)) {
            filter.type = type;
        }

        const videos = await Tamil.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .select('url title type createdAt updatedAt');

        const totalCount = await Tamil.countDocuments(filter);

        if(videos.length === 0){
            return res.status(404).json({
                success: false,
                message: "No videos found"
            })
        }
        
        res.status(200).json({
            success: true,
            message: "Videos fetched successfully",
            data: videos,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                hasNextPage: skip + videos.length < totalCount,
                hasPrevPage: page > 1
            }
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error fetching videos",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        })
    }
})

// Update video status (deactivate old videos)
router.patch('/tamAudio/:id/status', async(req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        
        const updatedVideo = await Tamil.findByIdAndUpdate(
            id,
            { isActive: Boolean(isActive) },
            { new: true, runValidators: true }
        );
        
        if (!updatedVideo) {
            return res.status(404).json({
                success: false,
                message: "Video not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: `Video ${isActive ? 'activated' : 'deactivated'} successfully`,
            data: updatedVideo
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating video status",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

module.exports = router;