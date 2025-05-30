const mongoose = require('mongoose');

const TamilSchema = new mongoose.Schema({
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

const TamilModel = mongoose.model('Tamil', TamilSchema);

module.exports = TamilModel;