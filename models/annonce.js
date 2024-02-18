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
    }
})


const Annonce = mongoose.model('Annonce', annonceSchema)
module.exports = Annonce   