const Reservation = require('../models/reservation')
const Terrain = require('../models/terrain')
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = require('mongoose').Types;
const mongoose = require('mongoose');


exports.addReservation = async (req, res) => {
    const joueurId = req.user._id;

    const id_terrain = req.params.idterrain; // Assuming the terrain ID is passed in the route parameter
    const { jour, heure_debut_temps, duree } = req.body;

    try {
        const newReservation = new Reservation({
            joueur_id: joueurId,
            terrain_id: id_terrain,
            jour,
            heure_debut_temps,
            duree,

        });
        await newReservation.save();
        res.status(201).json(newReservation);
    } catch (error) {
        console.error('Error creating reservation:', error);
        res.status(500).json({ message: "Failed to create reservation.", error: error.message });
    }
};
exports.setReserveWithAdmin = async (req, res) => {
    // const id_terrain = req.params.idterrain;
    const etat = 'reserver';
    const payment = true;
    // const { jour, heure_debut_temps, duree, joueur_id } = req.body;

    // const reservation_group_id = uuidv4(); // Generate a unique group ID for this series of reservations
    const id = req.params.id;
    const updatedReservation = await Reservation.findOneAndUpdate({ _id: id }, { etat: etat, payment: payment, reservation_group_id: id }, { new: true });
    const reservation_group_id = updatedReservation.id;

    try {
        for (let i = 1; i < updatedReservation.duree; i++) {
            const newDay = new Date(updatedReservation.jour);
            newDay.setDate(newDay.getDate() + 7 * i);

            const newReservation = new Reservation({
                joueur_id: updatedReservation.joueur_id,
                terrain_id: updatedReservation.terrain_id,
                jour: newDay,
                heure_debut_temps: updatedReservation.heure_debut_temps,
                duree: updatedReservation.duree,
                etat: updatedReservation.etat,
                payment: updatedReservation.payment,
                reservation_group_id // Assign the group ID to each reservation
            });

            await newReservation.save();
        }

        res.status(201).json({ message: 'Reservations created successfully with group ID: ' + reservation_group_id });
    } catch (error) {
        console.error('Error creating reservation:', error);
        res.status(500).json({ message: "Failed to create reservation.", error: error.message });
    }
};


exports.adminAddReservation = async (req, res) => {
    const id_terrain = req.params.idterrain;
    const etat = 'reserver';
    const payment = true;
    const { jour, heure_debut_temps, duree, joueur_id } = req.body;
    const reservation_group_id = uuidv4(); // Generate a unique group ID for this series of reservations

    try {
        for (let i = 0; i < duree; i++) {
            const newDay = new Date(jour);
            newDay.setDate(newDay.getDate() + 7 * i);

            const newReservation = new Reservation({
                joueur_id,
                terrain_id: id_terrain,
                jour: newDay,
                heure_debut_temps,
                duree,
                etat,
                payment,
                reservation_group_id  // Assign the group ID to each reservation
            });

            await newReservation.save();
        }

        res.status(201).json({ message: 'Reservations created successfully with group ID: ' + reservation_group_id });
    } catch (error) {
        console.error('Error creating reservation:', error);
        res.status(500).json({ message: "Failed to create reservation.", error: error.message });
    }
};


//----------------------------
// Controller for updating a creneau
exports.updateReservation = async (req, res, next) => {
    try {

        const id = req.params.id;
        const ReservationDataToUpdate = req.body;
        const updatedReservation = await Reservation.findOneAndUpdate({ _id: id }, ReservationDataToUpdate, { new: true });
        if (!updatedReservation) {
            return res.status(404).json({ message: 'Creneau not found or unauthorized' });
        }
        res.json(updatedReservation);
    } catch (error) {
        res.json(error);
    }
};

