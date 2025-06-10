import Phaser from 'phaser';

// Esta classe representa um "local de reprodução" do mosquito da dengue no jogo
// Herda de Phaser.Physics.Arcade.Sprite, o que significa que é um objeto visual que pode ter física
export class BreedingSite extends Phaser.Physics.Arcade.Sprite {
  // Variável que guarda se este local já foi limpo pelo jogador
  private cleared: boolean = false;
  
  // Animação que faz o objeto "pulsar" (crescer e diminuir) para chamar atenção
  private siteTween: Phaser.Tweens.Tween;
  
  // Texto que aparece embaixo do objeto para identificar o que é
  private labelText: Phaser.GameObjects.Text;
  
  // Construtor: função que roda quando um novo BreedingSite é criado
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    // Chama o construtor da classe pai (Phaser sprite) com posição e imagem
    super(scene, x, y, texture);
    
    // Adiciona este objeto à cena do jogo para que apareça na tela
    scene.add.existing(this);
    
    // Define o tamanho do objeto (0.2 = 20% do tamanho original)
    this.setScale(0.2);
    
    // Cria uma animação que faz o objeto "pulsar" continuamente
    // Isso chama a atenção do jogador para mostrar que é interativo
    this.siteTween = scene.tweens.add({
      targets: this,              // O que vai ser animado (este objeto)
      scale: this.scale * 1.1,    // Cresce 10% do tamanho atual
      duration: 1000,             // Demora 1 segundo para crescer
      yoyo: true,                 // Volta ao tamanho original
      repeat: -1                  // Repete infinitamente (-1 = para sempre)
    });
    
    // Configurações de estilo para o texto que vai aparecer
    const textConfig = {
      fontSize: '12px',           // Tamanho da fonte
      color: '#ffffff',           // Cor branca
      stroke: '#000000',          // Contorno preto
      strokeThickness: 3          // Espessura do contorno
    };
    
    // Decide qual texto mostrar baseado no tipo de imagem (texture)
    let label = '';
    if (texture === 'tire') {
      label = 'Pneu com água';
    } else if (texture === 'waterContainer') {
      label = 'Vaso com água';
    } else if (texture === 'plant') {
      label = 'Planta com água';
    }
    
    // Cria o texto e posiciona ele um pouco abaixo do objeto (y + 20)
    this.labelText = scene.add.text(x, y + 20, label, textConfig);
    
    // Centraliza o texto horizontalmente
    this.labelText.setOrigin(0.5);
    
    // Define a "profundidade" do texto para aparecer na frente de outros objetos
    this.labelText.setDepth(60);
  }
  
  // Função chamada quando o jogador "limpa" este local de reprodução
  clear() {
    // Se já foi limpo, não faz nada
    if (this.cleared) return;
    
    // Marca como limpo
    this.cleared = true;
    
    // Para a animação de pulsação
    this.siteTween.stop();
    
    // Muda a cor para cinza escuro (indicando que foi limpo)
    this.setTint(0x666666);
    
    // Esconde o texto explicativo
    this.labelText.setVisible(false);
    
    // Cria uma animação que deixa o objeto mais transparente e menor
    this.scene.tweens.add({
      targets: this,              // Anima este objeto
      alpha: 0.3,                 // Fica 30% visível (mais transparente)
      scale: this.scale * 0.7,    // Diminui para 70% do tamanho atual
      duration: 500               // Animação dura meio segundo
    });
  }
  
  // Função que outros códigos podem usar para verificar se foi limpo
  isCleared() {
    return this.cleared;
  }
  
  // Função que roda quando este objeto é removido do jogo
  // Importante para limpar a memória e evitar problemas
  destroy(fromScene?: boolean) {
    // Se existe o texto, remove ele também
    if (this.labelText) {
      this.labelText.destroy();
    }
    // Chama a função de destruição da classe pai
    super.destroy(fromScene);
  }
}