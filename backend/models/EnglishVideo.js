const mongoose = require('mongoose')

const English = mongoose.Schema({
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
        default: 'English Audio/Video'
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
English.index({ createdAt: -1 });

module.exports = mongoose.model('EnglishVideo', English)