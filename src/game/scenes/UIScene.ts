import Phaser from 'phaser';

export const createUIScene = () => {
  class UIScene extends Phaser.Scene {
    // === DECLARAÇÃO DAS VARIÁVEIS DA INTERFACE ===
    // Estas variáveis guardam todos os elementos visuais da tela
    private hearts: Phaser.GameObjects.Image[] = [];  // Array para guardar os corações (vida do jogador)
    private scoreText!: Phaser.GameObjects.Text;      // Texto que mostra a pontuação
    private timeText!: Phaser.GameObjects.Text;       // Texto que mostra o tempo restante
    private sprayButton!: Phaser.GameObjects.Image;   // Botão do spray (inseticida)
    private sprayText!: Phaser.GameObjects.Text;      // Texto do botão spray
    private sprayProgress!: Phaser.GameObjects.Graphics; // Barra de progresso do spray
    private sprayProgressBg!: Phaser.GameObjects.Graphics; // Fundo da barra de progresso
    private messageText!: Phaser.GameObjects.Text;    // Texto para mostrar mensagens temporárias
    private messageTimer?: Phaser.Time.TimerEvent;    // Cronômetro para controlar mensagens
    
    constructor() {
      super({ key: 'UIScene' }); // Define o nome desta cena como 'UIScene'
    }

    // === FUNÇÃO PRINCIPAL DE CRIAÇÃO DA INTERFACE ===
    // Esta função roda quando a cena é iniciada e cria todos os elementos visuais
    create() {
      // Conecta com a cena principal do jogo para receber informações
      const mainScene = this.scene.get('MainScene');
      
      // Cria todos os elementos da interface
      this.createScoreboard();    // Cria o placar de pontuação
      this.createTimer();         // Cria o cronômetro
      this.createHearts();        // Cria os corações (indicador de vida)
      this.createSprayButton();   // Cria o botão do spray
      this.createMessageDisplay(); // Cria o sistema de mensagens
      
      // === SISTEMA DE COMUNICAÇÃO ENTRE CENAS ===
      // Configura "escutas" para receber atualizações da cena principal
      mainScene.events.on('updateScore', this.updateScore, this);           // Escuta mudanças na pontuação
      mainScene.events.on('updateTimer', this.updateTimer, this);           // Escuta mudanças no tempo
      mainScene.events.on('updateHealth', this.updateHealth, this);         // Escuta mudanças na vida
      mainScene.events.on('updateSprayCooldown', this.updateSprayCooldown, this); // Escuta mudanças no spray
      mainScene.events.on('showMessage', this.showMessage, this);           // Escuta pedidos para mostrar mensagens
      
      // === LIMPEZA QUANDO A CENA É DESLIGADA ===
      // Remove todas as "escutas" para evitar problemas de memória
      this.events.on('shutdown', () => {
        mainScene.events.off('updateScore', this.updateScore, this);
        mainScene.events.off('updateTimer', this.updateTimer, this);
        mainScene.events.off('updateHealth', this.updateHealth, this);
        mainScene.events.off('updateSprayCooldown', this.updateSprayCooldown, this);
        mainScene.events.off('showMessage', this.showMessage, this);
      });
    }

    // === CRIAÇÃO DO PLACAR DE PONTUAÇÃO ===
    // Cria o texto que mostra quantos pontos o jogador tem
    createScoreboard() {
      this.scoreText = this.add.text(16, 16, 'Pontos: 0', { 
        fontSize: '24px',      // Tamanho da fonte
        fontFamily: 'monospace', // Tipo de fonte (letras todas do mesmo tamanho)
        color: '#ffffff',      // Cor branca
        stroke: '#000000',     // Contorno preto
        strokeThickness: 4     // Espessura do contorno
      });
    }

    // === CRIAÇÃO DO CRONÔMETRO ===
    // Cria o texto que mostra quanto tempo resta no jogo
    createTimer() {
      this.timeText = this.add.text(this.cameras.main.width - 16, 16, '3:00', { 
        fontSize: '24px',
        fontFamily: 'monospace',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4 
      });
      this.timeText.setOrigin(1, 0); // Alinha o texto à direita da tela
    }

    // === CRIAÇÃO DOS CORAÇÕES (INDICADOR DE VIDA) ===
    // Cria 5 corações que mostram a vida do jogador
    createHearts() {
      for (let i = 0; i < 5; i++) { // Cria 5 corações
        const heart = this.add.image(
          this.cameras.main.width / 2 - 80 + i * 40, // Posição X: centralizado, com espaçamento de 40 pixels
          30,    // Posição Y: 30 pixels do topo
          'heart' // Usa a imagem chamada 'heart'
        );
        heart.setScale(0.11); // Diminui o tamanho para 11% do original
        this.hearts.push(heart); // Adiciona o coração ao array de corações
      }
    }

    // === CRIAÇÃO DO BOTÃO DO SPRAY ===
    // Cria o botão que o jogador usa para ativar o spray inseticida
    createSprayButton() {
      // Cria o fundo do botão (retângulo escuro)
      this.sprayProgressBg = this.add.graphics();
      this.sprayProgressBg.fillStyle(0x000000, 0.5); // Cor preta com 50% de transparência
      this.sprayProgressBg.fillRoundedRect(
        this.cameras.main.width - 110,  // Posição X: 110 pixels da borda direita
        this.cameras.main.height - 110, // Posição Y: 110 pixels da borda inferior
        100,  // Largura: 100 pixels
        100,  // Altura: 100 pixels
        16    // Cantos arredondados com raio de 16 pixels
      );
      
      // Cria o gráfico que mostra o progresso do cooldown
      this.sprayProgress = this.add.graphics();
      
      // Cria a imagem do botão spray
      this.sprayButton = this.add.image(
        this.cameras.main.width - 60,   // Centralizado no fundo criado acima
        this.cameras.main.height - 60,
        'spray' // Usa a imagem chamada 'spray'
      ).setScale(0.2); // Diminui para 20% do tamanho original
      
      // Cria o texto "SPRAY" no botão
      this.sprayText = this.add.text(
        this.cameras.main.width - 60,
        this.cameras.main.height - 60,
        'SPRAY',
        {
          fontSize: '16px',
          fontFamily: 'monospace',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 3
        }
      ).setOrigin(0.5); // Centraliza o texto
      
      // Cria o texto de instrução "ESPAÇO" (tecla para ativar)
      this.add.text(
        this.cameras.main.width - 60,
        this.cameras.main.height - 20,
        'ESPAÇO',
        {
          fontSize: '12px',
          fontFamily: 'monospace',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 2
        }
      ).setOrigin(0.5);
    }

    // === CRIAÇÃO DO SISTEMA DE MENSAGENS ===
    // Cria o texto que mostra mensagens temporárias na tela
    createMessageDisplay() {
      this.messageText = this.add.text(
        this.cameras.main.width / 2,    // Centralizado horizontalmente
        this.cameras.main.height / 4,   // No primeiro quarto da tela (parte superior)
        '',  // Começa vazio
        {
          fontSize: '28px',
          fontFamily: 'monospace',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 4,
          align: 'center'
        }
      );
      this.messageText.setOrigin(0.5);     // Centraliza o texto
      this.messageText.setVisible(false);  // Começa invisível
    }

    // === ATUALIZAÇÃO DA PONTUAÇÃO ===
    // Esta função é chamada quando a pontuação muda
    updateScore(score: number) {
      this.scoreText.setText(`Pontos: ${score}`); // Atualiza o texto com a nova pontuação
    }

    // === ATUALIZAÇÃO DO CRONÔMETRO ===
    // Esta função é chamada quando o tempo muda
    updateTimer(seconds: number) {
      // Converte segundos para formato MM:SS
      const minutes = Math.floor(seconds / 60);        // Calcula os minutos
      const remainingSeconds = seconds % 60;           // Calcula os segundos restantes
      this.timeText.setText(
        `${minutes}:${remainingSeconds.toString().padStart(2, '0')}` // Formato: 3:05, 0:30, etc.
      );
      
      // Se restam 30 segundos ou menos, muda a cor para vermelho (urgência)
      if (seconds <= 30) {
        this.timeText.setColor('#ff0000');
      }
    }

    // === ATUALIZAÇÃO DA VIDA (CORAÇÕES) ===
    // Esta função é chamada quando a vida do jogador muda
    updateHealth(health: number) {
      // Para cada coração, mostra ou esconde baseado na vida atual
      this.hearts.forEach((heart, i) => {
        heart.setVisible(i < health); // Mostra se o índice for menor que a vida atual
      });
    }

    // === ATUALIZAÇÃO DO COOLDOWN DO SPRAY ===
    // Esta função mostra o progresso de recarga do spray
    updateSprayCooldown(progress: number) {
      this.sprayProgress.clear(); // Limpa o desenho anterior
      
      // Se o spray ainda está em cooldown (progress < 1)
      if (progress < 1) {
        this.sprayProgress.fillStyle(0x666666, 0.7); // Cor cinza com transparência
        const startAngle = -Math.PI / 2;              // Começa no topo (12 horas)
        const endAngle = startAngle + (1 - progress) * Math.PI * 2; // Calcula onde terminar
        
        // Desenha uma "fatia de pizza" mostrando o cooldown
        this.sprayProgress.slice(
          this.cameras.main.width - 60,   // Centro X
          this.cameras.main.height - 60,  // Centro Y
          50,          // Raio da fatia
          startAngle,  // Ângulo inicial
          endAngle,    // Ângulo final
          false        // Não é anti-horário
        );
        
        this.sprayProgress.fillPath();           // Desenha a fatia
        this.sprayButton.setTint(0x888888);      // Deixa o botão cinza (desabilitado)
      } else {
        this.sprayButton.clearTint();            // Remove o efeito cinza (botão disponível)
      }
    }

    // === EXIBIÇÃO DE MENSAGENS TEMPORÁRIAS ===
    // Esta função mostra uma mensagem na tela por um tempo determinado
    showMessage(text: string, duration: number = 2000) { // Duração padrão: 2 segundos
      // Se já existe uma mensagem sendo exibida, cancela
      if (this.messageTimer) {
        this.messageTimer.destroy();
      }
      
      // Define o texto e torna visível
      this.messageText.setText(text);
      this.messageText.setVisible(true);
      
      // Animação de entrada: a mensagem "pula" para aparecer
      this.tweens.add({
        targets: this.messageText,
        scale: { from: 0.8, to: 1 },  // Cresce de 80% para 100%
        duration: 300,                // Duração da animação: 0.3 segundos
        ease: 'Bounce.Out'            // Efeito de "quique"
      });
      
      // Programa o desaparecimento da mensagem
      this.messageTimer = this.time.delayedCall(duration, () => {
        // Animação de saída: a mensagem desaparece gradualmente
        this.tweens.add({
          targets: this.messageText,
          alpha: { from: 1, to: 0 },    // Transparência vai de 100% para 0%
          duration: 300,
          onComplete: () => {           // Quando a animação termina
            this.messageText.setVisible(false); // Esconde completamente
            this.messageText.setAlpha(1);       // Restaura a transparência para próxima vez
          }
        });
      });
    }
  }

  // Retorna a classe UIScene para ser usada em outras partes do código
  return UIScene;
};