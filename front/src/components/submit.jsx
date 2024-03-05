function Submit({formId, limparDados, modo}) {
    return (
        <div className="submitDiv">
            <button className="secondBtn" onClick={limparDados}>Limpar</button>
            <button form={formId} type="submit" className="submitBtn">{modo}</button>
        </div>
    )
}

export default Submit




