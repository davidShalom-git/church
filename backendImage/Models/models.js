const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    fileName: {
        type: String,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const ImageModel = mongoose.model('Image', imageSchema);

module.exports = ImageModel;