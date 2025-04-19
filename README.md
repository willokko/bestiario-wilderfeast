# Bestiário WilderFeast

Este é um site de bestiário para o jogo WilderFeast, desenvolvido para facilitar a consulta de monstros durante as sessões de jogo.

## Funcionalidades

- **Visualização em Cards**: Todos os monstros são exibidos em cards na página inicial, facilitando a navegação
- **Busca de Monstros**: Busque monstros por nome, linhagem ou habitat
- **Visualização Detalhada**: Clique em um card para ver todos os detalhes do monstro
- **Traços em Dropdown**: Os traços dos monstros são exibidos em formato dropdown para facilitar a leitura
- **Suporte para Imagens**: Cada monstro tem um campo para imagem que pode ser preenchido manualmente
- **Design Responsivo**: O site funciona bem em dispositivos móveis e desktop

## Como Usar

1. Abra o arquivo `index.html` em qualquer navegador moderno
2. Navegue pelos cards de monstros na página inicial
3. Use a barra de busca para encontrar monstros específicos
4. Clique em um card para ver todos os detalhes do monstro
5. Na visualização detalhada, clique nos traços para expandir/recolher suas descrições
6. Use o botão "Voltar" para retornar à visualização em grade

## Personalização

### Adicionando Imagens

Para adicionar imagens aos monstros, edite o arquivo `bestiario_data/bestiario.json` e preencha o campo `imagem_url` com o caminho para a imagem desejada. Recomendamos criar uma pasta `img/monstros/` e armazenar as imagens lá.

Exemplo:
```json
{
  "id": 1,
  "nome": "ASEWA",
  "imagem_url": "img/monstros/asewa.jpg",
  ...
}
```

### Adicionando Novos Monstros

Para adicionar novos monstros, edite o arquivo `bestiario_data/bestiario.json` e adicione um novo objeto seguindo o formato existente. Certifique-se de atribuir um ID único para cada monstro.

## Estrutura de Arquivos

- `index.html`: Página principal do site
- `css/`: Estilos do site
  - `styles.css`: Estilos principais
  - `responsive.css`: Estilos para responsividade
  - `enhancements.css`: Melhorias visuais e animações
- `js/`: Scripts JavaScript
  - `app.js`: Controlador principal da aplicação
  - `bestiario.js`: Funções para gerenciamento do bestiário
  - `data.js`: Funções para carregamento de dados
  - `dropdown_tracos.js`: Sistema de dropdown para traços
  - `tracos.js`: Funções para gerenciamento de traços
  - `utils.js`: Funções utilitárias
  - `visualizacao_detalhada.js`: Funções para visualização detalhada
  - `testes.js`: Testes automatizados
- `bestiario_data/`: Dados do bestiário
  - `bestiario.json`: Dados dos monstros
  - `tracos_dropdown.json`: Dados dos traços com suporte para dropdown

## Requisitos Técnicos

- Navegador moderno com suporte a JavaScript ES6+
- Não requer conexão com internet (funciona offline)
- Não requer instalação de dependências externas

## Desenvolvimento

Este site foi desenvolvido usando HTML, CSS e JavaScript puro, sem dependências externas. Os dados são carregados de arquivos JSON locais e armazenados em memória durante a execução.

Para modificar o código, basta editar os arquivos correspondentes. O site usa uma arquitetura modular, com cada funcionalidade em seu próprio arquivo JavaScript.

---

Desenvolvido com base no manual WilderFeast Corebook.
