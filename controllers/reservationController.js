const Reservation = require('../models/reservation')
const Terrain = require('../models/terrain')
const { ObjectId } = require('mongoose').Types;

exports.addReservation = async (req, res) => {
    const joueurId = req.user._id;
    const id_terrain = req.params.idterrain; // Assuming the terrain ID is passed in the route parameter
    const { jour, debut_temps, duree, etat, payment } = req.body;

    try {
        const newReservation = new Reservation({
            joueur_id: joueurId,
            terrain_id: id_terrain,
            jour,
            debut_temps,
            duree,
            etat,  // Default to "demander" if not provided
            payment,  // Default to "non" if not provided
        });
        await newReservation.save();
        res.status(201).json(newReservation);
    } catch (error) {
        console.error('Error creating reservation:', error);
        res.status(500).json({ message: "Failed to create reservation.", error: error.message });
    }
};

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


// Controller for finding all creneaus
// exports.findAllReservations = async (req, res, next) => {
//     try {
//         const reservations = await Reservation.find();
//         res.json(reservations);
//     } catch (error) {
//         next(error);
//     }
// };

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

// exports.filterReservations = async (req, res) => {
//     try {
//         const filter = { tarif, description } = req.query;
//         const reservations = await Reservation.find(filter);
//         res.json(reservations);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };


exports.filterReservations = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3; // How many documents to return
        const filter = req.query; // Use the entire query object as the filter
        
        if (req.query.cursor) {
            filter._id = { $lt: new ObjectId(req.query.cursor) };
        }
        
        // Fetch the documents from the database, sort by _id
        const reservations = await Reservation.find(filter).sort({ _id: -1 }).limit(limit);
        
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
        res.status(500).json({ error: error.message });
    }
};