class Gameover extends Phaser.Scene{
    constructor(){
        super("gameoverScene");
    }

    preload(){
        this.load.image('cmyk_logo', './assets/CMYKmenu_logo.png');
        this.load.image('flower', './assets/menu_flower.png');

        this.load.audio('gameover', './assets/sound/music/game over.wav');
    }
    create(){
        this.cameras.main.setAlpha(0);
        this.add.tween({
            targets: this.cameras.main,
            alpha: 1,
            duration: 1000,
        });
        //this.cameras.main.fadeIn(2000, 0, 0, 0)
        this.bgm = this.sound.add('gameover', {volume: 0, loop: true});
        this.bgm.play();
        this.add.tween({
            targets: this.bgm,
            volume: 0.5,
            duration: 1000,
        });

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
                x: 800,
                duration: 1500,
                ease: 'Cubic',
                onComplete: ()=> location.reload(),
            });
        });
    }
    update(){
        this.flower.angle--;
    }

    createScoreUI() {
        let i = 0;
        let posX = dotPaddingRight;
        let posY = dotPaddingTop;

        for (i = 1; i <= 16; i++) {
            if (i == 9) {
                posX -= dotHorizSpacing;
                posY = dotPaddingTop;
            }
            let score = this.add.sprite(posX, posY, 'scoreUI').setOrigin(0.5, 0.5);
            score.setDepth('1');
            score.scale = 0.5;
            score.setFrame(0);

            this.scores.push(score);
            posY += dotVertSpacing;
        }
    }

    //returns the (unsigned) binary data of a passed integer in 16 bits.
    scoreBinary(score) {
        if (score < 0) {
            return 0;
        }
        let outputArr = [];
        let num = score;
        while(outputArr.length < 16) {
            outputArr.push(num % 2);
            num = Math.floor(num/2);
        }
        //console.log(outputArr)
        return outputArr;
    }

    updateScore(score) {
        let i = 0;
        let binaryData = this.scoreBinary(score);
        for (i = 0; i < 16; i++) {
            this.scores[i].setFrame(binaryData[i]);
        }
    }

    restart() {
        this.scene.stop('playScene');
        this.scene.start('playScene');
    }
}

