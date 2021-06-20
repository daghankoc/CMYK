class Menu extends Phaser.Scene {
    constructor(){
        super("menuScene");
    }
    
    preload(){
        this.load.audio('main_menu', './assets/sound/music/main menu.wav');
        this.load.audio('kick', './assets/sound/fx/kick.wav');

        this.load.image('cmyk_logo', './assets/CMYKmenu_logo.png');
        this.load.image('flower', './assets/menu_flower.png');
        this.load.image('beginButton', './assets/MenuButtonBegin.png');
        this.load.image('creditsButton', './assets/MenuButtonCredits.png');
        this.load.image('tutorialButton', './assets/MenuButtonTutorial.png');
    }

    create(){
        if (!this.bgm) {
            this.bgm = this.sound.add('main_menu', {loop: true, volume: 0.3});
            this.bgm.play();
            this.cameras.main.setAlpha(0);
            this.add.tween({
                targets: this.cameras.main,
                alpha: 1,
                duration: 1000,
            });
        }

        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        
        
        //this.cameras.main.fadeIn(2000, 0, 0, 0)
        this.cmyk = this.add.image(screenCenterX, screenCenterY - 100, 'cmyk_logo').setOrigin(0.5);
        this.flower = this.add.image(screenCenterX+1, screenCenterY - 166, 'flower').setOrigin(0.5);
        this.creditsButton = this.add.image(game.config.width/1.45, game.config.height * 0.8, 'creditsButton').setOrigin(0.5)
        this.tutorialButton = this.add.image(game.config.width/3.2, game.config.height * 0.8, 'tutorialButton').setOrigin(0.5)

        this.startButton = this.add.image(game.config.width/2, game.config.height * 0.8, 'beginButton').setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            this.startGame();
        });

        this.creditsButton
        .setInteractive()
        .on('pointerdown', () => {
            this.sound.play('kick', {volume: 0.5});
            this.tweens.add({
                targets: [this.cmyk, this.startButton, this.flower, this.creditsButton, this.tutorialButton],
                x: -250,
                duration: 2000,
                ease: 'Cubic',
                onComplete: ()=> this.scene.stop('menuScene'),
            });
            this.scene.start('creditsScene')
        });

        this.tutorialButton
        .setInteractive()
        .on('pointerdown', () => {
            this.sound.play('kick', {volume: 0.5});
            this.tweens.add({
                targets: [this.cmyk, this.startButton, this.flower, this.creditsButton, this.tutorialButton],
                x: -250,
                duration: 2000,
                ease: 'Cubic',
                onComplete: ()=> this.scene.stop('menuScene'),
            });
            this.scene.start('tutorialScene')
        });

    }
    update(){
        this.flower.angle++;

        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            this.startGame();
        }
    }

    startGame() {
        this.sound.play('kick', {volume: 0.5});
        this.tweens.add({
            targets:  this.bgm,
            volume:   0,
            duration: 2000,
            onComplete: ()=> this.bgm.stop(),
        });

        this.tweens.add({
            targets: [this.cmyk, this.startButton, this.flower, this.creditsButton, this.tutorialButton],
            x: -210,
            duration: 2000,
            ease: 'Cubic',
            onComplete: ()=> {this.scene.stop('menuScene'), this.scene.launch('playScene')}
        });
    }
}