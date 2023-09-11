const express = require('express');
const userController = require('../controllers/userController');
const responsableController = require('../controllers/responsableController');
const router = express.Router();
router.get('/', async (req, res) => {
    res.json({ message: 'hellow' })

})
router.post('/user', userController.createUser)
router.post('/responsable', responsableController.createResponsible)


module.exports = router;
