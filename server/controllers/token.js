const crypto = require('crypto');
const Token = require('../models/Token');
const Accounts = require('../models/Accounts')
const { validarPesquisa } = require('../func/validarPesquisa')
const md5 = require('md5')

exports.gerarToken = async (req, res, next) => {
    const params = req.body
    try {
        const pesquisa = validarPesquisa(params, ['login', 'senha'])

        const user = await Accounts.findOne({
            where: {
                username: pesquisa.login
            }
        });

        if (user) {

            if (md5(pesquisa.senha) !== user.password) {
                return res.status(401).json({ mensagem: "Senha incorreta" })
            }

            if (!user.administrador) {
                return res.status(401).json({ mensagem: "Usuário não é administrador" })
            }

            const token = crypto.randomBytes(5).toString('hex');
            await Token.create({
                token: token,
                validade: true
            });
            return res.status(201).json({ mensagem: "Novo token Criado com Sucesso" })
        } else {
            return res.status(400).json({ mensagem: "Usuário não encontrado" })
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};




