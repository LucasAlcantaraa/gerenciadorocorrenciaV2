import './templateModal.css'
import './modalCliente.css'
import TemplateModal from './templateModal'
import axiosInstance from '../../func/axiosInstance';
import { useState } from 'react'

async function getClientes(cliente, setDados) {
    try {
        const { data } = await axiosInstance.get('/cliente', {
            params: {
                cliente: cliente.cliente
            }
        });
        console.log(data)
        setDados(data)
    } catch (error) {
        console.error('Erro ao buscar dados', error);
    }
}


function ModalCliente({ fecharModal, preencherCliente }) {
    const [cliente, setCliente] = useState({ cliente: '' })
    const [dados, setDados] = useState([])

    return (
        <TemplateModal titulo="Pesquisar Cliente" fecharModal={fecharModal}>
            <div className="divModalCliente">
                <input type="text" placeholder='Nome ou Código do Cliente' value={cliente.cliente} onChange={e => setCliente({ cliente: e.target.value })} />
                <button className="mainBtn" style={{ marginRight: 0 }} onClick={() => getClientes(cliente, setDados)}>Pesquisar</button>
            </div>
            <div className="mensagemErro">{dados.mensagem && <span>{dados.mensagem}</span>}</div>

            <div className="divTableCliente">
                <table className="tableCliente">
                    <thead>
                        <tr>
                            <th className="idClienteModal">id</th>
                            <th className="nomeClienteModal">Nome</th>
                            <th className="codClienteModal">Código Parceiro</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(dados && !dados.mensagem) && dados.map((item) => (
                            <tr key={item.id} className="trTableCliente" onClick={() => preencherCliente(item)}>
                                <td>{item.id}</td>
                                <td>{item.nome}</td>
                                <td>{item.codigoparceiro}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </TemplateModal>
    );
}


export default ModalCliente