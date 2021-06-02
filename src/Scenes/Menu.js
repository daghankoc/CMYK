class Menu extends Phaser.Scene {
    constructor(){
        super("menuScene");
    }
    
    preload(){
        this.load.image('cmyk_logo', './assets/CMYKmenu_logo.png');
        this.load.image('flower', './assets/menu_flower.png');
        this.load.image('beginButton', './assets/MenuButtonBegin.png');
        this.load.image('creditsButton', './assets/MenuButtonCredits.png');
        this.load.image('tutorialButton', './assets/MenuButtonTutorial.png');
    }

    create(){
        this.cameras.main.fadeIn(2000, 0, 0, 0)
        this.cmyk = this.add.image(screenCenterX, screenCenterY - 100, 'cmyk_logo').setOrigin(0.5);
        this.flower = this.add.image(screenCenterX+1, screenCenterY - 166, 'flower').setOrigin(0.5);
        this.creditsButton = this.add.image(game.config.width/1.45, game.config.height * 0.8, 'creditsButton').setOrigin(0.5)
        this.tutorialButton = this.add.image(game.config.width/3.2, game.config.height * 0.8, 'tutorialButton').setOrigin(0.5)

        this.startButton = this.add.image(game.config.width/2, game.config.height * 0.8, 'beginButton').setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            this.tweens.add({
                targets: [this.cmyk, this.startButton, this.flower, this.creditsButton, this.tutorialButton],
                x: -250,
                duration: 2000,
                ease: 'Cubic',
                onComplete: ()=> this.scene.stop('menuScene'),
            });
            this.scene.launch('playScene')
        });

        this.creditsButton
        .setInteractive()
        .on('pointerdown', () => {
            this.tweens.add({
                targets: [this.cmyk, this.startButton, this.flower, this.creditsButton, this.tutorialButton],
                x: -250,
                duration: 2000,
                ease: 'Cubic',
                onComplete: ()=> this.scene.stop('menuScene'),
            });
            this.scene.start('creditsScene')
        });
    }
    update(){
        this.flower.angle++;
    }

}