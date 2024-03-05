import React, { useState, useEffect } from 'react';
import {useNavigate, useParams, useLocation } from "react-router-dom";
import axiosInstance from '../func/axiosInstance';
import ModalCliente from '../components/modais/modalCliente';
import AvisoModal from '../components/modais/avisoModal'
import { validarPesquisa } from '../func/validar';
import Submit from '../components/submit';
import { useSelector } from 'react-redux'

import './ocorrencia.css'
import '../styles/geral.css'

async function inserirOcorrencia(dados) {
    try {
        const { data } = await axiosInstance.post('/ocorrencia', dados);
        console.log(data)
        sessionStorage.removeItem('dados')
    } catch (error) {
        if (error.response) {
            // A solicitação foi feita e o servidor respondeu com um código de status
            // que cai fora do intervalo de 2xx
            throw new Error(error.response.data.error);
        } else {
            // Algo aconteceu na configuração da solicitação que acionou um erro
            throw error;
        }
    }
}

async function atualizarOcorrencia(dados) {
    try {
        const { data } = await axiosInstance.patch('/ocorrencia', dados);
        console.log(data)
        sessionStorage.removeItem('dados')
    } catch (error) {
        if (error.response) {
            // A solicitação foi feita e o servidor respondeu com um código de status
            // que cai fora do intervalo de 2xx
            throw new Error(error.response.data.error);
        } else {
            // Algo aconteceu na configuração da solicitação que acionou um erro
            throw error;
        }
    }
}

