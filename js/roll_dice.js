// Implementação da funcionalidade de rolagem de dados para estilos de monstros
// Este script adiciona a funcionalidade de rolar dados ao clicar em um estilo específico
// Regra: d6 em quantidade igual ao número do estilo + 1d20

// Função para rolar um dado de n faces
function rolarDado(faces) {
  return Math.floor(Math.random() * faces) + 1;
}

// Função para rolar múltiplos dados e somar os resultados
function rolarMultiplosDados(quantidade, faces) {
  let total = 0;
  const resultados = [];
  
  for (let i = 0; i < quantidade; i++) {
    const resultado = rolarDado(faces);
    resultados.push(resultado);
    total += resultado;
  }
  
  return {
    total: total,
    resultados: resultados
  };
}

// Função principal para rolar dados baseado no estilo do monstro
function rolarEstilo(valorEstilo) {
  // Rolar d6 em quantidade igual ao valor do estilo
  const resultadoD6 = rolarMultiplosDados(valorEstilo, 6);
  
  // Rolar 1d20
  const resultadoD20 = rolarDado(20);
  
  // Calcular o total
  const total = resultadoD6.total + resultadoD20;
  
  return {
    d6: {
      quantidade: valorEstilo,
      resultados: resultadoD6.resultados,
      total: resultadoD6.total
    },
    d20: resultadoD20,
    total: total
  };
}

// Função para exibir o resultado da rolagem na interface
function exibirResultadoRolagem(resultado, nomeEstilo, nomeDoMonstro) {
  // Criar elemento para exibir o resultado
  const resultadoElement = document.createElement('div');
  resultadoElement.className = 'resultado-rolagem';
  
  // Construir a mensagem de resultado
  let mensagem = `<h3>Rolagem de ${nomeEstilo} para ${nomeDoMonstro}</h3>`;
  mensagem += `<p><strong>d6 (${resultado.d6.quantidade}):</strong> ${resultado.d6.resultados.join(', ')} = ${resultado.d6.total}</p>`;
  mensagem += `<p><strong>d20:</strong> ${resultado.d20}</p>`;
  mensagem += `<p><strong>Total:</strong> ${resultado.total}</p>`;
  
  // Adicionar efeito especial para resultados críticos
  if (resultado.d20 === 20) {
    mensagem += `<p class="critico sucesso">SUCESSO CRÍTICO!</p>`;
  } else if (resultado.d20 === 1) {
    mensagem += `<p class="critico falha">FALHA CRÍTICA!</p>`;
  }
  
  // Adicionar opção "Soltar o Bicho"
  mensagem += `<button class="btn-soltar-bicho" onclick="soltarOBicho('${nomeEstilo}', ${resultado.d6.quantidade}, '${nomeDoMonstro}')">Soltar o Bicho!</button>`;
  
  resultadoElement.innerHTML = mensagem;
  
  // Adicionar ao container de resultados
  const resultadosContainer = document.getElementById('resultados-rolagem');
  if (resultadosContainer) {
    // Limitar a 5 resultados visíveis
    if (resultadosContainer.children.length >= 5) {
      resultadosContainer.removeChild(resultadosContainer.lastChild);
    }
    
    // Adicionar o novo resultado no topo
    resultadosContainer.insertBefore(resultadoElement, resultadosContainer.firstChild);
  } else {
    // Criar o container se não existir
    const container = document.createElement('div');
    container.id = 'resultados-rolagem';
    container.appendChild(resultadoElement);
    
    // Adicionar após o container de detalhes do monstro
    const detalhesContainer = document.querySelector('.detalhes-monstro');
    if (detalhesContainer) {
      detalhesContainer.parentNode.insertBefore(container, detalhesContainer.nextSibling);
    } else {
      document.body.appendChild(container);
    }
  }
  
  // Adicionar efeito de animação
  resultadoElement.classList.add('animacao-rolagem');
  setTimeout(() => {
    resultadoElement.classList.remove('animacao-rolagem');
  }, 1000);
}

