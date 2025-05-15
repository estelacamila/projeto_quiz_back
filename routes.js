import express from "express";
import sql from "./database.js";
import bcrypt from "bcrypt";

const routes = express.Router();

// BUSCAR TODOS OS USUÁRIOS
routes.get('/Usuarios', async (req, res) => {
    try {
        const usuarios = await sql`SELECT * FROM Usuarios`;
        return res.status(200).json(usuarios);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao buscar usuários', error });
    }
});

//  ROTA DE CADASTRO

routes.post('/Cadastrar', async (req, res) => {
    const { Email, Senha } = req.body;

    try {
        const senhaCriptografada = await bcrypt.hash(Senha, 10);

        await sql`
            INSERT INTO Usuarios (Email, Senha, Status)
            VALUES (${Email}, ${senhaCriptografada}, 'aluno')
        `;

        return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao cadastrar usuário', error });
    }
});

// LOGIN COM COMPARAÇÃO DE SENHA (HASH)
routes.post('/Login', async (req, res) => { 
    const { Email, Senha } = req.body;

    try {
        const resultado = await sql`
            SELECT * FROM Usuarios WHERE Email = ${Email}
        `;
        
        if (resultado.length === 0) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        const Usuario = resultado[0]; 
        const SenhaValida = await bcrypt.compare(Senha, Usuario.Senha);
        console.log(SenhaValida);

        if (!SenhaValida) {
            return res.status(401).json({ message: 'Ops... Tente  novamente' });
        }

        return res.status(200).json(Usuario);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao realizar login', error });
    }
});



















// BUSCAR TODOS OS FILMES/SERIES
routes.get('/Filme/Serie', async (req, res) => {
    try {
        const Filmes = await sql`SELECT * FROM Filmes`;
        return res.status(200).json(Filmes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao buscar filmes', error });
    }
});
// routes.get('/questao1', async (req, res) => {
//     try {
//         const questoes = await sql`SELECT * FROM perguntas`;
//         return res.status(200).json(questoes);
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Erro ao buscar questões', error });
//     }
// });

// CADASTRAR QUESTÃO
routes.post('/filme/cadastrar', async (req, res) => {
    try {
        const { questao, questao1, questao2, questao3, questao4, gabarito, nivel } = req.body;
        const insert = await sql `
            INSERT INTO perguntas (questao, questao1, questao2, questao3, questao4, gabarito, nivel)
            VALUES (${questao}, ${questao1}, ${questao2}, ${questao3}, ${questao4}, ${gabarito}, ${nivel})
        `;

        return res.status(201).json({ message: 'filme cadastrado com sucesso!', questao: insert[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao cadastrar filme', error });
    }
});

// ATUALIZAR UMA QUESTÃO
routes.put('/Atualizar/:id', async (req, res) => {
    const { id } = req.params;
    const { questao, questao1, questao2, questao3, questao4, gabarito, nivel } = req.body;

    try {
        const result = await sql`
            UPDATE perguntas
            SET questao = ${questao}, questao1 = ${questao1}, questao2 = ${questao2}, 
                questao3 = ${questao3}, questao4 = ${questao4}, gabarito = ${gabarito}, nivel = ${nivel}
            WHERE id = ${id};
        `;

        if (result.length === 0) {
            return res.status(404).json({ message: 'Questão não encontrada' });
        }

        return res.status(200).json({ message: 'Questão atualizada com sucesso!', questao: result[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao atualizar questão', error });
    }
});

// DELETAR UMA QUESTÃO
routes.delete('/deletefilme/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`tentando deletar ${id}`)

    try {
        const result = await sql`DELETE FROM filme WHERE id = ${id}`;

        if (result.length === 0) {
            return res.status(404).json({ message: 'Questão não encontrada' });
        }

        return res.status(200).json({ message: 'Questão excluída com sucesso!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao excluir questão', error });
    }
});


export default routes;
