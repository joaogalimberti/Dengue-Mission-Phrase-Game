import Phaser from 'phaser';

// Esta classe representa o jogador (personagem controlado pelo usuário)
// Herda de Phaser.Physics.Arcade.Sprite para ter movimento e física
export class Player extends Phaser.Physics.Arcade.Sprite {
  // Guarda as teclas de direção (setas do teclado) para controlar o movimento
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  
  // Controla se o jogador está "piscando" (efeito visual após ser atacado)
  private isFlashing: boolean = false;
  
  // Construtor: função que roda quando um novo jogador é criado
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    // Chama o construtor da classe pai com posição, imagem e frame 0
    super(scene, x, y, texture, 0);
    
    // Adiciona o jogador à cena para aparecer na tela
    scene.add.existing(this);
    
    // Habilita física para que o jogador possa se mover e colidir
    scene.physics.add.existing(this);

    // Define o tamanho do personagem (20% do tamanho original)
    this.setScale(0.2);
    
    // Ajusta o tamanho da área de colisão (hitbox)
    // Isso torna as colisões mais justas para o jogador
    const body = this.body as Phaser.Physics.Arcade.Body;
    const hitboxScale = 0.6; // Hitbox será 60% do tamanho do sprite
    
    // Define o novo tamanho da hitbox
    body.setSize(
      this.width * hitboxScale,   // Largura da hitbox
      this.height * hitboxScale   // Altura da hitbox
    );
    
    // Centraliza a hitbox no meio do sprite
    body.setOffset(
      (this.width - body.width) / 2,    // Centralização horizontal
      (this.height - body.height) / 2   // Centralização vertical
    );
    
    // Configurações de física do jogador
    this.setCollideWorldBounds(true); // Não deixa sair da tela
    this.setBounce(0.1);              // Leve quique ao colidir com bordas
    
    // Configura os controles do teclado (setas direcionais)
    if (scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys();
    } else {
      throw new Error('Keyboard input is not available in this scene.');
    }
    
    // Espera um pouco para garantir que as animações foram carregadas
    // Depois toca a animação de "parado"
    scene.time.delayedCall(50, () => {
      if (this.anims.exists('agent-idle')) {
        this.play('agent-idle');
      }
    });
  }
  
  // Função que roda a cada frame para atualizar o movimento do jogador
  update() {
    // Velocidade de movimento do jogador
    const speed = 160;
    
    // Controla se o jogador está se movendo neste frame
    let isMoving = false;
    
    // Se está "piscando" (após ser atacado), não pode se mover
    if (this.isFlashing) return;
    
    // Para o movimento atual (velocidade zero)
    this.setVelocity(0);
    
    // Controles de movimento horizontal (esquerda/direita)
    if (this.cursors.left.isDown) {
      // Move para a esquerda
      this.setVelocityX(-speed);
      this.setFlipX(true); // Espelha o sprite para virar para a esquerda
      console.log('Tentando tocar agent-walk-side (esquerda)');
      this.play('agent-walk-side', true); // Toca animação de andar lateral
      isMoving = true;
    } else if (this.cursors.right.isDown) {
      // Move para a direita
      this.setVelocityX(speed);
      this.setFlipX(false); // Sprite normal (virado para a direita)
      console.log('Tentando tocar agent-walk-side (direita)');
      this.play('agent-walk-side', true); // Toca animação de andar lateral
      isMoving = true;
    }
    
    // Controles de movimento vertical (cima/baixo)
    if (this.cursors.up.isDown) {
      // Move para cima
      this.setVelocityY(-speed); // Negativo = para cima
      console.log('Tentando tocar agent-walk-up');
      this.play('agent-walk-up', true); // Toca animação de andar para cima
      isMoving = true;
    } else if (this.cursors.down.isDown) {
      // Move para baixo
      this.setVelocityY(speed);
      console.log('Tentando tocar agent-walk-down');
      this.play('agent-walk-down', true); // Toca animação de andar para baixo
      isMoving = true;
    }
    
    // Se não está se movendo, toca a animação de "parado"
    if (!isMoving) {
      console.log('Tentando tocar agent-idle');
      this.play('agent-idle', true);
    }
    
    // Corrige movimento diagonal para manter velocidade constante
    // Sem isso, mover na diagonal seria mais rápido que mover reto
    if (this.body && this.body.velocity.x !== 0 && this.body.velocity.y !== 0) {
      // Normaliza o vetor velocidade e multiplica pela velocidade desejada
      this.body.velocity.normalize().scale(speed);
    }
  }
  
  // Função chamada quando o jogador é atacado (cria efeito visual de piscar)
  flash() {
    // Se já está piscando, não faz nada
    if (this.isFlashing) return;
    
    // Marca que está piscando
    this.isFlashing = true;
    
    // Cria efeito visual de piscar mudando a transparência
    this.scene.tweens.add({
      targets: this,           // Anima este jogador
      alpha: 0.3,             // Fica 30% visível (mais transparente)
      duration: 50,           // Cada "piscada" dura 50ms
      yoyo: true,             // Volta ao normal depois de cada piscada
      repeat: 5,              // Repete 5 vezes (total de 6 piscadas)
      onComplete: () => {     // Quando termina o efeito
        this.alpha = 1;       // Volta a ficar completamente visível
        this.isFlashing = false; // Para de piscar
      }
    });
  }
}