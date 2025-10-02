# 🔧 Solução de Problemas - Editor de Artigos Desktop

## ❌ **Problema Identificado**

### **Erro Principal:**
```
ERROR: Cannot create symbolic link : O cliente nao tem o privil�gio necess�rio.
```

### **Causa:**
O `electron-builder` está tentando criar links simbólicos no Windows, mas não tem privilégios de administrador.

## ✅ **SOLUÇÕES DISPONÍVEIS**

### **🚀 Solução 1: Executável Portátil (RECOMENDADO)**

**Vantagem**: Não precisa de privilégios de administrador

1. **Execute o script portátil**:
   ```cmd
   build_portable.bat
   ```

2. **Resultado**: `dist/EditorArtigos-Portable.exe`
   - Arquivo único
   - Não precisa instalação
   - Funciona diretamente
   - Tamanho menor

### **🔐 Solução 2: Com Privilégios de Administrador**

**Para gerar instalador completo:**

1. **Clique com botão direito** no PowerShell/CMD
2. **Selecione** "Executar como administrador"
3. **Execute**:
   ```cmd
   build_admin.bat
   ```

### **⚡ Solução 3: Comandos Manuais**

**Executável Portátil:**
```cmd
npm install
npm run build-portable
```

**Com Instalador (como admin):**
```cmd
npm install
npm run build-win
```

## 🎯 **Diferenças Entre os Tipos**

### **Executável Portátil** (`EditorArtigos-Portable.exe`)
- ✅ **Não precisa instalação**
- ✅ **Não precisa privilégios de admin**
- ✅ **Arquivo único**
- ✅ **Execução direta**
- ✅ **Mais fácil de distribuir**
- ❌ Não cria atalhos automáticos
- ❌ Não aparece em "Programas Instalados"

### **Instalador NSIS** (`Setup.exe`)
- ✅ **Instalação completa**
- ✅ **Atalhos automáticos**
- ✅ **Desinstalador incluído**
- ✅ **Integração com Windows**
- ❌ **Precisa privilégios de admin**
- ❌ **Mais complexo de gerar**

## 🔧 **Comandos de Limpeza**

### **Se o build falhar, limpe o cache:**

**Windows:**
```cmd
rmdir /s /q node_modules\.cache
rmdir /s /q %APPDATA%\electron-builder\Cache
rmdir /s /q %LOCALAPPDATA%\electron-builder\Cache
npm install
```

**Linux/Mac:**
```bash
rm -rf node_modules/.cache
rm -rf ~/.cache/electron-builder
npm install
```

## 📋 **Pré-requisitos**

### **Obrigatórios:**
- ✅ **Node.js 16+** (https://nodejs.org/)
- ✅ **npm** (incluído com Node.js)

### **Para Instalador (Opcional):**
- ✅ **Privilégios de Administrador**
- ✅ **Windows 10/11**

## 🚀 **Recomendação Final**

### **Para Distribuição Simples:**
**Use o executável portátil** - é mais simples e não requer privilégios especiais.

1. **Execute**: `build_portable.bat`
2. **Resultado**: `dist/EditorArtigos-Portable.exe`
3. **Envie** este arquivo para o redator
4. **Redator** executa diretamente (duplo clique)

### **Para Instalação Profissional:**
**Use o instalador** - mas precisa executar como administrador.

## 🔍 **Verificação de Sucesso**

### **Arquivos Esperados na pasta `dist/`:**

**Executável Portátil:**
```
dist/
└── EditorArtigos-Portable.exe
```

**Instalador Completo:**
```
dist/
├── Editor de Artigos Setup.exe
├── win-unpacked/
└── builder-effective-config.yaml
```

## 🎯 **Teste do Executável**

### **Como testar se funcionou:**

1. **Navegue** para a pasta `dist/`
2. **Execute** o arquivo `.exe` gerado
3. **Verifique** se a aplicação abre
4. **Teste** criação de um artigo
5. **Confirme** conexão com banco

### **Se não funcionar:**
- Verifique se o Node.js está instalado
- Execute como administrador
- Limpe o cache e tente novamente
- Use a versão portátil como alternativa

## 📞 **Suporte Adicional**

### **Logs de Debug:**
Os logs detalhados ficam em:
- Windows: `%APPDATA%/npm/_logs/`
- Electron Builder: `node_modules/.cache/electron-builder/`

### **Comandos de Diagnóstico:**
```cmd
node --version
npm --version
npm list electron
npm list electron-builder
```

---

## 🎊 **Resumo das Soluções**

| Método | Comando | Privilégios | Resultado |
|--------|---------|-------------|-----------|
| **Portátil** | `build_portable.bat` | ❌ Não precisa | `.exe` direto |
| **Instalador** | `build_admin.bat` | ✅ Admin necessário | Setup completo |
| **Manual** | `npm run build-portable` | ❌ Não precisa | `.exe` direto |

**Recomendação: Use o método portátil para simplicidade máxima!**
