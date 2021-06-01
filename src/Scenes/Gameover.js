class Gameover extends Phaser.Scene{
    constructor(){
        super("gameoverScene");
    }

    preload(){
        this.load.image('cmyk_logo', './assets/CMYKmenu_logo.png');
        this.load.image('flower', './assets/menu_flower.png');
    }
    create(){
        let menuConfig = {
            fontFamily: 'Quicksand',
            fontSize: '28px',
            color: '#AEB6BF',
            align: 'right',
            padding: {
                top: 0,
                bottom: 0,
            },
            fixedWidth: 0
        }
        this.cmyk = this.add.image(screenCenterX, screenCenterY - 100, 'cmyk_logo').setOrigin(0.5);
        this.flower = this.add.image(screenCenterX+1, screenCenterY - 166, 'flower').setOrigin(0.5);
        this.gameover = this.add.text(game.config.width/2, game.config.height * 0.72, 'GAME OVER', menuConfig).setOrigin(0.5)
        this.scoreUI = this.add.text(game.config.width/2.1, game.config.height * 0.77, 'SCORE: ', menuConfig).setOrigin(0.5)
        this.score = this.add.text(game.config.width/1.715, game.config.height * 0.77, scoreCount, menuConfig).setOrigin(0.5)
        this.restartButton = this.add.text(game.config.width/2, game.config.height * 0.9, 'RESTART', menuConfig).setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            this.tweens.add({
                targets: [this.cmyk, this.flower, this.restartButton, this.gameover, this.score, this.scoreUI],
                x: -250,
                duration: 2000,
                ease: 'Cubic',
                onComplete: ()=> location.reload(),
            });
        });
    }
    update(){
        this.flower.angle--;
    }

    restart() {
        this.scene.stop('playScene');
        this.scene.start('playScene');
    }
}

