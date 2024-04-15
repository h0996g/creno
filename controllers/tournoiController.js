const Tournoi = require('../models/tournoi');
const { ObjectId } = require('mongoose').Types;

exports.addTournoi = async (req, res) => {
    try {
        const { titre, debut_date, fin_date, type, numero_equipe, frais_inscription, lieu } = req.body;
        const admin_id = req.user._id;

        const newTournoiData = {
            titre,
            debut_date,
            fin_date,
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

//----------------------------
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
//----------------------------
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
//----------------------------
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

//----------------------------

exports.findAllTournois = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 3; // How many documents to return
        const query = {};
        
        if (req.query.cursor) {
            query._id = { $lt: new ObjectId(req.query.cursor) };
        }
        
        // Fetch the documents from the database, sort by _id
        const tournois = await Tournoi.find(query).sort({ _id: -1 }).limit(limit);
        
        // Determine if there's more data to fetch
        const moreDataAvailable = tournois.length === limit;

        // Optionally, you can fetch the next cursor by extracting the _id of the last document
        const nextCursor = moreDataAvailable ? tournois[tournois.length - 1]._id : null;

        res.json({
            data: tournois,
            moreDataAvailable,
            nextCursor,
        });
    } catch (error) {
        next(error);
    }
};


//----------------------------

exports.filterTournois = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3; // How many documents to return
        const filter = req.query; // Use the entire query object as the filter
        
        if (req.query.cursor) {
            filter._id = { $lt: new ObjectId(req.query.cursor) };
        }
        
        // Fetch the documents from the database, sort by _id
        const tournois = await Tournoi.find(filter).sort({ _id: -1 }).limit(limit);
        
        // Determine if there's more data to fetch
        const moreDataAvailable = tournois.length === limit;

        // Optionally, you can fetch the next cursor by extracting the _id of the last document
        const nextCursor = moreDataAvailable ? tournois[tournois.length - 1]._id : null;

        res.json({
            data: tournois,
            moreDataAvailable,
            nextCursor,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
