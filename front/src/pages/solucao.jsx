import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axiosInstance from '../func/axiosInstance';
import { validarPesquisa } from '../func/validar';
import Submit from '../components/submit';
import AvisoModal from '../components/modais/avisoModal';
import './solucao.css'
import '../styles/geral.css'

async function inserirSolucao(dados) {
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

function Solucao({ setTitulo }) {
    const { numOcorrencia } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    console.log('de novo', location)

    const [modalAvisoAberto, setModalAvisoAberto] = useState(false)
    const [mensagem, setMensagem] = useState('')

    const [dados, setDados] = useState({
        idocorrencia: '',
        versaosolucao: '',
        basetestada: '',
        procedimentos: '',
        resolvida: 'F'
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

                    if (!data.mensagem) {
                        const item = location.state.item.solucionada
                        setTitulo('solucao', `Solução da ocorrência N° ${numOcorrencia}`);
                        console.log('location aqui', location)

                        setDados({
                            idocorrencia: item.idocorrencia,
                            versaosolucao: item.versaosolucao,
                            basetestada: item.basetestada,
                            procedimentos: item.procedimentos,
                            resolvida: item.resolvida
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
            if (!mensagem.includes('Falta campo obrigatório')) {
                navigate('/home');
            }
        }
    }, [modalAvisoAberto]); // "Observa" as mudanças em modalAvisoAberto

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const obj = validarPesquisa(dados, ['versaosolucao', 'basetestada', 'procedimentos'])
            obj.resolvida = 'T'
            
            await inserirSolucao(obj)
            handleMensagem({ message: "Solução atualizada com sucesso!" })

            // limparDados()
        } catch (error) {
            console.log(error)
            handleMensagem(error)
        }

    };

    function limparDados() {
        setDados({
            idocorrencia: '',
            versaosolucao: '',
            basetestada: '',
            procedimentos: '',
            resolvida: 'F'
        });
    }

    function handleMensagem(mensagem) {
        setMensagem(mensagem.message)
        setModalAvisoAberto(true)
    }

    return (
        <section className="solucaoPage">
            <div className="cabecalho">
                <button className="mainBtn" onClick={() => navigate(-1)}>voltar</button>
            </div>

            {modalAvisoAberto && <AvisoModal fecharModal={() => setModalAvisoAberto(false)} mensagem={mensagem} />}

            <div className="divSolucao">
                <form id="formSolucao" onSubmit={handleSubmit} className="formSolucao">
                    <div className="versaoSolucao">
                        <label htmlFor="">Versão Solução</label>
                        <input type="text" value={dados.versaosolucao} onChange={e => setDados({ ...dados, versaosolucao: e.target.value })} />
                    </div>
                    <div className="baseTestada">
                        <label htmlFor="">Base Testada</label>
                        <input type="text" value={dados.basetestada} onChange={e => setDados({ ...dados, basetestada: e.target.value })} />
                    </div>
                    <div className="procedimentosSolucao">
                        <label htmlFor="">Procedimentos</label>
                        <textarea name="" id="" cols="30" rows="10" value={dados.procedimentos} onChange={e => setDados({ ...dados, procedimentos: e.target.value })} />
                    </div>
                </form>
                <Submit formId="formSolucao" limparDados={limparDados} modo={dados.resolvida === 'T' ? 'Editar' : 'Solucionar'} />
            </div>

        </section>
    )
}

export default Solucao