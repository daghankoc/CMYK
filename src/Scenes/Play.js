class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    preload() {
        //loading map assets 
        this.load.image('tiles', './assets/CMYK_spritesheet1.png');

        //preload maps.
        this.load.tilemapTiledJSON('testmap1', './maps/CMYK_testmap1.json');
        this.load.tilemapTiledJSON('testmap2', './maps/CMYK_testmap2.json');
        this.load.tilemapTiledJSON('testmap3', './maps/CMYK_testmap3.json');
        this.load.tilemapTiledJSON('testmap4', './maps/CMYK_testmap4.json');
        this.load.tilemapTiledJSON('testmap5', './maps/CMYK_testmap5.json');
        this.load.tilemapTiledJSON('testmap6', './maps/CMYK_testmap6.json');
        this.load.tilemapTiledJSON('map1', './maps/CMYKmap1.json');
        this.load.tilemapTiledJSON('map2', './maps/CMYKmap2.json');
        this.load.tilemapTiledJSON('map3', './maps/CMYKmap3.json');
        this.load.tilemapTiledJSON('map4', './maps/CMYKmap4.json');
        this.load.tilemapTiledJSON('map5', './maps/CMYKmap5.json');
        this.load.tilemapTiledJSON('map6', './maps/CMYKmap6.json');


        //sound effect that plays when you move
        this.load.audio('move_sfx', './assets/sound/fx/woosh_better.wav');
        //sound effect that plays when you cycle colors
        this.load.audio('cycle_sfx', './assets/sound/fx/click.wav');
        //sound effect that plays when you cross into a new color zone (successfully)
        this.load.audio('transition_sfx', './assets/sound/fx/kick.wav');
        //sound effect that plays when you pause or use a menu button
        //this.load.audio('kick', './assets/sound/fx/kick.wav');
        //sound effect that plays when you crash :(
        this.load.audio('crash_sfx', './assets/sound/fx/crash.wav');
        //rewind
        this.load.audio('rewind', './assets/sound/fx/reverse.wav');
        //pause
        this.load.audio('pause_sfx', './assets/sound/fx/doink.wav');
        //background music
        this.load.audio('music_sfx1', './assets/sound/music/robotaki_obelisk.mp3');
        this.load.audio('music_sfx2', './assets/sound/music/open_eye_signal.mp3');
        this.load.audio('music_sfx3', './assets/sound/music/fuckin house music.wav');

        //load tutorial assets
        // this.load.image('tutorial_move', "./assets/tutorial/TutorialMove.png");
        // this.load.image('tutorial_cycle', "./assets/tutorial/TutorialCycle.png");
        // this.load.image('tutorial_prepare', "./assets/tutorial/TutorialPrepare.png");
        // this.load.image('tutorial_prepare_text', "./assets/tutorial/TutorialPrepareJustText.png");
        // this.load.image('tutorial_barrier', "./assets/tutorial/TutorialBarrier.png");

        //background
        this.load.image('background', "./assets/ui/bg 1.png");

        //UI background
        this.load.image('UIbackgroundR', "./assets/ui/UI_backgroundRight.png");
        this.load.image('UIbackgroundL', "./assets/ui/UI_backgroundLeft.png");

        //player spritesheet
        this.load.spritesheet('player', "./assets/CMYK_arrow_80_140.png",{
            frameWidth: 80,
            frameHeight: 140,
        });

        //rybit spritesheet
        this.load.image('RybitBlue', "./assets/Powerups/RYBbitBlue.png");

        //Score UI spritesheet
        this.load.spritesheet('scoreUI', "./assets/ui/CMYK_score_dot.png",{
            frameWidth: 50,
            frameHeight: 50,
        });

        //color UI spritesheet
        this.load.spritesheet('colorUI', "./assets/ui/CMYK UI.png",{
            frameWidth: 235,
            frameHeight: 110,
        });
    }
    
    
    create() {
        //setting the background color to eggshell
        //this.cameras.main.setBackgroundColor('#fbfbe3');
        this.bgm = this.sound.add('music_sfx3');
        this.bgm.play({loop: true, volume: 0.3});

        //this.randMusic = Math.floor(Math.random() * 3) + 1;  // returns a random integer from 1 to 3 
        //this.sound.play('music_sfx' + this.randMusic, {loop: true, volume: 0.3});
        //this.sound.play('music_sfx3', {loop: true, volume: 0.3});

        scoreCount = 0;1

        //declaring local variables
        this.transitioning = false;
        this.actionQueue = [];
        this.pause = false;
        this.crashing = false;
        this.colorTransition = false;
        this.endofgame = false;
        this.curRGB = 0;
        this.curColor = '';
        this.shipLocationRGB;
        this.scores = [];
        this.currentScore;
        this.currentPlayerColor;
        this.colorUI;
        this.scoreBackground;
        this.background = [];
        this.rewinding = false;
        this.rybitsArray - [];

        //declaring color bools

        this.C = false;
        this.M = false;
        this.Y = false;


        //Adding inputs to use
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyPause = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

        this.cameras.main.setAlpha(0);
        this.add.tween({
            targets: this.cameras.main,
            alpha: 1,
            duration: 1000,
        });

        for (let j = 0; j < 3; j++) {
            this.background[j] = this.add.tileSprite(screenCenterX, screenCenterY, 640, 960, 'background').setOrigin(0.5, 0.5);
            this.background[j].scale = ((j + 1) / 10) + 0.9;
            this.background[j].alpha = (j + 1) / 4;
        }

        //mapData array initialization, based on mapNames order
        for (let i = 0; i < mapNames.length; i++) {
            mapData.push(this.add.tilemap(mapNames[i]))
        }
        
        //map1 intiialization
        map1 = mapData[0];
        visuals1 = map1.addTilesetImage('spritesheet', 'tiles'); //change "base" to "spritesheet" when we add the loading stuff update
        botLayer1 = map1.createLayer('Tile Layer 1', [visuals1], mapX, map1relative);
        topLayer1 = map1.createLayer('Tile Layer 2', [visuals1], mapX, map1relative);
        botLayer1.scale = tilemapScale;
        topLayer1.scale = tilemapScale;

        //map2 initialization
        map2 = mapData[1];
        visuals2 = map2.addTilesetImage('spritesheet', 'tiles'); //change "base" to "spritesheet" when we add the loading stuff update
        botLayer2 = map2.createLayer('Tile Layer 1', [visuals2], mapX, map2relative);
        topLayer2 = map2.createLayer('Tile Layer 2', [visuals2], mapX, map2relative);
        botLayer2.scale = tilemapScale;
        topLayer2.scale = tilemapScale;

        // placing arrow asset
        playerShip = this.add.sprite(screenCenterX - (100 * tilemapScale), arrowY, 'player').setOrigin(0.5,0.5);
        playerShip.scale = arrowScale;

        //setting the player to color black for the start
        playerShip.setFrame(0);
        playerShip.currentFrame = 0 
        playerShip.setDepth('1');
        
        //creating colorUI
        this.colorUI = this.add.sprite(screenCenterX, screenCenterY + (screenCenterY * 0.85), 'colorUI').setOrigin(0.5, 0.5);
        this.colorUI.setDepth('1');
        //this.colorUI.scale = 0.5;
        this.colorUI.setFrame(0);

        this.scoreBackground = this.add.sprite(screenCenterX + (400 * tilemapScale), -100, 'UIbackgroundR').setOrigin(0,0);
        this.scoreBackground.alpha = 0.75;

        this.scoreBackground = this.add.sprite(screenCenterX - (400 * tilemapScale), -100, 'UIbackgroundL').setOrigin(1,0);
        this.scoreBackground.alpha = 0.75;

        this.createScoreUI();
    }

    update(){

        // let shipX = ((playerShip.x - mapX) / tilemapScale);
        // console.log(shipX);

        //Tween movement to right lane with right arrow key 
        if (Phaser.Input.Keyboard.JustDown(keyRight)) {
            this.actionQueue.push("right");
        }

        if (Phaser.Input.Keyboard.JustDown(keyLeft)) {
            this.actionQueue.push("left");
        }

        if (Phaser.Input.Keyboard.JustDown(spaceBar)) {
            this.actionQueue.push("space");
            //this.sound.play('cycle_sfx')
        }

        if (Phaser.Input.Keyboard.JustDown(keyPause)) { //pause button, needs menu?
            this.pause = !this.pause;
            this.sound.play('pause_sfx', {volume: 0.5});
            console.log("pause");
        }
        

        //selectiong the correct player color based on key inputs.
        this.C = keyA.isDown;
        this.M = keyW.isDown + keyS.isDown;
        this.Y = keyD.isDown;
        //console.log(this.C, this.M, this.Y);
        if (!this.rewinding) {
            this.currentPlayerColor = this.colorLogic(this.C, this.M, this.Y);
        } else {
            this.currentPlayerColor = playerColor;
        }
        
        //console.log(this.currentPlayerColor);
        if (this.currentPlayerColor != playerColor) {
            this.sound.play('cycle_sfx', {volume: 0.5});
            this.playerRevBump();
            switch (this.currentPlayerColor) {
                case 'black':
                    playerColor = 'black';
                    playerShip.setFrame(0);
                    this.colorUI.setFrame(0);
                    break;
                case 'cyan':
                    playerColor = 'cyan';
                    playerShip.setFrame(1);
                    this.colorUI.setFrame(1);
                    break;
                case 'majenta':
                    playerColor = 'majenta';
                    playerShip.setFrame(2);
                    this.colorUI.setFrame(2);
                    break;
                case 'yellow':
                    playerColor = 'yellow';
                    playerShip.setFrame(3);
                    this.colorUI.setFrame(3);
                    break;
                case 'red':
                    playerColor = 'red';
                    playerShip.setFrame(4);
                    this.colorUI.setFrame(4);
                    break;
                case 'green':
                    playerColor = 'green';
                    playerShip.setFrame(5);
                    this.colorUI.setFrame(5);
                    break;
                case 'blue':
                    playerColor = 'blue';
                    playerShip.setFrame(6);
                    this.colorUI.setFrame(6);
                    break;
                case 'eggshell':
                    playerColor = 'eggshell';
                    playerShip.setFrame(7);
                    this.colorUI.setFrame(7);
                    break;
            }
        }
        
        if (!this.transitioning && this.actionQueue.length > 0) {
            let action = this.actionQueue.shift();

            //Tween movement to right lane with left arrow key
            if(action == "right" && currentLane < 3){
                this.transitioning = true;
                this.sound.play('move_sfx', {volume: 0.20});

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
                this.sound.play('move_sfx', {volume: 0.20});

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

        this.background[0].tilePositionY -= 1;
        this.background[1].tilePositionY -= 1.1;
        this.background[2].tilePositionY -= 1.2;

        //run functions
        if (!this.pause) { //if the game is not paused...

            //update the score (if the score needs updating)
            if (scoreCount != this.currentScore) {
                this.updateScore(scoreCount);
                this.currentScore = scoreCount;
            }
            
            this.moveMap()

            // RGBA of pixel under player (both layers) -1 mean no layer (#topLayer problems)
            this.shipLocationRGB = this.getTilemapRGB();;

            //determine the correct layer to test
            if (this.shipLocationRGB[1][0] + this.shipLocationRGB[1][1] + this.shipLocationRGB[1][2] > 0) { //if top layer has a value
                this.curRGB = (this.shipLocationRGB[1]); //top layer is selected
            } else {
                this.curRGB = (this.shipLocationRGB[0]); //otherwise, bottom layer is selected
            }

            //check collisions
                this.checkCollisions(this.whatColor(this.curRGB), playerColor);
        }

        if (this.rewinding) {
            this.smoothRewind();
        }
    } // end of update function


    //------------Player Control Functions-------------//
    
    colorLogic(C, M, Y) {
        let color = ['black', 'cyan', 'majenta', 'blue', 'yellow', 'green', 'red', 'eggshell']
        //convert inputs to binary
        C *= 1;
        M *= 2;
        Y *= 4;
        return color[C + M + Y];
    }

    // function to figure out what color an RGB value is, This version uses a summed value of R G and B.
    whatColor(RGBA) {
        let color;
        let RGBsum = RGBA[0] + RGBA[1] + RGBA[2]; //sum Red Green and Blue values to get unique color code:
        switch (RGBsum) {
            case 86:
                color = 'black';
                break;
            case 563:
                color = 'cyan';
                break;
            case 579:
                color = 'majenta';
                break;
            case 586:
                color = 'yellow';
                break;
            case 352:
                color = 'red';
                break;
            case 327:
                color = 'green';
                break;
            case 315:
                color = 'blue';
                break;
            case 729:
                color = 'eggshell';
                break;
            default:
                color = 'n/a';
        }
        return color;
    }

    //~~~~~~~~Collision Handeler Functions~~~~~~~~//

    //get the RGB value of the pixel under the player (for both map layers)
    getTilemapRGB() {
        let tileY = 0;
        let tileX = 0;
        let selectedIndex = [-1, -1];
        let tileToCheckTop;
        let tileToCheckBot;
        let topLayerXY;
        let botLayerXY;
        let topRGB;
        let botRGB;
    
        //determine ship location (y) over tileMap and then converts to tileY, also gather tile data
        if (Math.abs(map1Pos) <= (Math.abs(map1relative + arrowY)) && map1Pos < arrowY) {
            tileY = ((map1Pos - arrowY) / tilemapScale) % 200;
            tileY = Math.abs(Math.floor(tileY));

            tileToCheckTop = topLayer1.getTileAtWorldXY(playerShip.x, playerShip.y, true);
            tileToCheckBot = botLayer1.getTileAtWorldXY(playerShip.x, playerShip.y, true);
        }

        if (Math.abs(map2Pos) <= (Math.abs(map1relative + arrowY)) && map2Pos < arrowY) {
            tileY = (((map1Pos - arrowY) + map1relative) / tilemapScale) % 200;
            tileY = Math.abs(Math.floor(tileY));

            tileToCheckTop = topLayer2.getTileAtWorldXY(playerShip.x, playerShip.y, true);
            tileToCheckBot = botLayer2.getTileAtWorldXY(playerShip.x, playerShip.y, true);
        }
    
        //determines ship X value and then converts to tileX
        tileX = Math.floor(((playerShip.x - mapX) / tilemapScale)) % 200;

        //if a tilemap is loaded, pull the correct indexes. otherwise just exit
        if (tileToCheckBot != null) {
                selectedIndex[0] = tileToCheckBot.index;
                selectedIndex[1] = tileToCheckTop.index;
            } else {
            selectedIndex = [-1, -1];
            return selectedIndex;
        }
    
        //if top layer isn't empty, get the RGB at player location
        if (selectedIndex[1] != -1) {
            topLayerXY = this.indexToTileOrigin(selectedIndex[1], tileX, tileY);
            topRGB = this.getPixelRGB(topLayerXY);
        } else {
            topRGB = [-1, -1, -1, -1];
        }

        //if bottom layer isn't empty, get the RGB at player location
        if (selectedIndex[0] != -1) {
            botLayerXY = this.indexToTileOrigin(selectedIndex[0], tileX, tileY);
            botRGB = this.getPixelRGB(botLayerXY);
        } else {
            botRGB = [-1, -1, -1, -1];
        }

        //return RGB data (or lack thereof)
        return [botRGB, topRGB];
    }
    
    //function that converts a tilemap index to the origin point (in pixels) of that tile on the map sprite atlas.
    indexToTileOrigin(index, arrowX, arrowY) {
        let indexMinus1 = index - 1;
        let originX = (Math.floor((indexMinus1) % 16)) * 200; //finds the top left corner of the tile in question (on the spritesheet)
        let originY = ((indexMinus1 - (indexMinus1 % 16)) / 16) * 200;

        return([originX + arrowX, originY + arrowY]);
    }

    //function that gets the RGB value at a particular XY location on the spritesheet 'tiles'
    getPixelRGB(xy) {
        let color = game.scene.getScenes()[0].textures.getPixel(xy[0], xy[1], 'tiles');
        if (color != null) {
            return [color.r, color.g, color.b, color.a]; //actual RGB
        } else {
            return [-1, -1, -1, -1];
        }  
    }
    
    //function that comapres the tilemap color to the player color and figures out what to do.
    checkCollisions(newTile, player) { 
        let oldTile = tileColor;
        if (oldTile != newTile) {
            this.colorTransition = true;
        } else {
            this.colorTransition = false;
        }
        if (this.colorTransition && !this.invulnerable) {
            switch (newTile) {
                case 'cyan':
                    if (player != 'cyan') {
                        this.crashing = true;
                    } else {
                        //console.log('safe cyan');
                        this.playerBump();
                        this.sound.play('kick', {volume: 0.6});
                        safeTranstions++;
                    }
                    break;
                case 'majenta':
                    if (player != 'majenta') {
                        this.crashing = true;
                    } else {
                        //console.log('safe majenta');
                        this.playerBump();
                        this.sound.play('kick', {volume: 0.6});
                        safeTranstions++;
                    }
                    break;
                case 'yellow':
                    if (player != 'yellow') {
                        this.crashing = true;
                    } else {
                        //console.log('safe yellow');
                        this.playerBump();
                        this.sound.play('kick', {volume: 0.6});
                        safeTranstions++;
                    }
                    break;
                case 'red':
                    if (player != 'red') {
                        this.crashing = true;
                    } else {
                        //console.log('safe red');
                        this.playerBump();
                        this.sound.play('kick', {volume: 0.6});
                        safeTranstions++;
                    }
                    break;
                case 'green':
                    if (player != 'green') {
                        this.crashing = true;
                    } else {
                        //console.log('safe green');
                        this.playerBump();
                        this.sound.play('kick', {volume: 0.6});
                        safeTranstions++;
                    }
                    break;
                case 'blue':
                    if (player != 'blue') {
                        this.crashing = true;
                    } else {
                        //console.log('safe blue');
                        this.playerBump();
                        this.sound.play('kick', {volume: 0.6});
                        safeTranstions++;
                    }
                    break;
                case 'eggshell':
                    this.crashing = true;
                    break;
                case 'black':
                    //console.log('safe black');
                    break;
                default:
                    //console.log('n/a');
            }
        }
        if (this.crashing) { //if a crash has been detected
            console.log('crashed!');
            
            //trying to create a rybit
            //this.rybit1 = new Rybit(this, player.x,player.y,'RybitBlue',0,0).setOrigin(0,0);
            this.sound.play('crash_sfx');
            this.pause = true;
            this.crashing = false;
            if(lives == 0) {
                console.log("game over!");
                this.playerDeath();
                this.tweens.add({
                    targets:  this.bgm,
                    volume: 0,
                    duration: 1950,
                    ease: 'cubic',
                    onComplete: ()=> this.bgm.stop(),
                });
                this.add.tween({
                    targets: this.cameras.main,
                    alpha: 0,
                    duration: 2000,
                    onComplete: ()=> this.endScene(),
                });
                // this.time.addEvent({
                //     delay: 2000,
                //     callback: ()=>{
                //         this.endScene();
                //     },
                //     loop: false
                // })
            } else if (lives > 0 ) {
                this.playerRewind();
                this.reverseMap();
                lives--;
                console.log("remaining lives: " + lives);
            }
        }
        tileColor = newTile;
    }

    //~~~~~~~~ Map Functions ~~~~~~~//

    //functions that handels moving the two maps, switching thier contents and positions occasionally.
    moveMap() {
        map1Pos = map1dist;
        map2Pos = map2dist;
        
        if (nextMap < mapNames.length - 1) {
            if (map1Pos > game.config.height + 50) {
                map1dist = (map2dist + map1relative);
                //scrollSpeed++
                if (nextMap >= mapNames.length -1) {
                    nextMap = mapNames.length -1;
                }
                this.swapMap1(nextMap);
                this.laneAddition(nextMap)
                nextMap++;
            }
        
            if (map2Pos > game.config.height + 50) {
                map2dist = (map1dist + map1relative);
                scrollSpeed++
                if (nextMap >= mapNames.length -1) {
                    nextMap = mapNames.length -1;
                }
                this.swapMap2(nextMap)
                this.laneAddition(nextMap)
                nextMap++
            }
        }
        botLayer1.setPosition(mapX, map1Pos);
        topLayer1.setPosition(mapX, map1Pos);
        botLayer2.setPosition(mapX, map2Pos);
        topLayer2.setPosition(mapX, map2Pos);
    
        //step maps forward
        map1dist += scrollSpeed;
        map2dist += scrollSpeed;
        rawDist += scrollSpeed; //this is used for scoring.

        scoreCount = Math.floor((rawDist / tilemapScale) / 200)
    }

    //swap map functions, uses mapData array which is constructed in the create method.
    swapMap1(index) {
        map1 = mapData[index];
        botLayer1.destroy();
        topLayer1.destroy();

        botLayer1 = map1.createLayer('Tile Layer 1', [visuals1], mapX, map1relative);
        topLayer1 = map1.createLayer('Tile Layer 2', [visuals1], mapX, map1relative);
        botLayer1.scale = tilemapScale;
        topLayer1.scale = tilemapScale;
    }
    
    swapMap2(index) {
        map2 = mapData[index];
        botLayer2.destroy();
        topLayer2.destroy();

        botLayer2 = map2.createLayer('Tile Layer 1', [visuals2], mapX, map2relative);
        topLayer2 = map2.createLayer('Tile Layer 2', [visuals2], mapX, map2relative);
        botLayer2.scale = tilemapScale;
        topLayer2.scale = tilemapScale;
    }

    endScene() {
        this.scene.stop('playScene');
        this.scene.launch('gameoverScene');
    }

    //~~~~~~~~Score Functions~~~~~~~~//

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

    //~~~~~~~~Rybit / Power up functions~~~~~~~~//

    rybitSpawner(inventory) {
        let curBit;
        if (inventory.length != 0) {
            curBit = inventory[inventory.length - 1].colorID;
        } else {
            curBit = 0;
        }
        rybitsArray.unshift(new rybit); //this.add.prefab whatever it is
        rybitsArray[0].x = Math.floor(Math.random() * 3);; //randomly decide which lane to spawn the bit in.
        rybitsArray[0].colorID = curBit + 1; //make the new bit the next color you need to collect
    }

    rybitMover() {
        if (rybitsArray.length != 0) {
            for (let i = 0; i < rybitsArray.length; i++) {
                rybitsArray[i].y += scrollSpeed;
                if (rybitsArray[i].y > arrowY - 25 && rybitsArray[i].y < arrowY + 25) {
                    this.rybitCollision(rybitsArray[i]); //passes whole rybit when it's in the range of the player.
                }
                //if the bit is off the bottom of the map, remove it
                if (rybitsArray[i].y >  game.config.height + 50) {
                    //destory the bit (code here)
                    rybitsArray.splice(i); //remove the refrence from the array
                }
            }
        }
    }

    rybitCollision(rybit) {
        if (rybit.x == playerShip.x) {
            //run collection code which sends the bit to the inventory array, and moves it to its spot in the rybbit UI.
        }
    }

    //function that adds the bits to your inventory

    //function that combines rybits when you have enough

    //~~~~~~~~effects~~~~~~~~//

    playerBump() {
        this.add.tween({
            targets: playerShip,
            scale : arrowScale+ 0.1,
            duration: 20,
            ease: 'linear',
            onComplete: ()=> this.add.tween({
                targets: playerShip,
                scale : arrowScale,
                duration: 80,
                ease: 'cubic',
            }),
        })
    }

    playerRevBump() {
        playerShip.scale = arrowScale - (arrowScale / 20);
        this.add.tween({
            targets: playerShip,
            scale : arrowScale,
            duration: 50,
            ease: 'cubic',
        })
    }

    playerRewind() {
        this.invulnerable = true;
        this.bgm.volume = 0.1;
        this.add.tween({
            targets: playerShip,
            scale : arrowScale + 0.2,
            alpha : 0.5,
            duration: 50,
            ease: 'linear',
            onComplete: ()=> this.add.tween({
                targets: playerShip,
                scale : arrowScale + 0.1,
                duration: 500,
                ease: 'cubic',
            }),
        })
        this.time.addEvent({
            delay: 1500,
            callback: ()=>{
                this.add.tween({
                    targets: playerShip,
                    scale : arrowScale,
                    duration: 500,
                    ease: 'cubic',
                })
            },
            loop: false
        })
        this.time.addEvent({
            delay: 2900,
            callback: ()=>{
                this.add.tween({
                    targets: playerShip,
                    alpha : 1,
                    duration: 50,
                    ease: 'cubic',
                    onComplete: () => {this.bgm.volume = 0.3, this.invulnerable = false;},
                })
                this.playerBump();
            },
            loop: false
        })
    }

    playerDeath() {
        this.add.tween({
            targets: playerShip,
            scale : 1,
            duration: 1100,
            ease: 'cubic',
        })
        this.add.tween({
            targets: playerShip,
            alpha : 0,
            duration: 1100,
            ease: 'cubic',
        })
    }

    //~~~~~~~~Other Functions~~~~~~~~//

    laneAddition(index){
        if(index >= secondLane && index < thirdLane - 1){
            laneNumber = 2;
        }  else if(index >= thirdLane){
            laneNumber = 3;
        }
    }
    reverseMap() {
        let m1Reset;
        let m2Reset;
        if (Math.abs(map1Pos - 4000) < Math.abs(map2Pos - 4000)) {
            m1Reset = map1relative + arrowY;
            m2Reset = map2relative + arrowY;
        } else {
            m1Reset = map2relative + arrowY;
            m2Reset = map1relative + arrowY;
        }

        console.log('reversed');
        this.sound.play('rewind', {volume: 0.5});
        this.rewinding = true;
        this.add.tween({
            targets: topLayer1,
            y : m1Reset,
            duration: 2000,
            ease: 'Cubic',
            // onComplete: ()=> this.transitioning = false,
        })
        this.add.tween({
            targets: botLayer1,
            y : m1Reset,
            duration: 2000,
            ease: 'Cubic',
            onComplete: ()=> this.rewindPos(m1Reset, m2Reset),
        })

        this.add.tween({
            targets: topLayer2,
            y : m2Reset,
            duration: 2000,
            ease: 'Cubic',
            // onComplete: ()=> this.transitioning = false,
        })
        this.add.tween({
            targets: botLayer2,
            y : m2Reset,
            duration: 2000,
            ease: 'Cubic',
            onComplete: ()=> this.rewindPos(m1Reset, m2Reset),
        })
        // setTimeout(() => {
        //     this.pause = false;
        //     lives --;
        //     map1Pos -= m1Reset;
        //     map2Pos -= m2Reset;
        // }, 3000);
    }

    smoothRewind() {
        topLayer1.y = Math.floor(topLayer1.y);
        botLayer1.y = Math.floor(botLayer1.y);
        topLayer2.y = Math.floor(topLayer2.y);
        botLayer2.y = Math.floor(botLayer2.y);
    }

    //updates the mapDist values after a rewind is complete.
    rewindPos(m1,m2) {
        map1dist = m1;
        map2dist = m2;
        this.pause = false;
        this.rewinding = false;
    }
}