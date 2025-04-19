/**
 * Arquivo principal da aplicação
 */

// Variáveis globais
let appState = {
    initialized: false,
    dataLoaded: false,
    currentView: 'grid', // 'grid' ou 'detail'
    currentMonsterId: null
};

// Inicializar aplicação
async function initApp() {
    if (appState.initialized) return;
    
    showLoading();
    
    try {
        // Carregar dados
        await Promise.all([
            loadBestiarioData().then(data => {
                monstros = data;
                console.log(`Carregados ${monstros.length} monstros`);
            }),
            loadTracosData().then(data => {
                tracosData = data;
                console.log(`Carregados ${tracosData.tracos ? tracosData.tracos.length : 0} traços`);
            })
        ]);
        
        // Criar mapa de traços para fácil acesso
        tracosMap = await createTracosMap();
        
        appState.dataLoaded = true;
        
        // Renderizar interface inicial
        renderMonsterCards(monstros);
        
        // Configurar eventos
        setupAppEventListeners();
        
        appState.initialized = true;
    } catch (error) {
        console.error('Erro ao inicializar aplicação:', error);
        showError('Erro ao carregar dados. Por favor, recarregue a página.');
    }
}

// Configurar eventos da aplicação
function setupAppEventListeners() {
    // Botão de voltar
    document.getElementById('back-button').addEventListener('click', () => {
        navigateToGridView();
    });
    
    // Busca
    document.getElementById('search-button').addEventListener('click', performSearch);
    document.getElementById('search-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Adicionar evento de input para pesquisa em tempo real
    document.getElementById('search-input').addEventListener('input', debounce(performSearch, 300));
}

// Função de debounce para limitar a frequência de chamadas da função de pesquisa
function debounce(func, delay) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}

// Navegar para visualização em grade
function navigateToGridView() {
    appState.currentView = 'grid';
    appState.currentMonsterId = null;
    
    toggleVisibility(document.getElementById('monster-details'), false);
    toggleVisibility(document.getElementById('monsters-grid'), true);
}

// Navegar para visualização detalhada
function navigateToDetailView(monstroId) {
    const monstro = monstros.find(m => m.id === parseInt(monstroId));
    if (!monstro) {
        console.error('Monstro não encontrado:', monstroId);
        return;
    }
    
    appState.currentView = 'detail';
    appState.currentMonsterId = monstroId;
    
    // Renderizar visualização detalhada
    renderDetailView(monstro);
    
    toggleVisibility(document.getElementById('monsters-grid'), false);
    toggleVisibility(document.getElementById('monster-details'), true);
    
    // Rolar para o topo
    window.scrollTo(0, 0);
}

// Renderizar visualização detalhada
function renderDetailView(monstro) {
    // Atualizar elementos HTML
    document.getElementById('monster-name').textContent = monstro.nome;
    
    // Imagem do monstro
    const monsterImage = document.getElementById('monster-image');
    monsterImage.src = monstro.imagem_url || 'img/placeholder.png';
    monsterImage.alt = monstro.nome;
    monsterImage.onerror = function() {
        this.src = 'img/placeholder.png';
    };
    
    // Informações gerais
    document.getElementById('monster-lineage').textContent = monstro.linhagem;
    document.getElementById('monster-size').textContent = monstro.tamanho;
    document.getElementById('monster-habitat').textContent = monstro.habitat;
    
    // Descrição
    document.getElementById('monster-description').textContent = monstro.descricao;
    
    // Renderizar estilos do monstro
    renderDetailedMonsterStyles(monstro.estilos);
    
    // Renderizar habilidades do monstro
    renderDetailedMonsterAbilities(monstro.habilidades);
    
    // Renderizar partes
    renderDetailedMonsterParts(monstro.partes);
    
    // Renderizar traços com dropdown
    renderTraitsWithDropdown(monstro.tracos, document.getElementById('monster-traits'));
    
    // Renderizar ataques
    renderDetailedMonsterAttacks(monstro.ataques);
}

// Realizar busca
function performSearch() {
    const searchTerm = document.getElementById('search-input').value.trim();
    const filteredMonsters = filterMonsters(monstros, searchTerm);
    renderMonsterCards(filteredMonsters);
    
    // Se estiver na visualização detalhada, voltar para a grade
    if (appState.currentView === 'detail') {
        navigateToGridView();
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initApp);
