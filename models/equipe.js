const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const equipeSchema = new mongoose.Schema({
    nom: {
        type: String,
        unique: true
    },
    numero_joueurs: {
        type: Number,
        required: true
    },
    joueurs: [{

        type: ObjectId, required: true,
        ref: "Joueur"

    }],
    capitaine_id: {
        type: ObjectId, required: true,
        ref: "Joueur"

    },
    wilaya: {
        type: String,
        required: false
    },

}, { timestamps: true })





const Equipe = mongoose.model('Equipe', equipeSchema)
module.exports = Equipe   