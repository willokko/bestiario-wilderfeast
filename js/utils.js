/**
 * Arquivo de utilidades para o bestiário
 */

// Função para criar elemento HTML com classes
function createElement(tag, classes = [], text = '') {
    const element = document.createElement(tag);
    if (classes.length > 0) {
        element.classList.add(...classes);
    }
    if (text) {
        element.textContent = text;
    }
    return element;
}

// Função para formatar texto com primeira letra maiúscula
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Função para truncar texto
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

// Função para mostrar mensagem de erro
function showError(message) {
    const monstersGrid = document.getElementById('monsters-grid');
    monstersGrid.innerHTML = '';
    
    const errorElement = createElement('div', ['error-message'], message);
    monstersGrid.appendChild(errorElement);
}

// Função para mostrar mensagem de carregamento
function showLoading() {
    const monstersGrid = document.getElementById('monsters-grid');
    monstersGrid.innerHTML = '';
    
    const loadingElement = createElement('div', ['loading'], 'Carregando bestiário...');
    monstersGrid.appendChild(loadingElement);
}

// Função para filtrar monstros por termo de busca
function filterMonsters(monsters, searchTerm) {
    if (!searchTerm) return monsters;
    
    searchTerm = searchTerm.toLowerCase();
    return monsters.filter(monster => {
        return (
            monster.nome.toLowerCase().includes(searchTerm) ||
            monster.linhagem.toLowerCase().includes(searchTerm) ||
            monster.habitat.toLowerCase().includes(searchTerm)
        );
    });
}

// Função para alternar visibilidade de elemento
function toggleVisibility(element, isVisible) {
    if (isVisible) {
        element.classList.remove('hidden');
    } else {
        element.classList.add('hidden');
    }
}

// Função para alternar expansão de dropdown
function toggleDropdown(element, isExpanded) {
    const content = element.querySelector('.trait-content');
    const toggle = element.querySelector('.trait-toggle');
    
    if (isExpanded) {
        content.classList.add('expanded');
        toggle.classList.add('expanded');
        toggle.textContent = '▲';
    } else {
        content.classList.remove('expanded');
        toggle.classList.remove('expanded');
        toggle.textContent = '▼';
    }
}
