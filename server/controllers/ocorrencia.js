const Ocorrencias = require('../models/Ocorrencias')
const Solucionadas = require('../models/Solucionadas')
const Clientes = require('../models/Clientes')
const { Op } = require('sequelize')
const { db } = require('../database/conexao')
const formatacao = require('../func/formatacao')
const { validarPesquisa, validarPesquisaParcial } = require('../func/validarPesquisa')

//      CODIGO DO SELECT A PARTIR DAQUI

function retornarWhere(pesquisa) {

    let whereOcorrencias = {};
    let whereSolucoes = {};
    let whereClientes = {};

    if (pesquisa.numeroocorrencia !== undefined && pesquisa.numeroocorrencia !== '') {

        whereOcorrencias.numeroocorrencia = pesquisa.numeroocorrencia;

        return [whereOcorrencias, whereSolucoes, whereClientes];
    }

    const filtroOcorrencia = {
        descricaoocorrencia: '',
        versaoerro: '',
        modulo: '',
        status: '',
        setor: '',
        responsavel: ''
    }
    const filtroSolucionado = {
        versaosolucao: '',
        basetestada: '',
        resolvida: ''
    }
    const filtroCliente = {
        cliente: ''
    }

    for (let chave in pesquisa) {
        if (filtroOcorrencia.hasOwnProperty(chave) && ![null, '', undefined].includes(pesquisa[chave])) {

            if (chave === 'descricaoocorrencia') {
                whereOcorrencias[chave] = { [Op.like]: pesquisa[chave] + '%' }
            } else {
                whereOcorrencias[chave] = pesquisa[chave]
            }
        }
        if (filtroSolucionado.hasOwnProperty(chave) && ![null, '', undefined].includes(pesquisa[chave])) {
            whereSolucoes[chave] = pesquisa[chave]
        }

        if (filtroCliente.hasOwnProperty(chave) && ![null, '', undefined].includes(pesquisa[chave])) {
            const nome = /[a-zA-Z]/g
            pesquisa[chave].match(nome) ? whereClientes.nome = pesquisa[chave] :
                whereClientes.codigoparceiro = pesquisa[chave]
        }
    }
    return [whereOcorrencias, whereSolucoes, whereClientes];
}

function verificarETratarDatas(pesquisa) {
    if (pesquisa.datainicio && pesquisa.datafim) {

        if (pesquisa.datafim < pesquisa.datainicio) {
            throw new Error("Data final não pode ser menor que a inicial ")
        } else {
            let dataocorrencia = {}
            return dataocorrencia = { datainicio: pesquisa.datainicio, datafim: pesquisa.datafim }
        }
    } else if ((pesquisa.datainicio && !pesquisa.datafim) || (!pesquisa.datainicio && pesquisa.datafim)) {
        throw new Error("Data inicial e data final devem estar preenchidas ")
    }
}

function retornarConsultaPaginada(consulta, itensPorPagina) {
    let resultado = {};
    let paginaAtual = 1;
    let contador = 0;
    let itens = [];

    for (let i = 0; i < consulta.length; i++) {
        itens.push(consulta[i]);
        contador++;

        if (contador === itensPorPagina) {
            resultado[paginaAtual] = itens;
            itens = [];
            contador = 0;
            paginaAtual++;
        }
    }

    // Adiciona os itens restantes na última página, se houver
    if (itens.length > 0) {
        resultado[paginaAtual] = itens;
    }

    return resultado;
}

