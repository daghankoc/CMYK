var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 960,
    margin: 0,
    transparent: true,
    scene : [Menu, Credits, Play, Gameover, Tutorial],
    parent: 'phaser_canvas',
    //autoCenter: true,
};


let game = new Phaser.Game(config);

// reserving conrols
let keyW, keyA, keyS, keyD, spaceBar, keyLeft, keyRight, keyPause;

// set Global variables

//map variables (sorry Adam, but .this aint it <3)
let playerShip = null;
let newMap = null;
let visualsNew = null;
let botLayerNew = null;
let topLayerNew = null;
var mapToRemove = null;
let laneNumber = 1;
let map1 = null;
let map2 = null;
let visuals1 = null;
let visuals2 = null;
let botLayer1 = null;
let topLayer1 = null;
let botLayer2 = null;
let topLayer2 = null;

//maps that lane change happens
let thirdLane = 8;
let secondLane = 2;

// Screen Centers
const screenCenterY = game.config.height/2;
const screenCenterX = game.config.width/2;

//Size and Scale
const tilemapScale = 0.5;
const arrowScale = 0.5;

//Map horizontal offet to make sure it's always centered
const mapX = screenCenterX - (tilemapScale * 400);


//Arrow Y pos
const arrowY = screenCenterY + (screenCenterY / 2); //720
const arrowHeight = game.config.height - arrowY; //240

//Arrow left right travel distance
const arrowDist = 200 * tilemapScale;
const arrowMovementR = '+=' + (200 * tilemapScale);
const arrowMovementL = '-=' + (200 * tilemapScale);

//map movement variables
let map1Pos = 0;
let map2Pos = 0;
const map1relative = ((8000 * tilemapScale) * -1);  //  -4000
const map2relative = ((8000 * tilemapScale) * -2);  //  -8000
let map1dist = map1relative;
let map2dist = map2relative;

//player color
let playerColor = 'red'; //starting color is red

//tile color (under player)
let tileColor = 'n/a';

//total distance traveled, to be used for score later
let scoreCount = 0;
let rawDist = -arrowY;

//scrolling rate (start)
let scrollSpeed = 4;

//current lane of the player
let currentLane = 1;

//score UI spacing paramters:
const dotVertSpacing = 50;
const dotHorizSpacing = 50;

const dotPaddingRight = game.config.width - 50;
const dotPaddingTop = 50;

//total lives of the player
let lives = 3;



//data structures and stuff for maps

//map name arrays, must be updated when new maps are added
let mapsEasy = ['testmap1', 'testmap2', 'testmap3', 'testmap4', 'testmap5', 'testmap6'];
let mapsMid = [];
let mapsHard = [];

//future function that defines a random map order for each game, but still conforms to tutorial order and difficulty.
function createMapOrder() {
    return mapsEasy.concat(mapsMid, mapsHard); //currently puts maps in order.
}

let mapNames = createMapOrder(); //populate map names order
let mapData = [];
let nextMap = 2; //counter used to index through mapNames array, change to start on a particular map (after maps 1 and 2 pass) (DEFUALT IS 2)

if (nextMap >= mapNames.length) { //puts you on the last map even if nextMap is set to a number greater than the number of maps loaded. (safety net)
    nextMap = mapNames.length - 1;
}