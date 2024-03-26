const Reservation = require('../models/reservation')


// Controller for adding a new creneau
exports.addReservation = async (req, res, next) => {
    try {
        const joueurId = req.user._id;;
        const id_terrain = req.params.idterrain;
        const { jour, s_temps,  duree, tarif, etat, payment ,terrain_id ,joueur_id } = req.body;
        const newReservationData = {
            
            jour,
            s_temps,
            duree,
            tarif,
            etat,
            payment,
            terrain_id : id_terrain,
            joueur_id : joueurId
           
        };
        const newReservation = new Reservation(newReservationData);
        await newReservation.save();
        res.status(201).json(newReservation);
    } catch (error) {
        res.json(error);
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
        const  id = req.params;
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
exports.findAllReservations = async (req, res, next) => {
    try {
        const reservations = await Reservation.find();
        res.json(reservations);
    } catch (error) {
        next(error);
    }
};

exports.filterReservations = async (req, res) => {
    try {
        const filter  ={ tarif , description }= req.query; 
        const reservations = await Reservation.find(filter);
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};