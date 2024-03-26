// const mongoose = require('mongoose');
// const ObjectId = mongoose.Types.ObjectId;

// const creneauSchema = new mongoose.Schema({
//    jour: {
//       type: String,
//       required: true
//    },
//    s_temps: {
//       type: String,
//       required: true
//    },
//    e_temps: {
//       type: String,
//       required: true
//    },
//    //hedi tsma gdh nsmena yhkmo mital 3 chehor tjihum 12 smena 
//    duree: {
//       type: String,
//       required: true
//    },
//    tarif: {
//       type: String,
//       required: true
//    },
//    etat: {
//       type: String,
//       required: true
//    },


//    payment: {
//       type: String,
      
//       default : "non"
//    },
//    joueur_id: { type: ObjectId, ref: 'Joueur' ,required:false },
//    joueurs: [{

//       type: ObjectId, required: false,
//       ref: "Joueur"

//    }],
//    terrain_id: { type: ObjectId, ref: 'Terrain',required:false },
// })



// // creneauSchema.post('save', async function (doc, next) {
// //    try {
// //        const terrain = await mongoose.model('Terrain').findById(doc.terrain_id);
// //        terrain.creneaus.push(doc._id);

// //        await terrain.save();
// //    } catch (error) {
// //        console.error('Error updating admin with new terrain:', error);
// //    }
// // }
// // );

// creneauSchema.post('save', async function (doc, next) {
//    try {
//        // Update the terrain document to push the creneau ID to the creneaus array
//        await mongoose.model('Terrain').updateOne(
//            { _id: doc.terrain_id },
//            { $push: { creneaus: doc._id } }
//        );
//    } catch (error) {
//        console.error('Error updating terrain with new creneau:', error);
//    }
// });




// creneauSchema.pre('deleteOne', async function(next) {
//    try {
//        const creneauId = this.getQuery()._id;

//        // Update Terrain document
//        await mongoose.model('Terrain').updateOne(
//            { creneaus: creneauId },
//            { $pull: { creneaus: creneauId } }
//        );

//        // Update Joueur documents in creneaus_finale array
//        await mongoose.model('Joueur').updateOne(
//            { creneaus_finale: creneauId },
//            { $pull: { creneaus_finale: creneauId } }
//        );

//        // Update Joueur documents in creneaus_reserve array
//        await mongoose.model('Joueur').updateMany(
//            { creneaus_reserve: creneauId },
//            { $pull: { creneaus_reserve: creneauId } }
//        );

//    } catch (error) {
//        console.log(error);
//    }
// });








// const Creneau = mongoose.model('Creneau', creneauSchema)
// module.exports = Creneau  