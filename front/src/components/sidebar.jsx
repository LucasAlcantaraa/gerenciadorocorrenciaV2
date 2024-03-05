import './sidebar.css'
import '../styles/geral.css'
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
    const [sidebar, setSidebar] = useState('collapsed')
    const [textoVisivel, setTextoVisivel] = useState('textoOculto')
    const [flex, setFlex] = useState('flexCenter')
    const usuario = sessionStorage.getItem('usuario')

    function changeSidebar() {
        if (sidebar === 'collapsed') {
            setSidebar('opened')
            setTextoVisivel('textoVisivel')
            setFlex('flexRight')

        } else {
            setSidebar('collapsed')
            setTextoVisivel('textoOculto')
            setFlex('flexCenter')
        }

    }

    return (
        <div className={`sidebar ${sidebar}`}>
            <div className={`sidebarHeader ${flex}`}>
                <Link to={`/home`} className="usuarioHeader">
                    <span className={`material-symbols-outlined ${textoVisivel}`}>
                        account_circle
                    </span>
                    <span className={textoVisivel}>{usuario.substring(0, 14)}</span>
                </Link>

                <span className="material-symbols-outlined menuSidebar" onClick={changeSidebar}>
                    menu
                </span>
            </div>
            <div className="sidebarBody">
                <Link to={`/cliente`} className="semSublinhado">
                    <div>
                        <span className="material-symbols-outlined">
                            person_add
                        </span>
                        <h4 className={textoVisivel}>Cadastrar Cliente</h4>
                    </div>
                </Link>
                <Link to={`/mudar-senha`} className="semSublinhado">
                    <div>
                        <span className="material-symbols-outlined">
                            vpn_key
                        </span>
                        <h4 className={textoVisivel}>Mudar Senha</h4>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Sidebar;