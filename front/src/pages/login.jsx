import './login.css'
import '../styles/geral.css'
import axiosInstance from '../func/axiosInstance';
import { useState, useEffect } from 'react';
import { validarPesquisa } from '../func/validar';
import { useNavigate } from 'react-router-dom';
import AvisoModal from '../components/modais/avisoModal';

async function realizarLogin(dados) {
    try {
        const { data } = await axiosInstance.post('/login', dados);
        if (data) {
            sessionStorage.setItem('usuario', data.usuario)
        }
    } catch (error) {
        console.error('Erro ao realizar login', error);
        if (error.response.data.mensagem) {
            alert(error.response.data.mensagem)
        } else {
            alert(error.response.data.error)
        }
    }
}

async function realizarCadastro(cadastro, setModo) {
    try {
        await axiosInstance.post('/cadastro', cadastro);
        setModo('login')
    } catch (error) {
        console.error('Erro ao cadastrar usuario', error);
        if (error.response.data.mensagem) {
            alert(error.response.data.mensagem)
        } else {
            alert(error.response.data.error)
        }

    }
}

function Login() {
    const [dados, setDados] = useState({
        login: '',
        senha: ''
    })
    const [cadastro, setCadastro] = useState({
        login: '',
        senha: '',
        confirmarsenha: '',
        token: ''
    })
    const [modo, setModo] = useState('login')
    const [modalAvisoAberto, setModalAvisoAberto] = useState(false)
    const [mensagem, setMensagem] = useState('')
    const navigate = useNavigate();
    const usuarioSessao = sessionStorage.getItem('usuario')

    useEffect(() => {
        if (usuarioSessao) {
            navigate('/home')
        }
    }, [usuarioSessao]);


    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const dadosValidados = validarPesquisa(dados, ['login', 'senha'])
            await realizarLogin(dadosValidados)

            navigate('/home')
        } catch (error) {
            setMensagem(error.message)
            setModalAvisoAberto(true)
        }
    }

    const handleCadastro = async (event) => {
        event.preventDefault()
        try {
            const dadosValidados = validarPesquisa(cadastro, ['login', 'senha', 'confirmarsenha', 'token'])
            await realizarCadastro(dadosValidados, setModo)

            navigate('/')
        } catch (error) {
            alert(error)
        }
    }

    const changeModo = (modo) => {
        if (modo === 'cadastro') {
            setModo(modo)
            setDados({
                login: '',
                senha: ''
            })
        } else if (modo === 'login') {
            setModo(modo)
            setCadastro({
                login: '',
                senha: '',
                confirmarsenha: '',
                token: ''
            })
        }
    }

    return (
        <section className="loginPage">
            {modalAvisoAberto && <AvisoModal fecharModal={() => setModalAvisoAberto(false)} mensagem={mensagem}/>}
            {modo === 'login' &&
                <div className="loginContent">
                    <span className="material-symbols-outlined tituloIcon">
                        person
                    </span>
                    <span className="tituloLogin">Login Ocorrências</span>
                    <form id="formLogin" onSubmit={handleSubmit}>
                        <div className="loginInputs">
                            <div className="relative">
                                <span className="material-symbols-outlined loginIcon">
                                    person
                                </span>
                                <input type="text" placeholder="Usuário" autoComplete="username" value={dados.login} onChange={e => setDados({ ...dados, login: e.target.value })} />
                            </div>
                            <div className="relative">
                                <span className="material-symbols-outlined loginIcon">
                                    key
                                </span>
                                <input type="password" placeholder="Senha" autoComplete="current-password" value={dados.senha} onChange={e => setDados({ ...dados, senha: e.target.value })} />
                            </div>
                        </div>
                    </form>
                    <button form="formLogin" type="submit" className='primaryBtn'>Entrar</button>
                    <span className="criarConta" onClick={() => changeModo('cadastro')}>Criar uma Conta</span>
                </div>
            }
            {modo === 'cadastro' &&
                <div className="loginContent" style={{ height: '400px' }}>
                    <span className="tituloLogin">Cadastrar-se</span>
                    <form id="formCadastro" onSubmit={handleCadastro}>
                        <div className="loginInputs">
                            <div className="relative">
                                <span className="material-symbols-outlined loginIcon">
                                    person
                                </span>
                                <input type="text" placeholder="Usuário" autoComplete="username" value={cadastro.login} onChange={e => setCadastro({ ...cadastro, login: e.target.value })} />
                            </div>
                            <div className="relative">
                                <span className="material-symbols-outlined loginIcon">
                                    key
                                </span>
                                <input type="password" placeholder="Senha" autoComplete="current-password" value={cadastro.senha} onChange={e => setCadastro({ ...cadastro, senha: e.target.value })} />
                            </div>
                            <div className="relative">
                                <span className="material-symbols-outlined loginIcon">
                                    check
                                </span>
                                <input type="password" placeholder="Confirmar Senha" value={cadastro.confirmarsenha} onChange={e => setCadastro({ ...cadastro, confirmarsenha: e.target.value })} />
                            </div>
                            <div className="relative">
                                <span className="material-symbols-outlined loginIcon">
                                    lock
                                </span>
                                <input type="password" placeholder="Token" value={cadastro.token} onChange={e => setCadastro({ ...cadastro, token: e.target.value })} />
                            </div>
                        </div>
                    </form>
                    <button form="formCadastro" type="submit" className='primaryBtn' style={{ padding: '15px 95px' }}>Cadastrar</button>
                    <span className="criarConta" onClick={() => changeModo('login')}>Fazer Login</span>
                </div>
            }
        </section >
    )
}

export default Login