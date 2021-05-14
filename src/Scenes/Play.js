class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    preload() {
        
        //loading the assets   

        //loading tilemap assets
        this.load.image('tiles', './assets/rybSpriteSheet.png');

        //this.load.tilemapTiledJSON('map', './maps/testmap_2.json');
        //this.load.tilemapTiledJSON('map1', './maps/map1.json');

        //preload final maps.

            this.load.tilemapTiledJSON('easy1', './maps/maps_skill/easy1.json');
            this.load.tilemapTiledJSON('easy2', './maps/maps_skill/easy2.json');
            this.load.tilemapTiledJSON('easy3', './maps/maps_skill/easy3.json');

            this.load.tilemapTiledJSON('mid1', './maps/maps_skill/mid1.json');
            this.load.tilemapTiledJSON('mid2', './maps/maps_skill/mid2.json');
            this.load.tilemapTiledJSON('mid3', './maps/maps_skill/mid3.json');
            this.load.tilemapTiledJSON('mid4', './maps/maps_skill/mid4b.json');

            this.load.tilemapTiledJSON('hard1', './maps/maps_skill/hard1.json');
            this.load.tilemapTiledJSON('hard2', './maps/maps_skill/hard2.json');
            this.load.tilemapTiledJSON('hard3', './maps/maps_skill/hard3.json');
            this.load.tilemapTiledJSON('hard4', './maps/maps_skill/hard4.json');
            this.load.tilemapTiledJSON('hard5', './maps/maps_skill/hard5.json');
            this.load.tilemapTiledJSON('hard6', './maps/maps_skill/hard6.json');
            this.load.tilemapTiledJSON('hard7', './maps/maps_skill/hard7.json');


        //sound effect that plays when you move
        this.load.audio('move_sfx', './assets/testSound.wav')

        //sound effect that plays when you cycle colors
        this.load.audio('cycle_sfx', './assets/testSound.wav')

        //sound effect that plays when you cross into a new color zone (successfully)
        this.load.audio('transition_sfx', './assets/testSound.wav')

        //sound effect that plays when you pause or use a menu button
        this.load.audio('menu_sfx', './assets/testSound.wav')

        //sound effect that plays when you crash :(
        this.load.audio('menu_sfx', './assets/testSound.wav')

        //background music
        this.load.audio('music_sfx', './assets/testMusic.mp3')


        //load image assets
        this.load.image('UI_circle','./assets/UI_circle.png');
        this.load.image('UI_circle_outline','./assets/UI_circle_outline.png');
    
        //loading the different player colors as spritesheets
        //frame 1 = red, 2 = blue,3 = yellow 
        this.load.spritesheet('player', "./assets/arrowRYB.png",{
            frameWidth: 112,
            frameHeight: 167,
            });
    }
    
    
    create() {
        //setting the background color to eggshell
        this.cameras.main.setBackgroundColor('#fbfbe3');

        this.sound.play('music_sfx');

        //declaring local variables
        this.transitioning = false;
        this.actionQueue = [];
        this.pause = false;
        this.crash = false;


        //Adding inputes to use
        spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyPause = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

        //maps
        map3 = this.add.tilemap('easy1');
        map3_visuals = map3.addTilesetImage('spritesheet', 'tiles');
        map4 = this.add.tilemap('easy2');
        map4_visuals = map4.addTilesetImage('spritesheet', 'tiles');
        map5 = this.add.tilemap('easy3');
        map5_visuals = map5.addTilesetImage('spritesheet', 'tiles');
        map6 = this.add.tilemap('mid1');
        map6_visuals = map6.addTilesetImage('spritesheet', 'tiles');
        map7 = this.add.tilemap('mid2');
        map7_visuals = map7.addTilesetImage('spritesheet', 'tiles');


        //map1 initialization
        map1 = this.add.tilemap('hard2');
        visuals1 = map1.addTilesetImage('spritesheet', 'tiles'); //change "base" to "spritesheet" when we add the loading stuff update
        botLayer1 = map1.createLayer('Tile Layer 1', [visuals1], mapX, map1relative);
        topLayer1 = map1.createLayer('Tile Layer 2', [visuals1], mapX, map1relative);
        botLayer1.scale = tilemapScale;
        topLayer1.scale = tilemapScale;
        currentMap = map1;

        //map2 initialization
        map2 = this.add.tilemap('hard3');
        visuals2 = map2.addTilesetImage('spritesheet', 'tiles'); //change "base" to "spritesheet" when we add the loading stuff update
        botLayer2 = map2.createLayer('Tile Layer 1', [visuals2], mapX, map2relative);
        topLayer2 = map2.createLayer('Tile Layer 2', [visuals2], mapX, map2relative);
        botLayer2.scale = tilemapScale;
        topLayer2.scale = tilemapScale;

        // placing arrow asset
        playerShip = this.add.sprite(screenCenterX, arrowY, 'player').setOrigin(0.5,0.5);
        playerShip.scale = arrowScale;


        //setting the player to color red for the start
        playerShip.setFrame(0);
        playerShip.currentFrame = 0 


        //rendering the ship above the lane
        playerShip.setDepth('1');    

        //creating a bottom UI bar for the color indicator
        this.circleOutline = this.add.sprite(screenCenterX - (arrowDist/2), 936, 'UI_circle_outline').setOrigin(0.5, 0.5);
        this.circleOutline.setDepth('2');

        //this.add.rectangle(0, screenCenterY * 1.9,screenCenterX * 2 , screenCenterY / 3, "0xffffff").setOrigin(0.5, 0.5);
        this.redCircle = this.add.sprite(screenCenterX - (arrowDist/2), 935, 'UI_circle').setOrigin(0.5, 0.5);
        this.redCircle.setTint("0xCF1313");
        this.redCircle.setDepth('1');
        
        this.yellowCircle = this.add.sprite(screenCenterX, 935, 'UI_circle').setOrigin(0.5, 0.5);
        this.yellowCircle.setTint("0xeed456");
        this.yellowCircle.setDepth('1');

        this.blueCircle = this.add.sprite(screenCenterX + (arrowDist/2), 935, 'UI_circle').setOrigin(0.5, 0.5);
        this.blueCircle.setTint("0x1181D9");
        this.blueCircle.setDepth('1');

 
    }
    update(){

        // let shipX = ((playerShip.x - mapX) / tilemapScale);
        // console.log(shipX);

        //Tween movement to right lane with right arrow key 
        if (Phaser.Input.Keyboard.JustDown(keyRight)) {
            this.actionQueue.push("right");
            this.sound.play('move_sfx');
        }

        if (Phaser.Input.Keyboard.JustDown(keyLeft)) {
            this.actionQueue.push("left");
            this.sound.play('move_sfx')
        }

        if (Phaser.Input.Keyboard.JustDown(spaceBar)) {
            //mapSpawner(mapToRemove);
            this.actionQueue.push("space");
            this.sound.play('cycle_sfx')
        }

        if (Phaser.Input.Keyboard.JustDown(keyPause)) { //pause button, needs menu?
            this.pause = !this.pause;
            this.sound.play('move_sfx');
        }
        
        
        if (!this.transitioning && this.actionQueue.length > 0) {
            let action = this.actionQueue.shift();
            if (action == "space") {
                mapSpawner();
                if (playerShip.currentFrame == 0)
                {
                    console.log("Color switched to yellow");
                    //changes the frame of the spritesheet to blue
                    playerShip.setFrame(1);
                    playerShip.currentFrame = 1;
                    this.circleOutline.setPosition(screenCenterX, 936);
                } else if (playerShip.currentFrame == 1)
                {
                    console.log("Color switched to blue");
                    //changes the frame of the spritesheet to blue
                    playerShip.setFrame(2);
                    playerShip.currentFrame = 2;
                    this.circleOutline.setPosition(screenCenterX + (arrowDist/2), 935);
                } else if(playerShip.currentFrame == 2)
                {
                    console.log("Color switched to red");
                    //changes the frame of the spritesheet to blue
                    playerShip.setFrame(0);
                    playerShip.currentFrame = 0;
                    this.circleOutline.setPosition(screenCenterX - (arrowDist/2), 935);
                }
            }

            //Tween movement to right lane with left arrow key
            if(action == "right" && currentLane < 2){
                this.transitioning = true;

                this.add.tween({
                    targets: playerShip,
                    x : arrowMovementR,
                    duration: 200,
                    ease: 'Cubic',
                    onComplete: ()=> this.transitioning = false,
                })
                currentLane ++;
            }

            //Tween movement to left lane with left arrow key
            if(action == "left" && currentLane > 0){
                this.transitioning = true;

                this.add.tween({
                    targets: playerShip,
                    x : arrowMovementL,
                    duration: 200,
                    ease: 'Cubic',
                    onComplete: ()=> this.transitioning = false,
                })
                currentLane --;
            }
        }

        //getting the tile that the player is on every frame
        //var tileToCheckTop = topLayer.getTileAtWorldXY(playerShip.x, playerShip.y, true);
        //var tileToCheckTop = botLayer.getTileAtWorldXY(playerShip.x, playerShip.y, true);
        
        //console.log(tileToCheckTop.index);
        
        //var color1 = tileToCheck.texture.getPixel(10,10);
        //console.log(color1);

    

        let tileToCheckTop = topLayer1.getTileAtWorldXY(playerShip.x, playerShip.y, true);
        let tileToCheckBot = botLayer1.getTileAtWorldXY(playerShip.x, playerShip.y, true);
        //console.log(tileToCheckTop); Passes entire object...


        function indexToTileOrigin(index) {
            let originX = (Math.floor(index % 5)) * 200; //finds the top left corner of the tile in question (on the spritesheet)
            let originY = (Math.floor(index / 5)) * 200;
            return([originX, originY]);
        }

        //checkCollisions(tileToCheckTop, tileToCheckBot);

        function checkCollisions(topIndex, botIndex) {
            let tileY = 0;
            
            //determine ship location over tileMap and then converts to tileY
            if (botLayer1.y <= (map1relative + arrowY) && botLayer1.y > arrowY) {
                tileY = ((botLayer1.y / tilemapScale) + arrowHeight)% 200;
            }
            if (botLayer2.y <= (map1relative + arrowY) && botLayer2.y > arrowY) {
                tileY = ((botLayer2.y / tilemapScale) + arrowHeight)% 200;
            }
            //if (tileY = -1)
            
            //determines ship X value and then converts to tileX
            let shipX = ((playerShip.x - mapX) / tilemapScale);
            let tileX = Math.floor(shipX) % 200


            //get pixel color at location on spritesheet
            let color = this.textures.getPixel(tileX, tileY, 'tiles2');
            console.log(color);

            //compare do stuff with pixel color
                //if topLayer is null (0, 0, 0) check bottom layer
                    //if eggshell do nothing
                    //if barrier crash
                    //if red yellow or blue
                        //compare color to current color 
                        //if transition is fresh and color is same, do noting
                        //if transition is fresh and color is different, crash (after certin ammount of time)
                //set "crash" to true if crashed
        }
         
        
        //updateMap(travelDist, scrollSpeed); //old updateMap function, here for testing mostly...

        if (!this.pause) { //if the game is not paused...
            moveMap() //run moveMap fuction
        }

        function moveMap() {
            map1Pos = map1dist; 
            map2Pos = map2dist;

            if (map1Pos > game.config.height + 50) {
                map1dist = (map2dist + map1relative);
                scrollSpeed++
                //CALL FUNCTION THAT SWAPS MAPS HERE
            }

            if (map2Pos > game.config.height + 50) {
                map2dist = (map1dist + map1relative);
                scrollSpeed++
                //CALL FUNCTION THAT SWAPS MAPS HERE
            }

            botLayer1.setPosition(mapX, map1Pos);
            topLayer1.setPosition(mapX, map1Pos);
            botLayer2.setPosition(mapX, map2Pos);
            topLayer2.setPosition(mapX, map2Pos);

            //step maps forward
            //if has crashed is false
            map1dist += scrollSpeed;
            map2dist += scrollSpeed;
            rawDist++;
        }

        function mapSpawner(){
            //map1.LayerData.destroy();
            if(travelDist <= 100){
                var value = Phaser.Math.Between(0, 5);
                console.log(value);
                if(value == 1){
                    map3_botLayer = map3.createLayer('Tile Layer 1', [map3_visuals], mapX, map2relative);
                    map3_topLayer = map3.createLayer('Tile Layer 2', [map3_visuals], mapX, map2relative);
                    map3_botLayer.scale = tilemapScale;
                    map3_topLayer.scale = tilemapScale;
                    currentMap = map3;
                } else if (value == 2){
                    map4_botLayer = map4.createLayer('Tile Layer 1', [map4_visuals], mapX, map2relative);
                    map4_topLayer = map4.createLayer('Tile Layer 2', [map4_visuals], mapX, map2relative);
                    currentMap = map4;
                    map4_botLayer.scale = tilemapScale;
                    map4_topLayer.scale = tilemapScale;
                } else if (value == 3){
                    map5_botLayer = map5.createLayer('Tile Layer 1', [map5_visuals], mapX, map2relative);
                    map5_topLayer = map5.createLayer('Tile Layer 2', [map5_visuals], mapX, map2relative);
                    currentMap = map5;
                    map5_botLayer.scale = tilemapScale;
                    map5_topLayer.scale = tilemapScale;
                } else if (value == 4){
                    map6_botLayer = map6.createLayer('Tile Layer 1', [map6_visuals], mapX, map2relative);
                    map6_topLayer = map6.createLayer('Tile Layer 2', [map6_visuals], mapX, map2relative);
                    currentMap = map6;
                    map6_botLayer.scale = tilemapScale;
                    map6_topLayer.scale = tilemapScale;
                } else if (value == 5){
                    map7_botLayer = map7.createLayer('Tile Layer 1', [map7_visuals], mapX, map2relative);
                    map7_topLayer = map7.createLayer('Tile Layer 2', [map7_visuals], mapX, map2relative);
                    currentMap = map7;
                    map7_botLayer.scale = tilemapScale;
                    map7_topLayer.scale = tilemapScale;
                } 
                
            } else if (travelDist > 100){
                Debug.log(">100");
            }
            
        }
    }
}