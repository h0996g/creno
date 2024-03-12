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
   etat: {
      type: String,
      required: true
   },



   joueur_id: { type: ObjectId, ref: 'Joueur' ,required:false },
   joueurs: [{

      type: ObjectId, required: false,
      ref: "Joueur"

   }],
   terrain_id: { type: ObjectId, ref: 'Terrain',required:false },
})



creneauSchema.post('save', async function (doc, next) {
   try {
       const terrain = await mongoose.model('Terrain').findById(doc.terrain_id);
       terrain.creneaus.push(doc._id);

       await terrain.save();
   } catch (error) {
       console.error('Error updating admin with new terrain:', error);
   }
}
);



creneauSchema.pre('deleteOne',  async function(next) {
   try {


       const creneauId = this.getQuery()._id;

       
       const terrain = await mongoose.model('Terrain').findOne({ creneaus: creneauId });
       
       if (terrain) {
           terrain.creneaus.pull(creneauId);
           await terrain.save();
       }

       const joueurres = await mongoose.model('Joueur').findOne({ creneaus_finale: creneauId });
       
       if (joueurres) {
           joueurres.creneaus_finale.pull(creneauId);
           await joueurres.save();
       }


       const joueurs = await mongoose.model('Joueur').find({ creneaus_reserve: creneauId });

       for (const joueur of joueurs) {
           joueur.creneaus_reserve.pull(creneauId);
           await joueur.save();
       }


   } catch (error) {
       console.log(error);
   }
});







const Creneau = mongoose.model('Creneau', creneauSchema)
module.exports = Creneau  