@echo off
echo ========================================
echo  BUILD CORRIGIDO - DEPENDÊNCIAS PG
echo  Editor de Artigos - Blog Liberdade Médica
echo ========================================
echo.
echo Corrigindo problema: Cannot find module 'pg-types'
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

echo Limpando instalação anterior...
rmdir /s /q node_modules 2>nul
rmdir /s /q dist 2>nul
rmdir /s /q %APPDATA%\electron-builder 2>nul
rmdir /s /q %LOCALAPPDATA%\electron-builder 2>nul

echo.
echo Instalando dependências corretas do PostgreSQL...
npm install pg@8.11.3
npm install pg-types@4.0.1
npm install pg-pool@3.6.1
npm install pg-protocol@1.6.0
npm install pg-connection-string@2.6.2
npm install pg-int8@1.0.1
npm install pgpass@1.0.5
npm install postgres-array@3.0.2
npm install postgres-bytea@3.0.0
npm install postgres-date@2.0.1
npm install postgres-interval@3.0.0

echo.
echo Instalando dependências de desenvolvimento...
npm install electron@27.0.0 --save-dev
npm install electron-builder@24.6.4 --save-dev

echo.
echo Gerando executável com dependências corretas...
npm run build-simple

echo.
if exist "dist\win-unpacked\Editor de Artigos.exe" (
    echo ========================================
    echo  EXECUTÁVEL GERADO COM DEPENDÊNCIAS!
    echo ========================================
    echo.
    echo Arquivo: dist\win-unpacked\Editor de Artigos.exe
    echo.
    echo TESTE AGORA:
    echo 1. Vá para: dist\win-unpacked\
    echo 2. Execute: Editor de Artigos.exe
    echo 3. Deve funcionar sem erro de pg-types
    echo.
    echo PARA DISTRIBUIR:
    echo - Envie a pasta completa: dist\win-unpacked\
    echo - Redator executa: Editor de Artigos.exe
    echo.
) else (
    echo ========================================
    echo  ERRO NO BUILD
    echo ========================================
    echo.
    echo Tentando método alternativo PKG...
    echo Este método é mais confiável:
    echo.
    call build_alternativo.bat
)

pause
