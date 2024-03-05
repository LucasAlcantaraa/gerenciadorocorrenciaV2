const md5 = require('md5')
const { validarPesquisa } = require('../func/validarPesquisa')
const Accounts = require('../models/Accounts')
const Token = require('../models/Token')
const { db } = require('../database/conexao')

exports.realizarCadastro = async (req, res, next) => {
    const params = req.body
    const transaction = await db.transaction();
    try {
        const pesquisa = validarPesquisa(params, ['login', 'senha', 'confirmarsenha', 'token'])

        const account = await Accounts.findOne({
            where: {
                username: pesquisa.login
            }
        });

        if (account) {
            return res.status(401).json({ error: 'Usuário já cadastrado' });
        }

        if (md5(pesquisa.senha) !== md5(pesquisa.confirmarsenha)) {
            return res.status(401).json({ error: 'Senha e confirmar senha não conferem' });
        }

        const token = await Token.findOne({
            where: {
                token: pesquisa.token
            }
        });

        if (token && token.validade) {

            await Token.update({
                validade: false
            }, {
                where: {
                    token: token.token
                }
            },
                { transaction: transaction })

            await Accounts.create({
                username: pesquisa.login,
                password: md5(pesquisa.senha),
                administrador: false
            }, { transaction: transaction });

            await transaction.commit();
            res.status(201).json({ mensagem: "Cadastrado com Sucesso!" });
        } else {
            res.status(401).json({ mensagem: "Token inválido" });
        }

    } catch (error) {
        await transaction.rollback();
        res.status(400).json({ error: error.message });
    }
};

exports.alterarSenha = async (req, res, next) => {
    const params = req.body
    try {
        const pesquisa = validarPesquisa(params, ['login', 'senhaatual', 'novasenha', 'confirmarsenha'])

        const account = await Accounts.findOne({
            where: {
                username: pesquisa.login
            }
        });

        if (!account) {
            return res.status(401).json({ error: 'Usuário Não encontrado' });
        }

        if (md5(pesquisa.senhaatual) !== account.password) {
            return res.status(401).json({ error: 'Senha atual está incorreta' });
        }

        if (md5(pesquisa.novasenha) !== md5(pesquisa.confirmarsenha)) {
            return res.status(401).json({ error: 'Senha e confirmar senha não conferem' });
        }

        await Accounts.update({
            password: md5(pesquisa.novasenha)
        }, {
            where: {
                username: pesquisa.login
            }
        })

        res.status(201).json({ mensagem: "Senha Alterada" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}



