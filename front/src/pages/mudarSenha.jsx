import './login.css'
import '../styles/geral.css'
import axiosInstance from '../func/axiosInstance';
import { useState, useEffect } from 'react';
import AvisoModal from '../components/modais/avisoModal'
import { validarPesquisa } from '../func/validar';

async function sair() {
    try {
        const { data } = await axiosInstance.get('/login/logout')
        if (data) {
            sessionStorage.clear()
            window.location.reload()
        }
    } catch (error) {
        console.log(error)
    }
}

async function alterarSenha(dados, modalAviso, setMensagem, setRedirecionar) {
    try {
        const { data } = await axiosInstance.patch('/cadastro', dados);
        if (data) {
            setMensagem(data.mensagem)
            setRedirecionar(true)
            modalAviso(true)
        }
    } catch (error) {
        console.error('Erro ao trocar senha', error);
        if (error.response.data.mensagem) {
            setMensagem(error.response.data.mensagem)
            modalAviso(true)
        } else {
            setMensagem(error.response.data.error)
            modalAviso(true)
        }
    }
}

function MudarSenha() {
    const login = sessionStorage.getItem('usuario')
    const [dados, setDados] = useState({
        login: login,
        senhaatual: '',
        novasenha: '',
        confirmarsenha: ''
    })
    const [modalAvisoAberto, setModalAvisoAberto] = useState(false)
    const [mensagem, setMensagem] = useState('')
    const [redirecionar, setRedirecionar] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const dadosValidados = validarPesquisa(dados, ['login', 'senhaatual', 'novasenha', 'confirmarsenha'])

            await alterarSenha(dadosValidados, setModalAvisoAberto, setMensagem, setRedirecionar)
        } catch (error) {
            setMensagem(error.message)
            setModalAvisoAberto(true)
        }
    }

    useEffect(() => {
        if (!modalAvisoAberto && redirecionar) {
            sair()
        }
    }, [modalAvisoAberto]); // "Observa" as mudanças em modalAvisoAberto

    return (
        <section style={{ display: 'flex', justifyContent: 'center' }}>
            {modalAvisoAberto && <AvisoModal fecharModal={() => setModalAvisoAberto(false)} mensagem={mensagem} />}
            <div className="loginContent">
                <span className="tituloLogin">Alterar Senha</span>
                <form id="formAlterarSenha" onSubmit={handleSubmit}>
                    <div className="loginInputs">
                        <div className="relative" hidden>
                            <span className="material-symbols-outlined loginIcon">
                                user
                            </span>
                            <input type="text" placeholder="Senha Atual" autoComplete="current-username" value={dados.login} readOnly />
                        </div>
                        <div className="relative">
                            <span className="material-symbols-outlined loginIcon">
                                key
                            </span>
                            <input type="password" placeholder="Senha Atual" autoComplete="current-password" value={dados.senhaatual} onChange={e => setDados({ ...dados, senhaatual: e.target.value })} />
                        </div>
                        <div className="relative">
                            <span className="material-symbols-outlined loginIcon">
                                vpn_key
                            </span>
                            <input type="password" placeholder="Nova Senha" autoComplete="current-password" value={dados.novasenha} onChange={e => setDados({ ...dados, novasenha: e.target.value })} />
                        </div>
                        <div className="relative">
                            <span className="material-symbols-outlined loginIcon">
                                check
                            </span>
                            <input type="password" placeholder="Confirmar Nova Senha" autoComplete="current-password" value={dados.confirmarsenha} onChange={e => setDados({ ...dados, confirmarsenha: e.target.value })} />
                        </div>
                    </div>
                </form>
                <button form="formAlterarSenha" type="submit" className='primaryBtn'>Alterar</button>
            </div>
        </section>
    )
}

export default MudarSenha