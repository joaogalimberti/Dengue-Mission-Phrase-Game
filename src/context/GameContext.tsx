// Importações necessárias do React
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define a estrutura dos dados que vão ser compartilhados globalmente
interface GameContextType {
  sound: boolean; // Se o som está ligado ou desligado
  toggleSound: () => void; // Função para ligar/desligar o som
  difficulty: 'easy' | 'medium' | 'hard'; // Nível de dificuldade atual
  setDifficulty: (level: 'easy' | 'medium' | 'hard') => void; // Função para mudar a dificuldade
  highScore: number; // Maior pontuação já alcançada
  updateHighScore: (score: number) => void; // Função para atualizar o recorde
}

// Cria o contexto React - inicialmente é undefined porque ainda não tem valor
const GameContext = createContext<GameContextType | undefined>(undefined);

// Hook personalizado para usar o contexto de forma segura
export const useGameContext = () => {
  // Pega o valor atual do contexto
  const context = useContext(GameContext);
  
  // Se o contexto for undefined, significa que o hook está sendo usado fora do Provider
  if (!context) {
    throw new Error('useGameContext must be used within a GameContextProvider');
  }
  
  // Retorna o contexto se tudo estiver correto
  return context;
};

// Define o tipo das props que o Provider vai receber
interface GameContextProviderProps {
  children: ReactNode; // Todos os componentes filhos que vão ter acesso ao contexto
}

// Componente Provider que vai fornecer os dados globais para toda a aplicação
export const GameContextProvider: React.FC<GameContextProviderProps> = ({ children }) => {
  // Estados locais que vão ser compartilhados globalmente
  
  // Estado para controlar se o som está ligado (começa ligado)
  const [sound, setSound] = useState(true);
  
  // Estado para controlar a dificuldade (começa no médio)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  
  // Estado para guardar a maior pontuação (começa em 0)
  const [highScore, setHighScore] = useState(0);

  // Função para alternar entre som ligado/desligado
  const toggleSound = () => {
    setSound(!sound); // Inverte o valor atual (true vira false, false vira true)
  };

  // Função para atualizar o recorde apenas se a nova pontuação for maior
  const updateHighScore = (score: number) => {
    if (score > highScore) {
      setHighScore(score); // Só atualiza se for realmente um novo recorde
    }
  };

  // Objeto que contém todos os valores e funções que serão compartilhados
  const value = {
    sound,          // Valor atual do som
    toggleSound,    // Função para alternar som
    difficulty,     // Valor atual da dificuldade
    setDifficulty,  // Função para mudar dificuldade
    highScore,      // Valor atual do recorde
    updateHighScore // Função para atualizar recorde
  };

  // Retorna o Provider que "envolve" todos os componentes filhos
  // Todos os componentes dentro de {children} vão poder acessar esses dados
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};