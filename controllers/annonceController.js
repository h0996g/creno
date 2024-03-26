const Annonce = require('../models/annonce');


// Controller for adding a new annonce
exports.addAnnonce = async (req, res) => {
    try {
        const { type, description } = req.body;
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




exports.updateAnnonce = async (req, res) => {
    try {
        const id = req.params.id;
        const { type, description } = req.body;
        const { role, _id } = req.user; // Extract user role and ID from the authenticated user

        if (role === 'admin') {
            // Update Annonce if the user is an admin
            const updatedAnnonce = await Annonce.findOneAndUpdate({ _id: id, admin_id: _id }, { type, description }, { new: true });
            if (!updatedAnnonce) {
                return res.status(404).json({ message: 'Annonce not found or unauthorized' });
            }
            res.json(updatedAnnonce);
        } else if (role === 'joueur') {
            // Update Annonce if the user is a joueur
            const updatedAnnonce = await Annonce.findOneAndUpdate({ _id: id, joueur_id: _id }, { type, description }, { new: true });
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



// Controller for deleting an Annonce
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


// Get Annonces by Admin ID or Joueur ID
exports.getAnnoncesByUserId = async (req, res) => {
    try {
        const userId = req.user._id; // Extract userId from request parameters
        const annonces = await Annonce.find({ $or: [{ admin_id: userId }, { joueur_id: userId }] });

        if (!annonces) {
            return res.status(404).json({ message: 'Annonces not found' });
        }

        res.json(annonces);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




// Controller for getting an annonce by ID
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

// Controller for getting all annonces
exports.getAllAnnonces = async (req, res) => {
    try {
        const annonces = await Annonce.find();
        res.json(annonces);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller for filtering annonces
exports.filterAnnonces = async (req, res) => {
    try {
        const filter = { type , description } = req.query;
        const annonces = await Annonce.find(filter);
        res.json(annonces);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};