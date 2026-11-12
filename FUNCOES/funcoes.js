//trazer a lista - K.O

//saber qual é o último ID cadastrado - K.O
//somar + 1 para ser o próximo ID - K.O

//return

import { listarTodos} from "../MANIPULACOES/manipulador_arquivo.js";

export async function gerarNovoId(){
    const registrosAlunos = await listarTodos();

    //pegar todos os IDs existentes
    const ids = registrosAlunos.map((aluno) => aluno.id);

    const novoID = Math.max(...ids) + 1;
    return novoID;
}