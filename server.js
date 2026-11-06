const express = require('express');
const app = express();
const PORT = process.env.PORT || 3027;

app.use(express.json());

// ==========================================
// BANCO DE DADOS EM MEMÓRIA
// ==========================================
let categorias = [
  { id: 1, nome: "Calçados", descricao: "Tênis de corrida, chuteiras e sapatilhas esportivas" },
  { id: 2, nome: "Vestuário", descricao: "Camisas de times, bermudas, regatas e agasalhos" },
  { id: 3, nome: "Equipamentos", descricao: "Bolas, raquetes, luvas de boxe e equipamentos de proteção" }
];

let produtos = [
  {
    id: 1,
    nome: "Tênis Nike Air Zoom Pegasus 40",
    categoriaId: 1,
    preco: 599.90,
    quantidadeEstoque: 15,
    marca: "Nike",
    status: "DISPONIVEL"
  },
  {
    id: 2,
    nome: "Camisa Seleção Brasileira 2024",
    categoriaId: 2,
    preco: 349.90,
    quantidadeEstoque: 25,
    marca: "Nike",
    status: "DISPONIVEL"
  },
  {
    id: 3,
    nome: "Bola de Futebol Adidas Al Rihla",
    categoriaId: 3,
    preco: 199.90,
    quantidadeEstoque: 0,
    marca: "Adidas",
    status: "ESGOTADO"
  }
];

let proximoCategoriaId = 4;
let proximoProdutoId = 4;

// ==========================================
// ROTAS - ENTIDADE: CATEGORIAS
// ==========================================

// GET /api/categorias - Listar todas as categorias (200 OK)
app.get('/api/categorias', (req, res) => {
  return res.status(200).json(categorias);
});

// GET /api/categorias/:id - Buscar categoria por ID (200 OK / 404 Not Found)
app.get('/api/categorias/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const categoria = categorias.find(c => c.id === id);

  if (!categoria) {
    return res.status(404).json({ mensagem: "Categoria não encontrada." });
  }

  return res.status(200).json(categoria);
});

// POST /api/categorias - Criar nova categoria (201 Created / 400 Bad Request)
app.post('/api/categorias', (req, res) => {
  const { nome, descricao } = req.body;

  if (!nome || !descricao) {
    return res.status(400).json({ mensagem: "Erro de Validação: Os campos 'nome' e 'descricao' são obrigatórios." });
  }

  const novaCategoria = {
    id: proximoCategoriaId++,
    nome,
    descricao
  };

  categorias.push(novaCategoria);
  return res.status(201).json(novaCategoria);
});

// PUT /api/categorias/:id - Atualizar categoria completa (200 OK / 400 / 404)
app.put('/api/categorias/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = categorias.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ mensagem: "Categoria não encontrada." });
  }

  const { nome, descricao } = req.body;

  if (!nome || !descricao) {
    return res.status(400).json({ mensagem: "Erro de Validação: Os campos 'nome' e 'descricao' são obrigatórios." });
  }

  categorias[index] = { id, nome, descricao };
  return res.status(200).json(categorias[index]);
});

// PATCH /api/categorias/:id - Atualizar categoria parcialmente (200 OK / 404)
app.patch('/api/categorias/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const categoria = categorias.find(c => c.id === id);

  if (!categoria) {
    return res.status(404).json({ mensagem: "Categoria não encontrada." });
  }

  const { nome, descricao } = req.body;

  if (nome !== undefined) categoria.nome = nome;
  if (descricao !== undefined) categoria.descricao = descricao;

  return res.status(200).json(categoria);
});

// DELETE /api/categorias/:id - Excluir categoria (200 OK / 404 Not Found)
app.delete('/api/categorias/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = categorias.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ mensagem: "Categoria não encontrada." });
  }

  categorias.splice(index, 1);
  return res.status(200).json({ mensagem: `Categoria com ID ${id} removida com sucesso.` });
});


// ==========================================
// ROTAS - ENTIDADE: PRODUTOS (ARTIGOS ESPORTIVOS)
// ==========================================

// GET /api/produtos - Listar produtos com Query Params (200 OK)
app.get('/api/produtos', (req, res) => {
  let resultado = [...produtos];
  const { categoriaId, status, marca } = req.query;

  if (categoriaId) {
    resultado = resultado.filter(p => p.categoriaId === parseInt(categoriaId));
  }

  if (status) {
    resultado = resultado.filter(p => p.status.toUpperCase() === status.toUpperCase());
  }

  if (marca) {
    resultado = resultado.filter(p => p.marca.toLowerCase() === marca.toLowerCase());
  }

  return res.status(200).json(resultado);
});

