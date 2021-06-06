class Rybit extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y,texture, frame, colorID) {
      super(scene, x, y, texture, frame, colorID);
      scene.add.existing(this);

      if(colorID == 0){
       //this.setTexture('RybitBlue');
       console.log('texture set');
      } else if (colorID == 1) {
        //this.setTexture('RybitBlue');
        console.log('texture set');
      } else if (colorID == 2) {
        //this.setTexture('RybitBlue');
        console.log('texture set');
      } else if (colorID == 3) {
        //this.setTexture('RybitBlue');
        console.log('texture set');
      } else if (colorID == 4) {
        //this.setTexture('RybitBlue');
        console.log('texture set');
      } else if (colorID == 5) {
        //this.setTexture('RybitBlue');
        console.log('texture set');
      }
      
    }
    update() {
        
    }
    reset() {
        
    }
}