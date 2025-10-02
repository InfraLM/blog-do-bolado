#!/usr/bin/env node

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Arquivo para simular banco de dados
const DB_FILE = path.join(__dirname, 'artigos.json');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Função para gerar slug
function generateSlug(titulo) {
  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .replace(/^_+|_+$/g, '');
}

// Função para ler artigos do arquivo
function readArticles() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Erro ao ler artigos:', error);
    return [];
  }
}

// Função para salvar artigos no arquivo
function saveArticles(articles) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(articles, null, 2));
    return true;
  } catch (error) {
    console.error('Erro ao salvar artigos:', error);
    return false;
  }
}

// Rotas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Testar conexão (simulada)
app.get('/api/test-connection', async (req, res) => {
  res.json({ 
    success: true, 
    message: 'Modo local ativo - artigos salvos em arquivo JSON' 
  });
});

// Publicar artigo
app.post('/api/articles', async (req, res) => {
  try {
    const { titulo, categoria, autor, content } = req.body;
    
    if (!titulo || !categoria || !autor || !content) {
      return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios' });
    }
    
    const articles = readArticles();
    const slug = generateSlug(titulo);
    
    // Garantir slug único
    let finalSlug = slug;
    let counter = 1;
    while (articles.some(art => art.slug === finalSlug)) {
      finalSlug = `${slug}_${counter}`;
      counter++;
    }
    
    const newArticle = {
      id: Date.now(),
      titulo,
      slug: finalSlug,
      categoria,
      autor,
      data_criacao: new Date().toISOString().split('T')[0],
      data_atualizacao: new Date().toISOString().split('T')[0],
      content,
      status: 'publicado',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    articles.push(newArticle);
    
    if (saveArticles(articles)) {
      res.json({
        success: true,
        id: newArticle.id,
        slug: finalSlug,
        message: 'Artigo salvo localmente com sucesso!'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao salvar artigo'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Listar artigos
app.get('/api/articles', async (req, res) => {
  try {
    const articles = readArticles();
    const recentArticles = articles
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10)
      .map(art => ({
        id: art.id,
        titulo: art.titulo,
        categoria: art.categoria,
        autor: art.autor,
        data_criacao: art.data_criacao,
        status: art.status
      }));
    
    res.json({ success: true, articles: recentArticles });
  } catch (error) {
    res.json({ success: false, message: error.message, articles: [] });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('========================================');
  console.log(' EDITOR DE ARTIGOS - MODO LOCAL');
  console.log(' Blog Liberdade Médica');
  console.log('========================================');
  console.log('');
  console.log(`Servidor iniciado na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
  console.log('');
  console.log('MODO LOCAL ATIVO:');
  console.log('- Artigos salvos em: artigos.json');
  console.log('- Para conectar ao PostgreSQL, use app-simple.js');
  console.log('');
  console.log('Para parar o servidor, pressione Ctrl+C');
  console.log('========================================');
  
  // Tentar abrir navegador
  try {
    const open = require('open');
    setTimeout(() => {
      open(`http://localhost:${PORT}`);
    }, 1000);
  } catch (error) {
    console.log('Abra manualmente: http://localhost:3000');
  }
});

// Tratamento de erros
process.on('uncaughtException', (error) => {
  console.error('Erro não capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promise rejeitada:', reason);
});
