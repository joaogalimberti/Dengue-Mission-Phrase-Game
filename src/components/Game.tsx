// Importa as bibliotecas necessárias
import React, { useEffect, useRef } from 'react'; // React e hooks para gerenciar estado e efeitos
import Phaser from 'phaser'; // Biblioteca para criar jogos 2D
import { useGameContext } from '../context/GameContext'; // Hook customizado para acessar configurações do jogo
import { createMainScene } from '../game/scenes/MainScene'; // Função que cria a cena principal do jogo
import { createBootScene } from '../game/scenes/BootScene'; // Função que cria a cena de inicialização
import { createUIScene } from '../game/scenes/UIScene'; // Função que cria a cena da interface do usuário

// Define o tipo das propriedades que o componente vai receber
interface GameProps {
  onGameOver: (score: number, won: boolean) => void; // Função que será chamada quando o jogo terminar
}

// Componente principal que vai renderizar o jogo
const Game: React.FC<GameProps> = ({ onGameOver }) => {
  // Cria uma referência para guardar a instância do jogo Phaser
  // useRef permite manter um valor que não causa re-renderização quando muda
  const gameRef = useRef<Phaser.Game | null>(null);
  
  // Cria uma referência para o elemento HTML que vai conter o jogo
  const gameContainerRef = useRef<HTMLDivElement>(null);
  
  // Pega as configurações do jogo (som e dificuldade) do contexto global
  const { sound, difficulty } = useGameContext();
  
  // useEffect executa código quando o componente é montado ou quando suas dependências mudam
  useEffect(() => {
    // Se não existe o container HTML, sai da função
    if (!gameContainerRef.current) return;
    
    // Configura as opções do jogo Phaser
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO, // Deixa o Phaser escolher automaticamente WebGL ou Canvas
      width: 800, // Largura do jogo em pixels
      height: 600, // Altura do jogo em pixels
      parent: gameContainerRef.current, // Onde o jogo será inserido no HTML
      
      // Configurações da física do jogo
      physics: {
        default: 'arcade', // Usa o sistema de física arcade (mais simples e rápido)
      },
      
      // Lista das cenas que o jogo vai usar, na ordem que serão carregadas
      scene: [
        createBootScene(), // Cena de inicialização (carrega recursos)
        createMainScene({ onGameOver, difficulty, sound }), // Cena principal do jogo
        createUIScene() // Cena da interface (HUD, menus, etc.)
      ],
      
      // Configurações de áudio
      audio: {
        disableWebAudio: false, // Permite usar Web Audio API
        noAudio: !sound // Desabilita áudio se a configuração de som estiver desligada
      },
      
      pixelArt: true, // Otimiza para gráficos pixel art (evita suavização)
      
      // Configurações de escala/redimensionamento
      scale: {
        mode: Phaser.Scale.FIT, // Ajusta o jogo para caber na tela mantendo proporção
        autoCenter: Phaser.Scale.CENTER_BOTH // Centraliza o jogo horizontal e verticalmente
      }
    };
    
    // Cria uma nova instância do jogo Phaser com as configurações definidas
    gameRef.current = new Phaser.Game(config);
    
    // Função de limpeza que executa quando o componente é desmontado
    return () => {
      // Se existe uma instância do jogo, destrói ela para liberar memória
      if (gameRef.current) {
        gameRef.current.destroy(true); // true = remove também o canvas do DOM
        gameRef.current = null; // Limpa a referência
      }
    };
  }, [onGameOver, difficulty, sound]); // Executa novamente se essas variáveis mudarem
  
  // Renderiza o HTML do componente
  return (
    /* Container principal com estilização Tailwind CSS */
    <div className="w-full h-full max-w-4xl flex justify-center items-center bg-black rounded-lg shadow-xl overflow-hidden">
      {/* Div que vai conter o canvas do jogo Phaser */}
      <div ref={gameContainerRef} className="w-full h-full" />
    </div>
  );
};

// Exporta o componente para ser usado em outros arquivos
export default Game;