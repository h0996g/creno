const Equipe = require('../models/equipe');
exports.createEquipe = async (req, res) => {
    try {
        const id = req.user._id;
        const { nom, numero_joueurs, joueurs, wilaya, capitaine_id } = req.body;
        const createEquipe = new Equipe({ nom, numero_joueurs, joueurs, wilaya, capitaine_id: id })
        await createEquipe.save();
        res.status(201).json({ data: createEquipe });
    } catch (e) {
        res.status(500).json(e);
    }
}

exports.modifierEquipe = async (req, res) => {
    try {
        const id_Equipe = req.params.id;
        const { nom, numero_joueurs, joueurs, wilaya, capitaine_id } = req.body;
        if (capitaine_id !== req.user._id.toString()) {
            return res.status(403).json({ error: 'You are not authorized to modify this equipe.' });
        }
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

exports.supprimerEquipe = async (req, res) => {
    try {
        const id_Equipe = req.params.id;

        const equipe = await Equipe.findByIdAndDelete(id_Equipe);
        if (!equipe) {
            return res.status(404).json({ error: 'Equipe not found' });
        }
        res.status(204).json({ message: 'Equipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
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


exports.findAllEquipes = async (req, res) => {
    try {
        const equipes = await Equipe.find();
        res.json(equipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.filterEquipes = async (req, res) => {
    try {
        const filter = { nom, numero_joueurs, capitaine_id, wilaya } = req.query;

        const equipes = await Equipe.find(filter);
        res.json(equipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


