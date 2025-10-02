#!/usr/bin/env node

const express = require('express');
const path = require('path');
const { Client } = require('pg');
const open = require('open');

const app = express();
const PORT = 3000;

// Configuração do banco de dados
const dbConfig = {
  host: '35.199.101.38',
  port: 5432,
  database: 'liberdade-medica',
  user: 'vinilean',
  password: '-Infra55LM-',
  ssl: { rejectUnauthorized: false }
};

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

// Função para garantir slug único
async function ensureUniqueSlug(client, baseSlug) {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const result = await client.query('SELECT id FROM public.blog_artigos WHERE slug = $1', [slug]);
    if (result.rows.length === 0) {
      return slug;
    }
    slug = `${baseSlug}_${counter}`;
    counter++;
  }
}

// Rotas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Testar conexão
app.get('/api/test-connection', async (req, res) => {
  try {
    const client = new Client(dbConfig);
    await client.connect();
    await client.end();
    res.json({ success: true, message: 'Conectado ao banco de dados' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Publicar artigo
app.post('/api/articles', async (req, res) => {
  try {
    const { titulo, categoria, autor, content } = req.body;
    
    if (!titulo || !categoria || !autor || !content) {
      return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios' });
    }
    
    const client = new Client(dbConfig);
    await client.connect();
    
    const slug = generateSlug(titulo);
    const finalSlug = await ensureUniqueSlug(client, slug);
    
    const query = `
      INSERT INTO public.blog_artigos 
      (titulo, slug, categoria, autor, data_criacao, data_atualizacao, content, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
    `;
    
    const now = new Date();
    const values = [
      titulo,
      finalSlug,
      categoria,
      autor,
      now.toISOString().split('T')[0],
      now.toISOString().split('T')[0],
      content,
      'publicado',
      now,
      now
    ];

    const result = await client.query(query, values);
    await client.end();

    res.json({
      success: true,
      id: result.rows[0].id,
      slug: finalSlug,
      message: 'Artigo publicado com sucesso!'
    });
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
    const client = new Client(dbConfig);
    await client.connect();
    
    const result = await client.query(
      'SELECT id, titulo, categoria, autor, data_criacao, status FROM public.blog_artigos ORDER BY created_at DESC LIMIT 10'
    );
    
    await client.end();
    res.json({ success: true, articles: result.rows });
  } catch (error) {
    res.json({ success: false, message: error.message, articles: [] });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('========================================');
  console.log(' EDITOR DE ARTIGOS - BLOG LIBERDADE MÉDICA');
  console.log('========================================');
  console.log('');
  console.log(`Servidor iniciado na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
  console.log('');
  console.log('Para parar o servidor, pressione Ctrl+C');
  console.log('========================================');
  
  // Abrir navegador automaticamente
  setTimeout(() => {
    open(`http://localhost:${PORT}`);
  }, 1000);
});

// Tratamento de erros
process.on('uncaughtException', (error) => {
  console.error('Erro não capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promise rejeitada:', reason);
});
