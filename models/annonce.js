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


    joueur_id: { type: ObjectId, ref: 'Joueur',required: false },
    admin_id: { type: ObjectId, ref: 'Admin',required: false }
}, { timestamps: true })




// annonceSchema.post('save',  async function (doc, next) {
//     try {
//         // Check if the annonce has an admin_id
//         if (doc.admin_id) {
           
//             const admin =  await mongoose.model('Admin').findById(doc.admin_id);
//             if (admin) {
//                 admin.annonces.push(doc._id);
//                 await admin.save();
//             } else {
//                 console.error('Admin not found for the annonce.');
//             }
//         }
//         // Check if the annonce has a joueur_id
//         if (doc.joueur_id) {
            
//             const joueur =  await mongoose.model('Joueur').findById(doc.joueur_id);
//             if (joueur) {
//                 joueur.annonces.push(doc._id);
//                 await joueur.save();
//             } else {
//                 console.error('Joueur not found for the annonce.');
//             }
//         }

        
//     } catch (error) {
//         console.error('Error updating admin/joueur with new annonce:', error);
//         next(error);
//     }
// });



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




// annonceSchema.pre('deleteOne', async function (next) {
//     try {
//         const annonceId = this.getQuery()._id;

//         // Find the admin associated with the annonce being deleted
//         const admin = await mongoose.model('Admin').findOne({ annonces: annonceId });
//         if (admin) {
//             // Remove the annonce ID from the admin's annonces array
//             admin.annonces.pull(annonceId);
//             await admin.save();
//         }

//         // Find the joueur associated with the annonce being deleted
//         const joueur = await mongoose.model('Joueur').findOne({ annonces: annonceId });
//         if (joueur) {
//             // Remove the annonce ID from the joueur's annonces array
//             joueur.annonces.pull(annonceId);
//             await joueur.save();
//         }

//         next();
//     } catch (error) {
//         console.error('Error removing annonce from admin/joueur:', error);
//         next(error);
//     }
// });


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