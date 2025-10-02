@echo off
echo ========================================
echo  GERADOR DE EXECUTÁVEL PORTÁTIL
echo  Editor de Artigos - Blog Liberdade Médica
echo ========================================
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

echo Limpando cache do electron-builder...
rmdir /s /q node_modules\.cache 2>nul
rmdir /s /q %APPDATA%\electron-builder\Cache 2>nul
rmdir /s /q %LOCALAPPDATA%\electron-builder\Cache 2>nul

echo.
echo Instalando dependências...
npm install

echo.
echo Gerando executável portátil (sem instalador)...
echo IMPORTANTE: Este método não requer privilégios de administrador!
echo.

npm run build-portable

echo.
if exist "dist\EditorArtigos-Portable.exe" (
    echo ========================================
    echo  EXECUTÁVEL GERADO COM SUCESSO!
    echo ========================================
    echo.
    echo Arquivo: dist\EditorArtigos-Portable.exe
    echo Tipo: Executável portátil (não precisa instalar)
    echo.
    echo COMO USAR:
    echo 1. Copie o arquivo EditorArtigos-Portable.exe
    echo 2. Envie para o redator
    echo 3. Redator executa diretamente (duplo clique)
    echo 4. Não precisa instalação!
    echo.
) else (
    echo ========================================
    echo  ERRO NA GERAÇÃO DO EXECUTÁVEL
    echo ========================================
    echo.
    echo Tente executar como Administrador:
    echo 1. Clique com botão direito no PowerShell/CMD
    echo 2. Selecione "Executar como administrador"
    echo 3. Execute este script novamente
    echo.
)

pause
