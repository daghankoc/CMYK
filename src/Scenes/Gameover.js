class Gameover extends Phaser.Scene{
    constructor(){
        super("gameoverScene");
    }

    preload(){
        this.load.image('ryb_logo', './assets/RYB_logo_linear.png');
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
        this.add.image(325, 250, 'ryb_logo'); 
        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2 , game.config.height/1.8, 'Score: ', menuConfig).setOrigin(0.5);
        //needs score variable
    }
    update(){

    }
    
}