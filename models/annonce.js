const mongoose = require('mongoose');
// const ObjectId = mongoose.Types.ObjectId;

const annonceSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },


    joueur_id: { type: ObjectId, ref: 'Joueur',required: false },
    admin_id: { type: ObjectId, ref: 'Admin',required: false }
}, { timestamps: true })


const Annonce = mongoose.model('Annonce', annonceSchema)
module.exports = Annonce   