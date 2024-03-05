import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axiosInstance from '../func/axiosInstance';
import { validarPesquisa } from '../func/validar';
import Submit from '../components/submit';
import AvisoModal from '../components/modais/avisoModal';
import './cliente.css'
import '../styles/geral.css'

async function inserirCliente(dados) {
    try {
        const { data } = await axiosInstance.post('/cliente', dados);
        console.log(data)
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

function Cliente() {
    const navigate = useNavigate();
    const [dados, setDados] = useState({
        nome: '',
        codigoparceiro: '',
        endereco: '',
        telefone: '',
        bairro: '',
        cep: '',
        telefone2: '',
        cidade: '',
        estado: ''
    })
    const [modalAvisoAberto, setModalAvisoAberto] = useState(false)
    const [mensagem, setMensagem] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const obj = validarPesquisa(dados, ['nome', 'codigoparceiro'])

            await inserirCliente(obj)

            handleMensagem({message:"Cliente Cadastrado Com sucesso!"})
            limparDados()
        } catch (error) {
            console.log(error)
            handleMensagem(error)
        }

    };

    function limparDados() {
        setDados({
            nome: '',
            codigoparceiro: '',
            endereco: '',
            telefone: '',
            bairro: '',
            cep: '',
            telefone2: '',
            cidade: '',
            estado: ''
        });
    }

    function handleMensagem(mensagem) {
        setMensagem(mensagem.message)
        setModalAvisoAberto(true)
    }

    return (
        <section className="clientePage">
            <div className="cabecalho">
                <button className="mainBtn" onClick={() => navigate(-1)}>voltar</button>
            </div>

            {modalAvisoAberto && <AvisoModal fecharModal={() => setModalAvisoAberto(false)} mensagem={mensagem} />}

            <div className="divCliente">
                <form id="formCliente" onSubmit={handleSubmit} className="formCliente">

                    <div className="nomeCliente">
                        <label htmlFor="">Cliente</label>
                        <input type="text" value={dados.nome} onChange={e => setDados({ ...dados, nome: e.target.value })} />
                    </div>

                    <div>
                        <label htmlFor="">Cod. Cliente</label>
                        <input type="text" value={dados.codigoparceiro} onChange={e => setDados({ ...dados, codigoparceiro: e.target.value })} />
                    </div>

                    <span style={{ color: '#000', fontWeight: 'bold' }}>Dados de endereço são opcionais</span>

                    <div className="endereco">
                        <label htmlFor="">Endereço</label>
                        <input type="text" value={dados.endereco} onChange={e => setDados({ ...dados, endereco: e.target.value })} />
                    </div>

                    <div>
                        <label htmlFor="">Cidade</label>
                        <input type="text" value={dados.cidade} onChange={e => setDados({ ...dados, cidade: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="">Bairro</label>
                        <input type="text" value={dados.bairro} onChange={e => setDados({ ...dados, bairro: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="">Estado</label>
                        <select type="text" className="estado" id="estadoCliente" name="estado" value={dados.estado} onChange={e => setDados({ ...dados, estado: e.target.value })}>
                            <option value="">Selecione...</option>
                            <option value="AC">Acre</option>
                            <option value="AL">Alagoas</option>
                            <option value="AP">Amapá</option>
                            <option value="AM">Amazonas</option>
                            <option value="BA">Bahia</option>
                            <option value="CE">Ceará</option>
                            <option value="DF">Distrito Federal</option>
                            <option value="ES">Espírito Santo</option>
                            <option value="GO">Goiás</option>
                            <option value="MA">Maranhão</option>
                            <option value="MT">Mato Grosso</option>
                            <option value="MS">Mato Grosso do Sul</option>
                            <option value="MG">Minas Gerais</option>
                            <option value="PA">Pará</option>
                            <option value="PB">Paraíba</option>
                            <option value="PR">Paraná</option>
                            <option value="PE">Pernambuco</option>
                            <option value="PI">Piauí</option>
                            <option value="RJ">Rio de Janeiro</option>
                            <option value="RN">Rio Grande do Norte</option>
                            <option value="RS">Rio Grande do Sul</option>
                            <option value="RO">Rondônia</option>
                            <option value="RR">Roraima</option>
                            <option value="SC">Santa Catarina</option>
                            <option value="SP">São Paulo</option>
                            <option value="SE">Sergipe</option>
                            <option value="TO">Tocantins</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="">Telefone</label>
                        <input type="text" value={dados.telefone} onChange={e => setDados({ ...dados, telefone: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="">Telefone 2</label>
                        <input type="text" value={dados.telefone2} onChange={e => setDados({ ...dados, telefone2: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="">Cep</label>
                        <input type="text" value={dados.cep} onChange={e => setDados({ ...dados, cep: e.target.value })} />
                    </div>
                </form>

                <Submit formId="formCliente" limparDados={limparDados} modo={'cadastrar'} />
            </div>
        </section>
    )
}

export default Cliente