const mongoose = require('mongoose');
const { findAllTerrains } = require('../controllers/terrainController');
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
        type: ObjectId, required: false,
        ref: "Joueur"

    }],
// les joueures li invitithum 
    attente_joueurs: [{

        type: ObjectId, required: false,
        ref: "Joueur"

    }],
    // les joueurs li demandaw ydkhlo 3ndi 
    attente_joueurs_demande: [{

        type: ObjectId, required: false,
        ref: "Joueur"

    }],

    capitaine_id: {
        type: ObjectId, required: true,
        ref: "Joueur"

    },

    tournois: [{

        type: ObjectId, required: false,
        ref: "Tournoi"

    }],


    wilaya: {
        type: String,
        required: false
    },

}, { timestamps: true })





equipeSchema.post('save', async function (doc, next) {
    try {
        const joueur = await mongoose.model('Joueur').findById(doc.capitaine_id);

        // Update the joueur document to push the equipe ID to both mes_equipes and equipes arrays
        await mongoose.model('Joueur').updateOne(
            { _id: doc.capitaine_id },
            { $push: { mes_equipes: doc._id, equipes: doc._id } }
        );
    } catch (error) {
        console.error('Error updating joueur with new equipe:', error);
    }
});












equipeSchema.pre('deleteOne', async function (next) {
    try {
        const equipeId = this.getQuery()._id;

        // Update all joueurs associated with the equipe and remove equipeId from their equipes array
        await mongoose.model('Joueur').updateMany(
            { equipes: equipeId },
            { $pull: { equipes: equipeId } }
        );


        await mongoose.model('Joueur').updateMany(
            { demande_equipes: equipeId },
            { $pull: { demande_equipes: equipeId } }
        );

        await mongoose.model('Joueur').updateOne(
            { _id: this.getQuery.capitaine_id },
            { $pull: { mes_equipes: equipeId } }
        );



        await mongoose.model('Tournoi').updateMany(
            { equipes: equipeId },
            { $pull: { equipes: equipeId } }
        );
    } catch (error) {
        console.log(error);
    }
});






const Equipe = mongoose.model('Equipe', equipeSchema)
module.exports = Equipe   