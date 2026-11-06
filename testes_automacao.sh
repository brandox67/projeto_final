#!/bin/bash

# ==============================================================================
# SCRIPT DE AUTOMAÇÃO DE TESTES HTTP - ESTOQUE DE ARTIGOS ESPORTIVOS
# Disciplina: Back-End 1 (PBE1) - SENAI / Binário Tech
# ==============================================================================

LOG_FILE="resultado_execucao.log"
BASE_URL="http://localhost:3027/api"

# Função auxiliar para exibir no terminal e gravar no log de auditoria
log_exec() {
  echo -e "$1" | tee -a "$LOG_FILE"
}

# Inicialização do log de auditoria
echo "==================================================================" > "$LOG_FILE"
echo "  AUDITORIA DE EXECUÇÃO DE TESTES - API ESTOQUE ESPORTIVO" >> "$LOG_FILE"
echo "  Data e Hora de Execução: $(date '+%Y-%m-%d %H:%M:%S')" >> "$LOG_FILE"
echo "==================================================================" >> "$LOG_FILE"

log_exec "\n🚀 [INICIANDO BATERIA DE TESTES AUTOMATIZADOS]\n"

# ------------------------------------------------------------------------------
# 1. TESTES NA ENTIDADE: CATEGORIAS
# ------------------------------------------------------------------------------
log_exec "--------------------------------------------------";
log_exec " 1. TESTES DA ENTIDADE: CATEGORIAS";
log_exec "--------------------------------------------------";

log_exec "\n[POST 201] Criando Categoria: Suplementação"
curl -s -X POST "$BASE_URL/categorias" \
  -H "Content-Type: application/json" \
  -d '{"nome": "Suplementação", "descricao": "Proteínas, suplementos e pré-treinos"}' | jq . | tee -a "$LOG_FILE"

log_exec "\n[POST 400] Teste de Erro de Validação (Sem campo 'descricao')"
curl -s -X POST "$BASE_URL/categorias" \
  -H "Content-Type: application/json" \
  -d '{"nome": "Suplementação Invalida"}' | jq . | tee -a "$LOG_FILE"

log_exec "\n[GET 200] Listando todas as categorias"
curl -s -X GET "$BASE_URL/categorias" | jq . | tee -a "$LOG_FILE"

log_exec "\n[GET 200] Consultando Categoria por ID (ID 1)"
curl -s -X GET "$BASE_URL/categorias/1" | jq . | tee -a "$LOG_FILE"

log_exec "\n[GET 404] Consultando Categoria Inexistente (ID 999)"
curl -s -X GET "$BASE_URL/categorias/999" | jq . | tee -a "$LOG_FILE"

log_exec "\n[PUT 200] Atualização Completa da Categoria ID 4"
curl -s -X PUT "$BASE_URL/categorias/4" \
  -H "Content-Type: application/json" \
  -d '{"nome": "Suplementação & Nutrição", "descricao": "Proteínas, creatinas e vitaminas"}' | jq . | tee -a "$LOG_FILE"

log_exec "\n[PATCH 200] Atualização Parcial da Categoria ID 4"
curl -s -X PATCH "$BASE_URL/categorias/4" \
  -H "Content-Type: application/json" \
  -d '{"nome": "Nutrição Esportiva"}' | jq . | tee -a "$LOG_FILE"

log_exec "\n[DELETE 200] Excluindo Categoria ID 4"
curl -s -X DELETE "$BASE_URL/categorias/4" | jq . | tee -a "$LOG_FILE"

# ------------------------------------------------------------------------------
# 2. TESTES NA ENTIDADE: PRODUTOS (ARTIGOS ESPORTIVOS)
# ------------------------------------------------------------------------------
log_exec "\n--------------------------------------------------";
log_exec " 2. TESTES DA ENTIDADE: PRODUTOS";
log_exec "--------------------------------------------------";

log_exec "\n[POST 201] Criando Produto: Luva de Boxe Venum Challenger"
curl -s -X POST "$BASE_URL/produtos" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Luva de Boxe Venum Challenger 3.0",
    "categoriaId": 3,
    "preco": 289.90,
    "quantidadeEstoque": 10,
    "marca": "Venum",
    "status": "DISPONIVEL"
  }' | jq . | tee -a "$LOG_FILE"

log_exec "\n[POST 400] Teste de Erro de Validação de Produto (Campos ausentes)"
curl -s -X POST "$BASE_URL/produtos" \
  -H "Content-Type: application/json" \
  -d '{"nome": "Chuteira Sem Preço"}' | jq . | tee -a "$LOG_FILE"

log_exec "\n[GET 200] Listando todos os produtos esportivos"
curl -s -X GET "$BASE_URL/produtos" | jq . | tee -a "$LOG_FILE"

log_exec "\n[GET 200] Filtrando Produtos via Query Parameter (marca=Nike)"
curl -s -X GET "$BASE_URL/produtos?marca=Nike" | jq . | tee -a "$LOG_FILE"

log_exec "\n[GET 200] Filtrando Produtos via Query Parameter (status=ESGOTADO)"
curl -s -X GET "$BASE_URL/produtos?status=ESGOTADO" | jq . | tee -a "$LOG_FILE"

log_exec "\n[GET 200] Buscando Produto por ID (ID 1)"
curl -s -X GET "$BASE_URL/produtos/1" | jq . | tee -a "$LOG_FILE"

log_exec "\n[GET 404] Buscando Produto Inexistente (ID 888)"
curl -s -X GET "$BASE_URL/produtos/888" | jq . | tee -a "$LOG_FILE"

log_exec "\n[PUT 200] Atualizando produto ID 1 totalmente"
curl -s -X PUT "$BASE_URL/produtos/1" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Tênis Nike Air Zoom Pegasus 40 Edição Especial",
    "categoriaId": 1,
    "preco": 649.90,
    "quantidadeEstoque": 20,
    "marca": "Nike",
    "status": "DISPONIVEL"
  }' | jq . | tee -a "$LOG_FILE"

log_exec "\n[PATCH 200] Atualizando estoque do produto ID 1 via PATCH"
curl -s -X PATCH "$BASE_URL/produtos/1" \
  -H "Content-Type: application/json" \
  -d '{"quantidadeEstoque": 0}' | jq . | tee -a "$LOG_FILE"

log_exec "\n[DELETE 200] Excluindo produto ID 4"
curl -s -X DELETE "$BASE_URL/produtos/4" | jq . | tee -a "$LOG_FILE"

log_exec "\n✅ [TESTES FINALIZADOS] Log salvo em: $LOG_FILE\n"