function Ocorrencia({ setTitulo }) {
    const { numOcorrencia } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    // const item = useSelector(state => state.item.item)
    // const item = location.state.item;
    const [modalClienteAberto, setModalClienteAberto] = useState(false)
    const [modalAvisoAberto, setModalAvisoAberto] = useState(false)
    const [mensagem, setMensagem] = useState('')
    const usuario = sessionStorage.getItem('usuario')

    const [dados, setDados] = useState({
        numeroocorrencia: '',
        modulo: '',
        dataocorrencia: '',
        versaoerro: '',
        cliente: {
            nome: '',
            idclienteocorrencia: '',
            numeroocorrencia: ''
        },
        descricaoocorrencia: '',
        status: 'correcao',
        setor: '',
        responsavel: usuario ? usuario : ''
    })

    useEffect(() => {
        if (numOcorrencia) {
            async function getOcorrencias() {
                try {
                    const { data } = await axiosInstance.get('/ocorrencia', {
                        params: {
                            numeroocorrencia: numOcorrencia
                        }
                    });

                    if (!data.mensagem && location.state) {
                        const item = location.state.item
                        setTitulo('ocorrencia', `Ocorrência N° ${numOcorrencia}`);
                        console.log('location aqui', location)

                        function converterData(str) {
                            var parts = str.split("/");
                            return parts[2] + "-" + parts[1] + "-" + parts[0];
                        }

                        const dataFormatada = converterData(item.dataocorrencia)

                        setDados({
                            idocorrencia: item.id,
                            numeroocorrencia: item.numeroocorrencia,
                            modulo: item.modulo,
                            dataocorrencia: dataFormatada,
                            versaoerro: item.versaoerro,
                            cliente: {
                                nome: item.cliente.nome,
                                id: item.cliente.id,
                                codigoparceiro: item.cliente.codigoparceiro
                            },
                            descricaoocorrencia: item.descricaoocorrencia,
                            status: item.status,
                            setor: item.setor,
                            responsavel: item.responsavel

                        })

                    } else {
                        navigate('/404');
                    }
                } catch (error) {
                    console.error('Erro ao buscar dados', error);
                }
            }

            getOcorrencias();
        }
    }, [numOcorrencia]);

    useEffect(() => {
        if (!modalAvisoAberto && mensagem) {
            if (location.state && !mensagem.includes('Falta campo obrigatório')) {
                navigate('/home');
            }
        }
    }, [modalAvisoAberto]); // "Observa" as mudanças em modalAvisoAberto
    
    function preencherCliente(item) {
        setDados({ ...dados, cliente: item })
        setModalClienteAberto(false)
        console.log(dados)
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const newDados = { ...dados }
            newDados.idclienteocorrencia = dados.cliente.id
            delete newDados.cliente

            const obj = validarPesquisa(newDados, ['numeroocorrencia', 'modulo', 'dataocorrencia', 'versaoerro', 'idclienteocorrencia', 'descricaoocorrencia', 'status'])

            if (location.state) {
                await atualizarOcorrencia(obj)
                handleMensagem({ message: "Ocorrência Atualizada com sucesso!" })
            } else {
                await inserirOcorrencia(obj)
                handleMensagem({ message: "Ocorrência Cadastrada Com sucesso!" })
            }
            limparDados()
        } catch (error) {
            console.log(error)
            handleMensagem(error)
        }

    };

    function limparDados() {
        setDados({
            numeroocorrencia: '',
            modulo: '',
            dataocorrencia: '',
            versaoerro: '',
            cliente: {
                nome: '',
                idclienteocorrencia: '',
                numeroocorrencia: ''
            },
            descricaoocorrencia: '',
            status: 'correcao',
            setor: '',
            responsavel: usuario ? usuario : ''
        });
    }

    function handleMensagem(mensagem) {
        setMensagem(mensagem.message)
        setModalAvisoAberto(true)
    }

    return (
        <section className="ocorrenciaPage">
            <div className="cabecalho">
                <button className="mainBtn" onClick={() => navigate(-1)}>voltar</button>
                {location.state && <button className="auxBtn" onClick={() => navigate(`/solucao/${numOcorrencia}`,{state: {item:location.state.item}})}>Solucionar</button>}
            </div>

            {modalClienteAberto && <ModalCliente fecharModal={() => setModalClienteAberto(false)} preencherCliente={preencherCliente} />}
            {modalAvisoAberto && <AvisoModal fecharModal={() => setModalAvisoAberto(false)} mensagem={mensagem} />}

            <div className="divOcorrencia">
                <form id="formOcorrencia" onSubmit={handleSubmit} className="formOcorrencia">

                    <div>
                        <label htmlFor="">N° Ocorrência</label>
                        <input type="text" value={dados.numeroocorrencia} onChange={e => setDados({ ...dados, numeroocorrencia: e.target.value })} />
                    </div>

                    <div>
                        <label htmlFor="">Módulo</label>
                        <input type="text" value={dados.modulo} onChange={e => setDados({ ...dados, modulo: e.target.value })} />
                    </div>

                    <div>
                        <label htmlFor="">Data</label>
                        <input type="date" value={dados.dataocorrencia} onChange={e => setDados({ ...dados, dataocorrencia: e.target.value })} />
                    </div>

                    <div>
                        <label htmlFor="">Versão Erro</label>
                        <input type="text" value={dados.versaoerro} onChange={e => setDados({ ...dados, versaoerro: e.target.value })} />
                    </div>

                    <div className="clienteOcorrencia relative">
                        <span className="material-symbols-outlined searchIcon" onClick={() => setModalClienteAberto(true)}>
                            search
                        </span>
                        <label htmlFor="">Cliente</label>
                        <input type="text" value={dados.cliente.nome} readOnly />
                    </div>

                    <div className="descricaoOcorrencia">
                        <label htmlFor="">Descrição</label>
                        <textarea name="descricao" id="descricao" cols="30" rows="10" value={dados.descricaoocorrencia} onChange={e => setDados({ ...dados, descricaoocorrencia: e.target.value })} />
                    </div>

                    <div>
                        <label htmlFor="">Status</label>
                        <select value={dados.status} onChange={e => setDados({ ...dados, status: e.target.value })}>
                            <option value="correcao">Correção</option>
                            <option value="implementacao">Implementação</option>
                            <option value="melhoria">Melhoria</option>
                            <option value="duvida">Dúvida</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="">Setor</label>
                        <input type="text" value={dados.setor} onChange={e => setDados({ ...dados, setor: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="">Responsável</label>
                        <input type="text" value={dados.responsavel} onChange={e => setDados({ ...dados, responsavel: e.target.value })} />
                    </div>
                </form>
                <Submit formId="formOcorrencia" limparDados={limparDados} modo={location.state ? 'Editar' : 'Cadastrar' }/>
            </div>
        </section>
    )
}

export default Ocorrencia