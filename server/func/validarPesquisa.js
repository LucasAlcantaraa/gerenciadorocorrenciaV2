// verifica se todos os dados necessários para a pesquisa e enviados pelo usuário são válidos
exports.validarPesquisa = (obj, chaves) => {
    if (!Object.keys(obj).length) {
        throw new Error("Nenhum dado Passado");
    }
    for (let chave of chaves) {
        if (obj[chave] === undefined || (obj[chave] === "")) {
        throw new Error(`Falta campo obrigatório '${chave}'`);
        }
    }
    return obj
};

// verifica se pelo menos um dos dados da pesquisa enviados pelo usuário é válido
exports.validarPesquisaParcial = (obj, chaves) => {
    if (!Object.keys(obj).length) {
        throw new Error("Nenhum dado Passado");
    }
    let contador = 0

    for (let chave of chaves) {
        if (obj[chave] !== undefined && (obj[chave] !== "")) {
            contador ++
        }
    }

    if(contador === 0){
        throw new Error(`Nenhum dos dados necessários para a atualização foram fornecidos corretamente`);
    }

    return obj
};