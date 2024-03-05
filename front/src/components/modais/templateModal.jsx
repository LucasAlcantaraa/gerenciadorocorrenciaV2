import './templateModal.css'

function TemplateModal({ children, titulo, fecharModal }) {
    return (
        <div className="modal">
            <div className="modalContent">
                <div className="modalHeader">
                    <h2>{titulo}</h2>
                    <div className="fecharModalBtn" onClick={fecharModal}>
                        <span className="material-symbols-outlined">
                            close
                        </span>Fechar
                    </div>
                </div>
                <div className="modalBody">
                    {children}
                </div>
            </div>
        </div>
    );
}


export default TemplateModal