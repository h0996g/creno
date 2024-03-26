const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const terrainSchema = new mongoose.Schema({

    largeur: {
        type: Number,
        required: true
    },
    longeur: {
        type: Number,
        required: true
    },
    superficie: {
        type: Number,
        required: true
    },
    adresse: {
        type: String,
        required: true
    },
    // 3la gdh ybda journee
    s_temps: {
        type: String,
        required: true
    },
    // 3la gdh tkhls journe
    e_temps: {
        type: String,
        required: true
    },
    prix: {
        type: Number,
        required: true
    },

    description: {
        type: String,
        required: true
    },
    capacite: {
        type: Number,
        required: true
    },
    etat: {
        type: String,
        required: true
    },
    coordonnee: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    reservations: [{

        type: ObjectId, required: false,
        ref: "reservation"
    }],
    admin_id: { type: ObjectId, ref: 'Admin' },
    photos: [{ type: String }]


}, { timestamps: true }

)



terrainSchema.post('save', async function (doc, next) {
    try {
        // Update the admin document to push the new terrain ID into the terrains array
        await mongoose.model('Admin').updateOne(
            { _id: doc.admin_id },
            { $push: { terrains: doc._id } }
        );
    } catch (error) {
        console.error('Error updating admin with new terrain:', error);
    }
});


terrainSchema.pre('deleteOne', async function(next) {
    try {
        const terrainId = this.getQuery()._id;

        await mongoose.model('Reservation').deleteMany({ terrain_id: terrainId });
    
        // Update the admin document to remove the terrain ID from the terrains array
        await mongoose.model('Admin').updateOne(
            { terrains: terrainId },
            { $pull: { terrains: terrainId } }
        );
    } catch (error) {
        console.log(error);
    }
});



const Terrain = mongoose.model('Terrain', terrainSchema)
module.exports = Terrain   