// GET /api/produtos/:id - Buscar produto por ID (200 OK / 404 Not Found)
app.get('/api/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const produto = produtos.find(p => p.id === id);

  if (!produto) {
    return res.status(404).json({ mensagem: "Produto esportivo não encontrado." });
  }

  return res.status(200).json(produto);
});

// POST /api/produtos - Criar novo produto (201 Created / 400 Bad Request)
app.post('/api/produtos', (req, res) => {
  const { nome, categoriaId, preco, quantidadeEstoque, marca, status } = req.body;

  if (!nome || categoriaId === undefined || preco === undefined || quantidadeEstoque === undefined || !marca) {
    return res.status(400).json({
      mensagem: "Erro de Validação: Os campos 'nome', 'categoriaId', 'preco', 'quantidadeEstoque' e 'marca' são obrigatórios."
    });
  }

  const categoriaExiste = categorias.some(c => c.id === parseInt(categoriaId));
  if (!categoriaExiste) {
    return res.status(400).json({ mensagem: "Erro de Validação: A 'categoriaId' informada não existe no banco de dados." });
  }

  const novoProduto = {
    id: proximoProdutoId++,
    nome,
    categoriaId: parseInt(categoriaId),
    preco: parseFloat(preco),
    quantidadeEstoque: parseInt(quantidadeEstoque),
    marca,
    status: status || (parseInt(quantidadeEstoque) > 0 ? "DISPONIVEL" : "ESGOTADO")
  };

  produtos.push(novoProduto);
  return res.status(201).json(novoProduto);
});

// PUT /api/produtos/:id - Atualizar produto completo (200 OK / 400 / 404)
app.put('/api/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = produtos.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ mensagem: "Produto esportivo não encontrado." });
  }

  const { nome, categoriaId, preco, quantidadeEstoque, marca, status } = req.body;

  if (!nome || categoriaId === undefined || preco === undefined || quantidadeEstoque === undefined || !marca) {
    return res.status(400).json({
      mensagem: "Erro de Validação: Os campos 'nome', 'categoriaId', 'preco', 'quantidadeEstoque' e 'marca' são obrigatórios."
    });
  }

  produtos[index] = {
    id,
    nome,
    categoriaId: parseInt(categoriaId),
    preco: parseFloat(preco),
    quantidadeEstoque: parseInt(quantidadeEstoque),
    marca,
    status: status || (parseInt(quantidadeEstoque) > 0 ? "DISPONIVEL" : "ESGOTADO")
  };

  return res.status(200).json(produtos[index]);
});

// PATCH /api/produtos/:id - Atualizar produto parcialmente (200 OK / 404)
app.patch('/api/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const produto = produtos.find(p => p.id === id);

  if (!produto) {
    return res.status(404).json({ mensagem: "Produto esportivo não encontrado." });
  }

  const { nome, categoriaId, preco, quantidadeEstoque, marca, status } = req.body;

  if (nome !== undefined) produto.nome = nome;
  if (categoriaId !== undefined) produto.categoriaId = parseInt(categoriaId);
  if (preco !== undefined) produto.preco = parseFloat(preco);
  if (quantidadeEstoque !== undefined) {
    produto.quantidadeEstoque = parseInt(quantidadeEstoque);
    if (status === undefined) {
      produto.status = produto.quantidadeEstoque > 0 ? "DISPONIVEL" : "ESGOTADO";
    }
  }
  if (marca !== undefined) produto.marca = marca;
  if (status !== undefined) produto.status = status;

  return res.status(200).json(produto);
});

// DELETE /api/produtos/:id - Excluir produto (200 OK / 404 Not Found)
app.delete('/api/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = produtos.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ mensagem: "Produto esportivo não encontrado." });
  }

  produtos.splice(index, 1);
  return res.status(200).json({ mensagem: `Produto com ID ${id} removido do estoque com sucesso.` });
});

// ==========================================
// INICIALIZAÇÃO DO SERVIDOR
// ==========================================
app.listen(PORT, () => {
  console.log(`[SERVIDORES] API RESTful de Artigos Esportivos rodando em http://localhost:${PORT}`);
});
