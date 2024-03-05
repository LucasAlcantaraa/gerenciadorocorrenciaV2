const express = require('express');
const cadastroController = require('../controllers/cadastro');

const router = express.Router();

router.route('/')
.post(cadastroController.realizarCadastro)
.patch(cadastroController.alterarSenha);

// Defina outras rotas conforme necessário

module.exports = router;
