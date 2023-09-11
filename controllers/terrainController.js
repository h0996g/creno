const Terrain = require('../models/terrain');
exports.createTerrain = async (req, res) => {
    try {
        const { place, size, responsableId } = req.body;
        const createTerrain = new Terrain({ place, size, responsableId })
        await createTerrain.save();
        res.json({ data: createTerrain });
    } catch (e) {

    }
}
