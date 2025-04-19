/**
 * Arquivo para gerenciamento de traços
 */

// Variáveis globais
let tracosData = null;

// Inicializar traços
async function initTracos() {
    tracosData = await loadTracosData();
    return tracosData;
}

// Obter traço por ID
function getTracoById(id) {
    if (!tracosData || !tracosData.tracos) return null;
    
    return tracosData.tracos.find(traco => traco.id === id);
}

// Obter traços por categoria
function getTracosByCategory(category) {
    if (!tracosData || !tracosData.categorias || !tracosData.categorias[category]) return [];
    
    const tracoIds = tracosData.categorias[category];
    return tracoIds.map(id => getTracoById(id)).filter(traco => traco !== null);
}

// Renderizar dropdown de traço
function renderTracoDropdown(traco, container) {
    if (!traco) return;
    
    const traitItem = createElement('div', ['trait-item']);
    
    // Cabeçalho do traço (clicável para expandir/recolher)
    const traitHeader = createElement('div', ['trait-header']);
    const traitName = createElement('h4', [], traco.nome);
    const traitToggle = createElement('span', ['trait-toggle'], '▼');
    
    traitHeader.appendChild(traitName);
    traitHeader.appendChild(traitToggle);
    
    // Conteúdo do traço (inicialmente recolhido)
    const traitContent = createElement('div', ['trait-content']);
    
    // Adicionar tipo do traço se disponível
    if (traco.tipo) {
        const traitType = createElement('p', ['trait-type'], `Tipo: ${traco.tipo}`);
        traitContent.appendChild(traitType);
    }
    
    // Adicionar resumo do traço se disponível
    if (traco.resumo) {
        const traitSummary = createElement('p', ['trait-summary'], traco.resumo);
        traitContent.appendChild(traitSummary);
    }
    
    // Adicionar descrição completa do traço
    const traitDescription = createElement('p', ['trait-description'], traco.descricao);
    traitContent.appendChild(traitDescription);
    
    traitItem.appendChild(traitHeader);
    traitItem.appendChild(traitContent);
    
    // Adicionar evento de clique para expandir/recolher
    traitHeader.addEventListener('click', () => {
        const isExpanded = traitContent.classList.contains('expanded');
        toggleDropdown(traitItem, !isExpanded);
    });
    
    container.appendChild(traitItem);
    
    return traitItem;
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initTracos);
