const express = require('express');
const joueurController = require('../controllers/joueurController');
const adminController = require('../controllers/adminController');
const terrainController = require('../controllers/terrainController')
const equipeController = require('../controllers/equipeController')
const creneauController = require('../controllers/creneauController')
const tournoiController = require('../controllers/tournoiController')
const { protect } = require('../handler/auth');

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
// router.post('/terrain', terrainController.createTerrain)
// Route for adding a new terrain
router.post('/terrain', protect, terrainController.addTerrain);
// Route for updating a terrain
router.put('/terrain/:id', protect, terrainController.updateTerrain);
// Route for deleting a terrain
router.delete('/terrain/:id', protect, terrainController.deleteTerrain);
// Route for finding a terrain by ID
router.get('/terrain/:id', terrainController.findTerrainById);

// Route for finding all terrains
router.get('/terrains', terrainController.findAllTerrains);

router.get('/terrains/filter', terrainController.filterTerrains);

// ---------------------Equipe---------------------------------------------
router.post('/equipe', protect, equipeController.createEquipe)
router.put('/equipe/:id', protect, equipeController.modifierEquipe)
router.delete('/equipe/:id', protect, equipeController.supprimerEquipe)
router.get('/equipe/:id', protect, equipeController.findEquipeById)
router.get('/equipe', equipeController.findAllEquipes)


// ---------------------Creno---------------------------------------------
// -------------------------tournoi---------------------------------
// Route for adding a new tournament
router.post('/tournoi', protect, tournoiController.addTournoi);

// Route for updating a tournament
router.put('/tournoi/:id', protect, tournoiController.updateTournoi);

router.delete('/tournoi/:id', protect, tournoiController.deleteTournoi);

// Route for finding a tournament by ID
router.get('/tournoi/:id', tournoiController.findTournoiById);

// Route for finding all tournaments
router.get('/tournois', tournoiController.findAllTournois);



module.exports = router;
