import './home.css'
import '../styles/geral.css'

import React, { useState, useEffect } from 'react';
import axiosInstance from '../func/axiosInstance';
import Paginacao from '../components/paginacao';
import { Link, useNavigate } from "react-router-dom";
import ModalFiltro from '../components/modais/modalFiltro';
import Submit from '../components/submit';
import * as XLSX from 'xlsx';
import ModalRelatorio from '../components/modais/modalRelatorio';
import { useDispatch } from 'react-redux';
import { setItem } from '../app/ocorrencia/itemOcorrencia';

async function getOcorrencias(dadosPesquisa, setDados) {
    try {
        const { data } = await axiosInstance.get('/ocorrencia', {
            params: dadosPesquisa
        });
        console.log(data)
        sessionStorage.setItem('dados', JSON.stringify(data))
        setDados(data);
    } catch (error) {
        console.error('Erro ao buscar dados', error);
    }
}

function Home() {
    const [dados, setDados] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const [pesquisa, setPesquisa] = useState(false)
    const [botaoPesquisa, setBotaoPesquisa] = useState({ texto: 'Pesquisar', icone: 'search' })
    const [dadosPesquisa, setDadosPesquisa] = useState({
        numeroocorrencia: '',
        descricaoocorrencia: '',
        cliente: '',
        versaoerro: '',
        modulo: '',
        versaosolucao: '',
        basetestada: '',
        datainicio: '',
        datafim: '',
        resolvida: '',
        setor: '',
        responsavel: ''
    })
    const [campos, setCampos] = useState([
        { id: 'numeroocorrencia', classe: '', nome: 'num. ocorrencia', ativo: true },
        { id: 'descricaoocorrencia', classe: 'descricaoBd', nome: 'descrição', ativo: true },
        { id: 'cliente', classe: 'clienteBd', nome: 'cliente', ativo: true },
        { id: 'dataocorrencia', classe: '', nome: 'data', ativo: true },
        { id: 'modulo', classe: '', nome: 'módulo', ativo: true },
        { id: 'versaoerro', classe: '', nome: 'versão erro', ativo: true },
        { id: 'status', classe: '', nome: 'status', ativo: true },
        { id: 'setor', classe: '', nome: 'setor', ativo: true },
        { id: 'responsavel', classe: '', nome: 'responsável', ativo: true },
        { id: 'versaosolucao', classe: '', nome: 'versão solução', ativo: true },
        { id: 'basetestada', classe: '', nome: 'base testada', ativo: true }
    ])
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [modalFiltroAberto, setModalFiltroAberto] = useState(false)
    const [modalRelatorioAberto, setModalRelatorioAberto] = useState(false)
    const [nomeArquivo, setNomeArquivo] = useState('Relatorios');

    const pesquisaSessao = JSON.parse(sessionStorage.getItem('dados'));
    const camposStorage = JSON.parse(localStorage.getItem('campos'));
    const dispatch = useDispatch()
    console.log('aquii', pesquisaSessao)

    useEffect(() => {
        if (pesquisaSessao) {
            setDados(pesquisaSessao)
        } else {
            getOcorrencias(dadosPesquisa, setDados);
        }

    }, []);

    useEffect(() => {
        if (camposStorage) {
            setCampos(camposStorage)
        }
    }, []);

    useEffect(() => {
        if (dadosPesquisa.numeroocorrencia) {
            setIsReadOnly(true)
        } else {
            setIsReadOnly(false)
        }
        console.log(dadosPesquisa)
    }, [dadosPesquisa]);

    function handlePesquisa() {
        pesquisa ? setPesquisa(false) : setPesquisa(true)
        handleBotaoPesquisa()
    }

    function handleBotaoPesquisa() {
        botaoPesquisa.texto === 'Pesquisar' ?
            setBotaoPesquisa(prevState => ({
                ...prevState,
                texto: 'Listar',
                icone: 'list_alt'
            })) :
            setBotaoPesquisa(prevState => ({
                ...prevState,
                texto: 'Pesquisar',
                icone: 'search'
            }))
    }

    function limparDadosPesquisa() {
        setDadosPesquisa({
            numeroocorrencia: '',
            status: '',
            descricaoocorrencia: '',
            cliente: '',
            versaoerro: '',
            modulo: '',
            versaosolucao: '',
            basetestada: '',
            datainicio: '',
            datafim: '',
            resolvida: '',
            setor: '',
            responsavel:''
        });
    }

    async function handlePesquisarDados(event) {
        event.preventDefault()
        await getOcorrencias(dadosPesquisa, setDados)
        setPesquisa(false)
        handleBotaoPesquisa()
        limparDadosPesquisa()
    }

    const exportToExcel = (incluirProcedimentos) => {
        const wb = XLSX.utils.book_new();
        const allData = Object.values(dados).flat(); // Combina todos os dados de todas as páginas
        const ws = XLSX.utils.json_to_sheet(allData.map(item => {
            let data = {
                numeroocorrencia: item.numeroocorrencia,
                descricaoocorrencia: item.descricaoocorrencia,
                cliente: item.cliente.nome,
                dataocorrencia: item.dataocorrencia,
                versaoerro: item.versaoerro,
                modulo: item.modulo,
                status: item.status,
                setor: item.setor ? item.setor : null, 
                responsavel: item.responsavel ? item.responsavel : null,
                versaosolucao: item.solucionada ? item.solucionada.versaosolucao : null,
                basetestada: item.solucionada ? item.solucionada.basetestada : null,
            };
            if (incluirProcedimentos) {
                data.procedimentos = item.solucionada ? item.solucionada.procedimentos : null;
            }
            return data;
        }));

        // Definir a largura das colunas
        ws['!cols'] = [
            { wch: 20 }, // Largura da coluna 'numeroocorrencia'
            { wch: 30 }, // Largura da coluna 'descricaoocorrencia'
            { wch: 15 }, // Largura da coluna 'cliente'
            { wch: 15 }, // Largura da coluna 'dataocorrencia'
            { wch: 10 }, // Largura da coluna 'versaoerro'
            { wch: 15 }, // Largura da coluna 'modulo'
            { wch: 20 }, // Largura da coluna 'status'
            { wch: 20 }, // Largura da coluna 'setor'
            { wch: 20 }, // Largura da coluna 'responsável'
            { wch: 15 }, // Largura da coluna 'versaosolucao'
            { wch: 15 }, // Largura da coluna 'basetestada'
            { wch: 30 }  // Largura da coluna 'procedimentos'
        ];

        XLSX.utils.book_append_sheet(wb, ws, 'Dados');
        XLSX.writeFile(wb, `${nomeArquivo}.xlsx`);
        setModalRelatorioAberto(false)
    };

    return (
        <section className="homePage">
            <div className="cabecalho">

                <Link to={`/ocorrencia`}><button className="mainBtn">Nova Ocorrência</button></Link>
                <button className="pesquisaBtn flex" onClick={() => handlePesquisa()}>{botaoPesquisa.texto}
                    <span className="material-symbols-outlined">
                        {botaoPesquisa.icone}
                    </span>
                </button>
                <button className="relatorioBtn flex" onClick={() => setModalRelatorioAberto(true)}>Relatório
                    <span className="material-symbols-outlined">
                        lab_profile
                    </span>
                </button>
                <button className="material-symbols-outlined filtro" onClick={() => setModalFiltroAberto(true)}>
                    filter_alt
                </button>
            </div>
            {modalFiltroAberto && <ModalFiltro fecharModal={() => setModalFiltroAberto(false)} campos={campos} setCampos={setCampos} dados={dados} setDados={setDados} />}
            {modalRelatorioAberto && <ModalRelatorio fecharModal={() => setModalRelatorioAberto(false)} gerarRelatorio={exportToExcel} nomeArquivo={nomeArquivo} setNomeArquivo={setNomeArquivo} />}
            {!pesquisa ?
                <div className="tableDiv">
                    <table className="tableHome">
                        <thead>
                            <tr>
                                {campos.map(campo => campo.ativo && <th className={campo.id}>{campo.nome}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {dados[currentPage] && dados[currentPage].map((item) => (
                                <tr key={item.id} className="linhaOcorrencia" onClick={() => navigate(`/ocorrencia/${item.numeroocorrencia}`, { state: { item } })}>
                                    {campos.map(campo => {
                                        let valor = item[campo.id];
                                        if (campo.id === 'cliente') {
                                            valor = item.cliente.nome;
                                        } else if (campo.id === 'versaosolucao') {
                                            valor = item.solucionada.versaosolucao; // ou item.solucionada.basetestada
                                        } else if (campo.id === 'basetestada') {
                                            valor = item.solucionada.basetestada;
                                        } else if (campo.id === 'descricaoocorrencia') {
                                            valor = item.descricaoocorrencia.length > 28 ? item.descricaoocorrencia.substring(0, 28) + '...' : item.descricaoocorrencia
                                        }
                                        return campo.ativo && <td className={`${campo.id} ${campo.classe}`}>{valor}</td>;
                                    })}

                                    {/* {<td>{item.numeroocorrencia}</td>}
                                    {<td className="descricaoBd">{item.descricaoocorrencia.length > 28 ? item.descricaoocorrencia.substring(0, 28) + '...' : item.descricaoocorrencia}</td>}
                                    {<td className="clienteBd">{item.cliente.nome}</td>}
                                    {<td>{item.dataocorrencia}</td>}
                                    {<td>{item.modulo}</td>}
                                    {<td>{item.versaoerro}</td>}
                                    {<td>{item.status}</td>}
                                    {<td>{item.solucionada.versaosolucao}</td>}
                                    {<td>{item.solucionada.basetestada}</td>} */}
                                </tr>
                            ))}

                        </tbody>
                    </table>
                    <Paginacao
                        consulta={dados}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
                :
                <div className="searchDiv">
                    <div className="pesquisaHeader">
                        <span>Pesquisar</span>
                    </div>
                    <form id="formPesquisa" onSubmit={handlePesquisarDados} className="formPesquisa">
                        <div className="flexColumn">
                            <label htmlFor="">Numero Ocorrência</label>
                            <input type="text" value={dadosPesquisa.numeroocorrencia} onChange={e => setDadosPesquisa({ ...dadosPesquisa, numeroocorrencia: e.target.value })} />
                        </div>
                        <div className="flexColumn">
                            <label htmlFor="">Status</label>
                            <select value={dadosPesquisa.status} onChange={e => setDadosPesquisa({ ...dadosPesquisa, status: e.target.value })} disabled={isReadOnly}>
                                <option value="">Selecione...</option>
                                <option value="correcao">Correção</option>
                                <option value="duvida">Dúvida</option>
                                <option value="implementacao">Implementação</option>
                                <option value="melhoria">Melhoria</option>
                            </select>
                        </div>
                        <div className="flexColumn descricaoPesquisa">
                            <label htmlFor="" >Descrição Ocorrência</label>
                            <input type="text" value={dadosPesquisa.descricaoocorrencia} onChange={e => setDadosPesquisa({ ...dadosPesquisa, descricaoocorrencia: e.target.value })} readOnly={isReadOnly} />
                        </div>
                        <div className="flexColumn">
                            <label htmlFor="">Cliente</label>
                            <input type="text" value={dadosPesquisa.cliente} onChange={e => setDadosPesquisa({ ...dadosPesquisa, cliente: e.target.value })} readOnly={isReadOnly} />
                        </div>
                        <div className="flexColumn">
                            <label htmlFor="">Versão Erro</label>
                            <input type="text" value={dadosPesquisa.versaoerro} onChange={e => setDadosPesquisa({ ...dadosPesquisa, versaoerro: e.target.value })} readOnly={isReadOnly} />
                        </div>
                        <div className="flexColumn">
                            <label htmlFor="">Módulo</label>
                            <input type="text" value={dadosPesquisa.modulo} onChange={e => setDadosPesquisa({ ...dadosPesquisa, modulo: e.target.value })} readOnly={isReadOnly} />
                        </div>
                        <div className="flexColumn">
                            <label htmlFor="">Versão Solução</label>
                            <input type="text" value={dadosPesquisa.versaosolucao} onChange={e => setDadosPesquisa({ ...dadosPesquisa, versaosolucao: e.target.value })} readOnly={isReadOnly} />
                        </div>
                        <div className="flexColumn">
                            <label htmlFor="">Base Testada</label>
                            <input type="text" value={dadosPesquisa.baseteste} onChange={e => setDadosPesquisa({ ...dadosPesquisa, baseteste: e.target.value })} readOnly={isReadOnly} />
                        </div>
                        <div className="flexColumn">
                            <label htmlFor="">Setor</label>
                            <input type="text" value={dadosPesquisa.setor} onChange={e => setDadosPesquisa({ ...dadosPesquisa, setor: e.target.value })} readOnly={isReadOnly} />
                        </div>
                        <div className="flexColumn">
                            <label htmlFor="">Responsável</label>
                            <input type="text" value={dadosPesquisa.responsavel} onChange={e => setDadosPesquisa({ ...dadosPesquisa, responsavel: e.target.value })} readOnly={isReadOnly} />
                        </div>
                        <div className="flexColumn">
                            <label htmlFor="">Data Inicial</label>
                            <input type="date" value={dadosPesquisa.datainicio} onChange={e => setDadosPesquisa({ ...dadosPesquisa, datainicio: e.target.value })} readOnly={isReadOnly} />
                        </div>
                        <div className="flexColumn">
                            <label htmlFor="">Data Final</label>
                            <input type="date" value={dadosPesquisa.datafim} onChange={e => setDadosPesquisa({ ...dadosPesquisa, datafim: e.target.value })} readOnly={isReadOnly} />
                        </div>

                        <div className="divRadios flex">
                            <div>
                                <label htmlFor="">Solucionadas</label>
                                <input type="radio" name="status" value={dadosPesquisa.resolvida} checked={dadosPesquisa.resolvida === 'T'} onChange={() => setDadosPesquisa({ ...dadosPesquisa, resolvida: 'T' })} disabled={isReadOnly} />
                            </div>
                            <div>
                                <label htmlFor="">Não Solucionadas</label>
                                <input type="radio" name="status" value={dadosPesquisa.resolvida} checked={dadosPesquisa.resolvida === 'F'} onChange={() => setDadosPesquisa({ ...dadosPesquisa, resolvida: 'F' })} disabled={isReadOnly} />
                            </div>
                            <div>
                                <label htmlFor="">Todas</label>
                                <input type="radio" name="status" value={dadosPesquisa.resolvida} checked={dadosPesquisa.resolvida === ''} onChange={() => setDadosPesquisa({ ...dadosPesquisa, resolvida: '' })} disabled={isReadOnly} />
                            </div>

                        </div>
                    </form>
                    <Submit formId="formPesquisa" limparDados={limparDadosPesquisa} modo={'Pesquisar'} />
                </div>

            }
        </section>
    )
}

export default Home