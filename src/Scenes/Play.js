class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    preload() {
        //loading the assets   

        this.load.image('tiles', './assets/CMYK_spritesheet.png');

        //preload maps.
        this.load.tilemapTiledJSON('CMYKtestmap1', './maps/CMYK testmap1.json');
        this.load.tilemapTiledJSON('CMYKtestmap2', './maps/CMYK testmap2.json');


        //sound effect that plays when you move
        this.load.audio('move_sfx', './assets/sound/testSound.wav');
        //sound effect that plays when you cycle colors
        this.load.audio('cycle_sfx', './assets/sound/testSound.wav');
        //sound effect that plays when you cross into a new color zone (successfully)
        this.load.audio('transition_sfx', './assets/sound/testSound.wav');
        //sound effect that plays when you pause or use a menu button
        this.load.audio('menu_sfx', './assets/sound/testSound.wav');
        //sound effect that plays when you crash :(
        this.load.audio('menu_sfx', './assets/sound/testSound.wav');
        //background music
        this.load.audio('music_sfx', './assets/sound/robotaki_obelisk.mp3');


        //load tutorial assets
        this.load.image('tutorial_move', "./assets/tutorial/TutorialMove.png");
        this.load.image('tutorial_cycle', "./assets/tutorial/TutorialCycle.png");
        this.load.image('tutorial_prepare', "./assets/tutorial/TutorialPrepare.png");
        this.load.image('tutorial_prepare_text', "./assets/tutorial/TutorialPrepareJustText.png");
        this.load.image('tutorial_barrier', "./assets/tutorial/TutorialBarrier.png");

    
        //loading the different player colors as spritesheets
        //frame 1 = red, 2 = blue,3 = yellow 
        this.load.spritesheet('player', "./assets/CMYK_arrow_80_140.png",{
            frameWidth: 80,
            frameHeight: 140,
        });
    
        this.load.spritesheet('redUI', "./assets/ui/dotsred.png",{
            frameWidth: 100,
            frameHeight: 100,
        });

        this.load.spritesheet('yellowUI', "./assets/ui/dotsyellow.png",{
            frameWidth: 100,
            frameHeight: 100,
        });

        this.load.spritesheet('blueUI', "./assets/ui/dotsblue.png",{
            frameWidth: 100,
            frameHeight: 100,
        });

        this.load.spritesheet('scoreUI', "./assets/ui/dotsscore.png",{
            frameWidth: 100,
            frameHeight: 100,
        });
    }
    
    
    create() {
        //setting the background color to eggshell
        //this.cameras.main.setBackgroundColor('#fbfbe3');

        this.sound.play('music_sfx');

        //declaring local variables
        this.transitioning = false;
        this.actionQueue = [];
        this.pause = false;
        this.crashing = false;
        this.colorTransition = false;
        this.endofgame = false;
        this.curRed = 0;
        this.curColor = '';
        this.hitboxRGB;
        this.scores = [];
        this.currentScore;
        this.currentPlayerColor;

        //declaring color bools

        this.C = false;
        this.M = false;
        this.Y = false;


        //Adding inputs to use
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

        //color UI Needs to be updated
        // this.redCircle = this.add.sprite(screenCenterX - (arrowDist/2), 935, 'redUI').setOrigin(0.5, 0.5);
        // this.redCircle.setDepth('1');
        // this.redCircle.scale = 0.3;
        // this.redCircle.setFrame(1)
        
        // this.yellowCircle = this.add.sprite(screenCenterX, 935, 'yellowUI').setOrigin(0.5, 0.5);
        // this.yellowCircle.setDepth('1');
        // this.yellowCircle.scale = 0.3;

        // this.blueCircle = this.add.sprite(screenCenterX + (arrowDist/2), 935, 'blueUI').setOrigin(0.5, 0.5);
        // this.blueCircle.setDepth('1');
        // this.blueCircle.scale = 0.3;

        //score UI
        this.createScoreUI();
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
            this.actionQueue.push("space");
            this.sound.play('cycle_sfx')
        }

        if (Phaser.Input.Keyboard.JustDown(keyPause)) { //pause button, needs menu?
            this.pause = !this.pause;
            this.sound.play('move_sfx');
        }
        

        //selectiong the correct player color based on key inputs.
        this.C = keyA.isDown;
        this.M = keyS.isDown;
        this.Y = keyD.isDown;
        //console.log(this.C, this.M, this.Y);

        this.currentPlayerColor = this.colorLogic(this.C, this.M, this.Y);
        //console.log(this.currentPlayerColor);
        if (this.currentPlayerColor != playerColor) {
            switch (this.currentPlayerColor) {
                case 'black':
                    playerColor = "black";
                    playerShip.setFrame(0);
                    break;
                case 'cyan':
                    playerColor = "cyan";
                    playerShip.setFrame(1);
                    break;
                case 'majenta':
                    playerColor = "majenta";
                    playerShip.setFrame(2);
                    break;
                case 'yellow':
                    playerColor = "yellow";
                    playerShip.setFrame(3);
                    break;
                case 'red':
                    playerColor = "red";
                    playerShip.setFrame(4);
                    break;
                case 'green':
                    playerColor = "green";
                    playerShip.setFrame(5);
                    break;
                case 'blue':
                    playerColor = "blue";
                    playerShip.setFrame(6);
                    break;
                case 'eggshell':
                    playerColor = "eggshell";
                    playerShip.setFrame(7);
                    break;
            }
        }
        

        

        
        if (!this.transitioning && this.actionQueue.length > 0) {
            let action = this.actionQueue.shift();
            // if (action == "space") {
            //     if (playerShip.currentFrame == 0)
            //     {
            //         //console.log("Color switched to yellow");
            //         //changes the frame of the spritesheet to blue
            //         playerShip.setFrame(1);
            //         playerShip.currentFrame = 1;
            //         //this.circleOutline.setPosition(screenCenterX, 936);
            //     } else if (playerShip.currentFrame == 1)
            //     {
            //         //console.log("Color switched to blue");
            //         //changes the frame of the spritesheet to blue
            //         playerShip.setFrame(2);
            //         playerShip.currentFrame = 2;
            //         //this.circleOutline.setPosition(screenCenterX + (arrowDist/2), 935);
            //     } else if(playerShip.currentFrame == 2)
            //     {
            //         //console.log("Color switched to red");
            //         //changes the frame of the spritesheet to blue
            //         playerShip.setFrame(0);
            //         playerShip.currentFrame = 0;
            //         //this.circleOutline.setPosition(screenCenterX - (arrowDist/2), 935);
            //     }
            // }

            //Tween movement to right lane with left arrow key
            if(action == "right" && currentLane < 3){
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

        //run functions
        if (!this.pause) { //if the game is not paused...

            //update the score (if the score needs updating)
            if (scoreCount != this.currentScore) {
                this.updateScore(scoreCount);
                this.currentScore = scoreCount;
                //console.log("i am firing");
            }
            
            this.moveMap()

            // // RGB of pixel under player (both layers) -1 mean no layer (#topLayer problems)
            // this.hitboxRGB = this.getTilemapRGB();

            // //determine the correct layer to test
            // if (this.hitboxRGB[1][0] > 0) { //if red has no value in the top layer
            //     this.curRed = (this.hitboxRGB[1][0]); //top layer is selected
            // } else {
            //     this.curRed = (this.hitboxRGB[0][0]); //otherwise, bottom layer is selected
            // }

            // //check collisions after converting Red value to a color string.
            // this.checkCollisions(this.whatColor(this.curRed), playerColor);
        }
    } // end of update function


    //-------------------------
    
    colorLogic(C, M, Y) {
        let color;
        //convert inputs to binary
        C *= 1;
        M *= 2;
        Y *= 4;

        let inputCode = C + M + Y;
        //console.log(inputCode);

        switch (inputCode) {
            case 0:
                color = "black";
                break;
            case 1:
                color = "cyan";
                break;
            case 2:
                color = "majenta";
                break;
            case 3:
                color = "blue";
                break;
            case 4:
                color = "yellow";
                break;
            case 5:
                color = "green";
                break;
            case 6:
                color = "red";
                break;
            case 7:
                color = "eggshell";
                break;
            default:
                color = "n/a"
        }
        return color;
    }

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
                //console.log(nextMap)
            }
        
            if (map2Pos > game.config.height + 50) {
                map2dist = (map1dist + map1relative);
                //scrollSpeed++
                if (nextMap >= mapNames.length -1) {
                    nextMap = mapNames.length -1;
                }
                this.swapMap2(nextMap)
                this.laneAddition(nextMap)
                nextMap++
                //console.log(nextMap)
            }
        }

        botLayer1.setPosition(mapX, map1Pos);
        topLayer1.setPosition(mapX, map1Pos);
        botLayer2.setPosition(mapX, map2Pos);
        topLayer2.setPosition(mapX, map2Pos);
    
        //step maps forward
        map1dist += scrollSpeed;
        map2dist += scrollSpeed;
        rawDist += scrollSpeed; //use this for the tutorial spacing

        scoreCount = Math.floor((rawDist / tilemapScale) / 200)
    }


    //swap map functions, uses mapData array which is constructed in the create method.
    swapMap1(index) {
        map1 = mapData[index];
        //visuals1 = map1.addTilesetImage('spritesheet', 'tiles');
        
        botLayer1.destroy();
        topLayer1.destroy();

        botLayer1 = map1.createLayer('Tile Layer 1', [visuals1], mapX, map1relative);
        topLayer1 = map1.createLayer('Tile Layer 2', [visuals1], mapX, map1relative);
        botLayer1.scale = tilemapScale;
        topLayer1.scale = tilemapScale;
    }
    
    swapMap2(index) {
        map2 = mapData[index];
        //visuals2 = map2.addTilesetImage('spritesheet', 'tiles');

        botLayer2.destroy();
        topLayer2.destroy();

        botLayer2 = map2.createLayer('Tile Layer 1', [visuals2], mapX, map2relative);
        topLayer2 = map2.createLayer('Tile Layer 2', [visuals2], mapX, map2relative);
        botLayer2.scale = tilemapScale;
        topLayer2.scale = tilemapScale;
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
            score.scale = 0.3;
            score.setFrame(0);

            this.scores.push(score);

            posY += dotVertSpacing;
        }
    }

    updateScore(score) {
        let i = 0;
        let binaryData = this.scoreBinary(score);
        for (i = 0; i < 16; i++) {
            this.scores[i].setFrame(binaryData[i]);
        }
    }

    laneAddition(index){
        if(index >= secondLane && index < thirdLane - 1){
            laneNumber = 2;
        }  else if(index >= thirdLane){
            laneNumber = 3;
        }
    }
}