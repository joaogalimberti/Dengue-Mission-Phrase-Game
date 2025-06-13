import Phaser from 'phaser';
import { BreedingSite } from '../entities/BreedingSite';
import { Mosquito } from '../entities/Mosquito';
import { Player } from '../entities/Player';

// Interface que define as configurações do jogo
// Como se fosse um "contrato" dizendo quais informações são obrigatórias
interface MainSceneConfig {
  onGameOver: (score: number, won: boolean) => void; // Função chamada quando o jogo termina
  difficulty: 'easy' | 'medium' | 'hard'; // Nível de dificuldade
  sound: boolean; // Se o som está ligado ou desligado
}

// Função que cria a cena principal do jogo
export const createMainScene = (config: MainSceneConfig) => {
  class MainScene extends Phaser.Scene {
    // === DECLARAÇÃO DAS VARIÁVEIS DO JOGO ===
    // Estas são como "gavetas" onde guardamos as informações importantes
    
    private player!: Player; // O jogador (agente de saúde)
    private mosquitoes!: Phaser.Physics.Arcade.Group; // Grupo de todos os mosquitos
    private breedingSites!: Phaser.Physics.Arcade.StaticGroup; // Focos de dengue (pneus, vasos, etc)
    private screenBorders!: Phaser.Physics.Arcade.StaticGroup; // Bordas invisíveis da tela
    
    private sprayParticleManager!: Phaser.GameObjects.Particles.ParticleEmitter;
    
    // Informações do estado do jogo
    private score: number = 0; // Pontuação do jogador
    private health: number = 5; // Vida do jogador (quantas picadas pode levar)
    private timeLeft: number = 180; // Tempo restante em segundos (3 minutos)
    private gameTimer: Phaser.Time.TimerEvent | null = null; // Timer principal do jogo
    private mosquitoTimer: Phaser.Time.TimerEvent | null = null; // Timer para criar mosquitos
    private sprayCooldown: number = 1000; // Tempo de espera entre sprays (1 segundo)
    private lastSprayTime: number = 0; // Quando foi usado o spray pela última vez
    
    private isGameOver: boolean = false; // Se o jogo já terminou
    private difficultyLevel: string; // Nível de dificuldade escolhido
    private totalBreedingSites: number = 0; // Quantos focos existem no total
    private clearedBreedingSites: number = 0; // Quantos focos já foram eliminados

    // Variáveis para controlar a eliminação de focos (demora 5 segundos)
    private currentBreedingSite: BreedingSite | null = null; // Foco que está sendo eliminado
    private breedingSiteTimer: Phaser.Time.TimerEvent | null = null; // Timer de 5 segundos
    private clearingTimeLeft: number = 0; // Tempo restante para eliminar o foco
    private clearingText: Phaser.GameObjects.Text | null = null; // Texto mostrando o progresso

    constructor() {
      super({ key: 'MainScene' }); // Dá um nome para esta cena
      this.difficultyLevel = config.difficulty; // Guarda a dificuldade escolhida
    }
    
    // === FUNÇÃO PRELOAD ===
    // Esta função carrega os recursos antes do jogo começar
    preload() {
      // Criar uma imagem pequena e branca para as partículas do spray
      // É como criar um "pontinho" que será usado no efeito visual
      this.load.image('white-particle', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAG0lEQVQIHWPY//8/AzYwirkTmwYs3vn//38GAD7+Dh2Z7t0oAAAAAElFTkSuQmCC');
    }
    
    // === FUNÇÃO CREATE ===
    // Esta função configura tudo que aparece no jogo quando ele começa
    create() {
      this.scene.launch('UIScene'); // Inicia a interface do usuário (placar, vida, etc)
      this.createSimpleBackground(); // Cria o fundo do jogo (grama)
      
      // Criar as animações do personagem ANTES de criar o jogador
      this.createAnimations();
      
      // Criar os elementos do jogo na ordem correta
      this.setupGroups(); // Organiza os objetos em grupos
      this.createBreedingSites(); // Coloca os focos de dengue no mapa
      
      // Criar o jogador e colocá-lo na frente de tudo
      this.player = new Player(this, 400, 300, 'front_agent');
      this.player.setDepth(100); // Número maior = aparece na frente
      
      // Configurar o efeito visual do spray
      this.setupSprayParticles();
      
      // Configurar as colisões e limites do jogo
      this.setupScreenBorders(); // Cria bordas invisíveis
      this.setupCollisions(); // Define o que acontece quando objetos se tocam
      this.setupGameTimer(); // Inicia o cronômetro
      this.setupMosquitoSpawner(); // Configura criação automática de mosquitos
      
      // Mostrar mensagem inicial e atualizar interface
      this.events.emit('showMessage', 'Elimine todos os focos de dengue!', 3000);
      this.events.emit('updateHealth', this.health);
      this.events.emit('updateTimer', this.timeLeft);
    }

    // === CONFIGURAÇÃO DO SISTEMA DE PARTÍCULAS ===
    // Cria o efeito visual bonito quando o jogador usa o spray
    private setupSprayParticles() {
      // Criar o "gerenciador" que controla as partículas
      this.sprayParticleManager = this.add.particles(0, 0, 'white-particle', {
        speed: { min: 80, max: 120 }, // Velocidade das partículas
        scale: { start: 0.4, end: 0.05 }, // Tamanho (começa grande, fica pequeno)
        alpha: { start: 0.9, end: 0 }, // Transparência (começa visível, some)
        lifespan: 400, // Quanto tempo cada partícula vive (em milissegundos)
        quantity: 25, // Quantas partículas criar de uma vez
        emitZone: {
          type: 'edge',
          source: new Phaser.Geom.Circle(0, 0, 8), // Formato circular
          quantity: 25
        },
        angle: { min: 0, max: 360 }, // Direção das partículas (todas as direções)
        frequency: -1, // Não criar automaticamente
        blendMode: 'ADD', // Modo de mistura que deixa mais brilhante
        gravityY: 20 // Partículas caem um pouco (como spray real)
      });
      
      // Colocar o efeito na frente de quase tudo
      this.sprayParticleManager.setDepth(150);
      
      // Não começar criando partículas ainda
      this.sprayParticleManager.stop();
    }

    // === CRIAÇÃO DAS ANIMAÇÕES DO PERSONAGEM ===
    // Define como o agente de saúde se move em cada direção
    private createAnimations() {
      console.log('Criando animações...');
      
      // Animação quando o agente está parado
      this.anims.create({
        key: 'agent-idle', // Nome da animação
        frames: this.anims.generateFrameNumbers('front_agent', { start: 0, end: 3 }), // Quais imagens usar
        frameRate: 4, // Velocidade da animação
        repeat: -1 // Repetir infinitamente
      });
      console.log('Animação agent-idle criada');

      // Animação andando para baixo (quando aperta seta para baixo)
      this.anims.create({
        key: 'agent-walk-down',
        frames: this.anims.generateFrameNumbers('front_agent', { start: 0, end: 3 }),
        frameRate: 8, // Mais rápido que o idle
        repeat: -1
      });
      console.log('Animação agent-walk-down criada');

      // Animação andando para cima (quando aperta seta para cima)
      this.anims.create({
        key: 'agent-walk-up',
        frames: this.anims.generateFrameNumbers('back_agent', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
      });
      console.log('Animação agent-walk-up criada');

      // Animação andando para os lados (esquerda e direita)
      this.anims.create({
        key: 'agent-walk-side',
        frames: this.anims.generateFrameNumbers('agent', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
      });
      console.log('Animação agent-walk-side criada');
      console.log('Todas as animações foram criadas!');
    }

    // === CRIAÇÃO DO FUNDO DO JOGO ===
    // Cria um fundo simples com textura de grama
    createSimpleBackground() {
      const gameWidth = this.cameras.main.width; // Largura da tela
      const gameHeight = this.cameras.main.height; // Altura da tela
      
      // Criar ladrilhos de grama para cobrir toda a tela
      const tileSize = 200; // Tamanho de cada pedaço de grama
      const tilesX = Math.ceil(gameWidth / tileSize); // Quantos ladrilhos na horizontal
      const tilesY = Math.ceil(gameHeight / tileSize); // Quantos ladrilhos na vertical
      
      // Criar cada pedaço de grama
      for (let y = 0; y < tilesY; y++) {
        for (let x = 0; x < tilesX; x++) {
          const tile = this.add.image(
            x * tileSize + tileSize / 2, // Posição X
            y * tileSize + tileSize / 2, // Posição Y
            'grass' // Imagem da grama
          );
          tile.setDisplaySize(tileSize, tileSize); // Ajustar tamanho
          tile.setDepth(0); // Colocar atrás de tudo (fundo)
        }
      }
    }

    // === CONFIGURAÇÃO DOS GRUPOS DE OBJETOS ===
    // Organiza os diferentes tipos de objetos em grupos para facilitar o controle
    setupGroups() {
      // Grupo dos focos de dengue (não se movem)
      this.breedingSites = this.physics.add.staticGroup();
      
      // Grupo dos mosquitos (se movem e são atualizados constantemente)
      this.mosquitoes = this.physics.add.group({
        classType: Mosquito, // Tipo de objeto
        runChildUpdate: true // Atualizar todos os mosquitos automaticamente
      });
      
      // Grupo das bordas da tela (invisíveis, só para colisão)
      this.screenBorders = this.physics.add.staticGroup();
    }

    // === CRIAÇÃO DAS BORDAS INVISÍVEIS ===
    // Cria "paredes" invisíveis para que o jogador não saia da tela
    setupScreenBorders() {
      const gameWidth = this.cameras.main.width;
      const gameHeight = this.cameras.main.height;
      const borderThickness = 32; // Espessura das bordas
      
      // Borda superior
      this.screenBorders.create(gameWidth / 2, borderThickness / 2, undefined)
        .setDisplaySize(gameWidth, borderThickness)
        .setVisible(false); // Invisível, mas ainda funciona para colisão

      // Borda inferior
      this.screenBorders.create(gameWidth / 2, gameHeight - borderThickness / 2, undefined)
        .setDisplaySize(gameWidth, borderThickness)
        .setVisible(false);

      // Borda esquerda
      this.screenBorders.create(borderThickness / 2, gameHeight / 2, undefined)
        .setDisplaySize(borderThickness, gameHeight)
        .setVisible(false);

      // Borda direita
      this.screenBorders.create(gameWidth - borderThickness / 2, gameHeight / 2, undefined)
        .setDisplaySize(borderThickness, gameHeight)
        .setVisible(false);
    }

    // === CONFIGURAÇÃO DAS COLISÕES ===
    // Define o que acontece quando objetos se tocam
    setupCollisions() {
      // Jogador não pode atravessar as bordas da tela
      this.physics.add.collider(this.player, this.screenBorders);
      
      // Mosquitos também não podem sair da tela
      this.physics.add.collider(this.mosquitoes, this.screenBorders);
      
      // Mosquitos não podem atravessar uns aos outros
      this.physics.add.collider(this.mosquitoes, this.mosquitoes);
      
      // Quando o jogador toca um foco de dengue, começar a eliminá-lo
      this.physics.add.overlap(this.player, this.breedingSites, this.handleBreedingSiteOverlap, undefined, this);
      
      // Quando um mosquito toca o jogador, ele perde vida
      this.physics.add.overlap(this.player, this.mosquitoes, this.handleMosquitoCollision, undefined, this);
    }

    // === CRIAÇÃO DOS FOCOS DE DENGUE ===
    // Coloca os focos de dengue (pneus, vasos, etc) em posições aleatórias no mapa
    createBreedingSites() {
      this.totalBreedingSites = 6; // Sempre criar 6 focos
      const breedingTypes = ['tire', 'waterContainer', 'plant']; // Tipos de focos
      const gameWidth = this.cameras.main.width;
      const gameHeight = this.cameras.main.height;
      const padding = 100; // Distância das bordas
      const minDistance = 120; // Distância mínima entre focos
      const positions: { x: number; y: number }[] = []; // Lista de posições já usadas
      
      // Criar cada foco de dengue
      for (let i = 0; i < this.totalBreedingSites; i++) {
        let x: number, y: number;
        let attempts = 0;
        const maxAttempts = 50; // Máximo de tentativas para encontrar uma boa posição
        
        // Tentar encontrar uma posição que não seja muito perto de outros focos
        do {
          x = padding + Math.random() * (gameWidth - padding * 2);
          y = padding + Math.random() * (gameHeight - padding * 2);
          attempts++;
          
          // Se tentou muitas vezes, aceitar a posição mesmo que não seja perfeita
          if (attempts >= maxAttempts) break;
          
        } while (this.isTooClose(x, y, positions, minDistance));
        
        positions.push({ x, y }); // Guardar esta posição
        
        // Escolher um tipo aleatório de foco
        const type = breedingTypes[Math.floor(Math.random() * breedingTypes.length)];
        const breedingSite = new BreedingSite(this, x, y, type);
        
        // Colocar atrás do jogador mas na frente do fundo
        breedingSite.setDepth(50);
        this.breedingSites.add(breedingSite);
      }
    }

    // === VERIFICAÇÃO DE DISTÂNCIA ===
    // Verifica se duas posições estão muito próximas
    isTooClose(x: number, y: number, existingPositions: { x: number; y: number }[], minDistance: number): boolean {
      for (const pos of existingPositions) {
        const distance = Phaser.Math.Distance.Between(x, y, pos.x, pos.y);
        if (distance < minDistance) {
          return true; // Está muito perto
        }
      }
      return false; // Posição está boa
    }

    // === POSIÇÃO ALEATÓRIA PARA MOSQUITOS ===
    // Encontra uma posição aleatória segura para criar novos mosquitos
    getRandomSpawnPosition(): { x: number; y: number } {
      const gameWidth = this.cameras.main.width;
      const gameHeight = this.cameras.main.height;
      const padding = 80; // Distância das bordas
      
      return {
        x: padding + Math.random() * (gameWidth - padding * 2),
        y: padding + Math.random() * (gameHeight - padding * 2)
      };
    }

    // === QUANDO O JOGADOR TOCA UM FOCO DE DENGUE ===
    // Inicia o processo de eliminação do foco (demora 5 segundos)
    handleBreedingSiteOverlap(player: Phaser.GameObjects.GameObject, breedingSite: Phaser.GameObjects.GameObject) {
      const site = breedingSite as BreedingSite;
      const p = player as Player;
      
      // Se este foco já foi eliminado, não fazer nada
      if (site.isCleared()) return;
      
      // Se já estamos eliminando este foco, não fazer nada
      if (this.currentBreedingSite === site) return;
      
      // Se estamos eliminando outro foco, cancelar e começar este
      if (this.currentBreedingSite && this.currentBreedingSite !== site) {
        this.cancelBreedingSiteClearing();
      }
      
      // Começar a eliminar este foco
      this.startBreedingSiteClearing(site);
    }

    // === COMEÇAR A ELIMINAR UM FOCO ===
    // Inicia o processo de 5 segundos para eliminar um foco
    startBreedingSiteClearing(site: BreedingSite) {
      this.currentBreedingSite = site; // Guardar qual foco estamos eliminando
      this.clearingTimeLeft = 5; // 5 segundos para eliminar
      
      // Criar texto mostrando o progresso
      this.clearingText = this.add.text(
        site.x, 
        site.y - 50, 
        `Eliminando... ${this.clearingTimeLeft}s`, 
        {
          fontSize: '14px',
          color: '#ffff00', // Amarelo
          stroke: '#000000', // Borda preta
          strokeThickness: 3
        }
      );
      this.clearingText.setOrigin(0.5); // Centralizar texto
      this.clearingText.setDepth(200); // Aparecer na frente de tudo
      
      // Criar um timer que conta os segundos
      this.breedingSiteTimer = this.time.addEvent({
        delay: 1000, // A cada 1 segundo
        callback: () => {
          this.clearingTimeLeft--; // Diminuir contador
          
          // Atualizar o texto
          if (this.clearingText) {
            this.clearingText.setText(`Eliminando... ${this.clearingTimeLeft}s`);
          }
          
          // Verificar se o jogador ainda está perto do foco
          if (this.currentBreedingSite) {
            const distance = Phaser.Math.Distance.Between(
              this.player.x, 
              this.player.y,
              this.currentBreedingSite.x, 
              this.currentBreedingSite.y
            );
            
            // Se o jogador se afastou muito, cancelar
            if (distance > 50) {
              this.cancelBreedingSiteClearing();
              return;
            }
          }
          
          // Se completou os 5 segundos, eliminar o foco
          if (this.clearingTimeLeft <= 0) {
            this.completeBreedingSiteClearing();
          }
        },
        repeat: 4 // Repetir 4 vezes (total de 5 segundos)
      });
    }

    // === CANCELAR ELIMINAÇÃO DE FOCO ===
    // Para o processo de eliminação (quando o jogador se afasta)
    cancelBreedingSiteClearing() {
      // Parar o timer
      if (this.breedingSiteTimer) {
        this.breedingSiteTimer.remove();
        this.breedingSiteTimer = null;
      }
      
      // Remover o texto
      if (this.clearingText) {
        this.clearingText.destroy();
        this.clearingText = null;
      }
      
      // Limpar variáveis
      this.currentBreedingSite = null;
      this.clearingTimeLeft = 0;
    }

    // === COMPLETAR ELIMINAÇÃO DE FOCO ===
    // Quando o jogador consegue eliminar um foco completamente
    completeBreedingSiteClearing() {
      if (this.currentBreedingSite) {
        // Criar efeito visual antes de eliminar o foco
        this.createEliminationEffect(this.currentBreedingSite.x, this.currentBreedingSite.y);
        
        this.currentBreedingSite.clear(); // Marcar foco como eliminado
        this.clearedBreedingSites++; // Contar mais um foco eliminado
        this.score += 5; // Ganhar 5 pontos
        this.events.emit('updateScore', this.score); // Atualizar placar
        this.events.emit('showMessage', 'Foco eliminado! +5 pontos', 1500);

        // Se eliminou todos os focos, ganhou o jogo!
        if (this.clearedBreedingSites >= this.totalBreedingSites) {
          this.gameOver(true);
        }
      }
      
      // Limpar o processo de eliminação
      this.cancelBreedingSiteClearing();
    }

    // === EFEITO VISUAL DE ELIMINAÇÃO ===
    createEliminationEffect(x: number, y: number) {
      // Criar múltiplas partículas de faísca
      const particleCount = 15;
      const particles = [];
      
      for (let i = 0; i < particleCount; i++) {
        // Criar cada partícula como um círculo colorido
        const particle = this.add.circle(x, y, Phaser.Math.Between(2, 4), 0xFFD700); // Dourado
        
        // Adicionar brilho/glow
        particle.setStrokeStyle(1, 0xFFFFFF, 0.8);
        
        // Calcular direção aleatória para cada partícula
        const angle = (i / particleCount) * Math.PI * 2 + Phaser.Math.FloatBetween(-0.3, 0.3);
        const speed = Phaser.Math.Between(80, 150);
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed - Phaser.Math.Between(20, 60); // Bias para cima
        
        particles.push(particle);
        
        // Animar cada partícula
        this.tweens.add({
          targets: particle,
          x: x + velocityX * 0.01,
          y: y + velocityY * 0.01,
          scaleX: 0,
          scaleY: 0,
          alpha: 0,
          duration: Phaser.Math.Between(500, 800),
          ease: 'Quad.easeOut',
          onComplete: () => {
            particle.destroy(); // Limpar partícula após animação
          }
        });
      }
      
      // Adicionar flash de luz central
      const flash = this.add.circle(x, y, 30, 0xFFFFFF, 0.8);
      this.tweens.add({
        targets: flash,
        scaleX: 2,
        scaleY: 2,
        alpha: 0,
        duration: 300,
        ease: 'Quad.easeOut',
        onComplete: () => {
          flash.destroy();
        }
      });
      
      // Adicionar ondas de expansão
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const wave = this.add.circle(x, y, 5, 0x00FF00, 0.4); // Verde
          wave.setStrokeStyle(2, 0x00FF00, 0.6);
          wave.setFillStyle();
          
          this.tweens.add({
            targets: wave,
            scaleX: 6,
            scaleY: 6,
            alpha: 0,
            duration: 600,
            ease: 'Quad.easeOut',
            onComplete: () => {
              wave.destroy();
            }
          });
        }, i * 100);
      }
      
      // Adicionar efeito sonoro (se você tiver áudio configurado)
      // this.sound.play('elimination_sound', { volume: 0.5 });
    }

    // === VERSÃO ALTERNATIVA COM EFEITO MAIS SIMPLES ===
    createSimpleEliminationEffect(x: number, y: number) {
      // Efeito mais simples caso o anterior seja muito pesado
      const colors = [0xFFD700, 0xFF6B35, 0x4ECDC4, 0x45B7D1, 0x96CEB4];
      
      for (let i = 0; i < 8; i++) {
        const particle = this.add.circle(
          x + Phaser.Math.Between(-10, 10), 
          y + Phaser.Math.Between(-10, 10), 
          Phaser.Math.Between(3, 6), 
          colors[i % colors.length]
        );
        
        this.tweens.add({
          targets: particle,
          y: y - Phaser.Math.Between(50, 100),
          x: x + Phaser.Math.Between(-50, 50),
          alpha: 0,
          scaleX: 0,
          scaleY: 0,
          duration: 800,
          ease: 'Quad.easeOut',
          onComplete: () => particle.destroy()
        });
      }
      
      // Flash central
      const flash = this.add.circle(x, y, 20, 0xFFFFFF, 0.7);
      this.tweens.add({
        targets: flash,
        scaleX: 1.5,
        scaleY: 1.5,
        alpha: 0,
        duration: 200,
        onComplete: () => flash.destroy()
      });
    }

    // === QUANDO MOSQUITO PICA O JOGADOR ===
    // O que acontece quando um mosquito toca o jogador
    handleMosquitoCollision(player: Player, mosquito: Phaser.GameObjects.GameObject) {
      const m = mosquito as Mosquito;
      
      // Se o mosquito ainda não picou e não está morto
      if (!m.hasBitten && !m.isDead()) {
        m.bite(); // Mosquito pica
        this.health--; // Jogador perde vida
        this.events.emit('updateHealth', this.health); // Atualizar interface
        player.flash(); // Fazer jogador piscar (efeito visual)
        
        // Se a vida chegou a zero, perdeu o jogo
        if (this.health <= 0) {
          this.gameOver(false);
        }
      }
    }

    // === FUNÇÃO UPDATE (LOOP PRINCIPAL) ===
    // Esta função roda muitas vezes por segundo e atualiza tudo no jogo
    update(time: number) {
      // Se o jogo já terminou, não fazer nada
      if (this.isGameOver) return;
      
      // Atualizar o jogador e todos os mosquitos
      this.player.update();
      this.mosquitoes.getChildren().forEach(m => (m as Mosquito).update());
      
      // Calcular quanto tempo falta para poder usar spray novamente
      const cooldownProgress = Math.min(1, (time - this.lastSprayTime) / this.sprayCooldown);
      this.events.emit('updateSprayCooldown', cooldownProgress);
      
      // Se o jogador apertar ESPAÇO, usar spray
      if (this.input.keyboard && this.input.keyboard.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE), 100)) {
        this.useSpray(time);
      }

      // Verificar se o jogador ainda está perto do foco sendo eliminado
      if (this.currentBreedingSite && !this.currentBreedingSite.isCleared()) {
        const distance = Phaser.Math.Distance.Between(
          this.player.x, 
          this.player.y,
          this.currentBreedingSite.x, 
          this.currentBreedingSite.y
        );
        
        // Se se afastou muito, cancelar eliminação
        if (distance > 50) {
          this.cancelBreedingSiteClearing();
        }
      }
    }

    // === USO DO SPRAY ===
    // Quando o jogador aperta ESPAÇO para usar spray
    useSpray(time: number) {
      // Se ainda não passou o tempo de espera, não pode usar
      if (time < this.lastSprayTime + this.sprayCooldown) return;
      
      this.lastSprayTime = time; // Guardar quando usou o spray
      const sprayRange = 100; // Alcance do spray (100 pixels)
      let killed = 0; // Contador de mosquitos mortos
      
      // Ativar o efeito visual bonito
      this.activateSprayEffect();
      
      // Verificar todos os mosquitos
      this.mosquitoes.getChildren().forEach(m => {
        const mosquito = m as Mosquito;
        const dist = Phaser.Math.Distance.Between(
          this.player.x, this.player.y,
          mosquito.x, mosquito.y
        );
        
        // Se o mosquito está dentro do alcance e não está morto
        if (dist <= sprayRange && !mosquito.isDead()) {
          mosquito.kill(); // Matar mosquito
          this.score += 2; // Ganhar 2 pontos
          killed++; // Contar mais um morto
        }
      });
      
      // Se matou algum mosquito, mostrar mensagem
      if (killed > 0) {
        this.events.emit('updateScore', this.score);
        this.events.emit('showMessage', `${killed} mosquito${killed > 1 ? 's' : ''} eliminado${killed > 1 ? 's' : ''}! +${killed * 2} pontos`, 1500);
      }
    }

    // === EFEITO VISUAL DO SPRAY ===
    // Cria um efeito bonito quando o jogador usa spray
    private activateSprayEffect() {
      // Posicionar o sistema de partículas no jogador
      this.sprayParticleManager.setPosition(this.player.x, this.player.y);
      
      // Criar explosão de partículas
      this.sprayParticleManager.explode(30); // Primeira explosão
      
      // Segunda explosão um pouco depois para ficar mais denso
      this.time.delayedCall(50, () => {
        this.sprayParticleManager.explode(20);
      });
      
      // Criar círculo mostrando o alcance do spray
      const sprayCircle = this.add.circle(this.player.x, this.player.y, 100, 0xffffff, 0.08);
      sprayCircle.setDepth(110); // Atrás do jogador
      sprayCircle.setStrokeStyle(1, 0xffffff, 0.3); // Borda branca
      
      // Fazer o círculo desaparecer
      this.tweens.add({
        targets: sprayCircle,
        alpha: 0, // Ficar transparente
        duration: 200, // Em 0.2 segundos
        onComplete: () => {
          sprayCircle.destroy(); // Remover da memória
        }
      });
      
      // Criar partículas extras para simular névoa
      for (let i = 0; i < 8; i++) {
        this.time.delayedCall(i * 20, () => {
          // Calcular posição em círculo
          const angle = (i / 8) * Math.PI * 2;
          const distance = 30 + Math.random() * 40;
          const x = this.player.x + Math.cos(angle) * distance;
          const y = this.player.y + Math.sin(angle) * distance;
          
          // Criar partícula
          const sprayDot = this.add.circle(x, y, 1 + Math.random() * 2, 0xffffff, 0.6);
          sprayDot.setDepth(140);
          
          // Fazer a partícula se mover e sumir
          this.tweens.add({
            targets: sprayDot,
            x: x + (Math.random() - 0.5) * 30,
            y: y + (Math.random() - 0.5) * 30 + 10,
            alpha: 0,
            scale: 0.3,
            duration: 300 + Math.random() * 200,
            onComplete: () => sprayDot.destroy()
          });
        });
      }
    }
    

    // === CONFIGURAÇÃO DO CRONÔMETRO ===
    // Configura o timer principal do jogo (3 minutos)
    setupGameTimer() {
      this.gameTimer = this.time.addEvent({
        delay: 1000, // A cada 1 segundo
        callback: () => {
          if (this.isGameOver) return; // Se o jogo terminou, parar
          
          this.timeLeft--; // Diminuir tempo restante
          this.events.emit('updateTimer', this.timeLeft); // Atualizar interface
          
          // Se o tempo acabou, perdeu o jogo
          if (this.timeLeft <= 0) {
            this.gameOver(false);
          }
        },
        loop: true // Repetir infinitamente
      });
    }

    // === CONFIGURAÇÃO DO CRIADOR DE MOSQUITOS ===
    // Esta função é responsável por criar mosquitos automaticamente durante o jogo
    setupMosquitoSpawner() {
      // Define a velocidade de criação dos mosquitos baseada na dificuldade escolhida
      // Quanto mais difícil, mais rápido aparecem os mosquitos
      const spawnInterval = this.difficultyLevel === 'easy' ? 5000 :    // Fácil: cria um mosquito a cada 5 segundos
                          this.difficultyLevel === 'medium' ? 3000 :   // Médio: cria um mosquito a cada 3 segundos
                          2000;                                        // Difícil: cria um mosquito a cada 2 segundos
      
      // Cria um cronômetro que vai executar uma função repetidamente
      this.mosquitoTimer = this.time.addEvent({
        delay: spawnInterval,           // Tempo de espera entre cada execução (definido acima)
        callback: () => {               // Função que será executada repetidamente
          // Se o jogo já terminou, não cria mais mosquitos
          if (this.isGameOver) return; 
          
          // Escolhe uma posição aleatória na tela para criar o mosquito
          const { x, y } = this.getRandomSpawnPosition();
          
          // Cria um novo mosquito na posição escolhida
          // Passa as informações: cenário atual, posição x, posição y, imagem do mosquito, jogador
          const mosquito = new Mosquito(this, x, y, 'mosquito', this.player);
          
          // Define a camada visual do mosquito (75 = fica na frente de alguns objetos, mas atrás do jogador)
          mosquito.setDepth(75);
          
          // Adiciona o mosquito ao grupo de mosquitos do jogo para controle
          this.mosquitoes.add(mosquito);
        },
        loop: true                      // Faz o cronômetro repetir infinitamente
      });
    }

    // === FUNÇÃO PARA TERMINAR O JOGO ===
    // Esta função é chamada quando o jogo precisa acabar (vitória ou derrota)
    gameOver(won: boolean) {          // Recebe um parâmetro que diz se o jogador ganhou (true) ou perdeu (false)
      // Marca que o jogo terminou (importante para parar outras funções)
      this.isGameOver = true;
      
      // Para qualquer processo de limpeza de focos de mosquito que esteja acontecendo
      this.cancelBreedingSiteClearing();
      
      // Para o cronômetro principal do jogo (se existir)
      if (this.gameTimer) {
        this.gameTimer.remove();      // Remove o cronômetro da memória
      }
      
      // Para o cronômetro que cria mosquitos (se existir)
      if (this.mosquitoTimer) {
        this.mosquitoTimer.remove();  // Remove o cronômetro da memória
      }
      
      // Chama a função de fim de jogo definida na configuração
      // Passa a pontuação final e se o jogador ganhou ou perdeu
      config.onGameOver(this.score, won);
    }
  }
  
  // Retorna a classe MainScene para ser usada em outras partes do código
  return MainScene;
};