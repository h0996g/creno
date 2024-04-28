const Annonce = require('../models/annonce');
const { ObjectId } = require('mongoose').Types;



//----------------------------
exports.addAnnonce = async (req, res) => {
    try {
       
        const { type, description, wilaya, commune,terrain_id } = req.body;
        const { role } = req.user; // Extracting user role from the authenticated user

        let admin_id;
        let joueur_id;

        if (role === 'admin') {
            admin_id = req.user._id;
        } else if (role === 'joueur') {
            joueur_id = req.user._id;
        }

        const newAnnonceData = {
            type,
            description,
            wilaya,
            commune,
            terrain_id,
            admin_id,
            joueur_id
        };

        const newAnnonce = new Annonce(newAnnonceData);
        await newAnnonce.save();
        res.status(201).json(newAnnonce);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



//----------------------------
exports.updateAnnonce = async (req, res) => {
    try {
        const id = req.params.id;
        const { type, description, wilaya, commune, terrain_id } = req.body;
        const { role, _id } = req.user; // Extract user role and ID from the authenticated user

        if (role === 'admin') {
            // Update Annonce if the user is an admin
            const updatedAnnonce = await Annonce.findOneAndUpdate({ _id: id, admin_id: _id }, { type, description, wilaya, commune, terrain_id }, { new: true });
            if (!updatedAnnonce) {
                return res.status(404).json({ message: 'Annonce not found or unauthorized' });
            }
            res.json(updatedAnnonce);
        } else if (role === 'joueur') {
            // Update Annonce if the user is a joueur
            const updatedAnnonce = await Annonce.findOneAndUpdate({ _id: id, joueur_id: _id }, { type, description, wilaya, commune, terrain_id }, { new: true });
            if (!updatedAnnonce) {
                return res.status(404).json({ message: 'Annonce not found or unauthorized' });
            }
            res.json(updatedAnnonce);
        } else {
            // If user role is neither admin nor joueur
            return res.status(403).json({ message: 'Unauthorized access' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//----------------------------
exports.deleteAnnonce = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { role, _id } = req.user; // Extract user role and ID from the authenticated user

        if (role === 'admin') {
            // Delete Annonce if the user is an admin
            const deletedAnnonce = await Annonce.deleteOne({ _id: id, admin_id: _id });
            if (!deletedAnnonce) {
                return res.status(404).json({ message: 'Annonce not found or unauthorized' });
            }
            res.status(204).end();
        } else if (role === 'joueur') {
            // Delete Annonce if the user is a joueur
            const deletedAnnonce = await Annonce.deleteOne({ _id: id, joueur_id: _id });
            if (!deletedAnnonce) {
                return res.status(404).json({ message: 'Annonce not found or unauthorized' });
            }
            res.status(204).end();
        } else {
            // If user role is neither admin nor joueur
            return res.status(403).json({ message: 'Unauthorized access' });
        }
    } catch (error) {
        next(error);
    }
};

//----------------------------
exports.getMyAnnoncesJoueur = async (req, res) => {
    try {
        const userId = req.user._id; // Extract userId from request parameters
        const limit = parseInt(req.query.limit) || 10; // Default limit to 10 documents
        const query = { joueur_id: userId };

        // Apply cursor if present
        if (req.query.cursor) {
            query._id = { $lt: new ObjectId(req.query.cursor) };
        }

        // Fetch the documents from the database, limited and sorted
        const annonces = await Annonce.find(query)
            .limit(limit)
            .sort({ _id: -1 });

        // Check if there's more data available
        const moreDataAvailable = annonces.length === limit;

        // Determine the next cursor
        const nextCursor = moreDataAvailable ? annonces[annonces.length - 1]._id : '';

        res.json({
            data: annonces,
            moreDataAvailable,
            nextCursor,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//----------------------------
exports.getMyAnnoncesAdmin = async (req, res) => {
    try {
        const userId = req.user._id; // Extract userId from request parameters
        const limit = parseInt(req.query.limit) || 6; // Default limit to 10 documents
        const query = { admin_id: userId };

        // Apply cursor if present
        if (req.query.cursor) {
            query._id = { $lt: new ObjectId(req.query.cursor) };
        }

        // Fetch the documents from the database, limited and sorted
        const annonces = await Annonce.find(query)
            .limit(limit)
            .sort({ _id: -1 });

        // Check if there's more data available
        const moreDataAvailable = annonces.length === limit;

        // Determine the next cursor
        const nextCursor = moreDataAvailable ? annonces[annonces.length - 1]._id : '';

        res.json({
            data: annonces,
            moreDataAvailable,
            nextCursor,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



//----------------------------
exports.getAnnonceById = async (req, res) => {
    try {
        const id = req.params.id;
        const annonce = await Annonce.findById(id);
        if (!annonce) {
            return res.status(404).json({ message: 'Annonce not found' });
        }
        res.json(annonce);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//----------------------------
// exports.getAllAnnonces = async (req, res) => {
//     try {
//         const limit = parseInt(req.query.limit) || 10; // How many documents to return
//         const query = {};
//         if (req.query.cursor) {
//             query._id = { $lt: new ObjectId(req.query.cursor) }
//         }
//         // Fetch the documents from the database
//         const annonces = await Annonce.find(query).sort({ _id: -1 })
//             .limit(limit);
//         // Determine if there's more data to fetch
//         const moreDataAvailable = annonces.length === limit;

//         // Optionally, you can fetch the next cursor by extracting the _id of the last document
//         const nextCursor = moreDataAvailable ? annonces[annonces.length - 1]._id : null;

//         res.json({
//             data: annonces,
//             moreDataAvailable,
//             nextCursor,
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };



// exports.getAllAnnonces = async (req, res, next) => {
//     try {
//         const annonces = await Annonce.find()
//             .populate({
//                 path: 'admin_id joueur_id',
//                 select: 'nom prenom telephone'
//             });
//         res.json(annonces);
//     } catch (error) {
//         res.json(error);
//     }
// };



exports.getAllAnnonces = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 6; // How many documents to return
        const query = {};
        if (req.query.cursor) {
            query._id = { $lt: new ObjectId(req.query.cursor) }
        }

        // Fetch the documents from the database with population of related fields
        const annonces = await Annonce.find(query)
            .populate({
                path: 'admin_id joueur_id', // Adjust this line according to your schema fields
                select: 'nom telephone'    // Fields to retrieve
            })
            .sort({ _id: -1 })
            .limit(limit);

        // Determine if there's more data to fetch
        const moreDataAvailable = annonces.length === limit;

        // Optionally, you can fetch the next cursor by extracting the _id of the last document
        const nextCursor = moreDataAvailable ? annonces[annonces.length - 1]._id : null;

        res.json({
            data: annonces,
            moreDataAvailable,
            nextCursor,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



//----------------------------
exports.filterAnnonces = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 6; // How many documents to return
        const query = {};
        if (req.query.cursor) {
            query._id = { $lt: new ObjectId(req.query.cursor) }
        }
        // Extract filter parameters from query string
        const { type, description } = req.query;
        // Include filter parameters in the query
        if (type) query.type = type;
        if (description) query.description = description;

        // Fetch the documents from the database
        const annonces = await Annonce.find(query).sort({ _id: -1 }).limit(limit);
        // Determine if there's more data to fetch
        const moreDataAvailable = annonces.length === limit;

        // Optionally, you can fetch the next cursor by extracting the _id of the last document
        const nextCursor = moreDataAvailable ? annonces[annonces.length - 1]._id : null;

        res.json({
            data: annonces,
            moreDataAvailable,
            nextCursor,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};