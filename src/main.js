var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 960,
    margin: 0,
    transparent: true,
    scene : [Menu, Play, Gameover],
    parent: 'phaser_canvas',
    //autoCenter: true,
};


let game = new Phaser.Game(config);

// reserving conrols
let spaceBar, keyLeft, keyRight, keyPause;

// set Global variables
let playerShip = null;
let newMap = null;
let visualsNew = null;
let botLayerNew = null;
let topLayerNew = null;
var mapToRemove = null;

let currentMap = null;
let map1 = null;
let map2 = null;
let map3 = null;
let map4 = null;
let map5 = null;
let map6 = null;
let map7 = null;
let placeHoldermap = null;
let visuals1 = null;
let visuals2 = null;
let map3_visuals = null;
let map4_visuals = null;
let map5_visuals = null;
let map6_visuals = null;
let map7_visuals = null;
let botLayer1 = null;
let topLayer1 = null;
let botLayer2 = null;
let topLayer2 = null;
let map3_botLayer = null;
let map3_topLayer = null;
let map4_botLayer = null;
let map4_topLayer = null;
let map5_botLayer = null;
let map5_topLayer = null;
let map6_botLayer = null;
let map6_topLayer = null;
let map7_botLayer = null;
let map7_topLayer = null;


// Screen Centers
const screenCenterY = game.config.height/2;
const screenCenterX = game.config.width/2;

//Size and Scale
const tilemapScale = 0.6;
const arrowScale = 0.5;

const mapX = screenCenterX - (tilemapScale * 300);


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
const map1relative = ((8000 * tilemapScale) * -1);  //  -4800
const map2relative = ((8000 * tilemapScale) * -2);  //  -9600
let map1dist = map1relative;
let map2dist = map2relative;
let inOrder = true;


//total distance traveled
let travelDist = 0;
let rawDist = 0;
//scrolling rate (start)
let scrollSpeed = 4;

//current lane of the player to restrict its movement
let currentLane = 1;

let difficulty;