# projeto_final

<div align="center">

# API RESTful — Gestão de Estoque de Artigos Esportivos

**Projeto Final Integrador | Curso de Desenvolvedor Back-End 1 (PBE1)**  
**Escola SENAI "Jairo Cândido"** — Parceria **Binário Tech** | Mauá - SP, 2026

![Node.js](https://img.shields.io/badge/Node.js-v26.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![Debian Linux](https://img.shields.io/badge/Linux-Debian-A81D33?style=for-the-badge&logo=debian&logoColor=white)
![Bash Script](https://img.shields.io/badge/Shell_Script-Bash-4EAA25?style=for-the-badge&logo=gnu-bash&logoColor=white)
![Status](https://img.shields.io/badge/Status-Concluído-brightgreen?style=for-the-badge)

</div>

---

### Ficha Técnica do Projeto

| Campo | Detalhamento |
| :--- | :--- |
| **Título do Trabalho** | Desenvolvimento e Automação de API RESTful para Gestão de Estoque de Artigos Esportivos |
| **Instituição de Ensino** | Escola SENAI Jairo Cândido (Parceria Binário Tech) |
| **Unidade Curricular** | Programação Back-End 1 (PBE1) |
| **Autores (Desenvolvedores)** | **Nicollas Ribeiro** & **Murilo Brando** |
| **Docente Orientador** | Prof. Irineu |
| **Local e Data** | Mauá - SP, 2026 |

---

## SUMÁRIO

1. [Introdução](#1-introdução)
2. [Fundamentação Teórica e Tecnologias Utilizadas](#2-fundamentação-teórica-e-tecnologias-utilizadas)
3. [Arquitetura do Sistema e Fluxo de Dados](#3-arquitetura-do-sistema-e-fluxo-de-dados)
4. [Especificação do Sistema e Modelagem de Dados](#4-especificação-do-sistema-e-modelagem-de-dados)
5. [Mapeamento de Endpoints e Exemplos de Payload](#5-mapeamento-de-endpoints-e-exemplos-de-payload)
6. [Automação de Testes e Gerenciamento Linux](#6-automação-de-testes-e-gerenciamento-linux)
7. [Referências (Padrão ABNT)](#7-referências-padrão-abnt)

---

## 1. INTRODUÇÃO

### 1.1 Contextualização e Problematização
A gestão eficiente de inventário e controle de estoque de artigos esportivos exige sistemas capazes de registrar, atualizar e consultar produtos em tempo real com baixo tempo de resposta. A ausência de padronização nas rotas de comunicação e na validação dos dados de entrada pode resultar em inconsistências de estoque, prejuízos financeiros e falhas operacionais.

Este projeto aborda o desenvolvimento de um backend estruturado para o gerenciamento de dois módulos interdependentes: **Categorias** (famílias de artigos) e **Produtos Esportivos** (itens individuais com preço, marca, estoque e status).

### 1.2 Objetivos

#### 1.2.1 Objetivo Geral
Projetar, implementar e validar uma API RESTful completa acoplada a um script automatizado de testes em linguagem Shell Script (Bash), rodando sobre o sistema operacional Linux Debian e versionado via Git/GitHub por Nicollas Ribeiro e Murilo Brando no SENAI Jairo Cândido sob orientação do Prof. Irineu.

#### 1.2.2 Objetivos Específicos
* Construir um servidor em Node.js com Express para gerenciar as entidades Categorias e Produtos em memória.
* Garantir a aderência estrita aos verbos HTTP (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) e aos códigos de status HTTP apropriados (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`).
* Implementar suporte a filtragem via *Query Parameters* na busca de artigos esportivos.
* Desenvolver o script `testes.sh` para execução encadeada das rotas com redirecionamento de logs de auditoria (`resultado_execucao.log`).
* Demonstrar o gerenciamento do ciclo de vida de processos no sistema operacional Linux (`ps aux`, `kill -9`).

---

## 2. FUNDAMENTAÇÃO TEÓRICA E TECNOLOGIAS UTILIZADAS

* **Arquitetura REST e Protocolo HTTP:** Aplicação de restrições arquiteturais RESTful utilizando o protocolo HTTP/1.1 e comunicação estruturada via dados JSON.
* **Node.js e Express:** Execução JavaScript no lado do servidor e roteamento minimalista com suporte a middlewares como `express.json()`.
* **Shell Scripting e Linux Debian:** Automação de chamadas HTTP via CLI com utilitários `curl` e formatação JSON via `jq`.

---

## 3. ARQUITETURA DO SISTEMA E FLUXO DE DADOS

### 3.1 Diagrama de Comunicação Cliente-Servidor
O diagrama abaixo ilustra o fluxo de uma requisição desde a execução do script de testes no terminal Debian até a resposta processada em memória pelo servidor Express:

```text
[ Cliente HTTP / testes.sh ] 
         │ (Requisições HTTP: curl + JSON)
         ▼
[ Servidor Node.js + Express (Porta 3000) ]
         │ (Middlewares: express.json())
         ▼
[ Controladores de Rotas (/api/categorias e /api/produtos) ]
         │ (Validação de Payload e Query Params)
         ▼
[ Armazenamento Em Memória (Arrays de Objetos) ]
```

---

## 4. ESPECIFICAÇÃO DO SISTEMA E MODELAGEM DE DADOS

### 4.1 Modelagem das Entidades

#### Entidade 1: Categoria
Representa o agrupamento lógico dos itens esportivos (ex: Calçados, Vestuário, Equipamentos):
* `id` (Número inteiro, Chave Primária)
* `nome` (Texto, Obrigatório)
* `descricao` (Texto, Obrigatório)

#### Entidade 2: Produto Esportivo
Representa a unidade individual armazenada e controlada no estoque:
* `id` (Número inteiro, Chave Primária)
* `nome` (Texto, Obrigatório)
* `categoriaId` (Número inteiro, Chave Estrangeira referente a Categoria)
* `preco` (Ponto flutuante, Obrigatório)
* `quantidadeEstoque` (Número inteiro, Obrigatório)
* `marca` (Texto, Obrigatório)
* `status` (Texto: `"DISPONIVEL"` ou `"ESGOTADO"`)

---

## 5. MAPEAMENTO DE ENDPOINTS E EXEMPLOS DE PAYLOAD

| Entidade | Método HTTP | Endpoint | Parâmetros | Status HTTP | Descrição |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Categoria** | `GET` | `/api/categorias` | Nenhum | `200 OK` | Lista todas as categorias |
| **Categoria** | `GET` | `/api/categorias/:id` | `id` (Path) | `200` / `404` | Busca categoria por ID |
| **Categoria** | `POST` | `/api/categorias` | Body JSON | `201` / `400` | Cadastra nova categoria |
| **Categoria** | `PUT` | `/api/categorias/:id` | `id` + Body JSON | `200` / `400` / `404` | Atualização completa |
| **Categoria** | `PATCH` | `/api/categorias/:id` | `id` + Body JSON | `200` / `404` | Atualização parcial |
| **Categoria** | `DELETE` | `/api/categorias/:id` | `id` (Path) | `200` / `404` | Exclui categoria |
| **Produto** | `GET` | `/api/produtos` | Query (`marca`, `status`) | `200 OK` | Lista produtos com filtros |
| **Produto** | `GET` | `/api/produtos/:id` | `id` (Path) | `200` / `404` | Busca produto por ID |
| **Produto** | `POST` | `/api/produtos` | Body JSON | `201` / `400` | Cadastra artigo esportivo |
| **Produto** | `PUT` | `/api/produtos/:id` | `id` + Body JSON | `200` / `400` / `404` | Atualização completa do artigo |
| **Produto** | `PATCH` | `/api/produtos/:id` | `id` + Body JSON | `200` / `404` | Atualização parcial do artigo |
| **Produto** | `DELETE` | `/api/produtos/:id` | `id` (Path) | `200` / `404` | Remove produto do estoque |

---

### 5.1 Exemplos de Payloads (Requisição e Resposta)

#### 5.1.1 Cadastro de Novo Produto (`POST /api/produtos`)
Exemplo de envio de um objeto JSON válido no corpo da requisição para registrar um item no estoque:

```json
{
  "nome": "Luva de Boxe",
  "categoriaId": 3,
  "preco": 289.90,
  "quantidadeEstoque": 10,
  "marca": "Venum"
}
```

#### 5.1.2 Resposta de Sucesso na Criação (`201 Created`)
Retorno padrão da API confirmando a gravação em memória com o ID gerado automaticamente e o status calculado:

```json
{
  "id": 3,
  "nome": "Luva de Boxe",
  "categoriaId": 3,
  "preco": 289.90,
  "quantidadeEstoque": 10,
  "marca": "Venum",
  "status": "DISPONIVEL"
}
```

#### 5.1.3 Validação de Payload Incompleto (`400 Bad Request`)
Caso o cliente envie uma requisição faltando campos obrigatórios (como `preco` ou `marca`), a API bloqueia o cadastro com o código `400`:

* **Corpo enviado (inválido):**
```json
{
  "nome": "Chuteira"
}
```

* **Resposta de erro retornada pelo servidor:**
```json
{
  "mensagem": "Dados insuficientes para criação do produto."
}
```

#### 5.1.4 Consulta de Registro Inexistente (`404 Not Found`)
Quando uma busca, atualização ou exclusão (`GET /api/produtos/999`) aponta para um ID que não existe na base, o servidor retorna o status `404`:

```json
{
  "mensagem": "Produto não encontrado"
}
```

---

## 6. AUTOMAÇÃO DE TESTES E GERENCIAMENTO LINUX

### 6.1 Comando de Auditoria Automatizada (`testes.sh`)
Trecho do script Shell responsável por disparar requisições via `curl`, formatar o JSON de saída com `jq` e gravar o histórico no arquivo `resultado_execucao.log`:

```bash
curl -s -X POST "http://localhost:3000/api/produtos" \
  -H "Content-Type: application/json" \
  -d '{"nome": "Luva de Boxe", "categoriaId": 3, "preco": 289.90, "quantidadeEstoque": 10, "marca": "Venum"}' \
  | jq | tee -a resultado_execucao.log
```

---

### 6.2 Passo a Passo para Instalação e Execução

#### 1. Instalação das Dependências do Projeto
Baixa o framework Express e os módulos listados no `package.json`:

```bash
npm install
```

#### 2. Inicialização do Servidor Back-End
Coloca a API em execução na porta `3000` (`http://localhost:3000`):

```bash
npm start
```

#### 3. Permissão e Execução dos Testes Automatizados
Concede permissão de execução ao script Bash e roda toda a bateria de testes de rotas:

```bash
chmod +x testes.sh
./testes.sh
```

---

### 6.3 Gerenciamento de Processos no Linux Debian

#### 1. Executar o Servidor em Segundo Plano (Background)
Libera o terminal para outros comandos enquanto a API continua rodando:

```bash
node server.js &
```

#### 2. Localizar o Identificador do Processo (PID)
Filtra os processos ativos do sistema operacional para descobrir o número PID do servidor Node.js:

```bash
ps aux | grep node
```

#### 3. Encerrar o Processo Controladamente
Finaliza a execução do servidor utilizando o sinal `kill -9` seguido do número do PID encontrado:

```bash
kill -9 <PID>
```

---

## 7. REFERÊNCIAS (Padrão ABNT)

* ASSOCIAÇÃO BRASILEIRA DE NORMAS TÉCNICAS. **NBR 14724**: Informação e documentação - Trabalhos acadêmicos - Apresentação. Rio de Janeiro: ABNT, 2011.
* ASSOCIAÇÃO BRASILEIRA DE NORMAS TÉCNICAS. **NBR 6023**: Informação e documentação - Referências - Elaboração. Rio de Janeiro: ABNT, 2018.
* EXPRESS. **Express - Framework web rápido, não flexível e minimalista para Node.js**. Disponível em: <https://expressjs.com/pt-br/>. Acesso em: 2026.
* FIELDING, Roy Thomas. **Architectural Styles and the Design of Network-based Software Architectures**. 2000. Tese (Doutorado em Ciência da Computação) - University of California, Irvine, 2000.
* NODE.JS. **Node.js v26.x Documentation**. Disponível em: <https://nodejs.org/docs/>. Acesso em: 2026.
