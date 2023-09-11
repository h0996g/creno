const express = require('express');
const userController = require('../controllers/userController');
const responsableController = require('../controllers/responsableController');
const router = express.Router();
router.get('/', async (req, res) => {
    res.json({ message: 'hellow' })

})
router.get('/responsable', responsableController.loginResponsable)
router.get('/user', userController.loginUser)

router.post('/user', userController.createUser)
router.post('/responsable', responsableController.createResponsible)


module.exports = router;
