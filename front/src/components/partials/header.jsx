import './header.css'
import axiosInstance from '../../func/axiosInstance'

function Header({ titulo }) {

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

    return (
        <header className="header">
            <h2>{titulo}</h2>
            <div className="divButton" onClick={() => sair()}>
                <button className="logOut">SAIR</button>
            </div>
        </header>
    )
}

export default Header;