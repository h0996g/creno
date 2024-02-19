const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const creneauSchema = new mongoose.Schema({
    jour: {
        type: String,
        required: true 
   },
   s_temps: {
    type: String,
    required: true 
   },
   e_temps: {
    type: String,
    required: true 
   },
//hedi tsma gdh nsmena yhkmo mital 3 chehor tjihum 12 smena 
   duree: {
    type: String,
    required: true 
   },
   tarif: {
    type: String,
    required: true 
   },




   joueur_id: { type: ObjectId, ref: 'Joueur' },
   terrain_id: { type: ObjectId, ref: 'terrain' },
})


const Creneau = mongoose.model('Creneau', creneauSchema)
module.exports = Creneau  