import Phaser from 'phaser';

export const createBootScene = () => {
  class BootScene extends Phaser.Scene {
    constructor() {
      super({ key: 'BootScene' });
    }

    preload() {
      // Carregamento das imagens do jogo
      // Agora usando caminhos absolutos que funcionam no Netlify
      this.load.image('grass', '/assets/grass.png');
      this.load.image('heart', '/assets/heart.png');
      this.load.image('spray', '/assets/spray.png');
      this.load.image('tire', '/assets/breeding_tire.png');
      this.load.image('waterContainer', '/assets/breeding_plant.png');
      this.load.image('plant', '/assets/breeding_plant.png');

      // Carregamento das spritesheets do agente
      this.load.spritesheet('agent', '/assets/agent.png', {
        frameWidth: 64,
        frameHeight: 64
      });

      this.load.spritesheet('front_agent', '/assets/front_agent.png', {
        frameWidth: 64,
        frameHeight: 64
      });

      this.load.spritesheet('back_agent', '/assets/back_agent.png', {
        frameWidth: 64,
        frameHeight: 64
      });

      // Carregamento da spritesheet do mosquito
      this.load.spritesheet('mosquito', '/assets/mosquito1.png', {
        frameWidth: 32,
        frameHeight: 32
      });

      // Barra de carregamento
      const progressBar = this.add.graphics();
      const progressBox = this.add.graphics();
      progressBox.fillStyle(0x222222, 0.8);
      progressBox.fillRect(240, 270, 320, 50);

      const width = this.cameras.main.width;
      const height = this.cameras.main.height;
      const loadingText = this.make.text({
        x: width / 2,
        y: height / 2 - 50,
        text: 'Carregando...',
        style: {
          font: '20px monospace',
          color: '#ffffff'
        }
      });
      loadingText.setOrigin(0.5, 0.5);

      this.load.on('progress', (value: number) => {
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(250, 280, 300 * value, 30);
      });

      this.load.on('complete', () => {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
      });
    }

    create() {
      // Criar todas as animações AQUI, depois que todos os assets foram carregados
      this.createAllAnimations();
      
      // Só depois iniciar a cena principal
      this.scene.start('MainScene');
    }

    createAllAnimations() {
      // Animações do mosquito
      this.anims.create({
        key: 'fly',
        frames: this.anims.generateFrameNumbers('mosquito', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
      });

      // Animações do agente
      this.anims.create({
        key: 'agent-idle',
        frames: this.anims.generateFrameNumbers('front_agent', { start: 0, end: 3 }),
        frameRate: 4,
        repeat: -1
      });

      this.anims.create({
        key: 'agent-walk-down',
        frames: this.anims.generateFrameNumbers('front_agent', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
      });

      this.anims.create({
        key: 'agent-walk-up',
        frames: this.anims.generateFrameNumbers('back_agent', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
      });

      this.anims.create({
        key: 'agent-walk-side',
        frames: this.anims.generateFrameNumbers('agent', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
      });
    }
  }

  return BootScene;
};