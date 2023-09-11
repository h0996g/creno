const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const terrainSchema = new mongoose.Schema({
    place: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    size: {
        height: {
            type: Number,
            required: true
        },
        width: {
            type: Number,
            required: true
        },

    },
    responsableId: {
        type: ObjectId,
        ref: "responsable",
        required: true
    }
})


const Terrain = mongoose.model('Terrain', terrainSchema)
module.exports = Terrain   