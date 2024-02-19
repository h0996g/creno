const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
// var results = new Object();

const equipeSchema = new mongoose.Schema({
    nom: {
        type: String,
        unique: true
    },
    numero_joueurs: {
        type: Int16Array,
        required: true
    },
    joueurs: [{
        
            type: ObjectId, required: true,
            ref: "Joueur"
        
    }],
    capitaine_id: {
        type: ObjectId, required: true,
        ref: "Joueur"

    }

}, { timestamps: true })





const Equipe = mongoose.model('Equipe', equipeSchema)
module.exports = Equipe   