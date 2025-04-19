/**
 * Arquivo para gerenciamento da visualização detalhada de monstros
 */

// Variáveis globais
let monstroAtualDetalhado = null;

// Inicializar visualização detalhada
function initVisualizacaoDetalhada() {
    // Configurar eventos
    setupDetailViewEventListeners();
}

// Configurar eventos da visualização detalhada
function setupDetailViewEventListeners() {
    // Botão de voltar
    document.getElementById('back-button').addEventListener('click', () => {
        hideMonsterDetails();
    });
}

// Mostrar detalhes completos do monstro
function showDetailedMonsterView(monstroId) {
    // Buscar monstro pelo ID
    const monstro = monstros.find(m => m.id === parseInt(monstroId));
    if (!monstro) {
        console.error('Monstro não encontrado:', monstroId);
        return;
    }
    
    monstroAtualDetalhado = monstro;
    
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
    renderDetailedMonsterTraits(monstro.tracos);
    
    // Renderizar ataques
    renderDetailedMonsterAttacks(monstro.ataques);
    
    // Mostrar seção de detalhes e esconder grade de monstros
    toggleVisibility(document.getElementById('monsters-grid'), false);
    toggleVisibility(document.getElementById('monster-details'), true);
    
    // Rolar para o topo
    window.scrollTo(0, 0);
}

// Renderizar partes do monstro na visualização detalhada
function renderDetailedMonsterParts(parts) {
    const partsContainer = document.getElementById('monster-parts');
    partsContainer.innerHTML = '';
    
    if (!parts || parts.length === 0) {
        partsContainer.innerHTML = '<p>Este monstro não possui partes registradas.</p>';
        return;
    }
    
    parts.forEach(part => {
        const partItem = createElement('div', ['part-item']);
        
        const partHeader = createElement('div', ['part-header']);
        const partName = createElement('h4', [], part.nome);
        const partDurability = createElement('span', ['part-durability'], `Durabilidade: ${part.durabilidade}`);
        
        partHeader.appendChild(partName);
        partHeader.appendChild(partDurability);
        
        const partDescription = createElement('p', ['part-description'], part.descricao);
        
        partItem.appendChild(partHeader);
        partItem.appendChild(partDescription);
        
        if (part.tracos && part.tracos.length > 0) {
            const partTraitsTitle = createElement('h5', [], 'Traços da Parte:');
            partItem.appendChild(partTraitsTitle);
            
            const partTraitsList = createElement('ul', ['part-traits-list']);
            part.tracos.forEach(tracoNome => {
                const tracoItem = createElement('li', [], tracoNome);
                partTraitsList.appendChild(tracoItem);
            });
            
            partItem.appendChild(partTraitsList);
        }
        
        partsContainer.appendChild(partItem);
    });
}

// Renderizar traços do monstro na visualização detalhada com dropdown
function renderDetailedMonsterTraits(traits) {
    const traitsContainer = document.getElementById('monster-traits');
    traitsContainer.innerHTML = '';
    
    if (!traits || traits.length === 0) {
        traitsContainer.innerHTML = '<p>Este monstro não possui traços registrados.</p>';
        return;
    }
    
    // Agrupar traços por tipo (Passivo, Ativo, Especial)
    const traitsByType = {
        'Passivo': [],
        'Ativo': [],
        'Especial': []
    };
    
    traits.forEach(trait => {
        // Buscar informações detalhadas do traço no mapa de traços
        const traitInfo = tracosMap[trait.id] || trait;
        const traitType = traitInfo.tipo || 'Especial';
        
        if (!traitsByType[traitType]) {
            traitsByType[traitType] = [];
        }
        
        traitsByType[traitType].push(traitInfo);
    });
    
    // Renderizar traços agrupados por tipo
    Object.keys(traitsByType).forEach(type => {
        const typeTraits = traitsByType[type];
        if (typeTraits.length === 0) return;
        
        const typeTitle = createElement('h4', ['trait-type-title'], `Traços ${type}s`);
        traitsContainer.appendChild(typeTitle);
        
        typeTraits.forEach(trait => {
            const traitItem = createElement('div', ['trait-item']);
            
            // Cabeçalho do traço (clicável para expandir/recolher)
            const traitHeader = createElement('div', ['trait-header']);
            const traitName = createElement('h5', [], trait.nome);
            const traitToggle = createElement('span', ['trait-toggle'], '▼');
            
            traitHeader.appendChild(traitName);
            traitHeader.appendChild(traitToggle);
            
            // Conteúdo do traço (inicialmente recolhido)
            const traitContent = createElement('div', ['trait-content']);
            
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
            traitHeader.addEventListener('click', () => {
                const isExpanded = traitContent.classList.contains('expanded');
                toggleDropdown(traitItem, !isExpanded);
            });
            
            traitsContainer.appendChild(traitItem);
        });
    });
}

