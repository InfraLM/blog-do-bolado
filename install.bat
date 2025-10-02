@echo off
echo ========================================
echo  INSTALADOR RÁPIDO
echo  Editor de Artigos - Blog Liberdade Médica
echo ========================================
echo.

echo Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Node.js não está instalado!
    echo.
    echo Por favor, baixe e instale Node.js em:
    echo https://nodejs.org/
    echo.
    echo Após instalar o Node.js, execute este script novamente.
    pause
    exit /b 1
)

echo Node.js encontrado!
echo.

echo Instalando dependências...
npm install

echo.
echo ========================================
echo  INSTALAÇÃO CONCLUÍDA!
echo ========================================
echo.
echo Para testar a aplicação:
echo npm start
echo.
echo Para gerar o executável:
echo build_exe.bat
echo.
pause
