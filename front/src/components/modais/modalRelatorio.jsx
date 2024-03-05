import './templateModal.css'
import './modalRelatorio.css'
import TemplateModal from './templateModal'
import { useState } from 'react'

function ModalRelatorio({ fecharModal, gerarRelatorio, nomeArquivo, setNomeArquivo }) {
    const [incluirProcedimentos, setIncluirProcedimentos] = useState(false);

    return (
        <TemplateModal titulo="Gerar Relatorio" fecharModal={fecharModal}>
            <div className="divModalRelatorio">
                <span>Escolha um nome para o seu arquivo, ele será baixado como <strong>xlsx.</strong></span>
                <div className="divNomeArquivo">
                    <input type="text" placeholder='Nome do seu arquivo' value={nomeArquivo} onChange={e => setNomeArquivo(e.target.value)} />
                    <span style={{ fontWeight: 'bold' }}>.xlsx</span>
                </div>
                <div className="divIncluirProcedimento">
                    <label htmlFor="">Incluir Procedimentos</label>
                    <input type="checkbox" onChange={e => setIncluirProcedimentos(e.target.checked)} />
                </div>
                <div className="divRelatorioBtn">
                    <button className="mainBtn"  onClick={() => gerarRelatorio(incluirProcedimentos)}>Gerar Relatório</button>
                </div>

            </div>
        </TemplateModal>
    );
}


export default ModalRelatorio