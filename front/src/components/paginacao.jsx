import './paginacao.css'
import { Fragment } from 'react';

function Paginacao({ consulta, currentPage, setCurrentPage }) {
    const numeroPaginas = Object.keys(consulta)

    function mudarPagina(contador) {
        if (contador <= numeroPaginas.length && contador > 0) {
            setCurrentPage(contador)
        }
    }

    // Cria um array com o range de páginas que você quer exibir
    const paginasExibidas = numeroPaginas.filter((item, index) => {
        const numeroItem = parseInt(item);
        const isPrimeiraOuUltimaPagina = index === 0 || index === numeroPaginas.length - 1;

        return isPrimeiraOuUltimaPagina || (numeroItem >= currentPage - 1 && numeroItem <= currentPage + 1);
    });

    return (
        <div className="paginacao">
            <span className="paginaControleBtn" onClick={() => mudarPagina(currentPage - 1)}>Ant.</span>

            {paginasExibidas && paginasExibidas.map((item, index) => (
                <Fragment key={item}>
                    {console.log(paginasExibidas)}
                    {index === 1 && paginasExibidas[1] - paginasExibidas[0] > 1 && <span>...</span>}

                    <span key={item} onClick={() => mudarPagina(parseInt(item))} className={`paginaBtn ${parseInt(item) === currentPage ? 'paginaAtiva' : ''}`}>{item}</span>

                    {index === paginasExibidas.length - 2 && paginasExibidas[paginasExibidas.length - 1] - paginasExibidas[paginasExibidas.length - 2] > 1 && <span>...</span>}
                </Fragment>
            ))}
            <span className="paginaControleBtn" onClick={() => mudarPagina(currentPage + 1)}>Prox.</span>
        </div>
    )
}


export default Paginacao