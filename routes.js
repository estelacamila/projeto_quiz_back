import express from "express";
import sql from "./database.js";
import bcrypt from "bcrypt";

const routes = express.Router();

// BUSCAR TODOS OS USUÁRIOS
routes.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await sql`SELECT * FROM usuario`;
        return res.status(200).json(usuarios);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao buscar usuários', error });
    }
});

// LOGIN COM COMPARAÇÃO DE SENHA (HASH)
routes.post('/Login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const resultado = await sql`SELECT * FROM usuario WHERE email = ${email}`;
        
        if (resultado.length === 0) {
            return res.status(401).json({ message: 'Email não encontrado' });
        }

        const usuario = resultado[0]; 
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        console.log(senhaValida)

        if (!senhaValida) {
            return res.status(401).json({ message: 'Senha incorreta' });
        }

        return res.status(200).json(usuario);
    } catch (error) {
        
        console.error(error);
        return res.status(500).json({ message: 'Erro ao realizar login', error });
    }
});

// CADASTRAR USUÁRIO COM SENHA CRIPTOGRAFADA
routes.post('/Cadastrar', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        await sql`
            INSERT INTO usuario (email, senha, funcao, status)
            VALUES (${email}, ${senhaCriptografada}, 'padrao', 1)
        `;

        return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao cadastrar usuário', error });
    }
});

// BUSCAR TODAS AS QUESTÕES
routes.get('/questao', async (req, res) => {
    try {
        const questoes = await sql`SELECT * FROM perguntas ORDER BY RANDOM()`;
        return res.status(200).json(questoes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao buscar questões', error });
    }
});
routes.get('/questao1', async (req, res) => {
    try {
        const questoes = await sql`SELECT * FROM perguntas`;
        return res.status(200).json(questoes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao buscar questões', error });
    }
});

// CADASTRAR QUESTÃO
routes.post('/questao/cadastrar', async (req, res) => {
    try {
        const { questao, questao1, questao2, questao3, questao4, gabarito, nivel } = req.body;
        const insert = await sql `
            INSERT INTO perguntas (questao, questao1, questao2, questao3, questao4, gabarito, nivel)
            VALUES (${questao}, ${questao1}, ${questao2}, ${questao3}, ${questao4}, ${gabarito}, ${nivel})
        `;

        return res.status(201).json({ message: 'Questão cadastrada com sucesso!', questao: insert[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao cadastrar questão', error });
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
routes.delete('/deletequestao/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`tentando deletar ${id}`)

    try {
        const result = await sql`DELETE FROM perguntas WHERE id = ${id}`;

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
