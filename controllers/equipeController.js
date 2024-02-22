const Equipe = require('../models/equipe');
exports.createEquipe = async (req, res) => {
    try {
        const id = req.user._id;
        const { nom, numero_joueurs, joueurs, capitaine_id } = req.body;
        const createEquipe = new Equipe({ nom, numero_joueurs, joueurs, capitaine_id: id })
        await createEquipe.save();
        res.json({ data: createEquipe });
    } catch (e) {
        res.json(e);
    }
}

exports.modifierEquipe = async (req, res) => {
    try {
        const id_Equipe = req.params.id;
        const { nom, numero_joueurs, joueurs, capitaine_id } = req.body;

        const equipe = await Equipe.findByIdAndUpdate(id_Equipe, { nom, numero_joueurs, joueurs, capitaine_id }, { new: true });
        if (!equipe) {
            res.status(404).json({ error: 'Equipe not found' });
        } else {
            res.json(equipe);
        }
    } catch (e) {
        res.json(e);


    }


}
