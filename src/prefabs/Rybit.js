class Rybit extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame, colorID) {
    super(scene, x, y, texture, frame, colorID);
    scene.add.existing(this);
    
    this.color = colorID;
    this.wiggleBool = false;
    this.captured = false;
  }
}
