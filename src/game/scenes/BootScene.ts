import Phaser from 'phaser';

// Esta função cria e retorna a cena de inicialização do jogo
// É responsável por carregar todos os recursos antes do jogo começar
export const createBootScene = () => {
  // Classe que representa a cena de carregamento
  class BootScene extends Phaser.Scene {
    constructor() {
      // Define o nome/chave desta cena como 'BootScene'
      super({ key: 'BootScene' });
    }

    // Função que roda automaticamente para carregar recursos
    preload() {
      // Pega as dimensões da tela do jogo
      const width = this.cameras.main.width;
      const height = this.cameras.main.height;
      
      // Cria o texto "Carregando..." no centro da tela
      const loadingText = this.make.text({
        x: width / 2,           // Centralizado horizontalmente
        y: height / 2 - 50,     // Um pouco acima do centro
        text: 'Carregando...',
        style: {
          font: '20px monospace', // Fonte monoespaçada tamanho 20
          color: '#ffffff'        // Cor branca
        }
      });
      // Centraliza o texto usando seu próprio centro como referência
      loadingText.setOrigin(0.5, 0.5);
      
      // Cria o fundo da barra de progresso (retângulo cinza escuro)
      const progressBox = this.add.graphics();
      progressBox.fillStyle(0x222222, 0.8); // Cor cinza escura com 80% opacidade
      progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50); // Retângulo centralizado
      
      // Cria a barra de progresso que vai crescer conforme carrega
      const progressBar = this.add.graphics();
      
      // Configura o que acontece durante o carregamento
      this.load.on('progress', (value: number) => {
        // Limpa a barra anterior
        progressBar.clear();
        
        // Desenha a barra verde que cresce de 0 a 100%
        progressBar.fillStyle(0x00ff00, 1); // Verde sólido
        progressBar.fillRect(
          width / 2 - 150,    // Posição X (um pouco dentro do fundo)
          height / 2 - 15,    // Posição Y (um pouco dentro do fundo)
          300 * value,        // Largura cresce com o progresso (0 a 300 pixels)
          30                  // Altura fixa
        );
      });
      
      // Configura o que acontece quando termina de carregar
      this.load.on('complete', () => {
        // Remove os elementos visuais do carregamento
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        
        // Cria as animações dos personagens
        this.createAnimations();
        
        // Inicia a cena principal do jogo
        this.scene.start('MainScene');
      });
      
      // Chama a função que carrega todos os recursos
      this.loadAssets();
    }

    // Função que carrega todos os arquivos necessários para o jogo
    loadAssets() {
      // Carrega as imagens do personagem principal (agente de saúde)
      // Spritesheet = imagem com vários frames de animação
      this.load.spritesheet('agent', 
        '/src/assets/agent.png',
        { frameWidth: 408, frameHeight: 612 } // Tamanho de cada frame
      );

      // Carrega sprite do agente visto de costas
      this.load.spritesheet('back_agent', 
        '/src/assets/back_agent.png',
        { frameWidth: 408, frameHeight: 612 }
      );

      // Carrega sprite do agente visto de frente
      this.load.spritesheet('front_agent', 
        '/src/assets/front_agent.png',
        { frameWidth: 408, frameHeight: 612 }
      );
      
      // Carrega as imagens do mosquito
      this.load.spritesheet('mosquito', 
        '/src/assets/mosquito1.png',
        { frameWidth: 511, frameHeight: 511 } // Cada frame do mosquito
      );
      
      // Carrega imagem do fundo (grama)
      this.load.image('grass', '/src/assets/grass.png');

      // Carrega imagens dos locais de reprodução (criadouros)
      this.load.image('tire', '/src/assets/breeding_tire.png');              // Pneu
      this.load.image('waterContainer', '/src/assets/breeding_plant.png');   // Vaso
      this.load.image('plant', '/src/assets/breeding_plant.png');            // Planta
      
      // Carrega elementos da interface do usuário
      this.load.image('heart', '/src/assets/heart.png');  // Ícone de vida/saúde

      // Carrega botão de spray (inseticida)
      this.load.image('spray', '/src/assets/spray.png');
    }

    // Função que cria todas as animações usando os sprites carregados
    createAnimations() {
      // Animação do jogador andando para a esquerda
      this.anims.create({
        key: 'left',                    // Nome da animação
        frames: this.anims.generateFrameNumbers('agent', { start: 0, end: 3 }), // Usa frames 0,1,2,3
        frameRate: 10,                  // 10 frames por segundo
        repeat: -1                      // Repete infinitamente
      });
      
      // Animação do jogador parado (apenas 1 frame)
      this.anims.create({
        key: 'turn',
        frames: [{ key: 'agent', frame: 4 }], // Apenas o frame 4
        frameRate: 20
      });
      
      // Animação do jogador andando para a direita
      this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('agent', { start: 5, end: 8 }), // Usa frames 5,6,7,8
        frameRate: 10,
        repeat: -1
      });
      
      // Animação do mosquito voando
      this.anims.create({
        key: 'fly',
        frames: this.anims.generateFrameNumbers('mosquito', { start: 0, end: 3 }), // Frames 0,1,2,3
        frameRate: 12,                  // 12 frames por segundo (um pouco mais rápido)
        repeat: -1                      // Voa continuamente
      });
    }
  }

  // Retorna a classe para ser usada pelo Phaser
  return BootScene;
}