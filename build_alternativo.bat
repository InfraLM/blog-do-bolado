@echo off
echo ========================================
echo  MÉTODO ALTERNATIVO - SEM ELECTRON
echo  Editor de Artigos - Blog Liberdade Médica
echo ========================================
echo.
echo Este método usa Node.js + Express ao invés do Electron
echo Gera um executável muito menor e mais compatível.
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

echo Instalando dependências alternativas...
copy package-simple.json package.json
npm install

echo.
echo Gerando executável com PKG...
echo (Método mais simples e compatível)
echo.

npx pkg app-simple.js --target node18-win-x64 --output EditorArtigos-Simple.exe

echo.
if exist "EditorArtigos-Simple.exe" (
    echo ========================================
    echo  EXECUTÁVEL ALTERNATIVO GERADO!
    echo ========================================
    echo.
    echo Arquivo: EditorArtigos-Simple.exe
    echo Tamanho: Muito menor que Electron
    echo Tipo: Servidor web local + navegador
    echo.
    echo COMO FUNCIONA:
    echo 1. Executável inicia servidor local
    echo 2. Abre navegador automaticamente
    echo 3. Interface igual à versão web
    echo 4. Conecta no mesmo banco PostgreSQL
    echo.
    echo COMO USAR:
    echo 1. Envie EditorArtigos-Simple.exe para o redator
    echo 2. Redator executa (duplo clique)
    echo 3. Navegador abre automaticamente
    echo 4. Funciona igual à versão completa!
    echo.
    echo VANTAGENS:
    echo ✅ Arquivo muito menor (~50MB vs ~150MB)
    echo ✅ Não precisa privilégios especiais
    echo ✅ Mais compatível com Windows
    echo ✅ Mesmo banco de dados
    echo ✅ Mesmas funcionalidades
    echo.
) else (
    echo ========================================
    echo  ERRO NO MÉTODO ALTERNATIVO
    echo ========================================
    echo.
    echo Tentando instalar PKG globalmente...
    npm install -g pkg
    echo.
    echo Tentando novamente...
    pkg app-simple.js --target node18-win-x64 --output EditorArtigos-Simple.exe
    echo.
    if exist "EditorArtigos-Simple.exe" (
        echo SUCESSO com instalação global!
    ) else (
        echo Erro persistente. Verifique:
        echo 1. Conexão com internet
        echo 2. Antivírus bloqueando
        echo 3. Espaço em disco
    )
)

pause
