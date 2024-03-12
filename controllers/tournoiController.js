const Tournoi = require('../models/tournoi');

exports.addTournoi = async (req, res) => {
    try {
        const { titre, s_date, e_date, type, numero_equipe, frais_inscription, lieu } = req.body;
        const admin_id = req.user._id;

        const newTournoiData = {
            titre,
            s_date,
            e_date,
            type,
            numero_equipe,
            frais_inscription,
            lieu,
            admin_id
        };

        const newTournoi = new Tournoi(newTournoiData);
        await newTournoi.save();
        res.status(201).json(newTournoi);
    } catch (error) {
        res.json(error);
    }
};


exports.updateTournoi = async (req, res) => {
    try {
        const id = req.params.id;
        const tournoiData = req.body;
        const admin_id = req.user._id; // Extracting admin ID from the authenticated user
        const updatedTournoi = await Tournoi.findOneAndUpdate({ _id: id, admin_id: admin_id }, tournoiData, { new: true });
        if (!updatedTournoi) {
            return res.status(404).json({ message: 'Tournament not found or unauthorized' });
        }
        res.json(updatedTournoi);
    } catch (error) {
        res.json(error);
    }
};

exports.deleteTournoi = async (req, res) => {
    try {
        const id = req.params.id;
        const admin_id = req.user._id; // Extracting admin ID from the authenticated user
        const deletedTournoi = await Tournoi.deleteOne({ _id: id, admin_id: admin_id });
        if (!deletedTournoi) {
            return res.status(404).json({ message: 'Tournament not found or unauthorized' });
        }
        res.status(204).end();
    } catch (error) {
        res.json(error);
    }
};

// Controller for finding a tournament by ID
exports.findTournoiById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const tournoi = await Tournoi.findById(id);
        if (!tournoi) {
            return res.status(404).json({ message: 'Tournament not found' });
        }
        res.json(tournoi);
    } catch (error) {
        next(error);
    }
};

// Controller for finding all tournaments
exports.findAllTournois = async (req, res, next) => {
    try {
        const tournois = await Tournoi.find();
        res.json(tournois);
    } catch (error) {
        next(error);
    }
};
exports.filterTournois = async (req, res) => {
    try {
        const filter = req.query;

        const tournois = await Tournoi.find(filter);
        res.json(tournois);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
