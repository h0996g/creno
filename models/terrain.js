const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const terrainSchema = new mongoose.Schema({

    largeur: {
        type: Number,
        required: true
    },
    longeur: {
        type: Number,
        required: true
    },
    superficie: {
        type: Number,
        required: true
    },
    adresse: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    capacite: {
        type: String,
        required: true
    },
    etat: {
        type: String,
        required: true
    },
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
    creneaus: [{

        type: ObjectId, required: false,
        ref: "creneau"
    }],
    admin_id: { type: ObjectId, ref: 'Admin' },
    photos: [{ type: ObjectId, ref: 'Photo' }]


}, { timestamps: true }

)


const Terrain = mongoose.model('Terrain', terrainSchema)
module.exports = Terrain   