const express = require('express');
const joueurController = require('../controllers/joueurController');
const adminController = require('../controllers/adminController');
const terrainController = require('../controllers/terrainController')
const equipeController = require('../controllers/equipeController')
const crenoController = require('../controllers/crenoController')
const { protect } = require('../handler/auth');

const router = express.Router();
router.get('/', async (req, res) => {
    res.json({ message: 'hellow' })

})

// ---------------------User---------------------------------------------

router.get('/joueur', joueurController.loginJoueur)

router.post('/joueur', joueurController.createJoueur)
router.post('/demandCreno', protect, joueurController.demandCreno)


// ---------------------Responsable---------------------------------------------
router.get('/admin', adminController.loginAdmin)
router.post('/admin', adminController.createAdmin)

// ---------------------Terrain---------------------------------------------
router.post('/terrain', terrainController.createTerrain)

// ---------------------Equipe---------------------------------------------
router.post('/equipe', protect, equipeController.createEquipe)
router.put('/equipe/:id', protect, equipeController.modifierEquipe)

// ---------------------Creno---------------------------------------------
router.post('/creno', crenoController.createCreno)

module.exports = router;
