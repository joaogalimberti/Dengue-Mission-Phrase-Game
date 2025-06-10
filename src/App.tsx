import React, { useEffect, useState } from 'react';
import Game from './components/Game';
import MainMenu from './components/MainMenu';
import Instructions from './components/Instructions';
import GameOver from './components/GameOver';
import { GameContextProvider } from './context/GameContext';

// === DEFINIÇÃO DOS ESTADOS POSSÍVEIS DO JOGO ===
// Define quais "telas" o jogo pode mostrar
export type GameState = 'menu' | 'instructions' | 'playing' | 'gameOver';
// 'menu' = tela inicial
// 'instructions' = tela de instruções
// 'playing' = jogando
// 'gameOver' = tela de fim de jogo

// === COMPONENTE PRINCIPAL DA APLICAÇÃO ===
// Este é o "cérebro" que controla qual tela mostrar e quando
function App() {
  // === ESTADOS (VARIÁVEIS QUE PODEM MUDAR) ===
  // Estado atual do jogo (qual tela está sendo mostrada)
  const [gameState, setGameState] = useState<GameState>('menu'); // Começa no menu
  
  // Pontuação do jogador
  const [score, setScore] = useState(0); // Começa com 0 pontos
  
  // Se o jogador ganhou ou perdeu
  const [won, setWon] = useState(false); // Começa como false (não ganhou)

  // === FUNÇÕES PARA MUDAR DE TELA ===
  // Cada função é responsável por levar o jogador para uma tela diferente
  
  // Função chamada quando o jogador quer começar a jogar
  const handleStartGame = () => {
    setGameState('playing');  // Muda para a tela de jogo
    setScore(0);             // Reseta a pontuação para 0
  };

  // Função chamada quando o jogador quer ver as instruções
  const handleShowInstructions = () => {
    setGameState('instructions'); // Muda para a tela de instruções
  };

  // Função chamada quando o jogador quer voltar ao menu principal
  const handleBackToMenu = () => {
    setGameState('menu'); // Muda para a tela do menu
  };

  // Função chamada quando o jogo termina (vitória ou derrota)
  const handleGameOver = (finalScore: number, isVictory: boolean) => {
    setScore(finalScore);      // Guarda a pontuação final
    setWon(isVictory);         // Guarda se ganhou (true) ou perdeu (false)
    setGameState('gameOver');  // Muda para a tela de fim de jogo
  };

  // === RENDERIZAÇÃO (O QUE APARECE NA TELA) ===
  return (
    // Provedor de contexto: permite que todos os componentes filhos compartilhem dados
    <GameContextProvider>
      {/* Container principal com fundo azul degradê (céu) */}
      <div className="w-full h-screen bg-gradient-to-b from-sky-400 to-sky-600 flex justify-center items-center">
        
        {/* === RENDERIZAÇÃO CONDICIONAL ===
            Mostra diferentes componentes baseado no estado atual do jogo */}
        
        {/* Se o estado é 'menu', mostra o menu principal */}
        {gameState === 'menu' && (
          <MainMenu 
            onStartGame={handleStartGame}           // Passa a função de iniciar jogo
            onShowInstructions={handleShowInstructions} // Passa a função de mostrar instruções
          />
        )}
        
        {/* Se o estado é 'instructions', mostra as instruções */}
        {gameState === 'instructions' && (
          <Instructions 
            onBack={handleBackToMenu}  // Passa a função de voltar ao menu
          />
        )}
        
        {/* Se o estado é 'playing', mostra o jogo em si */}
        {gameState === 'playing' && (
          <Game 
            onGameOver={handleGameOver}  // Passa a função de fim de jogo
          />
        )}
        
        {/* Se o estado é 'gameOver', mostra a tela de fim de jogo */}
        {gameState === 'gameOver' && (
          <GameOver 
            score={score}                    // Passa a pontuação final
            won={won}                        // Passa se ganhou ou perdeu
            onPlayAgain={handleStartGame}    // Passa a função de jogar novamente
            onBackToMenu={handleBackToMenu}  // Passa a função de voltar ao menu
          />
        )}
      </div>
    </GameContextProvider>
  );
}

// Exporta o componente para ser usado em outras partes da aplicação
export default App;