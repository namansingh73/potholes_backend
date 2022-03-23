
const mongoose = require('mongoose');

const potholeSchema = new mongoose.Schema({
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    },
    area: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        lowercase: true,
        enum: ['low', 'medium', 'high']
    }
})

const Pothole = mongoose.model('Pothole', potholeSchema);

module.exports = Pothole;