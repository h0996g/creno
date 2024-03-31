const Terrain = require('../models/terrain');

exports.addTerrain = async (req, res, next) => {
    try {
        const { largeur, longeur, superficie, adresse, s_temps, e_temps, prix, description, capacite, etat, reservations, coordonnee, photos } = req.body;
        const admin_id = req.user._id; // Extracting admin ID from the authenticated user

        const newTerrainData = {
            largeur,
            longeur,
            superficie,
            adresse,
            s_temps,
            e_temps,
            prix,
            description,
            capacite,
            etat,
            reservations,
            admin_id,
            coordonnee,
            photos
        };

        const newTerrain = new Terrain(newTerrainData);
        await newTerrain.save();
        res.status(201).json(newTerrain);
    } catch (error) {
        res.json(error);
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

exports.findAllTerrains = async (req, res, next) => {
    try {
        const terrains = await Terrain.find();
        res.json(terrains);
    } catch (error) {
        res.json(error);
    }
};

exports.filterTerrains = async (req, res) => {
    try {
        const filter = { largeur, longeur, superficie, adresse, capacite, etat, place, s_temps, e_temps, prix, reservations, coordonnee } = req.query;
        const terrains = await Terrain.find(filter);

        res.json(terrains);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
