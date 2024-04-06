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
   


   
      equipes: [{
        
            type: ObjectId, required: false,
            ref: "Equipe"
        
    }],
}, { timestamps: true })






tournoiSchema.post('save', async function (doc, next) {
    try {
        // Update the admin document to add the new tournoi ID to the tournois array
        await mongoose.model('Admin').updateOne(
            { _id: doc.admin_id },
            { $push: { tournois: doc._id } }
        );
    } catch (error) {
        console.error('Error updating admin with new tournoi:', error);
    }
});





tournoiSchema.pre('deleteOne', async function(next) {
    try {
        const tournoiId = this.getQuery()._id;

        // Update admin document to remove tournoiId from the tournois array
        await mongoose.model('Admin').updateOne(
            { tournois: tournoiId },
            { $pull: { tournois: tournoiId } }
        );

        // Update all equipe documents to remove tournoiId from the tournois array
        await mongoose.model('Equipe').updateMany(
            { tournois: tournoiId },
            { $pull: { tournois: tournoiId } }
        );
    } catch (error) {
        console.log(error);
    }
});





const Tournoi = mongoose.model('Tournoi', tournoiSchema)
module.exports = Tournoi   