exports.listarOcorrencia = async (req, res, next) => {
    const params = req.query
    try {
        const data = verificarETratarDatas(params)
        const [whereOcorrencias, whereSolucoes, whereClientes] = retornarWhere(params)

        if (data) {
            let dataInicio = new Date(data.datainicio);
            let dataFim = new Date(data.datafim);
            whereOcorrencias.dataocorrencia = {
                [Op.between]: [dataInicio, dataFim]
            }
        }

        let ocorrencias = await Ocorrencias.findAll({
            where: whereOcorrencias,
            include: [
                {
                    model: Solucionadas,
                    where: whereSolucoes
                },
                {
                    model: Clientes,
                    required: true,
                    attributes: ['id', 'nome', 'codigoparceiro'],
                    where: whereClientes
                }
            ],
            raw: true,
            nest: true,
            limit: 500
        });
        ocorrencias = formatacao.ajustarFusoHorario(ocorrencias)
        ocorrencias = retornarConsultaPaginada(ocorrencias, 10)

        if (Object.keys(ocorrencias).length) {
            res.status(200).json(ocorrencias)
        } else {
            res.status(200).json({ mensagem: 'Ocorrencia não encontrada' })
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//      CODIGO DO INSERT A PARTIR DAQUI

async function verificarSeOcorrenciaExiste(pesquisa) {

    const checkOcorrencia = await Ocorrencias.findOne({
        where: {
            numeroocorrencia: pesquisa.numeroocorrencia
        }
    });

    if (checkOcorrencia) {
        throw new Error("Não é possível inserir a ocorrência, pois ela já está cadastrada.")
    }
}

exports.inserirOcorrencia = async (req, res, next) => {
    const params = req.body
    const transaction = await db.transaction();

    try {
        const pesquisa = validarPesquisa(params, ['numeroocorrencia', 'descricaoocorrencia', 'idclienteocorrencia', 'dataocorrencia', 'versaoerro', 'modulo', 'status'])
        const data = new Date(pesquisa.dataocorrencia);

        const offset = data.getTimezoneOffset();
        data.setMinutes(data.getMinutes() + offset);

        console.log('pesquisa aqui', pesquisa.dataocorrencia)
        console.log('data aqui', data)

        await verificarSeOcorrenciaExiste(pesquisa)

        const ocorrencia = await Ocorrencias.create({
            numeroocorrencia: pesquisa.numeroocorrencia,
            descricaoocorrencia: pesquisa.descricaoocorrencia,
            idclienteocorrencia: pesquisa.idclienteocorrencia,
            dataocorrencia: data,
            versaoerro: pesquisa.versaoerro,
            modulo: pesquisa.modulo,
            status: pesquisa.status,
            setor: pesquisa.setor,
            responsavel: pesquisa.responsavel
        }, { transaction: transaction });

        await Solucionadas.create({
            idocorrencia: ocorrencia.id,
            resolvida: 'F'
        }, { transaction: transaction });

        await transaction.commit();
        res.status(201).json({ mensagem: 'Ocorrencia cadastrada com sucesso!' })
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({ error: error.message });
    }
};

//      CODIGO DO UPDATE A PARTIR DAQUI


function retornarUpdate(pesquisa) {

    const filtroOcorrencia = {
        idocorrencia: '',
        numeroocorrencia: '',
        descricaoocorrencia: '',
        idclienteocorrencia: '',
        dataocorrencia: '',
        versaoerro: '',
        modulo: '',
        status: '',
        setor: '',
        responsavel: ''

    }
    const filtroSolucionado = {
        idocorrencia: '',
        versaosolucao: '',
        basetestada: '',
        resolvida: '',
        procedimentos: ''
    }

    let updateOcorrencias = {};
    let updateSolucoes = {};

    for (let chave in pesquisa) {
        if (filtroOcorrencia.hasOwnProperty(chave)) {
            if (chave === 'dataocorrencia') {
                const data = new Date(pesquisa[chave]);
                const offset = data.getTimezoneOffset();
                data.setMinutes(data.getMinutes() + offset);
                updateOcorrencias[chave] = data
            } else if (chave === 'idocorrencia') {
                updateOcorrencias.id = pesquisa[chave]
            } else {
                updateOcorrencias[chave] = pesquisa[chave]
            }
        }
        if (filtroSolucionado.hasOwnProperty(chave)) {
            updateSolucoes[chave] = pesquisa[chave]
        }
    }

    return [updateOcorrencias, updateSolucoes];

}

exports.atualizarOcorrencia = async (req, res, next) => {
    const params = req.body
    const transaction = await db.transaction();
    try {
        const pesquisa = validarPesquisaParcial(params, ['numeroocorrencia', 'descricaoocorrencia',
            'idclienteocorrencia', 'dataocorrencia', 'versaoerro', 'modulo', 'status', 'versaosolucao',
            'basetestada', 'resolvida', 'procedimentos'])

        const id = validarPesquisa(params, ['idocorrencia'])

        pesquisa.idocorrencia = id.idocorrencia

        const [updateOcorrencias, updateSolucoes] = retornarUpdate(pesquisa)

        
        if (updateOcorrencias && Object.keys(updateOcorrencias).length > 1) {
            //ID SEMPRE ESTARÁ PRESENTE, MESMO QUE NÃO HAJAM OUTROS DADOS NO OBJETO.
            //O IF É PARA EVITAR UPDATES DESNECESSÁRIOS, SOMENTE SE TIVER OUTROS DADOS ALÉM DO ID.
            await Ocorrencias.update(
                updateOcorrencias,
                { where: { id: updateOcorrencias.id } },
                { transaction: transaction });
        }

        if (updateSolucoes && Object.keys(updateSolucoes).length > 1) {
            console.log('entrou no solucionadas')
            await Solucionadas.update(
                updateSolucoes,
                { where: { idocorrencia: updateSolucoes.idocorrencia } },
                { transaction: transaction });
        }
        await transaction.commit();
        console.log([updateOcorrencias, updateSolucoes])
        res.status(200).json([updateOcorrencias, updateSolucoes])
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({ error: error.message });
    }
};
