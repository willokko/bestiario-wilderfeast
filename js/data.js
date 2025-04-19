/**
 * Arquivo para carregamento de dados do bestiário
 */

// Função para carregar dados do bestiário
async function loadBestiarioData() {
    try {
        const response = await fetch('bestiario_data/bestiario.json');
        if (!response.ok) {
            throw new Error('Falha ao carregar dados do bestiário');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao carregar dados do bestiário:', error);
        showError('Erro ao carregar dados do bestiário. Por favor, recarregue a página.');
        return [];
    }
}

// Função para carregar dados dos traços
async function loadTracosData() {
    try {
        const response = await fetch('bestiario_data/tracos_dropdown.json');
        if (!response.ok) {
            throw new Error('Falha ao carregar dados dos traços');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao carregar dados dos traços:', error);
        return { tracos: [], categorias: {} };
    }
}

// Criar um mapa de traços para fácil acesso
async function createTracosMap() {
    const tracosData = await loadTracosData();
    const tracosMap = {};
    
    if (tracosData && tracosData.tracos) {
        tracosData.tracos.forEach(traco => {
            tracosMap[traco.id] = traco;
        });
    }
    
    return tracosMap;
}
