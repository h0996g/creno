const express = require('express');
const joueurController = require('../controllers/joueurController');
const adminController = require('../controllers/adminController');
const terrainController = require('../controllers/terrainController')
const equipeController = require('../controllers/equipeController')
const crenoController = require('../controllers/crenoController')
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

// ---------------------Equipe---------------------------------------------
router.post('/equipe', protect, equipeController.createEquipe)
router.put('/equipe/:id', protect, equipeController.modifierEquipe)
router.delete('/equipe/:id', protect, equipeController.supprimerEquipe)
router.get('/equipe/:id', protect, equipeController.findEquipeById)
router.get('/equipe', protect, equipeController.findAllEquipes)


// ---------------------Creno---------------------------------------------
router.post('/creno', crenoController.createCreno)

module.exports = router;
