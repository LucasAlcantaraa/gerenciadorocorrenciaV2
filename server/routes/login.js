const express = require('express');
const loginController = require('../controllers/login');

const router = express.Router();

router.route('/')
.get(loginController.verificarLogin)
.post(loginController.realizarLogin);

router.route('/logOut')
.get(loginController.logout)


// Defina outras rotas conforme necessário

module.exports = router;

























