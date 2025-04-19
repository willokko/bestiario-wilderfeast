/**
 * Arquivo para testes do site de bestiário
 */

// Função para executar testes
function runTests() {
    console.log('Iniciando testes do site de bestiário...');
    
    // Testar carregamento de dados
    testDataLoading();
    
    // Testar renderização de cards
    testCardRendering();
    
    // Testar sistema de busca
    testSearchSystem();
    
    // Testar navegação para visualização detalhada
    testDetailNavigation();
    
    // Testar sistema de dropdown
    testDropdownSystem();
    
    console.log('Testes concluídos!');
}

// Testar carregamento de dados
function testDataLoading() {
    console.log('Testando carregamento de dados...');
    
    // Verificar se os monstros foram carregados
    if (!monstros || monstros.length === 0) {
        console.error('Erro: Monstros não foram carregados corretamente.');
    } else {
        console.log(`✓ ${monstros.length} monstros carregados com sucesso.`);
    }
    
    // Verificar se os traços foram carregados
    if (!tracosData || !tracosData.tracos || tracosData.tracos.length === 0) {
        console.error('Erro: Traços não foram carregados corretamente.');
    } else {
        console.log(`✓ ${tracosData.tracos.length} traços carregados com sucesso.`);
    }
}

// Testar renderização de cards
function testCardRendering() {
    console.log('Testando renderização de cards...');
    
    // Verificar se os cards foram renderizados
    const cards = document.querySelectorAll('.monster-card');
    if (cards.length === 0) {
        console.error('Erro: Cards de monstros não foram renderizados.');
    } else {
        console.log(`✓ ${cards.length} cards de monstros renderizados com sucesso.`);
    }
    
    // Verificar se os cards têm os elementos necessários
    let cardsWithMissingElements = 0;
    cards.forEach(card => {
        if (!card.querySelector('.card-image') || 
            !card.querySelector('.card-title') || 
            !card.querySelector('.card-info')) {
            cardsWithMissingElements++;
        }
    });
    
    if (cardsWithMissingElements > 0) {
        console.error(`Erro: ${cardsWithMissingElements} cards têm elementos faltando.`);
    } else {
        console.log('✓ Todos os cards têm os elementos necessários.');
    }
}

// Testar sistema de busca
function testSearchSystem() {
    console.log('Testando sistema de busca...');
    
    // Salvar estado atual
    const originalCards = document.querySelectorAll('.monster-card').length;
    
    // Testar busca com termo que deve retornar resultados
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    if (!searchInput || !searchButton) {
        console.error('Erro: Elementos de busca não encontrados.');
        return;
    }
    
    // Testar busca com termo comum (deve retornar resultados)
    searchInput.value = 'a';
    searchButton.click();
    
    // Verificar se os resultados foram atualizados
    setTimeout(() => {
        const filteredCards = document.querySelectorAll('.monster-card').length;
        console.log(`✓ Busca com termo 'a': ${filteredCards} resultados.`);
        
        // Testar busca com termo específico
        searchInput.value = monstros[0].nome.substring(0, 3);
        searchButton.click();
        
        setTimeout(() => {
            const specificFilteredCards = document.querySelectorAll('.monster-card').length;
            console.log(`✓ Busca com termo '${monstros[0].nome.substring(0, 3)}': ${specificFilteredCards} resultados.`);
            
            // Limpar busca
            searchInput.value = '';
            searchButton.click();
            
            setTimeout(() => {
                const resetCards = document.querySelectorAll('.monster-card').length;
                if (resetCards !== originalCards) {
                    console.error(`Erro: Limpar busca não restaurou todos os cards. Original: ${originalCards}, Atual: ${resetCards}`);
                } else {
                    console.log('✓ Limpar busca restaurou todos os cards.');
                }
            }, 100);
        }, 100);
    }, 100);
}

