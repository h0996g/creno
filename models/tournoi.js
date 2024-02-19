const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
var results = new Object();

const equipeSchema = new mongoose.Schema({
    titre: {
        type: String,
        unique: true
    },
    
    s_date: {
        type: Date,
        unique: true

    },
    e_date: {
        type: Date,
        unique: true

    } ,
    type: {
        type: String,
        unique: true

    }, 
    numero_equipe: {
        type: Number,
        unique: true

    } ,
    frais_inscription: {
        type: Number,
        unique: true

    } ,
    lieu: {
        type: String,
        unique: true

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





const Equipe = mongoose.model('Tournoi', tournoiSchema)
module.exports = Tournoi   