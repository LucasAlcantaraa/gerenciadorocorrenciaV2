import './templateModal.css'
import './modalCliente.css'
import './modalFiltro.css'
import TemplateModal from './templateModal'
import { useState } from 'react'

function ModalFiltro({ fecharModal, campos, setCampos, dados, setDados }) {
    const [localCampos, setLocalCampos] = useState(campos);
    const [groupField, setGroupField] = useState(''); // campo inicial para agrupamento
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' para crescente, 'desc' para decrescente

    const handleCheckboxChange = (event) => {
        setLocalCampos(prevCampos =>
            prevCampos.map(campo =>
                campo.id === event.target.name ? { ...campo, ativo: event.target.checked } : campo
            )
        );
    };

    const handleRadioChange = (event) => {
        setGroupField(event.target.value);
        // Atualiza o sortOrder para o valor do select correspondente
        const selectElement = document.getElementById(event.target.value);
        if (selectElement) {
            setSortOrder(selectElement.value);
        }
    };

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };


    const handleConfirm = () => {
        if (groupField) {
            // Remover a paginação e concatenar todos os dados
            const allDados = Object.values(dados).flat();

            // Ordenar os dados
            const sortedDados = [...allDados].sort((a, b) => {
                let valA;
                let valB;

                switch (groupField) {
                    case 'numeroocorrencia':
                        valA = Number(a[groupField]);
                        valB = Number(b[groupField]);
                        break;
                    case 'cliente':
                        valA = a[groupField].nome;
                        valB = b[groupField].nome;
                        break;
                    case 'versaosolucao':
                    case 'basetestada':
                        valA = a.solucionada[groupField];
                        valB = b.solucionada[groupField];
                        break;
                    default:
                        valA = a[groupField];
                        valB = b[groupField];
                }

                if (sortOrder === 'asc') {
                    return valA > valB ? 1 : -1;
                } else {
                    return valA < valB ? 1 : -1;
                }
            });

            // Reaplicar a paginação
            const paginatedDados = sortedDados.reduce((pages, item, index) => {
                const page = Math.floor(index / 10) + 1; // 10 itens por página
                if (!pages[page]) {
                    pages[page] = [];
                }
                pages[page].push(item);
                return pages;
            }, {});
            setDados(paginatedDados);
        }
        setCampos(localCampos);
        localStorage.setItem('campos', JSON.stringify(localCampos))
        fecharModal()
    };

    return (
        <TemplateModal titulo="Filtros" fecharModal={fecharModal}>
            <div className="divFiltros">
                <div className="filtroHeader">
                    <span>Visualizar Colunas</span>
                </div>
                <div className="divCamposFiltros">
                    {localCampos.map(campo => (
                        <div className="flex" key={campo.id}>
                            <label htmlFor={campo.id}>{campo.nome}</label>
                            <input
                                name={campo.id}
                                type="checkbox"
                                checked={campo.ativo}
                                onChange={handleCheckboxChange}
                            />
                        </div>
                    ))}
                </div>
                <div className="filtroHeader">
                    <span>Agrupar</span>
                </div>
                <div className="divCamposAgrupamento">
                    {localCampos.map(campo => (
                        <div key={campo.id}>
                            <label htmlFor={campo.id}>{campo.nome}</label>
                            <input
                                name={campo.id}
                                type="radio"
                                value={campo.id}
                                checked={groupField === campo.id}
                                onChange={handleRadioChange}
                            />

                            {(campo.id === 'dataocorrencia' || campo.id === 'numeroocorrencia') && (
                                <select id={campo.id} onChange={handleSortChange} disabled={groupField !== campo.id}>
                                    <option value="asc">asc</option>
                                    <option value="desc">desc</option>
                                </select>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="divConfirmarFiltro">
                <button className="submitBtn" onClick={handleConfirm}>Confirmar</button>
            </div>
        </TemplateModal>
    );
}


export default ModalFiltro