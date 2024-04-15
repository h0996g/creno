const mongoose = require('mongoose');
 const ObjectId = mongoose.Types.ObjectId;

const annonceSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    wilaya: { type: String },
    commune: { type: String },

    terrain_id: { type: ObjectId, ref: 'Terrain',required: false },

    joueur_id: { type: ObjectId, ref: 'Joueur',required: false },
    admin_id: { type: ObjectId, ref: 'Admin',required: false }
}, { timestamps: true })








annonceSchema.post('save', async function(doc, next) {
    try {
        // Check if the annonce has an admin_id
        if (doc.admin_id) {
            await mongoose.model('Admin').updateOne(
                { _id: doc.admin_id },
                { $push: { annonces: doc._id } }
            );
        }

        // Check if the annonce has a joueur_id
        if (doc.joueur_id) {
            await mongoose.model('Joueur').updateOne(
                { _id: doc.joueur_id },
                { $push: { annonces: doc._id } }
            );
        }
    } catch (error) {
        console.error('Error updating admin/joueur with new annonce:', error);
        next(error);
    }
});







annonceSchema.pre('deleteOne', async function(next) {
    try {
        const annonceId = this.getQuery()._id;

        // Remove the annonce ID from the admin's annonces array
        await mongoose.model('Admin').updateOne(
            { annonces: annonceId },
            { $pull: { annonces: annonceId } }
        );

        // Remove the annonce ID from the joueur's annonces array
        await mongoose.model('Joueur').updateOne(
            { annonces: annonceId },
            { $pull: { annonces: annonceId } }
        );

        next();
    } catch (error) {
        console.error('Error removing annonce from admin/joueur:', error);
        next(error);
    }
});





const Annonce = mongoose.model('Annonce', annonceSchema)
module.exports = Annonce   