const express = require('express');
const joueurController = require('../controllers/joueurController');
const adminController = require('../controllers/adminController');
const terrainController = require('../controllers/terrainController')
const equipeController = require('../controllers/equipeController')
const creneauController = require('../controllers/creneauController')
const tournoiController = require('../controllers/tournoiController')
const { protect, isAdmin } = require('../handler/auth');

const router = express.Router();
router.get('/', async (req, res) => {
    res.json({ message: 'hello' })

})

// ---------------------User---------------------------------------------

router.get('/joueur', joueurController.loginJoueur)

router.post('/joueur', joueurController.createJoueur)
router.post('/demandCreno', protect, joueurController.demandCreno)


// ---------------------admin---------------------------------------------
router.get('/admin', adminController.loginAdmin)
router.post('/admin', adminController.createAdmin)

// ---------------------Terrain---------------------------------------------

router.post('/terrain', protect, isAdmin, terrainController.addTerrain);
router.put('/terrain/:id', protect, terrainController.updateTerrain);
router.delete('/terrain/:id', protect, terrainController.deleteTerrain);
router.get('/terrain/:id', terrainController.findTerrainById);
router.get('/terrains', terrainController.findAllTerrains);

router.get('/terrains/filter', terrainController.filterTerrains);

// ---------------------Equipe---------------------------------------------
router.post('/equipe', protect, equipeController.createEquipe)
router.put('/equipe/:id', protect, equipeController.modifierEquipe)
router.delete('/equipe/:id', protect, equipeController.supprimerEquipe)
router.get('/equipe/:id', protect, equipeController.findEquipeById)
router.get('/equipe', equipeController.findAllEquipes)
router.get('/equipes/filter', equipeController.filterEquipes);


// ---------------------Creno---------------------------------------------
// Route for adding a new creneau
router.post('/creneau', protect, creneauController.addCreneau);
// Route for updating a creneau
router.put('/creneau/:id', protect, creneauController.updateCreneau);
// Route for deleting a creneau
router.delete('/creneau/:id', protect, creneauController.deleteCreneau);
// Route for finding a creneau by ID
router.get('/creneau/:id', creneauController.findCreneauById);
// Route for finding all creneaus
router.get('/creneaus', creneauController.findAllCreneaus);

router.get('/creneaus/filter', creneauController.filterCreneaus);
// -------------------------tournoi---------------------------------
router.post('/tournoi', protect, tournoiController.addTournoi);
router.put('/tournoi/:id', protect, tournoiController.updateTournoi);
router.delete('/tournoi/:id', protect, tournoiController.deleteTournoi);
router.get('/tournoi/:id', tournoiController.findTournoiById);
router.get('/tournois', tournoiController.findAllTournois);
router.get('/tournois/filter', tournoiController.filterTournois);



module.exports = router;
