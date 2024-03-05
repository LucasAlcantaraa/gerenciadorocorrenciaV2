const { validarPesquisa, validarPesquisaParcial } = require('../func/validarPesquisa')
const Clientes = require('../models/Clientes')
const {Op} = require('sequelize')

//      CÓDIGO DO SELECT A PARTIR DAQUI

exports.listarCliente = async (req, res, next) => {
    const params = req.query
    try {
        const pesquisa = validarPesquisa(params, ['cliente'])
        const nome = /[a-zA-Z]/g
        const cliente = new Object();
        nome.test(pesquisa.cliente) ? cliente.nome = {[Op.like]:'%' + pesquisa.cliente + '%'} : cliente.codigoparceiro = pesquisa.cliente

        const pesquisaClientes = await Clientes.findAll({
            where: cliente
        });
        if (pesquisaClientes.length) {
            console.log(req.session)
            res.status(200).json(pesquisaClientes)
        }
        else {
            res.status(200).json({ mensagem: "Cliente não encontrado" })
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


//      CÓDIGO DO INSERT A PARTIR DAQUI

async function verificarSeClienteExiste(pesquisa) {

    const checkCliente = await Clientes.findOne({
        where: {
            codigoparceiro: pesquisa.codigoparceiro
        }
    });

    if (checkCliente) {
        throw new Error("Não é possível inserir o cliente, pois ele já está cadastrado.")
    }
}

function retornarInsert(pesquisa) {
    const filtroCliente = {
        nome: '',
        codigoparceiro: '',
        endereco: '',
        telefone: '',
        bairro: '',
        cep: '',
        telefone2: '',
        cidade: '',
        estado: ''
    }

    const insert = new Object();

    for (let chave in pesquisa) {
        if (filtroCliente.hasOwnProperty(chave)) {
            insert[chave] = pesquisa[chave]
        }
    }

    return insert
}

exports.inserirCliente = async (req, res, next) => {
    const params = req.body
    try {
        console.log(params)
        const pesquisa = validarPesquisa(params, ['nome', 'codigoparceiro'])
        const insert = retornarInsert(pesquisa)

        await verificarSeClienteExiste(pesquisa)
        await Clientes.create(insert);

        res.status(201).json(insert)
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

//      CÓDIGO DO UPDATE A PARTIR DAQUI

async function verificarSeCodParceiroExiste(pesquisa) {

    if (!pesquisa.codigoparceiro) {
        return
    }

    const checkCodParceiro = await Clientes.findOne({
        where: {
            codigoparceiro: pesquisa.codigoparceiro
        }
    });

    if (checkCodParceiro) {
        throw new Error("Não foi possível atualizar, pois código do parceiro não pode ser repetido")
    }

}

exports.atualizarCliente = async (req, res, next) => {
    const params = req.body
    try {
        const pesquisa = validarPesquisaParcial(params, ['nome', 'codigoparceiro', 'endereco',
            'telefone', 'bairro', 'cep', 'telefone2', 'cidade', 'estado'])
        const id = validarPesquisa(params, ['idcliente'])
        const update = retornarInsert(pesquisa)

        await verificarSeCodParceiroExiste(pesquisa)
        await Clientes.update(
            update,
            { where: { id: id.idcliente } });

        res.status(201).json(update)
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


