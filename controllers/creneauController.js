// const Creneau = require('../models/creneau')


// // Controller for adding a new creneau
// exports.addCreneau = async (req, res, next) => {
//     try {

//         const id_terrain = req.params.idterrain;
//         const { jour, s_temps, e_temps, duree, tarif, etat, terrain_id } = req.body;
//         const newCreneauData = {
            
//             jour,
//             s_temps,
//             e_temps,
//             duree,
//             tarif,
//             etat,
//             terrain_id : id_terrain
           
//         };
//         const newCreneau = new Creneau(newCreneauData);
//         await newCreneau.save();
//         res.status(201).json(newCreneau);
//     } catch (error) {
//         res.json(error);
//     }
// };


// // Controller for updating a creneau
// exports.updateCreneau = async (req, res, next) => {
//     try {
//         const id = req.params.id;
//         const creneauDataToUpdate = req.body;
//         const updatedCreneau = await Creneau.findOneAndUpdate({ _id: id }, creneauDataToUpdate, { new: true });
//         if (!updatedCreneau) {
//             return res.status(404).json({ message: 'Creneau not found or unauthorized' });
//         }
//         res.json(updatedCreneau);
//     } catch (error) {
//         res.json(error);
//     }
// };


// // Controller for deleting a creneau
// exports.deleteCreneau = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const deletedCreneau = await Creneau.deleteOne({ _id: id });
//         if (!deletedCreneau) {
//             return res.status(404).json({ message: 'Creneau not found or unauthorized' });
//         }
//         res.status(204).end();
//     } catch (error) {
//         res.json(error);
//     }
// };

// // Controller for finding a creneau by ID
// exports.findCreneauById = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const creneau = await Creneau.findById(id);
//         if (!creneau) {
//             return res.status(404).json({ message: 'Creneau not found' });
//         }
//         res.json(creneau);
//     } catch (error) {
//         res.json(error);
//     }
// };


// // Controller for finding all creneaus
// exports.findAllCreneaus = async (req, res, next) => {
//     try {
//         const creneaus = await Creneau.find();
//         res.json(creneaus);
//     } catch (error) {
//         next(error);
//     }
// };

// exports.filterCreneaus = async (req, res) => {
//     try {
//         const filter = { jour, s_temps, e_temps, duree, tarif, etat, terrain_id } = req.query; // Extract the filter from query parameters
//         const creneaus = await Creneau.find(filter);
//         res.json(creneaus);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };