const express = require('express');
const userController = require('../controllers/userController');
const responsableController = require('../controllers/responsableController');
const terrainController = require('../controllers/terrainController')
const equipeController = require('../controllers/equipeController')
const router = express.Router();
router.get('/', async (req, res) => {
    res.json({ message: 'hellow' })

})

// ---------------------User---------------------------------------------

router.get('/user', userController.loginUser)

router.post('/user', userController.createUser)


// ---------------------Responsable---------------------------------------------
router.get('/responsable', responsableController.loginResponsable)
router.post('/responsable', responsableController.createResponsible)






// ---------------------Terrain---------------------------------------------
router.post('/terrain', terrainController.createTerrain)




// ---------------------Equipe---------------------------------------------
router.post('/equipe', equipeController.createEquipe)



module.exports = router;
