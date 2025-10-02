const { ipcRenderer } = require('electron');

class EditorArtigos {
    constructor() {
        this.blocos = [];
        this.initializeElements();
        this.bindEvents();
        this.testConnection();
    }

    initializeElements() {
        // Elementos do formulário
        this.tituloInput = document.getElementById('titulo');
        this.categoriaSelect = document.getElementById('categoria');
        this.autorInput = document.getElementById('autor');
        this.conteudoTextarea = document.getElementById('conteudo');
        this.tipoSelect = document.getElementById('tipo');
        
        // Elementos de interface
        this.statusDiv = document.getElementById('status');
        this.blocksListDiv = document.getElementById('blocksList');
        this.previewDiv = document.getElementById('preview');
        
        // Botões
        this.addBlockBtn = document.getElementById('addBlock');
        this.saveDraftBtn = document.getElementById('saveDraft');
        this.loadDraftBtn = document.getElementById('loadDraft');
        this.exportHtmlBtn = document.getElementById('exportHtml');
        this.publishBtn = document.getElementById('publishArticle');
    }

    bindEvents() {
        this.addBlockBtn.addEventListener('click', () => this.addBlock());
        this.saveDraftBtn.addEventListener('click', () => this.saveDraft());
        this.loadDraftBtn.addEventListener('click', () => this.loadDraft());
        this.exportHtmlBtn.addEventListener('click', () => this.exportHtml());
        this.publishBtn.addEventListener('click', () => this.publishArticle());
        
        // Atualizar preview quando campos principais mudarem
        this.tituloInput.addEventListener('input', () => this.updatePreview());
        this.categoriaSelect.addEventListener('change', () => this.updatePreview());
        this.autorInput.addEventListener('input', () => this.updatePreview());
        
        // Enter no textarea adiciona bloco
        this.conteudoTextarea.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.addBlock();
            }
        });
    }

    async testConnection() {
        try {
            const result = await ipcRenderer.invoke('test-connection');
            if (result.success) {
                this.setStatus('✅ ' + result.message, 'success');
            } else {
                this.setStatus('⚠️ ' + result.message, 'warning');
            }
        } catch (error) {
            this.setStatus('❌ Erro de conexão', 'error');
        }
    }

    setStatus(message, type = '') {
        this.statusDiv.textContent = message;
        this.statusDiv.className = `status ${type}`;
    }

    addBlock() {
        const conteudo = this.conteudoTextarea.value.trim();
        if (!conteudo) {
            alert('Digite o conteúdo do bloco!');
            return;
        }

        const tipo = this.tipoSelect.value;
        const bloco = {
            id: Date.now(),
            tipo: tipo,
            conteudo: conteudo,
            html: `<${tipo}>${this.escapeHtml(conteudo)}</${tipo}>`
        };

        this.blocos.push(bloco);
        this.updateBlocksList();
        this.updatePreview();
        
        // Limpar campos
        this.conteudoTextarea.value = '';
        this.tipoSelect.value = 'p';
        this.conteudoTextarea.focus();
        
        this.setStatus(`Bloco adicionado! Total: ${this.blocos.length}`);
    }

    updateBlocksList() {
        if (this.blocos.length === 0) {
            this.blocksListDiv.innerHTML = '<p class="empty-state">Nenhum bloco adicionado ainda.</p>';
            return;
        }

        const blocksHtml = this.blocos.map((bloco, index) => `
            <div class="block-item">
                <div class="block-content">
                    <div class="block-type">${bloco.tipo.toUpperCase()}</div>
                    <div class="block-text">${this.truncateText(bloco.conteudo, 100)}</div>
                </div>
                <div class="block-actions">
                    <button class="btn btn-move" onclick="editor.moveBlock(${index}, -1)" ${index === 0 ? 'disabled' : ''}>↑</button>
                    <button class="btn btn-move" onclick="editor.moveBlock(${index}, 1)" ${index === this.blocos.length - 1 ? 'disabled' : ''}>↓</button>
                    <button class="btn btn-danger" onclick="editor.removeBlock(${index})">🗑️</button>
                </div>
            </div>
        `).join('');

        this.blocksListDiv.innerHTML = blocksHtml;
    }

    updatePreview() {
        const titulo = this.tituloInput.value;
        const categoria = this.categoriaSelect.value;
        const autor = this.autorInput.value;

        let previewHtml = '';

        if (titulo || categoria || autor) {
            previewHtml += '<div class="preview-header">';
            if (titulo) {
                previewHtml += `<h1 class="preview-title">${this.escapeHtml(titulo)}</h1>`;
            }
            if (categoria || autor) {
                previewHtml += '<div class="preview-meta">';
                if (categoria) previewHtml += `<strong>Categoria:</strong> ${this.escapeHtml(categoria)} `;
                if (autor) previewHtml += `<strong>Autor:</strong> ${this.escapeHtml(autor)} `;
                previewHtml += `<strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}`;
                previewHtml += '</div>';
            }
            previewHtml += '</div>';
        }

        if (this.blocos.length > 0) {
            previewHtml += this.blocos.map(bloco => bloco.html).join('\n');
        }

        if (!previewHtml) {
            previewHtml = '<p class="empty-preview">A pré-visualização aparecerá aqui conforme você adiciona blocos de conteúdo.</p>';
        }

        this.previewDiv.innerHTML = previewHtml;
    }

    moveBlock(index, direction) {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= this.blocos.length) return;

        [this.blocos[index], this.blocos[newIndex]] = [this.blocos[newIndex], this.blocos[index]];
        this.updateBlocksList();
        this.updatePreview();
        this.setStatus('Bloco reordenado');
    }

    removeBlock(index) {
        if (confirm('Deseja remover este bloco?')) {
            this.blocos.splice(index, 1);
            this.updateBlocksList();
            this.updatePreview();
            this.setStatus(`Bloco removido! Total: ${this.blocos.length}`);
        }
    }

    async saveDraft() {
        if (!this.tituloInput.value) {
            alert('Digite o título do artigo!');
            return;
        }

        const data = {
            titulo: this.tituloInput.value,
            categoria: this.categoriaSelect.value,
            autor: this.autorInput.value,
            blocos: this.blocos
        };

        try {
            const result = await ipcRenderer.invoke('save-draft', data);
            if (result.success) {
                this.setStatus('✅ Rascunho salvo com sucesso!', 'success');
                alert('Rascunho salvo com sucesso!');
            } else {
                this.setStatus('❌ Erro ao salvar rascunho', 'error');
                alert('Erro ao salvar: ' + result.message);
            }
        } catch (error) {
            this.setStatus('❌ Erro ao salvar rascunho', 'error');
            alert('Erro ao salvar: ' + error.message);
        }
    }

    async loadDraft() {
        try {
            const result = await ipcRenderer.invoke('load-draft');
            if (result.success) {
                const data = result.data;
                this.tituloInput.value = data.titulo || '';
                this.categoriaSelect.value = data.categoria || '';
                this.autorInput.value = data.autor || '';
                this.blocos = data.blocos || [];
                
                this.updateBlocksList();
                this.updatePreview();
                this.setStatus('✅ Rascunho carregado com sucesso!', 'success');
                alert('Rascunho carregado com sucesso!');
            } else {
                this.setStatus('⚠️ Carregamento cancelado', 'warning');
            }
        } catch (error) {
            this.setStatus('❌ Erro ao carregar rascunho', 'error');
            alert('Erro ao carregar: ' + error.message);
        }
    }

    async exportHtml() {
        if (!this.tituloInput.value || this.blocos.length === 0) {
            alert('Preencha o título e adicione pelo menos um bloco!');
            return;
        }

        const htmlContent = this.generateFullHtml();
        
        try {
            const result = await ipcRenderer.invoke('export-html', htmlContent, this.tituloInput.value);
            if (result.success) {
                this.setStatus('✅ HTML exportado com sucesso!', 'success');
                alert('HTML exportado com sucesso!');
                
                // Perguntar se quer abrir o arquivo
                if (confirm('Deseja abrir o arquivo HTML?')) {
                    require('electron').shell.openPath(result.path);
                }
            } else {
                this.setStatus('❌ Erro ao exportar HTML', 'error');
                alert('Erro ao exportar: ' + result.message);
            }
        } catch (error) {
            this.setStatus('❌ Erro ao exportar HTML', 'error');
            alert('Erro ao exportar: ' + error.message);
        }
    }

    async publishArticle() {
        if (!this.tituloInput.value || !this.categoriaSelect.value || !this.autorInput.value || this.blocos.length === 0) {
            alert('Preencha todos os campos e adicione pelo menos um bloco!');
            return;
        }

        if (!confirm('Deseja publicar este artigo no blog?')) {
            return;
        }

        this.setStatus('📤 Publicando artigo...', 'warning');
        this.publishBtn.disabled = true;

        try {
            const articleData = {
                titulo: this.tituloInput.value,
                categoria: this.categoriaSelect.value,
                autor: this.autorInput.value,
                content: this.generateContentHtml()
            };

            const result = await ipcRenderer.invoke('publish-article', articleData);
            
            if (result.success) {
                this.setStatus(`✅ Artigo publicado! ID: ${result.id}`, 'success');
                alert(`Artigo publicado com sucesso!\n\nID: ${result.id}\nSlug: ${result.slug}`);
                
                if (confirm('Deseja limpar o formulário para criar um novo artigo?')) {
                    this.clearForm();
                }
            } else {
                this.setStatus('❌ Erro ao publicar artigo', 'error');
                alert('Erro ao publicar: ' + result.message);
            }
        } catch (error) {
            this.setStatus('❌ Erro ao publicar artigo', 'error');
            alert('Erro ao publicar: ' + error.message);
        } finally {
            this.publishBtn.disabled = false;
        }
    }

    generateContentHtml() {
        return this.blocos.map(bloco => bloco.html).join('\n');
    }

    generateFullHtml() {
        const titulo = this.escapeHtml(this.tituloInput.value);
        const categoria = this.escapeHtml(this.categoriaSelect.value);
        const autor = this.escapeHtml(this.autorInput.value);
        const content = this.generateContentHtml();

        return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${titulo}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1, h2, h3, h4, h5, h6 { color: #dc2626; }
        p { line-height: 1.6; margin-bottom: 15px; }
        .meta { color: #666; font-style: italic; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px; }
    </style>
</head>
<body>
    <h1>${titulo}</h1>
    <div class="meta">
        <strong>Categoria:</strong> ${categoria}<br>
        <strong>Autor:</strong> ${autor}<br>
        <strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}
    </div>
    ${content}
</body>
</html>`;
    }

    clearForm() {
        this.tituloInput.value = '';
        this.categoriaSelect.value = '';
        this.autorInput.value = '';
        this.conteudoTextarea.value = '';
        this.tipoSelect.value = 'p';
        this.blocos = [];
        this.updateBlocksList();
        this.updatePreview();
        this.setStatus('Formulário limpo - Pronto para novo artigo');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
}

// Inicializar aplicação
const editor = new EditorArtigos();
