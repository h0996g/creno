const Reservation = require('../models/reservation')
const Terrain = require('../models/terrain')
const { ObjectId } = require('mongoose').Types;

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
exports.adminAddReservation = async (req, res) => {
    // const joueurId = req.user._id; //! rj3to fl body bh admin li yb3to
    const id_terrain = req.params.idterrain; // Assuming the terrain ID is passed in the route parameter
    const etat = 'reserver';
    const payement = true;
    const { jour, heure_debut_temps, duree, joueur_id } = req.body;

    try {
        const newReservation = new Reservation({
            joueur_id,
            terrain_id: id_terrain,
            jour,
            heure_debut_temps,
            duree,
            etat: etat, // is always reserver
            payment: payement,  // is always true
        });
        await newReservation.save();
        const startDay = new Date(jour);
        for (let i = 1; i <= duree - 1; i++) {
            const newDay = new Date(startDay);
            newDay.setDate(newDay.getDate() + 7 * i);

            const newReservation = new Reservation({
                jour: newDay,
                heure_debut_temps: heure_debut_temps,
                duree: duree,
                etat: etat,
                payment: payement,
                joueur_id: joueur_id,
                terrain_id: id_terrain
            });

            await newReservation.save();
        }


        res.status(201).json(newReservation);
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
exports.getMyReservationJoueur = async (req, res) => {
    try {
        const joueur_id = req.user._id;
        const filter = req.query;
        const reservation = await Reservation.find({ joueur_id: joueur_id, ...filter });
        res.json(reservation);
    } catch (error) {
        res.json({ message: error.message });
    }
};
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
        const limit = parseInt(req.query.limit) || 20; // How many documents to return
        const filter = req.query; // Use the entire query object as the filter

        if (req.query.cursor) {
            filter._id = { $lt: new ObjectId(req.query.cursor) };
        }

        // Fetch the documents from the database, sort by _id
        const reservations = await Reservation.find(filter).sort({ _id: -1 }).limit(limit).populate([{
            path: 'joueur_id',
            select: 'username telephone'
        }, {
            path: 'terrain_id',
            select: 'nom'
        }]);

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