const Equipe = require('../models/equipe');

exports.createEquipe = async (req, res) => {
    try {
        var found = false;
        const { name, players, capitan } = req.body;
        const createEquipe = new Equipe({ name, players, capitan });

        for (var i = 0; i < players.length; i++) {
            if (players[i].userId.toString() == capitan.toString()) {
                found = true;
                console.log('lgah hmdl');
                break;
            }

        }

        if (found == false) {
            console.log('malgach');
            res.status(404).json({ error: 'User not found' });
            return;

        }

        await createEquipe.save();
        res.json({ data: createEquipe });
    } catch (e) {
    }
};
