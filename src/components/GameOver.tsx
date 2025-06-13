// Importações necessárias
import React from 'react'; // Biblioteca principal do React
import { useGameContext } from '../context/GameContext'; // Hook para acessar dados globais do jogo
import { Home, RotateCcw } from 'lucide-react'; // Ícones prontos da biblioteca Lucide

// Define que tipo de informações este componente vai receber
interface GameOverProps {
  score: number; // Pontuação atual do jogador
  won: boolean; // Se o jogador ganhou (true) ou perdeu (false)
  onPlayAgain: () => void; // Função que será executada quando clicar em "Jogar Novamente"
  onBackToMenu: () => void; // Função que será executada quando clicar em "Menu Principal"
}

// Componente que mostra a tela de fim de jogo
const GameOver: React.FC<GameOverProps> = ({ score, won, onPlayAgain, onBackToMenu }) => {
  // Pega a melhor pontuação e a função para atualizá-la do contexto global
  const { highScore, updateHighScore } = useGameContext();
  
  // useEffect executa quando o componente é carregado ou quando 'score' muda
  React.useEffect(() => {
    // Atualiza a melhor pontuação se a pontuação atual for maior
    updateHighScore(score);
  }, [score, updateHighScore]); // Executa novamente se score ou updateHighScore mudarem

  return (
    /* Container principal da tela de fim de jogo */
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 text-center">
      
      {/* Título que muda cor e texto dependendo se ganhou ou perdeu */}
      <h1 className={`text-3xl font-bold mb-6 ${won ? 'text-green-600' : 'text-red-600'}`}>
        {won ? 'Você Venceu!' : 'Missão Falhou!'}
      </h1>
      
      {/* Seção com imagem e mensagem de resultado */}
      <div className="mb-6">
        {/* Imagem que muda dependendo do resultado */}
        <img 
          src={won 
            ? 'assets/missao_dengue_vitoria.webp'  // Imagem de vitória
            : 'assets/missao_dengue_derrota.png'   // Imagem de derrota
          } 
          alt={won ? "Vitória" : "Derrota"} // Texto alternativo para acessibilidade
          className="w-full h-48 object-cover rounded-lg mb-4" 
        />
        
        {/* Mensagem que muda dependendo do resultado */}
        <p className="text-gray-700">
          {won 
            ? 'Parabéns! Você eliminou todos os focos de dengue e ajudou a proteger a comunidade!' 
            : 'Não desanime! A luta contra a dengue continua. Tente novamente!'}
        </p>
      </div>
      
      {/* Caixa que mostra as pontuações */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          {/* Pontuação atual */}
          <div>
            <p className="text-gray-700">Sua pontuação:</p>
            <p className="text-2xl font-bold text-blue-600">{score}</p>
          </div>
          {/* Melhor pontuação (recorde) */}
          <div>
            <p className="text-gray-700">Melhor pontuação:</p>
            <p className="text-2xl font-bold text-green-600">{highScore}</p>
          </div>
        </div>
      </div>
      
      {/* Botões de ação */}
      <div className="flex justify-center gap-4 mt-8">
        {/* Botão para jogar novamente */}
        <button
          onClick={onPlayAgain} // Executa a função recebida como props
          className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg transition duration-200"
        >
          <RotateCcw className="mr-2" size={18} /> {/* Ícone de "reiniciar" */}
          Jogar Novamente
        </button>
        
        {/* Botão para voltar ao menu */}
        <button
          onClick={onBackToMenu} // Executa a função recebida como props
          className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg transition duration-200"
        >
          <Home className="mr-2" size={18} /> {/* Ícone de "casa" */}
          Menu Principal
        </button>
      </div>
      
      {/* Seção educativa sobre dengue */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Você Sabia?</h3>
        <p className="text-sm text-gray-600">
          A eliminação de criadouros do mosquito Aedes aegypti é a forma mais eficaz de prevenir 
          doenças como dengue, zika e chikungunya. Sempre verifique se há água parada em sua casa!
        </p>
      </div>
    </div>
  );
};

// Exporta o componente para ser usado em outros lugares
export default GameOver;