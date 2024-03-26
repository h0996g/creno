const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const reservationSchema = new mongoose.Schema({
   jour: {
      type: Date,
      required: true
   },
   s_temps: {
      type: String,
      required: true
   },
//    e_temps: {
//       type: String,
//       required: true
//    },
   //hedi tsma gdh nsmena yhkmo mital 3 chehor tjihum 12 smena 
   duree: {
      type: Number,
      required: false
   },
   tarif: {
      type: Number,
      required: false
   },
   // kyn demander w accepter w refuser
   etat: {
      type: String,
      required: true,
      default:"demander"
   },

// la rservation est paye ou nn
   payment: {
      type: String,
      
      default : "non"
   },
   // kul reservation tntmi ljoueur
   joueur_id: { type: ObjectId, ref: 'Joueur' ,required:false },
//    joueurs: [{

//       type: ObjectId, required: false,
//       ref: "Joueur"

//    }],
   terrain_id: { type: ObjectId, ref: 'Terrain',required:false },
})





reservationSchema.post('save', async function (doc, next) {
   try {
       // Update the terrain document to push the creneau ID to the creneaus array
       await mongoose.model('Terrain').updateOne(
           { _id: doc.terrain_id },
           { $push: { reservations: doc._id } }
       );

       await mongoose.model('Joueur').updateOne(
        { _id: doc.joueur_id },
        { $push: { reservations: doc._id } }
    );


   } catch (error) {
       console.error('Error updating terrain with new reservation:', error);
   }
});




reservationSchema.pre('deleteOne', async function(next) {
   try {
       const reservationId = this.getQuery()._id;

       // Update Terrain document
       await mongoose.model('Terrain').updateOne(
           { reservations: reservationId },
           { $pull: { reservations: reservationId } }
       );

       // Update Joueur documents in creneaus_finale array
       await mongoose.model('Joueur').updateOne(
           { reservations: reservationId },
           { $pull: { reservations: reservationId } }
       );

 

   } catch (error) {
       console.log(error);
   }
});








const Reservation = mongoose.model('Reservation', reservationSchema)
module.exports = Reservation  