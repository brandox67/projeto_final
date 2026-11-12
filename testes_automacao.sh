#!/bin/bash

BASE_URL="http://localhost:3027/api"
LOG_FILE="resultado_execucao.log"

# Redireciona toda a saída para o terminal e para o arquivo de log simultaneamente
exec > >(tee "$LOG_FILE") 2>&1

requisicao() {
  local metodo=$1
  local endpoint=$2
  local dados=$3

  echo "------------------------------------------------------------------"
  echo "[$metodo] $BASE_URL$endpoint"
  if [ -n "$dados" ]; then
    echo "Payload: $dados"
    resposta=$(curl -s -w "\n%{http_code}" -X "$metodo" "$BASE_URL$endpoint" \
      -H "Content-Type: application/json" \
      -d "$dados")
  else
    resposta=$(curl -s -w "\n%{http_code}" -X "$metodo" "$BASE_URL$endpoint")
  fi

  http_code=$(echo "$resposta" | tail -n1)
  body=$(echo "$resposta" | sed '$d')

  echo "Status HTTP: $http_code"
  echo "Resposta:"
  echo "$body" | jq . 2>/dev/null || echo "$body"
}

echo "=================================================================="
echo " AUDITORIA AUTOMATIZADA DE API RESTFUL - ESTOQUE ESPORTIVO"
echo " Data/Hora: $(date '+%d/%m/%Y %H:%M:%S')"
echo "=================================================================="

# 1. CATEGORIAS (CRUD)
echo -e "\n>>> 1. TESTES DE CATEGORIAS"
requisicao "GET" "/categorias"
requisicao "POST" "/categorias" '{"nome":"Suplementos","descricao":"Proteínas, creatinas e isotônicos esportivos"}'
requisicao "GET" "/categorias/5"
requisicao "PATCH" "/categorias/5" '{"descricao":"Suplementos nutricionais e energéticos"}'
requisicao "DELETE" "/categorias/5"

# 2. PRODUTOS - LISTAGEM E FILTROS
echo -e "\n>>> 2. LISTAGEM E FILTROS DE PRODUTOS"
requisicao "GET" "/produtos"
requisicao "GET" "/produtos?categoriaId=1"
requisicao "GET" "/produtos?status=ESGOTADO"
requisicao "GET" "/produtos?nome=tenis"
requisicao "GET" "/produtos?precoMax=250"

# 3. PRODUTOS - CADASTRO E ATUALIZAÇÃO (ID 13)
echo -e "\n>>> 3. CRUD COMPLETO DE PRODUTO (ID 13)"
requisicao "POST" "/produtos" '{"nome":"Tênis Asics Gel-Nimbus 26","categoriaId":1,"preco":999.90,"quantidadeEstoque":7,"marca":"Asics"}'
requisicao "GET" "/produtos/13"
requisicao "PUT" "/produtos/13" '{"nome":"Tênis Asics Gel-Nimbus 26 Edição Especial","categoriaId":1,"preco":1049.90,"quantidadeEstoque":5,"marca":"Asics","status":"DISPONIVEL"}'
requisicao "PATCH" "/produtos/13" '{"quantidadeEstoque":0}'

# 4. VALIDAÇÕES E TRATAMENTO DE ERROS (400 e 404)
echo -e "\n>>> 4. TESTES DE VALIDAÇÃO E ERROS"
requisicao "POST" "/produtos" '{"nome":"Produto Inválido","categoriaId":1,"preco":-50,"quantidadeEstoque":10,"marca":"Teste"}'
requisicao "GET" "/produtos/999"

# 5. REMOÇÃO DO ITEM DE TESTE
echo -e "\n>>> 5. LIMPEZA DO ITEM DE TESTE"
requisicao "DELETE" "/produtos/13"

echo -e "\n=================================================================="
echo " FIM DA EXECUÇÃO - LOG SALVO EM: $LOG_FILE"
echo "=================================================================="