// Testar navegação para visualização detalhada
function testDetailNavigation() {
    console.log('Testando navegação para visualização detalhada...');
    
    // Verificar se há cards para clicar
    const cards = document.querySelectorAll('.monster-card');
    if (cards.length === 0) {
        console.error('Erro: Não há cards para testar navegação.');
        return;
    }
    
    // Clicar no primeiro card
    const firstCard = cards[0];
    firstCard.click();
    
    // Verificar se a visualização detalhada foi mostrada
    setTimeout(() => {
        const detailView = document.getElementById('monster-details');
        const gridView = document.getElementById('monsters-grid');
        
        if (detailView.classList.contains('hidden')) {
            console.error('Erro: Visualização detalhada não foi mostrada após clicar no card.');
        } else if (!gridView.classList.contains('hidden')) {
            console.error('Erro: Visualização em grade não foi escondida após clicar no card.');
        } else {
            console.log('✓ Navegação para visualização detalhada funcionou corretamente.');
        }
        
        // Verificar se os elementos da visualização detalhada foram preenchidos
        const monsterName = document.getElementById('monster-name');
        const monsterImage = document.getElementById('monster-image');
        const monsterLineage = document.getElementById('monster-lineage');
        const monsterSize = document.getElementById('monster-size');
        const monsterHabitat = document.getElementById('monster-habitat');
        const monsterDescription = document.getElementById('monster-description');
        
        if (!monsterName.textContent || 
            !monsterLineage.textContent || 
            !monsterSize.textContent || 
            !monsterHabitat.textContent || 
            !monsterDescription.textContent) {
            console.error('Erro: Elementos da visualização detalhada não foram preenchidos corretamente.');
        } else {
            console.log('✓ Elementos da visualização detalhada foram preenchidos corretamente.');
        }
        
        // Testar botão de voltar
        const backButton = document.getElementById('back-button');
        if (!backButton) {
            console.error('Erro: Botão de voltar não encontrado.');
        } else {
            backButton.click();
            
            // Verificar se voltou para a visualização em grade
            setTimeout(() => {
                if (!detailView.classList.contains('hidden')) {
                    console.error('Erro: Visualização detalhada não foi escondida após clicar no botão de voltar.');
                } else if (gridView.classList.contains('hidden')) {
                    console.error('Erro: Visualização em grade não foi mostrada após clicar no botão de voltar.');
                } else {
                    console.log('✓ Navegação de volta para visualização em grade funcionou corretamente.');
                }
            }, 100);
        }
    }, 100);
}

// Testar sistema de dropdown
function testDropdownSystem() {
    console.log('Testando sistema de dropdown...');
    
    // Primeiro, navegar para a visualização detalhada
    const cards = document.querySelectorAll('.monster-card');
    if (cards.length === 0) {
        console.error('Erro: Não há cards para testar dropdown.');
        return;
    }
    
    // Clicar no primeiro card
    const firstCard = cards[0];
    firstCard.click();
    
    // Verificar se há traços com dropdown
    setTimeout(() => {
        const traitItems = document.querySelectorAll('.trait-item');
        if (traitItems.length === 0) {
            console.log('Aviso: Não há traços para testar dropdown.');
            return;
        }
        
        console.log(`✓ ${traitItems.length} traços encontrados para teste de dropdown.`);
        
        // Testar clique no cabeçalho do traço
        const firstTraitHeader = traitItems[0].querySelector('.trait-header');
        const firstTraitContent = traitItems[0].querySelector('.trait-content');
        
        if (!firstTraitHeader || !firstTraitContent) {
            console.error('Erro: Elementos de dropdown não encontrados.');
            return;
        }
        
        // Verificar estado inicial (deve estar fechado)
        if (firstTraitContent.classList.contains('expanded')) {
            console.error('Erro: Dropdown está expandido inicialmente, deveria estar fechado.');
        } else {
            console.log('✓ Dropdown está fechado inicialmente.');
        }
        
        // Clicar para expandir
        firstTraitHeader.click();
        
        // Verificar se expandiu
        setTimeout(() => {
            if (!firstTraitContent.classList.contains('expanded')) {
                console.error('Erro: Dropdown não expandiu após clique.');
            } else {
                console.log('✓ Dropdown expandiu corretamente após clique.');
            }
            
            // Clicar novamente para fechar
            firstTraitHeader.click();
            
            // Verificar se fechou
            setTimeout(() => {
                if (firstTraitContent.classList.contains('expanded')) {
                    console.error('Erro: Dropdown não fechou após segundo clique.');
                } else {
                    console.log('✓ Dropdown fechou corretamente após segundo clique.');
                }
                
                // Voltar para a visualização em grade
                const backButton = document.getElementById('back-button');
                if (backButton) {
                    backButton.click();
                }
            }, 100);
        }, 100);
    }, 100);
}

// Executar testes quando a página estiver totalmente carregada
window.addEventListener('load', () => {
    // Aguardar um pouco para garantir que todos os dados foram carregados
    setTimeout(runTests, 1000);
});
