//IMPORTS
import express from "express";
import { listarTodos, salvarTodos } from "./MANIPULADOR/manipulador_arquivo.js";
import { gerarNovoId } from "./FUNÇÕES/funcoes.js";

const app = express();
const PORT = 3000;
app.use(express.json());

// LÓGICA
//GET - Boas Vindas
app.get("/", (req, res) => {
    res.send("Bem-vindo à API do Sistema de Controle de Presença e Saídas de Alunos");
});

//GET /registros
app.get("/registros", async (req, res) => {
    try{
        const cadastros = await listarTodos();

        return res.status(200).json(cadastros);
    }
    catch(error){
        console.log("Erro ao listar registros", error);
        res.status(500).json({error: "Não foi possível ler os registros"});
    }
});

//GET /registros/:id
app.get("/registros/:id", async (req, res) => {
  try {
    // Recuperar ID enviado na URL e converter para number
    const id = Number(req.params.id);

    // Ler os dados cadastrados
    const dados = await listarTodos();

    // Procurar o item que tenha o ID igual ao enviado
    const alunoEncontrado = dados.find((registros) => registros.id === id);

    // Verificar se encontrou o aluno
    if (!alunoEncontrado) {
      return res.status(404).json({ erro: "Aluno não encontrado" });
    }

    // Retornar os dados do aluno encontrado
    return res.status(200).json(alunoEncontrado);

  } catch (error) {
    console.log("Erro ao buscar cadastro", error);

    return res.status(500).json({ erro: "Não foi possível buscar o cadastro" });
  }
});

//POST /registrosPost
app.post("/registrosPost", async (req, res) => {
    try{
        //dados do novo cadastro
        const {matricula, nome, turma, data, presente, motivoSaida, minutosFora, alertaTempo} = req.body;
            
        //valida campos obrigatórios
        if (!matricula || !nome || !turma || !data || !presente || !motivoSaida || !minutosFora  ){
            return res.status(400).json({erro: "Todos os campos são obrigatórios"});
        }
    
        //gerando um novo ID único
        const id = await gerarNovoId();

    const novoCadastro = {
        id: Number(id),
        matricula: matricula,
        nome: nome,
        turma: turma,
        data: data,
        presente: presente,
        motivoSaida: motivoSaida,
        minutosFora: Number(minutosFora),
        alertaTempo: alertaTempo
    };
    
    const cadastros = await listarTodos();
    cadastros.push(novoCadastro);
    
    await salvarTodos(cadastros);
    
    return res.status(201).json({ mensagem: "Cadastro realizado com sucesso!"})
}
catch(error){
    console.log("Erro ao salvar cadastro", error);
    return res.status(500).json
    ({error : "Não foi possivel salvar o cadastro"})
}
});

//DELETE /registros/:id
app.delete("/registros/:id", async (req, res) => {

    try{
        //recuperar ID enviado na url e converter para Number
        const id = Number(req.params.id);

        //leio os dados cadastrados
        const dados = await listarTodos();

        //mantém apenas os itens com id diferente
        const dadosAtualizados = dados.filter((registro) => registro.id !== id);

        //verificar se deletou
        if(dadosAtualizados.length === dados.length){
            return res.status(404).json({erro: "Registro não deletado"});
        }

        //salvar a lista nova
        await salvarTodos(dadosAtualizados);

        //mensagem de resposta
        return res.status(200).json({mensagem: "Registro excluído com sucesso"});
    }

    catch(error){
        console.log("Erro ao deletar registro", error);
        return res.status(500).json({error: "Não foi possível deletar registro."});
    }
});

//PUT /registros/:id
app.put("/registros/:id", async(req, res) => {
    try{
        //recuperar ID enviado na url e converter para Number
        const id = Number(req.params.id);

        //ler os dados cadastrados
        const dados = await listarTodos();

        //procurar o item com id informado
        const registroExistente = dados.find(
            (registro) => registro.id === id
        );

        //verificar se entrou o registro
        if(!registroExistente) {
            return res.status(404).json({ erro: "Registro não encontrado" });
        }

        //se comportará como um novo cadastro.
         //dado do novo cadastro
         const {matricula, nome, turma, data, presente, motivoSaida, minutosFora, alertaTempo} = req.body;

         //valida campos obrigatórios
         if (!matricula || !nome || !turma || !data || !presente || !motivoSaida || !minutosFora){
                return res.status(400).json({erro: "Todos os campos são obrigatórios"})
         }

        const registrosAtualizado = {
        id: Number(id),
        matricula: matricula,
        nome: nome,
        turma: turma,
        data: data,
        presente: presente,
        motivoSaida: motivoSaida,
        minutosFora: Number(minutosFora),
        alertaTempo: alertaTempo
    };

    //substituir o atendimento existente pelo atualizado - map
    const dadosAtualizados = dados.map((registro) => 
        registro.id === id ? registrosAtualizado : registro
    );

    //salvar a lista nova
    await salvarTodos(dadosAtualizados);

    //mensagem de resposta
    return res.status(200).json({ mensagem: "Registro atualizado com sucesso!"});

    }
    catch(error){
        console.log("Erro ao alterar cadastro", error);
        return res.status(500).json
        ({error : "Não foi possivel alterar e salvar o cadastro"})
    }
});

// RESTO
//nenhuma rota
app.use((req, res) => {
    res.status(404).json({erro: "Rota não encontrada"});
});

//funções auxiliares
app.listen(PORT, () => {
    console.log("Está rodando na porta: ", PORT)
})
