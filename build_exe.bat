@echo off
echo ========================================
echo  GERADOR DE EXECUTÁVEL (.EXE)
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

echo Instalando dependências...
npm install

echo.
echo Gerando executável para Windows...
npm run build-win

echo.
echo ========================================
echo  EXECUTÁVEL GERADO COM SUCESSO!
echo ========================================
echo.
echo O arquivo .exe está em: dist\
echo.
echo Arquivos gerados:
dir dist\ /b
echo.
echo Você pode enviar o arquivo .exe para o redator!
echo.
pause
