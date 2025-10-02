@echo off
echo ========================================
echo  GERADOR DEFINITIVO - SEM ASSINATURA
echo  Editor de Artigos - Blog Liberdade Médica
echo ========================================
echo.
echo Este método desabilita completamente a assinatura de código
echo para evitar problemas de privilégios no Windows.
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

echo Limpando cache completo...
rmdir /s /q node_modules\.cache 2>nul
rmdir /s /q %APPDATA%\electron-builder 2>nul
rmdir /s /q %LOCALAPPDATA%\electron-builder 2>nul
rmdir /s /q electron-cache 2>nul
rmdir /s /q dist 2>nul

echo.
echo Reinstalando dependências...
rmdir /s /q node_modules 2>nul
npm install

echo.
echo Gerando executável SEM assinatura...
echo (Método mais compatível)
echo.

npm run build-simple

echo.
if exist "dist\win-unpacked\Editor de Artigos.exe" (
    echo ========================================
    echo  EXECUTÁVEL GERADO COM SUCESSO!
    echo ========================================
    echo.
    echo Arquivo: dist\win-unpacked\Editor de Artigos.exe
    echo Tipo: Executável direto (sem instalador)
    echo.
    echo COMO USAR:
    echo 1. Copie a pasta inteira: dist\win-unpacked\
    echo 2. Envie para o redator (toda a pasta)
    echo 3. Redator executa: Editor de Artigos.exe
    echo 4. Funciona sem instalação!
    echo.
    echo ALTERNATIVA: Tentando gerar portátil também...
    npm run build-portable
    echo.
    if exist "dist\EditorArtigos-Portable.exe" (
        echo SUCESSO! Também gerado: dist\EditorArtigos-Portable.exe
        echo (Arquivo único - ainda melhor!)
    )
) else (
    echo ========================================
    echo  ERRO PERSISTENTE
    echo ========================================
    echo.
    echo O problema pode ser:
    echo 1. Antivírus bloqueando
    echo 2. Política de segurança da empresa
    echo 3. Windows muito restritivo
    echo.
    echo SOLUÇÕES ALTERNATIVAS:
    echo 1. Execute como Administrador
    echo 2. Desabilite temporariamente o antivírus
    echo 3. Use a versão web do sistema
    echo.
)

pause
