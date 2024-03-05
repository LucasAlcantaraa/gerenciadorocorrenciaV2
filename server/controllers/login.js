const md5 = require('md5')
const { validarPesquisa } = require('../func/validarPesquisa')
const Accounts = require('../models/Accounts');
const session = require('express-session');

exports.realizarLogin = async (req, res, next) => {
    const params = req.body
    try {
        const pesquisa = validarPesquisa(params, ['login', 'senha'])

        const account = await Accounts.findOne({
            where: {
                username: pesquisa.login
            }
        });

        if (!account) {
            res.status(401).json({ error: 'Usuário não encontrado' });
            return
        }

        if (md5(pesquisa.senha) !== account.password) {
            res.status(401).json({ error: 'Senha incorreta' });
            return;
        }

        req.session.loggedin = true;
        req.session.username = account.username;

        res.status(200).json({ mensagem: "Usuário logado com sucesso!", usuario: account.username })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.verificarLogin = async (req, res, next) => {
    const session = req.session

    if (session.loggedin) {
        next();
    } else {
        res.status(401).json({ mensagem: "Usuário não está logado" });
    }
}

exports.logout = async (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({erro: "Houve um erro inexperado ao deslogar." })
        }else{
            res.status(200).json({mensagem: "Sessão finalizada"})
        }
    })
}



