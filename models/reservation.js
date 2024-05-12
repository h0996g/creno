const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const reservationSchema = new mongoose.Schema({
    jour: { type: Date, required: true },
    //  s_temps: "08:00" example to start time of the reservation
    heure_debut_temps: { type: String, required: true },

    //  duree de la reservation par semain example 4 semain and jour is dimanche it means this dimanche and the next 3 dimanche
    duree: { type: Number, required: false },

    //  demander w accepter w refuser
    etat: { type: String, required: true, default: "demander" },

    // la rservation est paye ou nn
    payment: { type: Boolean, default: false },

    reservation_group_id: { type: String, required: false },

    joueur_id: { type: ObjectId, ref: 'Joueur', required: false },

    terrain_id: { type: ObjectId, ref: 'Terrain', required: false },

    equipe_id1: { type: ObjectId, ref: 'Equipe', required: false },
    equipe_id2: { type: ObjectId, ref: 'Equipe', required: false },
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

reservationSchema.pre('deleteOne', async function (next) {
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

reservationSchema.pre('deleteMany', async function (next) {
    try {
        // console.log('deleteMany');
        // const filter = this.getFilter();
        // console.log(filter);
        const reservationId = this.getQuery().reservation_group_id;

        // // // Update Terrain document
        await mongoose.model('Terrain').updateMany(
            { reservations: reservationId },
            { $pull: { reservations: reservationId } }
        );

        // // Update Joueur documents in creneaus_finale array
        await mongoose.model('Joueur').updateMany(
            { reservations: reservationId },
            { $pull: { reservations: reservationId } }
        );



    } catch (error) {
        console.log(error);
    }
});

const Reservation = mongoose.model('Reservation', reservationSchema)
module.exports = Reservation  