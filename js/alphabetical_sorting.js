/**
 * Função para ordenar os monstros em ordem alfabética pelo nome
 * @param {Array} monsters - Array de monstros a ser ordenado
 * @returns {Array} - Array de monstros ordenado alfabeticamente
 */
function sortMonstersByName(monsters) {
    return [...monsters].sort((a, b) => {
      // Comparação case-insensitive para ordenação alfabética
      return a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' });
    });
  }
  
  /**
   * Função para aplicar ordenação alfabética ao renderizar os monstros
   * Deve ser chamada antes de renderizar os cards de monstros
   */
  function applyAlphabeticalSorting() {
    // Ordenar monstros globais em ordem alfabética
    monstros = sortMonstersByName(monstros);
  }
  
  // Modificar a função de renderização para garantir que os monstros estejam ordenados
  const originalRenderMonsterCards = renderMonsterCards;
  renderMonsterCards = function(monsters) {
    // Ordenar os monstros antes de renderizar
    const sortedMonsters = sortMonstersByName(monsters);
    // Chamar a função original com os monstros ordenados
    originalRenderMonsterCards(sortedMonsters);
  };
  
  // Modificar a função de pesquisa para manter a ordenação alfabética
  const originalFilterMonsters = filterMonsters;
  filterMonsters = function(monsters, searchTerm) {
    // Obter os monstros filtrados usando a função original
    const filteredMonsters = originalFilterMonsters(monsters, searchTerm);
    // Ordenar os resultados filtrados
    return sortMonstersByName(filteredMonsters);
  };
  
  // Modificar a função de inicialização para aplicar a ordenação logo após carregar os dados
  document.addEventListener('DOMContentLoaded', function() {
    // Adicionar um hook para ordenar os monstros após o carregamento dos dados
    const originalInitBestiario = window.initBestiario || function(){};
    window.initBestiario = function() {
      // Chamar a função original
      const result = originalInitBestiario.apply(this, arguments);
      
      // Aplicar ordenação alfabética após o carregamento dos dados
      if (window.monstros && window.monstros.length > 0) {
        applyAlphabeticalSorting();
      }
      
      return result;
    };
    
    // Se a aplicação já tiver sido inicializada, ordenar os monstros agora
    if (window.monstros && window.monstros.length > 0) {
      applyAlphabeticalSorting();
      // Re-renderizar os monstros para aplicar a ordenação
      if (typeof renderMonsterCards === 'function') {
        renderMonsterCards(window.monstros);
      }
    }
  });
  