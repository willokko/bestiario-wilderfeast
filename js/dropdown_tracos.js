/**
 * Arquivo para implementação do sistema de dropdown para traços
 */

// Variáveis globais
let dropdownState = {};

// Inicializar sistema de dropdown
function initDropdownSystem() {
    // Configurar eventos globais para dropdowns
    setupDropdownEventListeners();
}

// Configurar eventos para o sistema de dropdown
function setupDropdownEventListeners() {
    // Evento de clique global para fechar dropdowns quando clicar fora deles
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.trait-header') && !event.target.closest('.trait-content')) {
            closeAllDropdowns();
        }
    });
}

// Criar elemento de dropdown para traço
function createTraitDropdown(trait) {
    if (!trait) return null;
    
    const traitItem = createElement('div', ['trait-item']);
    traitItem.dataset.traitId = trait.id;
    
    // Cabeçalho do traço (clicável para expandir/recolher)
    const traitHeader = createElement('div', ['trait-header']);
    
    // Adicionar ícone de tipo se disponível
    if (trait.tipo) {
        const typeIcon = getTypeIcon(trait.tipo);
        const iconElement = createElement('span', ['trait-type-icon'], typeIcon);
        traitHeader.appendChild(iconElement);
    }
    
    const traitName = createElement('h4', [], trait.nome);
    const traitToggle = createElement('span', ['trait-toggle'], '▼');
    
    traitHeader.appendChild(traitName);
    traitHeader.appendChild(traitToggle);
    
    // Conteúdo do traço (inicialmente recolhido)
    const traitContent = createElement('div', ['trait-content']);
    
    // Adicionar tipo do traço se disponível
    if (trait.tipo) {
        const traitType = createElement('p', ['trait-type'], `Tipo: ${trait.tipo}`);
        traitContent.appendChild(traitType);
    }
    
    // Adicionar resumo do traço se disponível
    if (trait.resumo) {
        const traitSummary = createElement('p', ['trait-summary'], trait.resumo);
        traitContent.appendChild(traitSummary);
    }
    
    // Adicionar descrição completa do traço
    const traitDescription = createElement('p', ['trait-description'], trait.descricao);
    traitContent.appendChild(traitDescription);
    
    traitItem.appendChild(traitHeader);
    traitItem.appendChild(traitContent);
    
    // Adicionar evento de clique para expandir/recolher
    traitHeader.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleTraitDropdown(trait.id);
    });
    
    // Registrar estado inicial do dropdown
    dropdownState[trait.id] = false;
    
    return traitItem;
}

// Alternar estado de dropdown de traço
function toggleTraitDropdown(traitId) {
    const isExpanded = dropdownState[traitId];
    
    // Se estiver expandindo, fechar todos os outros primeiro
    if (!isExpanded) {
        closeAllDropdowns();
    }
    
    // Alternar estado do dropdown atual
    dropdownState[traitId] = !isExpanded;
    updateDropdownVisuals();
}

// Fechar todos os dropdowns
function closeAllDropdowns() {
    Object.keys(dropdownState).forEach(traitId => {
        dropdownState[traitId] = false;
    });
    updateDropdownVisuals();
}

// Atualizar visuais de todos os dropdowns
function updateDropdownVisuals() {
    Object.keys(dropdownState).forEach(traitId => {
        const traitItem = document.querySelector(`.trait-item[data-trait-id="${traitId}"]`);
        if (traitItem) {
            const isExpanded = dropdownState[traitId];
            toggleDropdown(traitItem, isExpanded);
        }
    });
}

// Obter ícone para tipo de traço
function getTypeIcon(type) {
    switch (type.toLowerCase()) {
        case 'passivo':
            return '🛡️';
        case 'ativo':
            return '⚔️';
        case 'especial':
            return '✨';
        default:
            return '•';
    }
}

// Renderizar lista de traços com dropdown
function renderTraitsWithDropdown(traits, container) {
    container.innerHTML = '';
    
    if (!traits || traits.length === 0) {
        container.innerHTML = '<p>Nenhum traço disponível.</p>';
        return;
    }
    
    // Agrupar traços por tipo
    const traitsByType = {
        'Passivo': [],
        'Ativo': [],
        'Especial': []
    };
    
    traits.forEach(trait => {
        const traitType = trait.tipo || 'Especial';
        
        if (!traitsByType[traitType]) {
            traitsByType[traitType] = [];
        }
        
        traitsByType[traitType].push(trait);
    });
    
    // Renderizar traços agrupados por tipo
    Object.keys(traitsByType).forEach(type => {
        const typeTraits = traitsByType[type];
        if (typeTraits.length === 0) return;
        
        const typeTitle = createElement('h4', ['trait-type-title'], `Traços ${type}s`);
        container.appendChild(typeTitle);
        
        const typeContainer = createElement('div', ['traits-type-container']);
        
        typeTraits.forEach(trait => {
            const traitDropdown = createTraitDropdown(trait);
            if (traitDropdown) {
                typeContainer.appendChild(traitDropdown);
            }
        });
        
        container.appendChild(typeContainer);
    });
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initDropdownSystem);
