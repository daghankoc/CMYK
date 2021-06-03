class Tutorial extends Phaser.Scene {
    constructor(){
        super("tutorialScene");
    }
    
    preload(){
        this.load.image('tutorial_select', './assets/tutorial/Tutorialselect.png');
        this.load.image('tutorial_combine', './assets/tutorial/TutorialCombine.png');
        this.load.image('tutorial_switch', './assets/tutorial/TutorialSwitch.png');
        this.load.image('tutorial_move', './assets/tutorial/TutorialMove.png');
    }

    create(){
        //this.cameras.main.fadeIn(2000, 0, 0, 0)
        let menuConfig = {
            fontFamily: 'Quicksand',
            fontSize: '28px',
            //backgroundColor: '#AEB6BF',
            color: '#AEB6BF',
            align: 'right',
            padding: {
                top: 0,
                bottom: 0,
            },
            fixedWidth: 0
        }
        this.add.image(game.config.width/2, game.config.height/8, 'tutorial_select').setOrigin(0.5)
        this.add.image(game.config.width/2, game.config.height/2.9, 'tutorial_combine').setOrigin(0.5)
        this.add.image(game.config.width/2, game.config.height*0.565, 'tutorial_switch').setOrigin(0.5)
        this.add.image(game.config.width/2.05, game.config.height*0.785, 'tutorial_move').setOrigin(0.5)
        
        this.add.text(game.config.width/2, game.config.height * 0.95, 'MAIN MENU', menuConfig).setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            this.tweens.add({
                targets: [this.cmyk, this.flower],
                x: -250,
                duration: 2000,
                ease: 'Cubic',
                onComplete: ()=> this.scene.stop('tutorialScene'),
            });
            this.scene.start('menuScene')
        });

        
    }
    update(){
    }

}