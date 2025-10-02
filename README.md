# 🚀 Editor de Artigos Desktop - Blog Liberdade Médica

Aplicação desktop standalone para criação de artigos médicos que pode ser convertida em arquivo executável (.exe) para distribuição.

## 🎯 Características

- **Aplicação Desktop**: Interface nativa usando Electron
- **Sem Python**: Desenvolvido em JavaScript/Node.js
- **Executável (.exe)**: Pode ser convertido em arquivo executável
- **Conexão PostgreSQL**: Conecta diretamente ao banco de dados
- **Interface Moderna**: Design responsivo e intuitivo
- **Funcionalidades Completas**: Todos os recursos do editor web

## 🏗️ Tecnologias

- **Electron**: Framework para aplicações desktop
- **Node.js**: Runtime JavaScript
- **PostgreSQL**: Banco de dados (via biblioteca `pg`)
- **HTML/CSS/JS**: Interface do usuário

## 📋 Pré-requisitos

### Para Desenvolvimento/Build:
- **Node.js 16+** (https://nodejs.org/)
- **npm** (incluído com Node.js)

### Para o Usuário Final:
- **Nenhum!** O arquivo .exe é standalone

## 🚀 Como Gerar o Executável

### **Opção 1: Script Automático (Windows)**

1. **Execute o instalador**:
   ```cmd
   install.bat
   ```

2. **Gere o executável**:
   ```cmd
   build_exe.bat
   ```

3. **Encontre o arquivo**: `dist/Editor de Artigos - Blog Liberdade Médica Setup.exe`

### **Opção 2: Comandos Manuais**

1. **Instale dependências**:
   ```bash
   npm install
   ```

2. **Teste a aplicação** (opcional):
   ```bash
   npm start
   ```

3. **Gere o executável**:
   ```bash
   # Para Windows
   npm run build-win
   
   # Para Mac
   npm run build-mac
   
   # Para Linux
   npm run build-linux
   ```

## 📁 Estrutura do Projeto

```
blog-editor-desktop/
├── main.js              # Processo principal do Electron
├── index.html           # Interface HTML
├── styles.css           # Estilos da aplicação
├── renderer.js          # Lógica do frontend
├── package.json         # Configurações e dependências
├── assets/              # Ícones e recursos
├── build_exe.bat        # Script de build Windows
├── install.bat          # Script de instalação
└── dist/                # Executáveis gerados
```

## 🎨 Funcionalidades

### ✅ **Interface Principal**
- Formulário para título, categoria e autor
- 16 categorias médicas especializadas
- Sistema de blocos de conteúdo (H1-H6, P)
- Pré-visualização em tempo real

### ✅ **Gerenciamento de Blocos**
- Adicionar blocos de conteúdo
- Reordenar blocos (mover para cima/baixo)
- Remover blocos individuais
- Tipos: H1, H2, H3, H4, H5, H6, Parágrafo

### ✅ **Funcionalidades Avançadas**
- Salvar/carregar rascunhos (arquivos JSON)
- Exportar artigo como HTML
- Publicar diretamente no banco PostgreSQL
- Geração automática de slug
- Validação de dados

### ✅ **Conexão com Banco**
- Teste automático de conexão
- Inserção segura na tabela `blog_artigos`
- Verificação de slug único
- Tratamento de erros

## 🎯 Como Usar (Para o Redator)

### **1. Executar a Aplicação**
- Duplo clique no arquivo `.exe`
- A aplicação abre automaticamente

### **2. Criar Artigo**
1. **Preencher informações básicas**:
   - Título do artigo
   - Categoria (selecionar da lista)
   - Nome do autor

2. **Adicionar conteúdo em blocos**:
   - Digite o texto no campo "Conteúdo"
   - Escolha o tipo (H1-H6 ou Parágrafo)
   - Clique "Adicionar Bloco"
   - Repita para cada seção

3. **Organizar conteúdo**:
   - Use ↑↓ para reordenar blocos
   - Use 🗑️ para remover blocos
   - Veja a pré-visualização em tempo real

4. **Finalizar**:
   - **Salvar Rascunho**: Salva para continuar depois
   - **Exportar HTML**: Gera arquivo HTML
   - **Publicar no Blog**: Envia para o banco de dados

## 🔧 Configurações

### **Banco de Dados**
As configurações estão no arquivo `main.js`:
```javascript
const dbConfig = {
  host: '35.199.101.38',
  port: 5432,
  database: 'liberdade-medica',
  user: 'vinilean',
  password: '-Infra55LM-',
  ssl: { rejectUnauthorized: false }
};
```

### **Personalização**
- **Ícone**: Substitua arquivos em `assets/`
- **Título**: Modifique `package.json`
- **Estilos**: Edite `styles.css`

## 📦 Distribuição

### **Arquivo Gerado**
Após o build, você terá:
- **Windows**: `dist/Editor de Artigos - Blog Liberdade Médica Setup.exe`
- **Tamanho**: ~150MB (inclui Node.js e dependências)
- **Instalação**: Executável com instalador

### **Como Distribuir**
1. Envie o arquivo `.exe` para o redator
2. O redator executa o arquivo
3. A aplicação é instalada automaticamente
4. Ícone é criado na área de trabalho
5. Pronto para usar!

## 🛠️ Desenvolvimento

### **Executar em Modo Desenvolvimento**
```bash
npm start
```

### **Debug**
Descomente no `main.js`:
```javascript
mainWindow.webContents.openDevTools();
```

### **Modificar Interface**
- **HTML**: `index.html`
- **CSS**: `styles.css`
- **JavaScript**: `renderer.js`

## 🔒 Segurança

- **Escape de HTML**: Previne XSS
- **Validação de entrada**: Campos obrigatórios
- **Conexão SSL**: Banco de dados seguro
- **Prepared statements**: Previne SQL injection

## 📊 Categorias Médicas

1. Medicina Geral
2. Cardiologia
3. Dermatologia
4. Endocrinologia
5. Gastroenterologia
6. Ginecologia e Obstetrícia
7. Neurologia
8. Oftalmologia
9. Ortopedia
10. Otorrinolaringologia
11. Pediatria
12. Psiquiatria
13. Reumatologia
14. Urologia
15. Medicina de Emergência
16. Medicina Preventiva

## 🎊 Vantagens da Versão Desktop

### **Para o Redator**
- ✅ **Instalação única**: Não precisa instalar Python/dependências
- ✅ **Interface nativa**: Melhor experiência de usuário
- ✅ **Offline parcial**: Funciona sem internet (exceto publicação)
- ✅ **Rascunhos locais**: Salva arquivos no computador
- ✅ **Sem browser**: Aplicação independente

### **Para o Administrador**
- ✅ **Distribuição fácil**: Um arquivo .exe
- ✅ **Sem configuração**: Funciona "out of the box"
- ✅ **Atualizações**: Pode incluir auto-update
- ✅ **Branding**: Ícone e nome personalizados

## 🚀 Próximos Passos

1. **Execute** `install.bat`
2. **Teste** com `npm start`
3. **Gere o .exe** com `build_exe.bat`
4. **Distribua** o arquivo para o redator
5. **Pronto!** Sistema funcionando

---

**Sistema completo para criação de artigos médicos - Sem Python, sem complicações!**
