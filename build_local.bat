@echo off
echo ========================================
echo  BUILD VERSÃO LOCAL - SEM POSTGRESQL
echo  Editor de Artigos - Blog Liberdade Médica
echo ========================================
echo.
echo Esta versão salva artigos em arquivo JSON local
echo e não precisa de conexão com PostgreSQL.
echo.

echo Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Node.js não está instalado!
    echo Baixe e instale em: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js encontrado!
echo.

echo Copiando configuração local...
copy package-sem-pg.json package.json

echo.
echo Instalando dependências mínimas...
npm install express@4.18.2
npm install pkg@5.8.1

echo.
echo Testando aplicação local...
echo Iniciando servidor de teste por 5 segundos...
timeout /t 2 >nul
start /min node app-sem-pg.js
timeout /t 3 >nul
taskkill /f /im node.exe >nul 2>&1

echo.
echo Gerando executável local...
npx pkg app-sem-pg.js --target node18-win-x64 --output EditorArtigos-Local.exe

echo.
if exist "EditorArtigos-Local.exe" (
    echo ========================================
    echo  EXECUTÁVEL LOCAL GERADO COM SUCESSO!
    echo ========================================
    echo.
    echo Arquivo: EditorArtigos-Local.exe
    echo Tamanho: ~30MB (muito menor!)
    echo Tipo: Servidor local + arquivo JSON
    echo.
    echo COMO FUNCIONA:
    echo 1. Executável inicia servidor local
    echo 2. Abre navegador automaticamente
    echo 3. Artigos salvos em: artigos.json
    echo 4. Interface idêntica à versão completa
    echo.
    echo VANTAGENS:
    echo ✅ Não precisa PostgreSQL
    echo ✅ Funciona offline
    echo ✅ Arquivo muito menor
    echo ✅ Sem problemas de dependências
    echo ✅ Artigos salvos localmente
    echo.
    echo PARA USAR:
    echo 1. Envie EditorArtigos-Local.exe para o redator
    echo 2. Redator executa (duplo clique)
    echo 3. Navegador abre automaticamente
    echo 4. Cria artigos normalmente
    echo 5. Artigos ficam em artigos.json
    echo.
    echo MIGRAÇÃO PARA POSTGRESQL:
    echo - Os artigos em JSON podem ser importados depois
    echo - Estrutura compatível com o banco
    echo.
) else (
    echo ========================================
    echo  ERRO NA GERAÇÃO
    echo ========================================
    echo.
    echo Tentando instalar PKG globalmente...
    npm install -g pkg
    echo.
    echo Tentando novamente...
    pkg app-sem-pg.js --target node18-win-x64 --output EditorArtigos-Local.exe
    echo.
    if exist "EditorArtigos-Local.exe" (
        echo SUCESSO com instalação global!
    ) else (
        echo Erro persistente. Verifique:
        echo 1. Conexão com internet
        echo 2. Antivírus bloqueando
        echo 3. Espaço em disco
        echo.
        echo TESTE MANUAL:
        echo node app-sem-pg.js
        echo (Deve abrir http://localhost:3000)
    )
)

pause
