// Importações necessárias
import React from 'react'; // Biblioteca principal do React
// Ícones da biblioteca Lucide para interface visual
import { AlertTriangle, Info, Play } from 'lucide-react';
import { useGameContext } from '../context/GameContext'; // Hook para acessar configurações globais do jogo

// Define que tipo de informações este componente vai receber
interface MainMenuProps {
  onStartGame: () => void; // Função que será executada quando clicar em "Jogar"
  onShowInstructions: () => void; // Função que será executada quando clicar em "Instruções"
}

// Componente do menu principal do jogo
const MainMenu: React.FC<MainMenuProps> = ({ onStartGame, onShowInstructions }) => {
  // Pega as configurações globais do jogo usando o contexto
  const {difficulty, setDifficulty } = useGameContext();

  // Função que determina o estilo visual dos botões de dificuldade
  const getDifficultyButtonClass = (level: 'easy' | 'medium' | 'hard') => {
    // Classe base que todos os botões vão ter
    const baseClass = 'px-4 py-2 rounded-md transition font-semibold';
    
    // Se o botão representa a dificuldade atual selecionada
    if (difficulty === level) {
      switch (level) {
        case 'easy':
          return `${baseClass} bg-green-500 text-white`; // Verde para fácil
        case 'medium':
          return `${baseClass} bg-yellow-500 text-white`; // Amarelo para médio
        case 'hard':
          return `${baseClass} bg-red-500 text-white`; // Vermelho para difícil
      }
    } else {
      // Se o botão NÃO é a dificuldade atual (botão não selecionado)
      switch (level) {
        case 'easy':
          return `${baseClass} bg-green-100 text-green-700 hover:bg-green-200`; // Verde claro com hover
        case 'medium':
          return `${baseClass} bg-yellow-100 text-yellow-700 hover:bg-yellow-200`; // Amarelo claro com hover
        case 'hard':
          return `${baseClass} bg-red-100 text-red-700 hover:bg-red-200`; // Vermelho claro com hover
      }
    }
  };

  return (
    /* Container principal do menu */
    <div className="flex flex-col bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 text-center">
      
      {/* Cabeçalho com ícone e título */}
      <div className="flex items-center justify-center mb-4">
        <AlertTriangle className="text-yellow-500 mr-2 h-8 w-8" /> {/* Ícone de alerta/aviso */}
        <h1 className="text-3xl font-bold text-blue-600">Missão Contra a Dengue</h1>
      </div>
      
      {/* Seção da imagem principal */}
      <div className="mb-6">
        <img 
          src="assets/first.webp" 
          alt="Missão Contra a Dengue" // Texto alternativo para acessibilidade
          className="w-full max-w-xs mx-auto rounded-lg shadow-md"
        />
      </div>
      
      {/* Descrição do jogo */}
      <p className="mb-6 text-gray-700">
        Ajude o agente de saúde a combater os focos do mosquito da dengue e salve a comunidade!
      </p>
      
      {/* Seção de seleção de dificuldade */}
      <div className="mb-8 bg-blue-50 p-4 rounded-lg">
        <h2 className="text-xl text-blue-700 font-semibold mb-2">Dificuldade</h2>
        <div className="flex justify-center gap-2">
          {/* Mapeia através dos níveis de dificuldade para criar os botões */}
          {(['easy', 'medium', 'hard'] as const).map((level) => (
            <button
              key={level} // Chave única para cada botão (necessário no React)
              onClick={() => setDifficulty(level)} // Atualiza a dificuldade quando clicado
              className={getDifficultyButtonClass(level)} // Aplica o estilo baseado na seleção
            >
              {/* Mostra o texto em português baseado no nível */}
              {level === 'easy' && 'Fácil'}
              {level === 'medium' && 'Médio'}
              {level === 'hard' && 'Difícil'}
            </button>
          ))}
        </div>
      </div>
      
      {/* Botões principais de ação, organizados lado a lado */}
      <div className="flex gap-4 mb-4">
        {/* Botão para iniciar o jogo */}
        <button
          onClick={onStartGame} // Executa a função recebida como props
          className="flex items-center justify-center text-white bg-green-500 hover:bg-green-600 py-3 px-6 rounded-lg text-lg font-semibold flex-1 transition duration-200 transform hover:scale-105"
        >
          <Play className="mr-2" /> {/* Ícone de play */}
          Jogar
        </button>
        
        {/* Botão para mostrar instruções */}
        <button
          onClick={onShowInstructions} // Executa a função recebida como props
          className="flex items-center justify-center text-white bg-blue-500 hover:bg-blue-600 py-3 px-6 rounded-lg text-lg font-semibold flex-1 transition duration-200"
        >
          <Info className="mr-2" /> {/* Ícone de informação */}
          Instruções
        </button>
      </div>
      
      {/* Rodapé com informações de copyright */}
      <p className="mt-6 text-sm text-gray-500">
        © 2025 Missão Contra a Dengue - Jogo Educativo
      </p>
    </div>
  );
};

// Exporta o componente para uso em outros arquivos
export default MainMenu;