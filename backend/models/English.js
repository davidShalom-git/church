const mongoose = require('mongoose');

const EnglishSchema = new mongoose.Schema({
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

const EnglishModel = mongoose.model('English', EnglishSchema);

module.exports = EnglishModel;