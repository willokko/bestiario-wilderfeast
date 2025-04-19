/**
 * Implementação do sistema de rolagem de dados com toaster
 */

// Função para rolar um dado de n faces
function rolarDado(faces) {
    return Math.floor(Math.random() * faces) + 1;
  }
  
  // Função para rolar múltiplos dados
  function rolarMultiplosDados(quantidade, faces) {
    const resultados = [];
    
    for (let i = 0; i < quantidade; i++) {
      const resultado = rolarDado(faces);
      resultados.push(resultado);
    }
    
    return resultados;
  }
  
  // Função principal para rolar dados baseado no estilo do monstro
  function rolarEstilo(valorEstilo) {
    // Rolar d6 em quantidade igual ao valor do estilo
    const resultadosD6 = rolarMultiplosDados(valorEstilo, 6);
    
    // Rolar 1d20
    const resultadoD20 = rolarDado(20);
    
    return {
      d6: {
        quantidade: valorEstilo,
        resultados: resultadosD6
      },
      d20: resultadoD20
    };
  }
  
  // Função para exibir o resultado da rolagem em um toaster
  function exibirResultadoRolagemToaster(resultado, nomeEstilo, nomeDoMonstro) {
    // Criar o toaster container se não existir
    let toasterContainer = document.getElementById('dice-toaster-container');
    if (!toasterContainer) {
      toasterContainer = document.createElement('div');
      toasterContainer.id = 'dice-toaster-container';
      document.body.appendChild(toasterContainer);
    }
    
    // Criar o toaster
    const toaster = document.createElement('div');
    toaster.className = 'dice-toaster';
    
    // Determinar se é crítico
    const isCriticoSucesso = resultado.d20 === 20;
    const isCriticoFalha = resultado.d20 === 1;
    
    if (isCriticoSucesso) {
      toaster.classList.add('critical-success');
    } else if (isCriticoFalha) {
      toaster.classList.add('critical-fail');
    }
    
    // Construir o conteúdo do toaster
    let toasterContent = `
      <div class="toaster-header">
        <h3>Rolagem de ${nomeEstilo}</h3>
        <span class="toaster-monster"></span>
        <button class="toaster-close">&times;</button>
      </div>
      <div class="toaster-body">
        <div class="dice-results">
          <div class="d20-result">
            <div class="dice d20 ${isCriticoSucesso ? 'success' : isCriticoFalha ? 'fail' : ''}">
              ${resultado.d20}
            </div>
            <span class="dice-label">d20</span>
          </div>
          <div class="d6-results">
    `;
    
    // Adicionar cada d6
    resultado.d6.resultados.forEach(valor => {
      toasterContent += `
        <div class="dice d6">${valor}</div>
      `;
    });
    
    toasterContent += `
          </div>
          <div class="dice-label d6-label">${resultado.d6.quantidade}d6</div>
        </div>
    `;
    
    // Adicionar mensagem de crítico se aplicável
    if (isCriticoSucesso) {
      toasterContent += `<div class="critical-message success">SUCESSO CRÍTICO!</div>`;
    } else if (isCriticoFalha) {
      toasterContent += `<div class="critical-message fail">FALHA CRÍTICA!</div>`;
    }
    
    toasterContent += `
      </div>
    `;
    
    // Definir o conteúdo do toaster
    toaster.innerHTML = toasterContent;
    
    // Adicionar evento para fechar o toaster
    toaster.querySelector('.toaster-close').addEventListener('click', () => {
      toaster.classList.add('closing');
      setTimeout(() => {
        toaster.remove();
      }, 300);
    });
    
    // Adicionar o toaster ao container
    toasterContainer.appendChild(toaster);
    
    // Remover o toaster após um tempo
    setTimeout(() => {
      if (toaster.parentNode) {
        toaster.classList.add('closing');
        setTimeout(() => {
          if (toaster.parentNode) {
            toaster.remove();
          }
        }, 300);
      }
    }, 8000);
  }
  
  // Adicionar estilos CSS para o toaster
  function adicionarEstilosToaster() {
    const style = document.createElement('style');
    style.textContent = `
      #dice-toaster-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        max-width: 350px;
      }
      
      .dice-toaster {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        margin-bottom: 15px;
        overflow: hidden;
        animation: slide-in 0.3s ease;
        border-left: 4px solid #007bff;
      }
      
      .dice-toaster.closing {
        animation: slide-out 0.3s ease forwards;
      }
      
      .dice-toaster.critical-success {
        border-left: 4px solid #28a745;
      }
      
      .dice-toaster.critical-fail {
        border-left: 4px solid #dc3545;
      }
      
      .toaster-header {
        background-color: #f8f9fa;
        padding: 10px 15px;
        border-bottom: 1px solid #e9ecef;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
      }
      
      .toaster-header h3 {
        margin: 0;
        font-size: 1.1rem;
        flex-grow: 1;
      }
      
      .toaster-monster {
        font-size: 0.9rem;
        color: #6c757d;
        margin-right: 25px;
      }
      
      .toaster-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        line-height: 1;
        color: #6c757d;
        cursor: pointer;
        padding: 0;
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
      }
      
      .toaster-body {
        padding: 15px;
      }
      
      .dice-results {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 15px;
      }
      
      .d20-result {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 15px;
      }
      
      .d6-results {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 5px;
      }
      
      .dice {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      
      .dice.d20 {
        background-color: #f8f9fa;
        border: 2px solid #007bff;
        color: #007bff;
        width: 50px;
        height: 50px;
        font-size: 1.3rem;
      }
      
      .dice.d20.success {
        background-color: #d4edda;
        border-color: #28a745;
        color: #28a745;
      }
      
      .dice.d20.fail {
        background-color: #f8d7da;
        border-color: #dc3545;
        color: #dc3545;
      }
      
      .dice.d6 {
        background-color: #e9ecef;
        border: 1px solid #ced4da;
        color: #495057;
      }
      
      .dice-label {
        font-size: 0.9rem;
        color: #6c757d;
        margin-top: 5px;
      }
      
      .critical-message {
        text-align: center;
        font-weight: bold;
        padding: 8px;
        border-radius: 4px;
        margin: 10px 0;
      }
      
      .critical-message.success {
        background-color: #d4edda;
        color: #155724;
      }
      
      .critical-message.fail {
        background-color: #f8d7da;
        color: #721c24;
      }
      
      @keyframes slide-in {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes slide-out {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
      
      @media (max-width: 576px) {
        #dice-toaster-container {
          left: 10px;
          right: 10px;
          max-width: none;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Inicializar quando o DOM estiver pronto
  document.addEventListener('DOMContentLoaded', function() {
    adicionarEstilosToaster();
  });
  