// Função para "Soltar o Bicho" - rolagem com vantagem
function soltarOBicho(nomeEstilo, valorEstilo, nomeDoMonstro) {
  // Rolar duas vezes e pegar o melhor resultado
  const rolagem1 = rolarEstilo(valorEstilo);
  const rolagem2 = rolarEstilo(valorEstilo);
  
  // Determinar qual rolagem teve o maior total
  const melhorRolagem = rolagem1.total >= rolagem2.total ? rolagem1 : rolagem2;
  
  // Criar elemento para exibir o resultado
  const resultadoElement = document.createElement('div');
  resultadoElement.className = 'resultado-rolagem soltar-bicho';
  
  // Construir a mensagem de resultado
  let mensagem = `<h3>SOLTOU O BICHO! - ${nomeEstilo} para ${nomeDoMonstro}</h3>`;
  mensagem += `<p><strong>Rolagem 1:</strong> ${rolagem1.total} (d6: ${rolagem1.d6.resultados.join(', ')} = ${rolagem1.d6.total}, d20: ${rolagem1.d20})</p>`;
  mensagem += `<p><strong>Rolagem 2:</strong> ${rolagem2.total} (d6: ${rolagem2.d6.resultados.join(', ')} = ${rolagem2.d6.total}, d20: ${rolagem2.d20})</p>`;
  mensagem += `<p><strong>Melhor resultado:</strong> ${melhorRolagem.total}</p>`;
  
  // Adicionar efeito especial para resultados críticos
  if (melhorRolagem.d20 === 20) {
    mensagem += `<p class="critico sucesso">SUCESSO CRÍTICO!</p>`;
  }
  
  resultadoElement.innerHTML = mensagem;
  
  // Adicionar ao container de resultados
  const resultadosContainer = document.getElementById('resultados-rolagem');
  if (resultadosContainer) {
    // Limitar a 5 resultados visíveis
    if (resultadosContainer.children.length >= 5) {
      resultadosContainer.removeChild(resultadosContainer.lastChild);
    }
    
    // Adicionar o novo resultado no topo
    resultadosContainer.insertBefore(resultadoElement, resultadosContainer.firstChild);
  }
  
  // Adicionar efeito de animação especial
  resultadoElement.classList.add('animacao-soltar-bicho');
  setTimeout(() => {
    resultadoElement.classList.remove('animacao-soltar-bicho');
  }, 1500);
}

// Função para adicionar listeners de clique nos estilos dos monstros
function adicionarListenersEstilos() {
  // Selecionar todos os elementos de estilo na visualização detalhada
  document.querySelectorAll('.estilo-item').forEach(estiloElement => {
    estiloElement.addEventListener('click', function() {
      // Obter dados do estilo
      const nomeEstilo = this.querySelector('.estilo-nome').textContent;
      const valorEstilo = parseInt(this.querySelector('.estilo-valor').textContent);
      const nomeDoMonstro = document.querySelector('.detalhes-monstro-nome').textContent;
      
      // Realizar a rolagem
      const resultado = rolarEstilo(valorEstilo);
      
      // Exibir o resultado
      exibirResultadoRolagem(resultado, nomeEstilo, nomeDoMonstro);
    });
    
    // Adicionar classe para indicar que é clicável
    estiloElement.classList.add('clicavel');
  });
}

// Adicionar estilos CSS para os resultados de rolagem
function adicionarEstilosCSS() {
  const style = document.createElement('style');
  style.textContent = `
    #resultados-rolagem {
      margin-top: 20px;
      padding: 10px;
      background-color: rgba(0, 0, 0, 0.05);
      border-radius: 8px;
      max-width: 600px;
    }
    
    .resultado-rolagem {
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 10px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }
    
    .resultado-rolagem h3 {
      margin-top: 0;
      color: #333;
      border-bottom: 1px solid #eee;
      padding-bottom: 8px;
    }
    
    .resultado-rolagem p {
      margin: 8px 0;
    }
    
    .critico {
      font-weight: bold;
      padding: 5px;
      border-radius: 4px;
      text-align: center;
    }
    
    .critico.sucesso {
      background-color: #d4edda;
      color: #155724;
    }
    
    .critico.falha {
      background-color: #f8d7da;
      color: #721c24;
    }
    
    .btn-soltar-bicho {
      background-color: #dc3545;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      margin-top: 10px;
      transition: background-color 0.3s;
    }
    
    .btn-soltar-bicho:hover {
      background-color: #c82333;
    }
    
    .animacao-rolagem {
      animation: pulse 1s;
    }
    
    .animacao-soltar-bicho {
      animation: shake 0.8s;
      background-color: #ffecec;
    }
    
    .soltar-bicho {
      border: 2px solid #dc3545;
      background-color: #fff5f5;
    }
    
    .estilo-item.clicavel {
      cursor: pointer;
      transition: background-color 0.3s;
      position: relative;
    }
    
    .estilo-item.clicavel:hover {
      background-color: #f8f9fa;
    }
    
    .estilo-item.clicavel:after {
      content: "🎲";
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      opacity: 0.5;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    @keyframes shake {
      0% { transform: translateX(0); }
      10% { transform: translateX(-5px); }
      20% { transform: translateX(5px); }
      30% { transform: translateX(-5px); }
      40% { transform: translateX(5px); }
      50% { transform: translateX(-5px); }
      60% { transform: translateX(5px); }
      70% { transform: translateX(-5px); }
      80% { transform: translateX(5px); }
      90% { transform: translateX(-5px); }
      100% { transform: translateX(0); }
    }
  `;
  document.head.appendChild(style);
}

// Inicializar a funcionalidade de rolagem quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
  adicionarEstilosCSS();
  
  // Verificar se estamos na página de detalhes de um monstro
  if (document.querySelector('.detalhes-monstro')) {
    adicionarListenersEstilos();
  }
  
  // Adicionar listener para quando um monstro for carregado dinamicamente
  document.addEventListener('monstroCarregado', function() {
    adicionarListenersEstilos();
  });
});

// Exportar funções para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    rolarDado,
    rolarMultiplosDados,
    rolarEstilo,
    soltarOBicho
  };
}
