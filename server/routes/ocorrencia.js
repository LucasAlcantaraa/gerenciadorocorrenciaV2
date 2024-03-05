const express = require('express');
const ocorrenciaController = require('../controllers/ocorrencia');
const { verificarLogin } = require('../controllers/login');

const router = express.Router();

router.use(verificarLogin);

router.route('/')
.get(ocorrenciaController.listarOcorrencia)
.post(ocorrenciaController.inserirOcorrencia)
.patch(ocorrenciaController.atualizarOcorrencia);

// Defina outras rotas conforme necessário

module.exports = router;
