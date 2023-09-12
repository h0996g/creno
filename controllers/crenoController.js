const Creno = require('../models/creno')
exports.createCreno = async (req, res) => {
    try {
        const { userId, terrainId, equipeId, dateStart, dateEnd, timeStart, timeEnd } = req.body;
        const createCreno = new Creno({ userId, terrainId, equipeId, dateStart, dateEnd, timeStart, timeEnd })
        await createCreno.save();
        res.json({ data: createCreno });
    } catch (e) {

    }
}