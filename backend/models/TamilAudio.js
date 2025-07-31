const mongoose = require('mongoose')

const Tamil = mongoose.Schema({
    url: {
        type: String,
        required: [true, 'URL is required'],
        trim: true,
        validate: {
            validator: function(v) {
                // Basic URL validation - you can make this more strict if needed
                return /^https?:\/\/.+/.test(v) || /^www\..+/.test(v) || /youtube\.com|youtu\.be/i.test(v);
            },
            message: 'Please enter a valid URL'
        }
    },
    title: {
        type: String,
        trim: true,
        default: 'Tamil Audio/Video'
    },
    type: {
        type: String,
        enum: ['video', 'audio'],
        default: 'video'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true // This automatically adds createdAt and updatedAt fields
})

// Add index for faster queries on createdAt
Tamil.index({ createdAt: -1 });

// Export with consistent naming - choose ONE name and use it everywhere
module.exports = mongoose.model('TamilVideo', Tamil)