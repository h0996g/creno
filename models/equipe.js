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

    attente_joueurs: [{

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


// equipeSchema.post('save', async function (doc, next) {
//     try {
//         const joueur = await mongoose.model('Joueur').findById(doc.capitaine_id);
//         joueur.mes_equipes.push(doc._id);
//         joueur.equipes.push(doc._id);

//         await joueur.save();
//     } catch (error) {
//         console.error('Error updating admin with new terrain:', error);
//     }
// }
// );


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




// equipeSchema.pre('deleteOne', async function (next) {
//     try {
//         const equipeId = this.getQuery()._id;
       
//         const joueurs = await mongoose.model('Joueur').find({ equipes: equipeId });

//         for (const joueur of joueurs) {
//             joueur.equipes.pull(equipeId);
//             await joueur.save();
//         }

//         const joueurss = await mongoose.model('Joueur').find({ demande_equipes: equipeId });

//         for (const joueur of joueurss) {
//             joueur.demande_equipes.pull(equipeId);
//             await joueur.save();
//         }




//         const joueur = await mongoose.model('Joueur').findOne({ mes_equipes: equipeId });
        
//         if (joueur) {
//             // Remove the terrain ID from the admin's terrains array
//             joueur.mes_equipes.pull(equipeId);
//             await joueur.save();
//         }



//         const tournois = await mongoose.model('Tournoi').find({ equipes: equipeId });

//         for (const tournoi of tournois) {
//             tournoi.equipes.pull(equipeId);
//             await tournoi.save();
//         }
        

   



//     } catch (error) {
//         console.log(error);
//     }
// });


equipeSchema.pre('deleteOne', async function(next) {
    try {
        const equipeId = this.getQuery()._id;

        // Update all joueurs associated with the equipe and remove equipeId from their equipes array
        await mongoose.model('Joueur').updateMany(
            { equipes: equipeId },
            { $pull: { equipes: equipeId } }
        );

        // Update all joueurs with demande_equipes containing equipeId and remove it
        await mongoose.model('Joueur').updateMany(
            { demande_equipes: equipeId },
            { $pull: { demande_equipes: equipeId } }
        );

        // Find the joueur with mes_equipes containing equipeId and remove it
        // const joueur = await mongoose.model('Joueur').findOne({ mes_equipes: equipeId });
        // if (joueur) {
            await mongoose.model('Joueur').updateOne(
                { _id: joueur._id },
                { $pull: { mes_equipes: equipeId } }
            );
        // }

        // Update all tournois associated with the equipe and remove equipeId from their equipes array
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