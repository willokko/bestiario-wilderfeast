/**
 * Sistema de Combate para Bestiário WilderFeast
 */

// Variáveis globais do sistema de combate
let combatState = {
    active: false,
    maxHealth: 30,
    currentHealth: 30,
    woundedCount: 0,
    maxWoundedCount: 3 // Limite máximo para o contador de ferido
};

// Inicializar sistema de combate
function initCombatSystem() {
    // Criar elementos do sistema de combate
    createCombatElements();
    
    // Configurar eventos
    setupCombatEventListeners();
    
    // Inicialmente oculto
    toggleCombatSystem(false);
}

// Criar elementos do sistema de combate
function createCombatElements() {
    // Criar botão de combate no header
    createCombatButton();
    
    // Criar painel de combate
    createCombatPanel();
}

// Criar botão de combate no header
function createCombatButton() {
    const headerContainer = document.querySelector('.header-container');
    
    // Verificar se o botão já existe
    if (document.getElementById('combat-toggle')) {
        return;
    }
    
    // Criar botão
    const combatButton = document.createElement('button');
    combatButton.id = 'combat-toggle';
    combatButton.className = 'combat-button';
    combatButton.textContent = 'Combate';
    
    // Adicionar ao header
    headerContainer.appendChild(combatButton);
}

// Criar painel de combate
function createCombatPanel() {
    const mainElement = document.querySelector('main');
    
    // Verificar se o painel já existe
    if (document.getElementById('combat-panel')) {
        return;
    }
    
    // Criar painel de combate
    const combatPanel = document.createElement('section');
    combatPanel.id = 'combat-panel';
    combatPanel.className = 'combat-panel';
    
    // Conteúdo do painel
    combatPanel.innerHTML = `
        <div class="combat-controls">
            <div class="health-section">
                <div class="health-header">
                    <h3>Pontos de Vida</h3>
                    <div class="health-inputs">
                        <div class="health-input-group">
                            <label for="max-health">Máximo:</label>
                            <input type="number" id="max-health" value="${combatState.maxHealth}" min="1">
                        </div>
                        <div class="health-input-group">
                            <label for="current-health">Atual:</label>
                            <input type="number" id="current-health" value="${combatState.currentHealth}" min="0">
                        </div>
                    </div>
                </div>
                <div class="health-bar-container">
                    <div class="health-bar" style="width: 100%;"></div>
                </div>
            </div>
            
            <div class="wounded-section">
                <div class="wounded-header">
                    <h3>Condição: Ferido</h3>
                    <div class="wounded-controls">
                        <button id="decrease-wounded" class="wounded-button">-</button>
                        <span id="wounded-count">${combatState.woundedCount}</span>
                        <button id="increase-wounded" class="wounded-button">+</button>
                    </div>
                </div>
                <div class="wounded-max-info">Máximo: ${combatState.maxWoundedCount} (Monstro morre ao atingir)</div>
            </div>
            
            <div class="damage-calculator">
                <h3>Calculador de Dano</h3>
                <div class="damage-input-group">
                    <input type="number" id="damage-input" placeholder="Dano" min="0">
                    <button id="apply-damage">Aplicar Dano</button>
                </div>
            </div>
        </div>
    `;
    
    // Inserir no início do main, antes de qualquer outro conteúdo
    mainElement.insertBefore(combatPanel, mainElement.firstChild);
}

// Configurar eventos do sistema de combate
function setupCombatEventListeners() {
    // Botão de toggle do combate
    const combatButton = document.getElementById('combat-toggle');
    if (combatButton) {
        combatButton.addEventListener('click', () => {
            combatState.active = !combatState.active;
            toggleCombatSystem(combatState.active);
        });
    }
    
    // Eventos para os inputs de vida
    const maxHealthInput = document.getElementById('max-health');
    if (maxHealthInput) {
        maxHealthInput.addEventListener('change', () => {
            updateMaxHealth(parseInt(maxHealthInput.value) || 1);
        });
    }
    
    const currentHealthInput = document.getElementById('current-health');
    if (currentHealthInput) {
        currentHealthInput.addEventListener('change', () => {
            updateCurrentHealth(parseInt(currentHealthInput.value) || 0);
        });
    }
    
    // Eventos para os botões de ferido
    const decreaseWoundedButton = document.getElementById('decrease-wounded');
    if (decreaseWoundedButton) {
        decreaseWoundedButton.addEventListener('click', () => {
            updateWoundedCount(combatState.woundedCount - 1);
        });
    }
    
    const increaseWoundedButton = document.getElementById('increase-wounded');
    if (increaseWoundedButton) {
        increaseWoundedButton.addEventListener('click', () => {
            updateWoundedCount(combatState.woundedCount + 1);
        });
    }
    
    // Evento para o calculador de dano
    const applyDamageButton = document.getElementById('apply-damage');
    if (applyDamageButton) {
        applyDamageButton.addEventListener('click', () => {
            const damageInput = document.getElementById('damage-input');
            const damage = parseInt(damageInput.value) || 0;
            applyDamage(damage);
            damageInput.value = '';
        });
    }
}

