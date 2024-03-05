import TemplateModal from "./templateModal";

function AvisoModal({ fecharModal, mensagem}) {

    return (
        <TemplateModal titulo="Aviso" fecharModal={fecharModal}>
         <div>
            <span>{mensagem}</span>
         </div>
        </TemplateModal>
    );
}


export default AvisoModal