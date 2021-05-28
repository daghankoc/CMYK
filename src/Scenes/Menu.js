class Menu extends Phaser.Scene {
    constructor(){
        super("menuScene");
    }
    
    preload(){
        this.load.image('cmyk_logo', './assets/CMYKmenu_logo.png');
        this.load.image('flower', './assets/menu_flower.png');
    }

    create(){
        let menuConfig = {
            fontFamily: 'Quicksand',
            fontSize: '28px',
            backgroundColor: '#AEB6BF',
            color: '#000',
            align: 'right',
            padding: {
                top: 0,
                bottom: 0,
            },
            fixedWidth: 0
        }
        this.ryb = this.add.image(screenCenterX-1, screenCenterY - 100, 'cmyk_logo').setOrigin(0.5);
        this.flower = this.add.image(screenCenterX, screenCenterY - 166, 'flower').setOrigin(0.5);
        //const startButton = this.add.text(game.config.width/2, game.config.height/2, 'START', menuConfig).setOrigin(0.5)
        //.setInteractive()
        // .on('pointerdown', () => this.scene.start("playScene"));
        
        this.startButton = this.add.text(game.config.width/2, game.config.height * 0.75, 'START', menuConfig).setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => 
            this.tweens.add({
                targets: [this.ryb, this.startButton],
                x: -250,
                duration: 2000,
                ease: 'Cubic',
                onComplete: ()=> this.scene.start('playScene'),
            })
        //this.scene.start("playScene")
        );

        
    }
    update(){
        this.flower.angle++;
    }

}