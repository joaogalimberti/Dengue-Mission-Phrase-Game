import Phaser from 'phaser';
import { Player } from './Player';

// Esta classe representa um mosquito no jogo
// Herda de Phaser.Physics.Arcade.Sprite para ter movimento e física
export class Mosquito extends Phaser.Physics.Arcade.Sprite {
  // Referência ao jogador para poder persegui-lo
  private player: Player;
  
  // Controla se este mosquito já picou alguém
  public hasBitten: boolean = false;
  
  // Controla se o mosquito está morrendo
  private isDying: boolean = false;
  
  // Timer que controla quando o mosquito muda de direção
  private moveTimer: Phaser.Time.TimerEvent;
  
  // Velocidade de movimento do mosquito
  private speed: number = 50;
  
  // Construtor: função que roda quando um novo mosquito é criado
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, player: Player) {
    // Chama o construtor da classe pai com posição e imagem
    super(scene, x, y, texture);
    
    // Adiciona o mosquito à cena para aparecer na tela
    scene.add.existing(this);
    
    // Habilita física para que o mosquito possa se mover e colidir
    scene.physics.add.existing(this);
    
    // Guarda a referência do jogador para poder perseguir
    this.player = player;
    
    // Configura a física do mosquito
    this.setCollideWorldBounds(true); // Não deixa sair da tela
    this.setScale(0.1);               // Define tamanho (10% do original)
    
    // Define uma velocidade inicial aleatória
    this.setRandomVelocity();
    
    // Cria um timer que faz o mosquito mudar de direção de tempos em tempos
    this.moveTimer = scene.time.addEvent({
      delay: Phaser.Math.Between(2000, 4000), // Entre 2 e 4 segundos
      callback: this.setRandomVelocity,        // Função a ser chamada
      callbackScope: this,                     // Contexto (este objeto)
      loop: true                               // Repete para sempre
    });

    // Inicia a animação de voar
    this.startAnimation();
  }

  // Função que inicia a animação de voar do mosquito
  startAnimation() {
    // Só anima se estiver vivo, não tiver picado e a animação existir
    if (this.scene && !this.isDying && !this.hasBitten && this.anims.exists('fly')) {
      this.anims.play('fly', true); // Toca a animação 'fly'
    }
  }
  
  // Função que roda a cada frame do jogo para atualizar o comportamento
  update() {
    // Se está morrendo ou já picou, não faz nada
    if (this.isDying || this.hasBitten) return;
    
    // Chance básica de perseguir o jogador (30%)
    let chaseChance = 0.3;
    
    // Calcula a distância entre o mosquito e o jogador
    const distance = Phaser.Math.Distance.Between(
      this.x, this.y,           // Posição do mosquito
      this.player.x, this.player.y  // Posição do jogador
    );
    
    // Se estiver perto do jogador, aumenta a chance de perseguir
    if (distance < 200) {
      chaseChance = 0.7; // 70% de chance quando está perto
    }
    
    // Decide aleatoriamente se vai perseguir o jogador
    if (Math.random() < chaseChance) {
      // Move o mosquito em direção ao jogador
      this.scene.physics.moveToObject(this, this.player, this.speed);
    }
  }
  
  // Função que define uma velocidade aleatória para o mosquito
  setRandomVelocity() {
    // Se está morrendo ou já picou, não muda velocidade
    if (this.isDying || this.hasBitten) return;
    
    // Gera velocidades aleatórias para X e Y
    const vx = Phaser.Math.Between(-this.speed, this.speed);
    const vy = Phaser.Math.Between(-this.speed, this.speed);
    
    // Define a nova velocidade
    this.setVelocity(vx, vy);
  }
  
  // Função chamada quando o mosquito pica o jogador
  bite() {
    // Se já está morrendo ou já picou, não faz nada
    if (this.isDying || this.hasBitten) return;
    
    // Marca que já picou
    this.hasBitten = true;
    
    // Para de se mover
    this.setVelocity(0, 0);
    
    // Destroi o timer de mudança de direção
    this.moveTimer.destroy();
    
    // Muda a cor para rosa/magenta para mostrar que picou
    this.setTint(0xFF00FF);
    
    // Espera meio segundo e depois foge voando
    this.scene.time.delayedCall(500, () => {
      // Voa para cima e para os lados aleatoriamente
      this.setVelocity(
        Phaser.Math.Between(-100, 100), // Movimento horizontal aleatório
        -200                            // Movimento para cima (negativo = para cima)
      );
      
      // Depois de 1.5 segundos voando, remove o mosquito do jogo
      this.scene.time.delayedCall(1500, () => {
        this.destroy();
      });
    });
  }
  
  // Função chamada quando o mosquito é morto pelo jogador
  kill() {
    // Se já está morrendo ou já picou, não faz nada
    if (this.isDying || this.hasBitten) return;
    
    // Marca que está morrendo
    this.isDying = true;
    
    // Para de se mover
    this.setVelocity(0, 0);
    
    // Destroi o timer de mudança de direção
    this.moveTimer.destroy();
    
    // Muda a cor para cinza escuro
    this.setTint(0x666666);
    
    // Cria animação de queda e desaparecimento
    this.scene.tweens.add({
      targets: this,           // Anima este mosquito
      y: this.y + 50,         // Cai 50 pixels para baixo
      alpha: 0,               // Fica transparente
      duration: 500,          // Animação dura meio segundo
      onComplete: () => {     // Quando termina a animação
        this.destroy();       // Remove o mosquito do jogo
      }
    });
  }
  
  // Função que outros códigos podem usar para verificar se o mosquito morreu
  isDead() {
    return this.isDying;
  }
}