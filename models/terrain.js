const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const responsable = require("./responsable");

const terrainSchema = new mongoose.Schema({
    place: {
        latitude: {
            type: Number,
            require: true
        },
        longitude: {
            type: Number,
            require: true
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
        require: true
    }
})


const Terrain = mongoose.model('Terain', terrainSchema)
module.exports = Terrain   