//----------------------------
// Controller for deleting a creneau
exports.deleteReservation = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedReservation = await Reservation.deleteOne({ _id: id });
        if (!deletedReservation) {
            return res.status(404).json({ message: 'Creneau not found or unauthorized' });
        }
        res.status(204).end();
    } catch (error) {
        res.json(error);
    }
};
exports.deleteReservationGroup = async (req, res) => {
    const groupId = req.params.groupId; // Assume the group ID is passed as a route parameter

    try {
        const reservations = await Reservation.find({ reservation_group_id: groupId });
        reservations.forEach(async (reservation) => {
            await mongoose.model('Terrain').updateOne(
                { reservations: reservation._id },
                { $pull: { reservations: reservation._id } }
            );
            await mongoose.model('Joueur').updateOne(
                { reservations: reservation._id },
                { $pull: { reservations: reservation._id } }
            );
        });
        const deletedReservations = await Reservation.deleteMany({ reservation_group_id: groupId });
        res.status(204).json({
            message: 'All reservations in the group deleted successfully',
            deletedCount: deletedReservations.deletedCount
        });
    } catch (error) {
        console.error('Error deleting reservation group:', error);
        res.status(500).json({ message: "Failed to delete reservation group.", error: error.message });
    }
};
//----------------------------
// Controller for finding a creneau by ID
exports.findReservationById = async (req, res, next) => {
    try {
        const id = req.params;
        const reservation = await Reservation.findById(id);
        if (!reservation) {
            return res.status(404).json({ message: 'reservation not found' });
        }
        res.json(reservation);
    } catch (error) {
        res.json(error);
    }
};

//----------------------------

exports.findAllReservations = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 3; // How many documents to return
        const query = {};

        if (req.query.cursor) {
            query._id = { $lt: new ObjectId(req.query.cursor) };
        }

        // Fetch the documents from the database, sort by _id
        const reservations = await Reservation.find(query).sort({ _id: -1 }).limit(limit);

        // Determine if there's more data to fetch
        const moreDataAvailable = reservations.length === limit;

        // Optionally, you can fetch the next cursor by extracting the _id of the last document
        const nextCursor = moreDataAvailable ? reservations[reservations.length - 1]._id : null;

        res.json({
            data: reservations,
            moreDataAvailable,
            nextCursor,
        });
    } catch (error) {
        next(error);
    }
};

//----------------------------

