exports.dataFormatadaInvertida = () => {
    const data = new Date();
    return data.toISOString().slice(0, 10);
}

exports.dataFormatada = () => {
    const data = new Date();
    return data.toLocaleDateString('pt-BR');
}

exports.dataAnteriorInvertida = () => {
    const data = new Date();
    data.setDate(data.getDate() - 7);
    return data.toISOString().slice(0, 10);
}

exports.ajustarFusoHorario = (obj) => {
    obj = obj.map(elemento => {
        elemento.dataocorrencia = elemento.dataocorrencia.toLocaleDateString('pt-br')
        return elemento;
    });

    return obj
}