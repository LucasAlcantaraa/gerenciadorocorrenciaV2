const express = require('express');
const clienteController = require('../controllers/cliente');
const { verificarLogin } = require('../controllers/login');

const router = express.Router();

router.use(verificarLogin);

router.route('/')
.get(clienteController.listarCliente)
.post(clienteController.inserirCliente)
.patch(clienteController.atualizarCliente)

// Defina outras rotas conforme necessário

module.exports = router;

