exports.filterReservations = async (req, res) => {
    try {
        const filter = req.query;
        const reservations = await Reservation.find(filter);
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// exports.getMyReservationJoueur = async (req, res) => {
//     try {
//         const joueur_id = req.user._id;
//         const filter = req.query;
//         const reservation = await Reservation.find({ joueur_id: joueur_id, ...filter });
//         res.json(reservation);
//     } catch (error) {
//         res.json({ message: error.message });
//     }
// };
exports.getReservationsWithConditions = async (req, res) => {
    try {
        const joueur_id = req.user._id;

        const filter = {};
        filter.terrain_id = req.params.idterrain;
        filter.jour = req.params.jour;

        // Fetching all reservations for the current joueur (payment true or false)
        // and all reservations for other joueurs but only where payment is true
        const reservations = await Reservation.find({
            $and: [
                filter,
                {
                    $or: [
                        { joueur_id: joueur_id }, // All reservations of the logged-in joueur
                        { payment: true } // All reservations of other joueurs with payment true
                    ]
                }
            ]
        });
        res.json(reservations);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({ message: "Failed to fetch reservations.", error: error.message });
    }
};

exports.filterReservationsPagination = async (req, res) => {
    try {
        const admin_id = req.user._id;
        const limit = parseInt(req.query.limit) || 20; // How many documents to return
        const filter = req.query; // Use the entire query object as the filter
        if (req.query.cursor) {
            filter._id = { $lt: new ObjectId(req.query.cursor) };
        }
        const terrains = await Terrain.find({ admin_id: new ObjectId(admin_id) }).select('id');   // Fetch all terrain IDs for the current admin
        const terrainIds = terrains.map(terrain => terrain.id); // Extract the IDs from the documents (3la jal bh y9der yjib ghir les reservation li kayna f terrain t3 admin brk  )
        console.log('Terrain IDs:', terrainIds);
        // filter.terrain_id = { $in: terrainIds };

        if (terrainIds.includes((filter.terrain_id))) {
            filter.terrain_id = (filter.terrain_id);
        } else {
            filter.terrain_id = { $in: terrainIds };
        }
        const reservations = await Reservation.find(filter).sort({ _id: -1 }).limit(limit).populate({
            path: 'terrain_id',
            select: 'nom admin_id',
        })
            .populate({
                path: 'joueur_id',
                select: 'username telephone'
            });

        // Determine if there's more data to fetch
        const moreDataAvailable = reservations.length === limit;

        // Optionally, you can fetch the next cursor by extracting the _id of the last document
        const nextCursor = moreDataAvailable ? reservations[reservations.length - 1]._id : '';

        res.json({
            data: reservations,
            moreDataAvailable,
            nextCursor,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.connectReservationsWithEquipe = async (req, res) => {
    try {
        const equipe_id1 = req.body.equipe_id1;
        const equipe_id2 = req.body.equipe_id2;
        const reservation_id = req.body.reservation_id;
        const reservation_group_id = req.body.reservation_group_id;

        // Update the reservations with the equipe and tournoi IDs
        if (reservation_group_id != null) {
            await Reservation.updateMany({ reservation_group_id }, { equipe_id1, equipe_id2 });
        } else {
            await Reservation.findByIdAndUpdate(reservation_id, { equipe_id1, equipe_id2 });
        }
        res.json({ message: 'Reservations connected to equipe successfully' });
    } catch (error) {
        console.error('Error connecting reservations to equipe:', error);
        res.status(500).json({ message: "Failed to connect reservations to equipe.", error: error.message });
    }
}


//get just one 
exports.getMyReservationJoueur = async (req, res) => {
    try {
        const joueur_id = req.user._id;
        const filter = req.query;
        const reservation = await Reservation.findOne({ joueur_id: joueur_id, ...filter }).populate({
            path: 'equipe_id1',
            select: 'nom numero_joueurs wilaya commune vertial',
            populate: [
                { path: 'joueurs', select: 'username age poste' },
                { path: 'attente_joueurs', select: 'username age poste' },
                { path: 'capitaine_id', select: 'username' }
            ]
        })
            .populate({
                path: 'equipe_id2',
                select: 'nom numero_joueurs wilaya commune',
                populate: [
                    { path: 'joueurs', select: 'username age poste' },
                    { path: 'capitaine_id', select: 'username' }
                ]
            });
        if (reservation == null) {
            return res.status(404).json({ message: 'reservation not found' });
        }
        res.json(reservation);
    } catch (error) {
        res.json({ message: error.message });
    }
}
exports.getOtherReservationJoueur = async (req, res) => {
    try {
        // const joueur_id = req.user._id;
        const filter = req.query;
        const reservation = await Reservation.findOne(filter).populate({
            path: 'equipe_id1',
            select: 'nom numero_joueurs wilaya commune vertial',
            populate: [
                { path: 'joueurs', select: 'username age poste' },
                { path: 'attente_joueurs', select: 'username age poste' },
                { path: 'capitaine_id', select: 'username' }
            ]
        })
            .populate({
                path: 'equipe_id2',
                select: 'nom numero_joueurs wilaya commune',
                populate: [
                    { path: 'joueurs', select: 'username age poste' },
                    { path: 'capitaine_id', select: 'username' }
                ]
            });
        if (reservation == null) {
            return res.status(404).json({ message: 'reservation not found' });
        }
        res.json(reservation);
    } catch (error) {
        res.json({ message: error.message });
    }
}


exports.deleteDemandeByJouer = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedReservation = await Reservation.deleteOne({ _id: id, joueur_id: req.user._id, etat: 'demander' });
        if (!deletedReservation) {
            return res.status(404).json({ message: 'Creneau not found or unauthorized' });
        }
        res.status(204).end();
    } catch (error) {
        res.json(error);
    }
};