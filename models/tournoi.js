const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
var results = new Object();

const tournoiSchema = new mongoose.Schema({
    titre: {
        type: String,
        required: true
    },
    
    s_date: {
        type: Date,
        required: true

    },
    e_date: {
        type: Date,
        required: true

    } ,
    type: {
        type: String,
        required: true

    }, 
    numero_equipe: {
        type: Number,
        required: true

    } ,
    frais_inscription: {
        type: Number,
        required: true

    } ,
    lieu: {
        type: String,
        required: true

    },




    admin_id: { type: ObjectId, ref: 'Admin' },
    // hedi ay mch heka reni 3dltha chetha flblys bkl bli mch hek 
    // equipes: [{
    //     equipeId: {
    //         type: ObjectId, required: true,
    //         ref: "Equipe"
    //     },
    // }],


    // hey teri9a shiha
      equipes: [{
        
            type: ObjectId, required: false,
            ref: "Equipe"
        
    }],
}, { timestamps: true })





const Tournoi = mongoose.model('Tournoi', tournoiSchema)
module.exports = Tournoi   