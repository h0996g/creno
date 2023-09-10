const express = require('express');
const userController = require('../controllers/userController')
const router = express.Router();
router.get('/', async (req, res) => {
    res.json({ message: 'hellow' })

})
router.post('/user', userController.createUser)


module.exports = router;