// Alternar visibilidade do sistema de combate
function toggleCombatSystem(active) {
    const combatButton = document.getElementById('combat-toggle');
    const combatPanel = document.getElementById('combat-panel');
    
    if (combatButton) {
        if (active) {
            combatButton.classList.add('active');
        } else {
            combatButton.classList.remove('active');
        }
    }
    
    if (combatPanel) {
        if (active) {
            combatPanel.style.display = 'block';
        } else {
            combatPanel.style.display = 'none';
        }
    }
}

// Atualizar vida máxima
function updateMaxHealth(newMaxHealth) {
    // Garantir que o valor seja pelo menos 1
    newMaxHealth = Math.max(1, newMaxHealth);
    
    // Atualizar estado
    combatState.maxHealth = newMaxHealth;
    
    // Atualizar input
    const maxHealthInput = document.getElementById('max-health');
    if (maxHealthInput) {
        maxHealthInput.value = newMaxHealth;
    }
    
    // Garantir que a vida atual não seja maior que a máxima
    if (combatState.currentHealth > newMaxHealth) {
        updateCurrentHealth(newMaxHealth);
    } else {
        // Atualizar barra de vida
        updateHealthBar();
    }
    
    // Se estiver com 3 feridos, manter a vida em zero
    if (combatState.woundedCount >= combatState.maxWoundedCount) {
        updateCurrentHealth(0);
    }
}

// Atualizar vida atual
function updateCurrentHealth(newHealth) {
    // Se estiver com 3 feridos, a vida deve permanecer em zero
    if (combatState.woundedCount >= combatState.maxWoundedCount) {
        newHealth = 0;
    }
    
    // Garantir que o valor esteja entre 0 e o máximo
    newHealth = Math.max(0, Math.min(combatState.maxHealth, newHealth));
    
    // Verificar se a vida zerou
    const wasZero = combatState.currentHealth <= 0;
    
    // Atualizar estado
    combatState.currentHealth = newHealth;
    
    // Atualizar input
    const currentHealthInput = document.getElementById('current-health');
    if (currentHealthInput) {
        currentHealthInput.value = newHealth;
    }
    
    // Atualizar barra de vida
    updateHealthBar();
    
    // Se a vida chegou a zero e não estava zero antes, incrementar ferido
    if (newHealth <= 0 && !wasZero) {
        handleZeroHealth();
    }
}

// Atualizar barra de vida
function updateHealthBar() {
    const healthBar = document.querySelector('.health-bar');
    if (healthBar) {
        const healthPercentage = (combatState.currentHealth / combatState.maxHealth) * 100;
        healthBar.style.width = `${healthPercentage}%`;
        
        // Atualizar cores baseado na porcentagem de vida
        if (healthPercentage <= 25) {
            healthBar.className = 'health-bar critical';
        } else if (healthPercentage <= 50) {
            healthBar.className = 'health-bar warning';
        } else {
            healthBar.className = 'health-bar';
        }
    }
}

// Atualizar contador de ferido
function updateWoundedCount(newCount) {
    // Garantir que o valor esteja entre 0 e o máximo
    newCount = Math.max(0, Math.min(combatState.maxWoundedCount, newCount));
    
    // Atualizar estado
    combatState.woundedCount = newCount;
    
    // Atualizar contador na interface
    const woundedCount = document.getElementById('wounded-count');
    if (woundedCount) {
        woundedCount.textContent = newCount;
    }
    
    // Se atingir o máximo de ferido (3), zerar a vida permanentemente
    if (newCount >= combatState.maxWoundedCount) {
        updateCurrentHealth(0);
        
        // Desabilitar inputs de vida quando estiver com 3 feridos
        const currentHealthInput = document.getElementById('current-health');
        if (currentHealthInput) {
            currentHealthInput.disabled = true;
            currentHealthInput.title = "Monstro derrotado (3 feridos)";
        }
    } else {
        // Habilitar inputs de vida quando estiver com menos de 3 feridos
        const currentHealthInput = document.getElementById('current-health');
        if (currentHealthInput) {
            currentHealthInput.disabled = false;
            currentHealthInput.title = "";
        }
    }
}

// Aplicar dano
function applyDamage(damage) {
    if (damage <= 0) return;
    
    const newHealth = combatState.currentHealth - damage;
    updateCurrentHealth(newHealth);
}

// Lidar com vida zerada
function handleZeroHealth() {
    // Incrementar contador de ferido
    const newWoundedCount = combatState.woundedCount + 1;
    updateWoundedCount(newWoundedCount);
    
    // Se não atingiu o máximo de ferido, restaurar vida ao máximo
    if (newWoundedCount < combatState.maxWoundedCount) {
        updateCurrentHealth(combatState.maxHealth);
    }
    // Se atingiu o máximo de ferido, manter a vida em zero
    else {
        updateCurrentHealth(0);
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initCombatSystem);
