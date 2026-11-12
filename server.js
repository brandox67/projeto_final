const express = require('express');
const app = express();
const PORT = process.env.PORT || 3027;

app.use(express.json());

// ==========================================
// BANCO DE DADOS EM MEMÓRIA (4 CATEGORIAS / 12 PRODUTOS)
// ==========================================
let categorias = [
  { id: 1, nome: "Calçados", descricao: "Tênis de corrida, chuteiras e sapatilhas esportivas" },
  { id: 2, nome: "Vestuário", descricao: "Camisas de times, bermudas, regatas e agasalhos" },
  { id: 3, nome: "Equipamentos", descricao: "Bolas, raquetes, luvas de boxe e equipamentos de proteção" },
  { id: 4, nome: "Acessórios", descricao: "Mochilas, garrafas térmicas, meias e munhequeiras" }
];

let produtos = [
  // Categoria 1: Calçados
  { id: 1, nome: "Tênis Nike Air Zoom Pegasus 40", categoriaId: 1, preco: 599.90, quantidadeEstoque: 15, marca: "Nike", status: "DISPONIVEL" },
  { id: 2, nome: "Chuteira Adidas Predator Edge", categoriaId: 1, preco: 449.90, quantidadeEstoque: 8, marca: "Adidas", status: "DISPONIVEL" },
  { id: 3, nome: "Tênis Mizuno Wave Creation 24", categoriaId: 1, preco: 899.90, quantidadeEstoque: 4, marca: "Mizuno", status: "DISPONIVEL" },

  // Categoria 2: Vestuário
  { id: 4, nome: "Camisa Seleção Brasileira 2024", categoriaId: 2, preco: 349.90, quantidadeEstoque: 25, marca: "Nike", status: "DISPONIVEL" },
  { id: 5, nome: "Bermuda Esportiva Puma Dry", categoriaId: 2, preco: 129.90, quantidadeEstoque: 12, marca: "Puma", status: "DISPONIVEL" },
  { id: 6, nome: "Agasalho Corta-Vento Adidas", categoriaId: 2, preco: 279.90, quantidadeEstoque: 0, marca: "Adidas", status: "ESGOTADO" },

  // Categoria 3: Equipamentos
  { id: 7, nome: "Bola de Futebol Adidas Al Rihla", categoriaId: 3, preco: 199.90, quantidadeEstoque: 0, marca: "Adidas", status: "ESGOTADO" },
  { id: 8, nome: "Luva de Boxe Venum Challenger 3.0", categoriaId: 3, preco: 289.90, quantidadeEstoque: 10, marca: "Venum", status: "DISPONIVEL" },
  { id: 9, nome: "Raquete de Tênis Wilson Pro Staff", categoriaId: 3, preco: 1199.90, quantidadeEstoque: 3, marca: "Wilson", status: "DISPONIVEL" },

  // Categoria 4: Acessórios
  { id: 10, nome: "Mochila Esportiva Nike Brasilia", categoriaId: 4, preco: 219.90, quantidadeEstoque: 18, marca: "Nike", status: "DISPONIVEL" },
  { id: 11, nome: "Garrafa Térmica Under Armour 1L", categoriaId: 4, preco: 119.90, quantidadeEstoque: 30, marca: "Under Armour", status: "DISPONIVEL" },
  { id: 12, nome: "Caneleira Futebol Puma Ultra", categoriaId: 4, preco: 79.90, quantidadeEstoque: 14, marca: "Puma", status: "DISPONIVEL" }
];

let proximoCategoriaId = 5;
let proximoProdutoId = 13;

// ==========================================
// ROTAS: CATEGORIAS
// ==========================================
app.get('/api/categorias', (req, res) => {
  return res.status(200).json(categorias);
});

app.get('/api/categorias/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const categoria = categorias.find(c => c.id === id);
  if (!categoria) {
    return res.status(404).json({ mensagem: "Categoria não encontrada." });
  }
  return res.status(200).json(categoria);
});

app.post('/api/categorias', (req, res) => {
  const { nome, descricao } = req.body;
  if (!nome || !descricao) {
    return res.status(400).json({ mensagem: "Erro de Validação: Os campos 'nome' e 'descricao' são obrigatórios." });
  }
  const novaCategoria = { id: proximoCategoriaId++, nome, descricao };
  categorias.push(novaCategoria);
  return res.status(201).json(novaCategoria);
});

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
// ROTAS: PRODUTOS
// ==========================================
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

app.get('/api/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const produto = produtos.find(p => p.id === id);
  if (!produto) {
    return res.status(404).json({ mensagem: "Produto esportivo não encontrado." });
  }
  return res.status(200).json(produto);
});

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

app.delete('/api/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = produtos.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ mensagem: "Produto esportivo não encontrado." });
  }
  produtos.splice(index, 1);
  return res.status(200).json({ mensagem: `Produto com ID ${id} removido do estoque com sucesso.` });
});

app.listen(PORT, () => {
  console.log(`[SERVIDORES] API RESTful de Artigos Esportivos rodando na porta ${PORT}`);
});
