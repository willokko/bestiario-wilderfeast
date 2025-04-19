/**
 * Arquivo para gerenciamento do bestiário
 */

// Variáveis globais
let monstros = [];
let tracosMap = {};
let monstroAtual = null;

// Inicializar o bestiário
async function initBestiario() {
    showLoading();
    
    // Carregar dados
    monstros = await loadBestiarioData();
    tracosMap = await createTracosMap();
    
    // Renderizar cards de monstros
    renderMonsterCards(monstros);
    
    // Configurar eventos
    setupEventListeners();
}

// Renderizar cards de monstros
function renderMonsterCards(monsters) {
    const monstersGrid = document.getElementById('monsters-grid');
    monstersGrid.innerHTML = '';
    
    if (monsters.length === 0) {
        monstersGrid.innerHTML = '<div class="no-results">Nenhum monstro encontrado</div>';
        return;
    }
    
    monsters.forEach(monster => {
        const card = createMonsterCard(monster);
        monstersGrid.appendChild(card);
    });
}

// Criar card de monstro
function createMonsterCard(monster) {
    const card = createElement('div', ['monster-card']);
    card.dataset.monsterId = monster.id;
    
    const imageContainer = createElement('div', ['card-image']);
    const image = document.createElement('img');
    image.src = monster.imagem_url || 'img/placeholder.png';
    image.alt = monster.nome;
    image.onerror = function() {
        this.src = 'img/placeholder.png';
    };
    imageContainer.appendChild(image);
    
    const cardContent = createElement('div', ['card-content']);
    const title = createElement('h3', ['card-title'], monster.nome);
    const info = createElement('p', ['card-info'], `${monster.linhagem} • ${monster.tamanho}`);
    
    cardContent.appendChild(title);
    cardContent.appendChild(info);
    
    card.appendChild(imageContainer);
    card.appendChild(cardContent);
    
    // Adicionar evento de clique
    card.addEventListener('click', () => {
        showMonsterDetails(monster);
    });
    
    return card;
}

// Mostrar detalhes do monstro
function showMonsterDetails(monster) {
    monstroAtual = monster;
    
    // Atualizar elementos HTML
    document.getElementById('monster-name').textContent = monster.nome;
    document.getElementById('monster-image').src = monster.imagem_url || 'img/placeholder.png';
    document.getElementById('monster-image').alt = monster.nome;
    document.getElementById('monster-lineage').textContent = monster.linhagem;
    document.getElementById('monster-size').textContent = monster.tamanho;
    document.getElementById('monster-habitat').textContent = monster.habitat;
    document.getElementById('monster-description').textContent = monster.descricao;
    
    // Renderizar estilos do monstro
    renderDetailedMonsterStyles(monster.estilos);
    
    // Renderizar habilidades do monstro
    renderDetailedMonsterAbilities(monster.habilidades);
    
    // Renderizar partes
    renderMonsterParts(monster.partes);
    
    // Renderizar traços
    renderMonsterTraits(monster.tracos);
    
    // Renderizar ataques
    renderMonsterAttacks(monster.ataques);
    
    // Mostrar seção de detalhes e esconder grade de monstros
    toggleVisibility(document.getElementById('monsters-grid'), false);
    toggleVisibility(document.getElementById('monster-details'), true);
    
    // Rolar para o topo
    window.scrollTo(0, 0);
}

// Renderizar partes do monstro
function renderMonsterParts(parts) {
    const partsContainer = document.getElementById('monster-parts');
    partsContainer.innerHTML = '';
    
    if (!parts || parts.length === 0) {
        partsContainer.innerHTML = '<p>Este monstro não possui partes registradas.</p>';
        return;
    }
    
    parts.forEach(part => {
        const partItem = createElement('div', ['part-item']);
        
        const partName = createElement('h4', [], part.nome);
        const partDurability = createElement('p', [], `Durabilidade: ${part.durabilidade}`);
        const partDescription = createElement('p', [], part.descricao);
        
        partItem.appendChild(partName);
        partItem.appendChild(partDurability);
        partItem.appendChild(partDescription);
        
        if (part.tracos && part.tracos.length > 0) {
            const partTraits = createElement('p', [], `Traços: ${part.tracos.join(', ')}`);
            partItem.appendChild(partTraits);
        }
        
        partsContainer.appendChild(partItem);
    });
}

// Renderizar traços do monstro
function renderMonsterTraits(traits) {
    const traitsContainer = document.getElementById('monster-traits');
    traitsContainer.innerHTML = '';
    
    if (!traits || traits.length === 0) {
        traitsContainer.innerHTML = '<p>Este monstro não possui traços registrados.</p>';
        return;
    }
    
    traits.forEach(trait => {
        // Buscar informações detalhadas do traço no mapa de traços
        const traitInfo = tracosMap[trait.id] || trait;
        
        const traitItem = createElement('div', ['trait-item']);
        
        // Cabeçalho do traço (clicável para expandir/recolher)
        const traitHeader = createElement('div', ['trait-header']);
        const traitName = createElement('h4', [], traitInfo.nome);
        const traitToggle = createElement('span', ['trait-toggle'], '▼');
        
        traitHeader.appendChild(traitName);
        traitHeader.appendChild(traitToggle);
        
        // Conteúdo do traço (inicialmente recolhido)
        const traitContent = createElement('div', ['trait-content']);
        
        // Adicionar tipo do traço se disponível
        if (traitInfo.tipo) {
            const traitType = createElement('p', ['trait-type'], `Tipo: ${traitInfo.tipo}`);
            traitContent.appendChild(traitType);
        }
        
        // Adicionar descrição do traço
        const traitDescription = createElement('p', ['trait-description'], traitInfo.descricao);
        traitContent.appendChild(traitDescription);
        
        traitItem.appendChild(traitHeader);
        traitItem.appendChild(traitContent);
        
        // Adicionar evento de clique para expandir/recolher
        traitHeader.addEventListener('click', () => {
            const isExpanded = traitContent.classList.contains('expanded');
            toggleDropdown(traitItem, !isExpanded);
        });
        
        traitsContainer.appendChild(traitItem);
    });
}

// Renderizar ataques do monstro
function renderMonsterAttacks(attacks) {
    const attacksContainer = document.getElementById('monster-attacks');
    attacksContainer.innerHTML = '';
    
    if (!attacks || attacks.length === 0) {
        attacksContainer.innerHTML = '<p>Este monstro não possui ataques registrados.</p>';
        return;
    }
    
    attacks.forEach(attack => {
        const attackItem = createElement('div', ['attack-item']);
        
        const attackName = createElement('h4', [], attack.nome);
        const attackDamage = createElement('p', [], `Dano: ${attack.dano}`);
        const attackDescription = createElement('p', [], attack.descricao);
        
        attackItem.appendChild(attackName);
        attackItem.appendChild(attackDamage);
        attackItem.appendChild(attackDescription);
        
        if (attack.efeito) {
            const attackEffect = createElement('p', [], `Efeito: ${attack.efeito}`);
            attackItem.appendChild(attackEffect);
        }
        
        attacksContainer.appendChild(attackItem);
    });
}

// Configurar eventos
function setupEventListeners() {
    // Botão de voltar
    document.getElementById('back-button').addEventListener('click', () => {
        toggleVisibility(document.getElementById('monster-details'), false);
        toggleVisibility(document.getElementById('monsters-grid'), true);
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

// Realizar busca
function performSearch() {
    const searchTerm = document.getElementById('search-input').value.trim();
    const filteredMonsters = filterMonsters(monstros, searchTerm);
    renderMonsterCards(filteredMonsters);
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initBestiario);