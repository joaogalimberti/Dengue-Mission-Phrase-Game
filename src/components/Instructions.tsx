// Importações necessárias
import React from 'react'; // Biblioteca principal do React
// Ícones da biblioteca Lucide para deixar a interface mais visual e intuitiva
import { ArrowLeft, Gamepad2, Heart, Target, Timer, Trophy, Zap } from 'lucide-react';

// Define que tipo de informação este componente vai receber
interface InstructionsProps {
  onBack: () => void; // Função que será executada quando o usuário quiser voltar ao menu
}

// Componente que mostra as instruções do jogo
const Instructions: React.FC<InstructionsProps> = ({ onBack }) => {
  return (
    /* Container principal com scroll para caso o conteúdo seja muito grande */
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      
      {/* Cabeçalho com botão de voltar e título */}
      <div className="flex justify-between items-center mb-6">
        {/* Botão de voltar com ícone de seta */}
        <button 
          onClick={onBack} // Executa a função para voltar ao menu
          className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition"
        >
          <ArrowLeft size={20} />
        </button>
        
        {/* Título centralizado */}
        <h1 className="text-2xl font-bold text-blue-600 flex-1 text-center">Instruções do Jogo</h1>
      </div>
      
      {/* Container com espaçamento entre as seções */}
      <div className="space-y-6">
        
        {/* SEÇÃO 1: Controles do jogo */}
        <section>
          <h2 className="text-xl font-semibold text-blue-700 flex items-center mb-2">
            <Gamepad2 className="mr-2 text-blue-500" /> Controles
          </h2>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex flex-col md:flex-row gap-4">
              
              {/* Explicação sobre movimento */}
              <div className="flex-1">
                <p className="font-semibold mb-1">Movimento:</p>
                <p>Use as setas do teclado para mover o agente de saúde</p>
                {/* Representação visual das teclas direcionais */}
                <div className="flex justify-center mt-2">
                  <div className="grid grid-cols-3 gap-1">
                    <div></div> {/* Espaço vazio para formar o layout das setas */}
                    <div className="bg-gray-300 p-2 rounded text-center">↑</div>
                    <div></div>
                    <div className="bg-gray-300 p-2 rounded text-center">←</div>
                    <div className="bg-gray-300 p-2 rounded text-center">↓</div>
                    <div className="bg-gray-300 p-2 rounded text-center">→</div>
                  </div>
                </div>
              </div>
              
              {/* Explicação sobre ações */}
              <div className="flex-1">
                <p className="font-semibold mb-1">Ações:</p>
                <p>Pressione a barra de espaço para usar o spray repelente</p>
                {/* Representação visual da barra de espaço */}
                <div className="bg-gray-300 p-2 rounded text-center mt-2">
                  Barra de espaço
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* SEÇÃO 2: Objetivos do jogo */}
        <section>
          <h2 className="text-xl font-semibold text-blue-700 flex items-center mb-2">
            <Target className="mr-2 text-blue-500" /> Objetivos
          </h2>
          <div className="bg-green-50 p-4 rounded-lg">
            {/* Lista dos objetivos principais */}
            <ul className="list-disc pl-5 space-y-2">
              <li>Elimine todos os focos de dengue no cenário</li>
              <li>Mate os mosquitos Aedes aegypti antes que eles piquem você</li>
              <li>Complete a missão antes que o tempo acabe</li>
            </ul>
          </div>
        </section>
        
        {/* SEÇÃO 3: Sistema de pontuação */}
        <section>
          <h2 className="text-xl font-semibold text-blue-700 flex items-center mb-2">
            <Trophy className="mr-2 text-blue-500" /> Pontuação
          </h2>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <ul className="space-y-2">
              {/* Item de pontuação com ícone visual */}
              <li className="flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">+5</span>
                Eliminar um foco de dengue
              </li>
              <li className="flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">+2</span>
                Matar um mosquito
              </li>
            </ul>
          </div>
        </section>
        
        {/* SEÇÃO 4: Sistema de vida */}
        <section>
          <h2 className="text-xl font-semibold text-blue-700 flex items-center mb-2">
            <Heart className="mr-2 text-red-500" /> Vida
          </h2>
          <div className="bg-red-50 p-4 rounded-lg">
            <ul className="list-disc pl-5 space-y-2">
              <li>Você começa com 5 corações de vida</li>
              <li>Perde um coração cada vez que um mosquito te pica</li>
              <li>Se perder todos os corações, é fim de jogo</li>
            </ul>
            {/* Representação visual dos 5 corações */}
            <div className="flex mt-2">
              {[...Array(5)].map((_, i) => (
                <Heart key={i} className="text-red-500 fill-red-500 mr-1" size={20} />
              ))}
            </div>
          </div>
        </section>
        
        {/* SEÇÃO 5: Sistema de tempo */}
        <section>
          <h2 className="text-xl font-semibold text-blue-700 flex items-center mb-2">
            <Timer className="mr-2 text-blue-500" /> Tempo
          </h2>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p>Você tem 3 minutos para completar a missão!</p>
            <p className="mt-2">Com o tempo, mais mosquitos aparecem, tornando o jogo mais difícil.</p>
          </div>
        </section>
        
        {/* SEÇÃO 6: Dicas estratégicas */}
        <section>
          <h2 className="text-xl font-semibold text-blue-700 flex items-center mb-2">
            <Zap className="mr-2 text-blue-500" /> Dicas
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ul className="list-disc pl-5 space-y-2">
              <li>Priorize eliminar os focos, pois eles geram mais mosquitos</li>
              <li>Use o spray com sabedoria, pois ele tem um tempo de recarga</li>
              <li>Fique atento aos mosquitos que se aproximam de você</li>
              <li>Tente criar uma estratégia para limpar áreas do mapa sistematicamente</li>
            </ul>
          </div>
        </section>
      </div>
      
      {/* Botão final para voltar ao menu */}
      <div className="mt-8 text-center">
        <button
          onClick={onBack} // Mesma função do botão do cabeçalho
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition duration-200"
        >
          Voltar ao Menu
        </button>
      </div>
    </div>
  );
};

// Exporta o componente para uso em outros arquivos
export default Instructions;