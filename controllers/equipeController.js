const Equipe = require('../models/equipe');
const Tournoi = require('../models/tournoi');
const { ObjectId } = require('mongoose').Types;

//----------------------------

exports.createEquipe = async (req, res) => {
    try {
        const id = req.user._id;
        const { nom, numero_joueurs, joueurs, wilaya, capitaine_id } = req.body;

        // Check if a team with the same name already exists
        const existingEquipe = await Equipe.findOne({ nom });
        if (existingEquipe) {
            return res.status(409).json({ message: 'A team with this name already exists.' });
        }

        // If the team name does not exist, create the new team
        const createEquipe = new Equipe({ nom, numero_joueurs, joueurs, wilaya, capitaine_id: id });
        await createEquipe.save();
        res.status(201).json({ data: createEquipe });
    } catch (e) {
        res.status(500).json(e);
    }
}

//----------------------------
exports.modifierEquipe = async (req, res) => {
    try {
        const id_Equipe = req.params.id;
        const { nom, numero_joueurs, joueurs, wilaya, capitaine_id } = req.body;
        // if (capitaine_id !== req.user._id.toString()) {
        //     return res.status(403).json({ error: 'You are not authorized to modify this equipe.' });
        // }
        const equipe = await Equipe.findByIdAndUpdate(id_Equipe, { nom, numero_joueurs, joueurs, wilaya, capitaine_id }, { new: true });

        if (!equipe) {
            return res.status(404).json({ error: 'Equipe not found' });
        } else {
            res.json(equipe);
        }
    } catch (e) {
        res.json(e);
    }
}
//----------------------------
exports.supprimerEquipe = async (req, res) => {
    try {
        const id = req.params.id;

        const equipe = await Equipe.deleteOne({_id: id});
        if (!equipe) {
            return res.status(404).json({ error: 'Equipe not found' });
        }
        res.status(204).json({ message: 'Equipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//----------------------------
exports.findEquipeById = async (req, res) => {
    try {
        const id_Equipe = req.params.id;
        const equipe = await Equipe.findById(id_Equipe);
        if (!equipe) {
            return res.status(404).json({ error: 'Equipe not found' });
        }
        res.json(equipe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//-------------------------------------

exports.getMyEquipes = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const userId = req.user._id; // Extract userId from request parameters
        
        const limit = parseInt(req.query.limit) || 10; // Default limit to 4 documents, corrected the default value mentioned in comment
        const query = { capitaine_id: userId };

        if (req.query.cursor) {
            query._id = { $lt: new ObjectId(req.query.cursor) };
        }

        // Fetch the documents from the database, limited and sorted
        const equipes = await Equipe.find(query)
            .populate({
                path: 'capitaine_id',
                select: 'username nom telephone' // Selecting name and phone from capitaine
            })
            .populate({
                path: 'joueurs',
                select: 'username nom telephone' // Selecting name and phone from joueurs
            })
            .populate({
                path: 'attente_joueurs',
                select: 'username nom telephone' // Selecting name and phone from joueurs in waiting
            })
            .populate({
                path: 'attente_joueurs_demande',
                select: 'username nom telephone' // Selecting name and phone from joueurs in waiting
            })
            .limit(limit)
            .sort({ _id: -1 });

        // Check if there's more data available
        const moreDataAvailable = equipes.length === limit;
        
        // Determine the next cursor
        const nextCursor = moreDataAvailable ? equipes[equipes.length - 1]._id : '';

        res.json({
            data: equipes,
            moreDataAvailable,
            nextCursor,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//---------------------------------------------------
exports.getEquipesImIn = async (req, res) => {
    try {
        console.log(req.user); // Debug: Print user info to console
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const userId = req.user._id; // Extract userId from request parameters

        const limit = parseInt(req.query.limit) || 10; // Set the default limit
        const query = { joueurs: { $in: [userId] } }; // Search for teams where userId is in the joueurs array

        // Apply cursor if present
        if (req.query.cursor) {
            query._id = { $lt: new ObjectId(req.query.cursor) };
        }

        // Fetch the documents from the database, limited and sorted
        const equipes = await Equipe.find(query)
        .populate({
            path: 'capitaine_id',
            select: 'username nom telephone' // Selecting name and phone from capitaine
        })
        .populate({
            path: 'joueurs',
            select: 'username nom telephone' // Selecting name and phone from joueurs
        })
        .populate({
            path: 'attente_joueurs',
            select: 'username nom telephone' // Selecting name and phone from joueurs in waiting
        })
        .populate({
            path: 'attente_joueurs_demande',
            select: 'username nom telephone' // Selecting name and phone from joueurs in waiting
        })
            .limit(limit)
            .sort({ _id: -1 });

        // Check if there's more data available
        const moreDataAvailable = equipes.length === limit;

        // Determine the next cursor
        const nextCursor = moreDataAvailable ? equipes[equipes.length - 1]._id : '';

        res.json({
            data: equipes,
            moreDataAvailable,
            nextCursor,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//----------------------------
exports.findAllEquipes = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 7; // How many documents to return
        const query = {};
        if (req.query.cursor) {
            query._id = { $lt: new ObjectId(req.query.cursor) }
        }
        // Fetch the documents from the database
        const equipes = await Equipe.find(query)
        .populate({
            path: 'capitaine_id',
            select: 'username nom telephone' // Selecting name and phone from capitaine
        })
        .populate({
            path: 'joueurs',
            select: 'username nom telephone' // Selecting name and phone from joueurs
        })
        .populate({
            path: 'attente_joueurs',
            select: 'username nom telephone' // Selecting name and phone from joueurs in waiting
        })
        .populate({
            path: 'attente_joueurs_demande',
            select: 'username nom telephone' // Selecting name and phone from joueurs in waiting
        })    // Fields to retrieve
        .sort({ _id: -1 }) .limit(limit);
        // Determine if there's more data to fetch
        const moreDataAvailable = equipes.length === limit;

        // Optionally, you can fetch the next cursor by extracting the _id of the last document
        const nextCursor = moreDataAvailable ? equipes[equipes.length - 1]._id : '';

        res.json({
            data: equipes,
            moreDataAvailable,
            nextCursor,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 

//--------------------- invitation des equipes---------------------

exports.getEquipesInvitedMe = async (req, res) => {
    try {
        console.log(req.user); // Debug: Print user info to console
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const userId = req.user._id; // Extract userId from request parameters

        const limit = parseInt(req.query.limit) || 10; // Set the default limit
        const query = { attente_joueurs: { $in: [userId] } }; // Search for teams where userId is in the joueurs array

        // Apply cursor if present
        if (req.query.cursor) {
            query._id = { $lt: new ObjectId(req.query.cursor) };
        }

        // Fetch the documents from the database, limited and sorted
        const equipes = await Equipe.find(query)
        .populate({
            path: 'capitaine_id',
            select: 'username nom telephone' // Selecting name and phone from capitaine
        })
        .populate({
            path: 'joueurs',
            select: 'username nom telephone' // Selecting name and phone from joueurs
        })
        .populate({
            path: 'attente_joueurs',
            select: 'username nom telephone' // Selecting name and phone from joueurs in waiting
        })
        .populate({
            path: 'attente_joueurs_demande',
            select: 'username nom telephone' // Selecting name and phone from joueurs in waiting
        })
            .limit(limit)
            .sort({ _id: -1 });

        // Check if there's more data available
        const moreDataAvailable = equipes.length === limit;

        // Determine the next cursor
        const nextCursor = moreDataAvailable ? equipes[equipes.length - 1]._id : '';

        res.json({
            data: equipes,
            moreDataAvailable,
            nextCursor,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//----------------------------
exports.filterEquipes = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3; // How many documents to return
        const filter = req.query; // Use the entire query object as the filter
        
        if (req.query.cursor) {
            filter._id = { $lt: new ObjectId(req.query.cursor) };
        }
        
        // Fetch the documents from the database, sort by _id
        const equipes = await Equipe.find(filter).sort({ _id: -1 }).limit(limit);
        
        // Determine if there's more data to fetch
        const moreDataAvailable = equipes.length === limit;

        // Optionally, you can fetch the next cursor by extracting the _id of the last document
        const nextCursor = moreDataAvailable ? equipes[equipes.length - 1]._id : null;

        res.json({
            data: equipes,
            moreDataAvailable,
            nextCursor,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//----------------------------

exports.rejoindreTournoi = async (req, res) => {
    try {
        const { equipeId, tournoiId } = req.params;

        const equipe = await Equipe.findById(equipeId);
        if (!equipe) {
            return res.status(404).json({ message: 'equipe not found' });
        }

        const tournoi = await Tournoi.findById(tournoiId);
        if (!tournoi) {
            return res.status(404).json({ message: 'tournoi not found' });
        }
 await Equipe.updateOne({ _id: equipeId }, { $push: { tournois: tournoiId } });
 await Tournoi.updateOne({ _id: tournoiId }, { $push: { equipes: equipeId } });
        res.status(200).json({ message: 'Equipe joined tournoi successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//----------------------------
exports.quitterTournoi = async (req, res) => {
    try {
        const { equipeId, tournoiId } = req.params;

        const equipe = await Equipe.findById(equipeId);
        if (!equipe) {
            return res.status(404).json({ message: 'equipe not found' });
        }

        const tournoi = await Tournoi.findById(tournoiId);
        if (!tournoi) {
            return res.status(404).json({ message: 'tournoi not found' });
        }
        await Equipe.updateOne({ _id: equipeId }, { $pull: { tournois: tournoiId } });
        await Tournoi.updateOne({ _id: tournoiId }, { $pull: { equipes: equipeId } });
        res.status(200).json({ message: 'Equipe quitted the tournoi successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};