const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

let db = {
    usuarios: [
        { id: 1, nome: "Usuário Teste", email: "teste@email.com" }
    ],
    cardapio: [
        { id: 1, nome: "Bolo de Chocolate", descricao: "Delicioso bolo recheado", preco: 15.00 },
        { id: 2, nome: "Coxinha de Frango", descricao: "Massa crocante e bem temperada", preco: 7.00 }
    ],
    pedidos: [
        { id: 1, usuario: "Usuário Teste", itens: "Bolo de Chocolate", total: 15.00, status: "Pendente" }
    ]
};

app.get('/api/usuarios', (req, res) => res.json(db.usuarios));
app.post('/api/usuarios', (req, res) => {
    const novo = { id: db.usuarios.length + 1, ...req.body };
    db.usuarios.push(novo);
    res.status(201).json(novo);
});

app.get('/api/cardapio', (req, res) => res.json(db.cardapio));
app.post('/api/cardapio', (req, res) => {
    const novo = { id: db.cardapio.length + 1, ...req.body };
    db.cardapio.push(novo);
    res.status(201).json(novo);
});

app.get('/api/pedidos', (req, res) => res.json(db.pedidos));
app.post('/api/pedidos', (req, res) => {
    const novo = { id: db.pedidos.length + 1, ...req.body };
    db.pedidos.push(novo);
    res.status(201).json(novo);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando liso na porta ${PORT}! Pode colar no front.`);
});