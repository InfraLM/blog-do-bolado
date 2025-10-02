@echo off

:: Verificar se está executando como administrador
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Executando como Administrador - OK!
) else (
    echo ========================================
    echo  REQUER PRIVILÉGIOS DE ADMINISTRADOR
    echo ========================================
    echo.
    echo Este script precisa ser executado como Administrador.
    echo.
    echo COMO EXECUTAR COMO ADMINISTRADOR:
    echo 1. Clique com botão direito no arquivo .bat
    echo 2. Selecione "Executar como administrador"
    echo.
    echo OU use o build_portable.bat que não precisa de admin!
    echo.
    pause
    exit /b 1
)

echo ========================================
echo  GERADOR DE EXECUTÁVEL COM INSTALADOR
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
echo Gerando executável com instalador...
echo (Executando como Administrador)
echo.

npm run build-win

echo.
echo ========================================
echo  EXECUTÁVEL GERADO COM SUCESSO!
echo ========================================
echo.
echo Verifique a pasta dist\ para os arquivos gerados.
echo.
pause