// Renderizar ataques do monstro na visualização detalhada
function renderDetailedMonsterAttacks(attacks) {
    const attacksContainer = document.getElementById('monster-attacks');
    attacksContainer.innerHTML = '';
    
    if (!attacks || attacks.length === 0) {
        attacksContainer.innerHTML = '<p>Este monstro não possui ataques registrados.</p>';
        return;
    }
    
    attacks.forEach(attack => {
        const attackItem = createElement('div', ['attack-item']);
        
        const attackHeader = createElement('div', ['attack-header']);
        const attackName = createElement('h4', [], attack.nome);
        const attackDamage = createElement('span', ['attack-damage'], `Dano: ${attack.dano}`);
        
        attackHeader.appendChild(attackName);
        attackHeader.appendChild(attackDamage);
        
        const attackDescription = createElement('p', ['attack-description'], attack.descricao);
        
        attackItem.appendChild(attackHeader);
        attackItem.appendChild(attackDescription);
        
        if (attack.efeito) {
            const attackEffectTitle = createElement('h5', [], 'Efeito:');
            const attackEffect = createElement('p', ['attack-effect'], attack.efeito);
            
            attackItem.appendChild(attackEffectTitle);
            attackItem.appendChild(attackEffect);
        }
        
        attacksContainer.appendChild(attackItem);
    });
}

// Função para renderizar estilos do monstro
function renderDetailedMonsterStyles(estilos) {
    const stylesContainer = document.getElementById('monster-styles');
    stylesContainer.innerHTML = '';
    
    if (!estilos || estilos.length === 0) {
        stylesContainer.innerHTML = '<p>Este monstro não possui estilos registrados.</p>';
        return;
    }
    
    // Criar container de grid para os cards
    const stylesGrid = createElement('div', ['styles-container']);
    
    estilos.forEach(estilo => {
        // Criar card para o estilo
        const styleCard = createElement('div', ['monster-style-card', `style-${estilo.nome}`]);
        styleCard.dataset.styleValue = estilo.valor;
        styleCard.dataset.styleName = estilo.nome;
        
        // Cabeçalho do card
        const cardHeader = createElement('div', ['card-header']);
        const cardTitle = createElement('h4', ['card-title'], estilo.nome);
        const cardValue = createElement('span', ['card-value'], estilo.valor);
        
        cardHeader.appendChild(cardTitle);
        cardHeader.appendChild(cardValue);
        
        // Indicador de dados
        const diceIndicator = createElement('span', ['dice-indicator'], '🎲');
        
        // Adicionar elementos ao card
        styleCard.appendChild(cardHeader);
        styleCard.appendChild(diceIndicator);
        
        // Adicionar evento de clique para rolagem de dados
        styleCard.addEventListener('click', () => {
            const nomeEstilo = estilo.nome;
            const valorEstilo = estilo.valor;
            const nomeDoMonstro = document.getElementById('monster-name').textContent;
            
            // Realizar a rolagem
            const resultado = rolarEstilo(valorEstilo);
            
            // Exibir o resultado usando toaster
            exibirResultadoRolagemToaster(resultado, nomeEstilo, nomeDoMonstro);
        });
        
        // Adicionar card ao grid
        stylesGrid.appendChild(styleCard);
    });
    
    // Adicionar grid ao container
    stylesContainer.appendChild(stylesGrid);
}

// Função para renderizar habilidades do monstro
function renderDetailedMonsterAbilities(habilidades) {
    const abilitiesContainer = document.getElementById('monster-abilities');
    abilitiesContainer.innerHTML = '';
    
    if (!habilidades || habilidades.length === 0) {
        abilitiesContainer.innerHTML = '<p>Este monstro não possui habilidades registradas.</p>';
        return;
    }
    
    // Criar container de grid para os cards
    const abilitiesGrid = createElement('div', ['abilities-container']);
    
    habilidades.forEach(habilidade => {
        // Criar card para a habilidade
        const abilityCard = createElement('div', ['monster-ability-card']);
        
        // Cabeçalho do card
        const cardHeader = createElement('div', ['card-header']);
        const cardTitle = createElement('h4', ['card-title'], habilidade.nome);
        const cardValue = createElement('span', ['card-value'], habilidade.valor);
        
        cardHeader.appendChild(cardTitle);
        cardHeader.appendChild(cardValue);
        
        // Adicionar elementos ao card
        abilityCard.appendChild(cardHeader);
        
        // Adicionar card ao grid
        abilitiesGrid.appendChild(abilityCard);
    });
    
    // Adicionar grid ao container
    abilitiesContainer.appendChild(abilitiesGrid);
}

// Esconder detalhes do monstro e voltar para a grade
function hideMonsterDetails() {
    toggleVisibility(document.getElementById('monster-details'), false);
    toggleVisibility(document.getElementById('monsters-grid'), true);
    monstroAtualDetalhado = null;
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initVisualizacaoDetalhada);