const md5 = require('md5')
const { validarPesquisa } = require('../func/validarPesquisa')
const Accounts = require('../models/Accounts')

exports.gerarRelatorio = async (req, res, next) => {
    const params = req.body
    try {
        const pesquisa = validarPesquisa(params, ['dados'])

        




        


        res.status(201).json("Cadastrado com Sucesso!");
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
