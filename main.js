const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { Client } = require('pg');

let mainWindow;

// Configuração do banco de dados
const dbConfig = {
  host: '35.199.101.38',
  port: 5432,
  database: 'liberdade-medica',
  user: 'vinilean',
  password: '-Infra55LM-',
  ssl: { rejectUnauthorized: false }
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    title: 'Editor de Artigos - Blog Liberdade Médica'
  });

  mainWindow.loadFile('index.html');

  // Abrir DevTools em desenvolvimento
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handlers

// Testar conexão com banco
ipcMain.handle('test-connection', async () => {
  try {
    const client = new Client(dbConfig);
    await client.connect();
    await client.end();
    return { success: true, message: 'Conectado ao banco de dados' };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

// Publicar artigo
ipcMain.handle('publish-article', async (event, articleData) => {
  try {
    const client = new Client(dbConfig);
    await client.connect();

    const { titulo, categoria, autor, content } = articleData;
    
    // Gerar slug
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

    return {
      success: true,
      id: result.rows[0].id,
      slug: finalSlug,
      message: 'Artigo publicado com sucesso!'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
});

// Salvar rascunho
ipcMain.handle('save-draft', async (event, data) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      title: 'Salvar Rascunho',
      defaultPath: `${data.titulo || 'rascunho'}.json`,
      filters: [
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (!result.canceled) {
      const draftData = {
        ...data,
        savedAt: new Date().toISOString()
      };
      
      fs.writeFileSync(result.filePath, JSON.stringify(draftData, null, 2), 'utf8');
      return { success: true, path: result.filePath };
    }
    
    return { success: false, message: 'Salvamento cancelado' };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

// Carregar rascunho
ipcMain.handle('load-draft', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Carregar Rascunho',
      filters: [
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ],
      properties: ['openFile']
    });

    if (!result.canceled && result.filePaths.length > 0) {
      const data = fs.readFileSync(result.filePaths[0], 'utf8');
      return { success: true, data: JSON.parse(data) };
    }
    
    return { success: false, message: 'Carregamento cancelado' };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

// Exportar HTML
ipcMain.handle('export-html', async (event, htmlContent, titulo) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      title: 'Exportar HTML',
      defaultPath: `${titulo || 'artigo'}.html`,
      filters: [
        { name: 'HTML Files', extensions: ['html'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (!result.canceled) {
      fs.writeFileSync(result.filePath, htmlContent, 'utf8');
      return { success: true, path: result.filePath };
    }
    
    return { success: false, message: 'Exportação cancelada' };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

// Funções auxiliares
function generateSlug(titulo) {
  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '_') // Substitui espaços por underscore
    .replace(/^_+|_+$/g, ''); // Remove underscores do início e fim
}

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
