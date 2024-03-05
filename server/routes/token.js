const express = require('express');
const tokenController = require('../controllers/token');

const router = express.Router();

router.route('/')
.post(tokenController.gerarToken);

// Defina outras rotas conforme necessário

module.exports = router;

























