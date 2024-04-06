const Terrain = require('../models/terrain');


exports.addTerrain = async (req, res, next) => {
    try {
        const {
            largeur, longeur, superficie, adresse,
            heure_debut_temps, heure_fin_temps,duree_creneau, prix, description,
            capacite, etat, coordonnee,
            photos, nonReservableTimeBlocks
        } = req.body;

        // Extracting admin ID from the authenticated user
        const admin_id = req.user._id;

        const newTerrain = new Terrain({
            largeur,
            longeur,
            superficie,
            adresse,
            heure_debut_temps, // Operational start time
            heure_fin_temps, // Operational end time
            duree_creneau,
            prix,
            description,
            capacite,
            etat,
            coordonnee,
            photos,
            nonReservableTimeBlocks, // Directly using the passed non-reservable time blocks
            admin_id
        });

        await newTerrain.save();
        res.status(201).json(newTerrain);
    } catch (error) {
        // Providing a more informative error response
        console.error('Error saving new terrain:', error);
        res.status(400).json({ message: "Failed to add new terrain.", error: error.message });
    }
};


// Controller for updating a terrain
exports.updateTerrain = async (req, res) => {
    try {
        const id = req.params.id;
        const terrainData = req.body;
        const admin_id = req.user._id; // Extracting admin ID from the authenticated user
        const updatedTerrain = await Terrain.findOneAndUpdate({ _id: id, admin_id: admin_id }, terrainData, { new: true });
        if (!updatedTerrain) {
            return res.status(404).json({ message: 'Terrain not found or unauthorized' });
        }
        res.json(updatedTerrain);
    } catch (error) {
        res.json(error);
    }
};

// Controller for deleting a terrain
exports.deleteTerrain = async (req, res, next) => {
    try {
        const id = req.params.id;
        const admin_id = req.user._id; // Extracting admin ID from the authenticated user
        const deletedTerrain = await Terrain.deleteOne({ _id: id, admin_id: admin_id });
        if (!deletedTerrain) {
            return res.status(404).json({ message: 'Terrain not found or unauthorized' });
        }
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

exports.findMyTerrains = async (req, res, next) => {
    try {
        const admin_id = req.user._id; // Extracting admin ID from the authenticated user
        const terrains = await Terrain.find({ admin_id });
        res.json(terrains);
    } catch (error) {
        res.json({ message: error.message });
    }
}

exports.findTerrainById = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const admin_id = req.user._id; // Extracting admin ID from the authenticated user
        const terrain = await Terrain.findById(id);
        if (!terrain) {
            return res.status(404).json({ message: 'Terrain not found or unauthorized' });
        }
        res.json(terrain);
    } catch (error) {
        res.json(error);
    }
};

// exports.findAllTerrains = async (req, res, next) => {
//     try {
//         const terrains = await Terrain.find();
//         res.json(terrains);
//     } catch (error) {
//         res.json(error);
//     }
// };

exports.findAllTerrains = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 3; // How many documents to return
        const query = {};
        
        if (req.query.cursor) {
            query._id = { $lt: new ObjectId(req.query.cursor) };
        }
        
        // Fetch the documents from the database, sort by _id
        const terrains = await Terrain.find(query).sort({ _id: -1 }).limit(limit);
        
        // Determine if there's more data to fetch
        const moreDataAvailable = terrains.length === limit;

        // Optionally, you can fetch the next cursor by extracting the _id of the last document
        const nextCursor = moreDataAvailable ? terrains[terrains.length - 1]._id : null;

        res.json({
            data: terrains,
            moreDataAvailable,
            nextCursor,
        });
    } catch (error) {
        next(error);
    }
};

// exports.filterTerrains = async (req, res) => {
//     try {
//         const filter = { largeur, longeur, superficie, adresse, capacite, etat, place, s_temps, e_temps, prix, reservations, coordonnee } = req.query;
//         const terrains = await Terrain.find(filter);

//         res.json(terrains);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };


exports.filterTerrains = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3; // How many documents to return
        const filter = req.query; // Use the entire query object as the filter
        
        if (req.query.cursor) {
            filter._id = { $lt: new ObjectId(req.query.cursor) };
        }
        
        // Fetch the documents from the database, sort by _id
        const terrains = await Terrain.find(filter).sort({ _id: -1 }).limit(limit);
        
        // Determine if there's more data to fetch
        const moreDataAvailable = terrains.length === limit;

        // Optionally, you can fetch the next cursor by extracting the _id of the last document
        const nextCursor = moreDataAvailable ? terrains[terrains.length - 1]._id : null;

        res.json({
            data: terrains,
            moreDataAvailable,
            nextCursor,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};