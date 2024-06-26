const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


const terrainSchema = new mongoose.Schema({
    nom: { type: String, required: true, unique: true },
    largeur: { type: Number, required: true },
    longeur: { type: Number, required: true },
    superficie: { type: Number, },
    wilaya: { type: String, required: false },
    commune: { type: String, required: false },
    adresse: { type: String, required: true },
    heure_debut_temps: { type: String, required: true }, // Operational start time (e.g., "08:00")
    heure_fin_temps: { type: String, required: true }, // Operational end time (e.g., "23:00")
    duree_creneau: { type: String, required: true },
    prix: { type: Number, required: true },
    description: { type: String, required: true },
    capacite: { type: Number, required: true },
    etat: { type: String, required: true, default: "disponible" },
    coordonnee: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    reservations: [{ type: ObjectId, ref: "Reservation" }],
    nonReservableTimeBlocks: [{
        day: {
            type: String,
            enum: ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

        },
        hours: [{ type: String }] // Array of hours that are non-reservable
    }],
    admin_id: { type: ObjectId, ref: 'Admin' },
    photos: [{ type: String }],
}, { timestamps: true },);

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

terrainSchema.pre('deleteOne', async function (next) {
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