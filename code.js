/*
 * @Author: Leandro Junqueira 
 */


let canvas;
let stage;
let img;
let parts;
let imgWidth;
let imgHeight;
let partsWidth;
let partsHeight;
let currentPart;
let currentDropPart;
let mouse;

const SIZE_WIDTH = 4; // DEFINE HOW MANY PARTS IN HORIZONTAL THIS IMAGE WILL BE RENDER
const SIZE_HEIGHT = 3; // DEFINE HOW MANY PARTS IN VERTICAL THIS IMAGE WILL BE RENDER

//DEFINE IMAGE TO THE GAME
const IMAGE_URL = "https://s3-eu-west-1.amazonaws.com/wagawin-ad-platform/media/testmode/banner-landscape.jpg";

//init image for the game
function init(){
    img = new Image();
    img.addEventListener('load',onImagePicture,false);
    img.src = IMAGE_URL;
}

//setup SPLIT PHOTO size of the image and parts
function onImagePicture(e) {
    partsWidth = Math.floor(img.width / SIZE_WIDTH) 
    partsHeight = Math.floor(img.height / SIZE_HEIGHT) 
    imgWidth = partsWidth * SIZE_WIDTH ; 
    imgHeight = partsHeight * SIZE_HEIGHT; 
    setupCanvas();
    initGame();
}
//setup canvas and style
function setupCanvas(){
    canvas = document.getElementById('myCanvas');
    stage = canvas.getContext('2d');
    canvas.width = imgWidth;
    canvas.height = imgHeight;
    canvas.style.border = "2px solid white";
    canvas.style.background = "white";
}
//Button click random image  and init game
function initGame(){
    parts = [];
    mouse = {x:0,y:0};
    currentPart = null;
    currentDropPart = null;
    stage.drawImage(img, 0, 0, imgWidth, imgHeight, 0, 0, imgWidth, imgHeight);
    TitleGame("CLICK HERE TO START THE GAME");
    buildParts();
}
//title style
function TitleGame(msg){
    stage.fillStyle = "#000000";
    stage.globalAlpha = .2;
    stage.fillRect(100,imgHeight - 100,imgWidth - 200,40);
    stage.fillStyle = "#FFFFFF";
    stage.globalAlpha = 1;
    stage.textAlign = "center";
    stage.textBaseline = "middle";
    stage.font = "50px Arial";
    stage.fillText(msg, imgWidth / 2, imgHeight - 80);
}
//Build parts
function buildParts(){
    let i;
    let part;
    let xPos = 0;
    let yPos = 0;
    for(i = 0;i < SIZE_WIDTH * SIZE_HEIGHT ;i++){
        part = {};
        part.sx = xPos;
        part.sy = yPos;
        parts.push(part);
        xPos += partsWidth;
        if(xPos >= imgWidth){
            xPos = 0;
            yPos += partsHeight;
        }
    }
    document.onmousedown = Random;
}
//Create a random of the parts
function Random(){
    parts = RandomArray(parts);
    stage.clearRect(0,0,imgWidth,imgHeight);
    let i;
    let part;
    let xPos = 0;
    let yPos = 0;
    for(i = 0;i < parts.length;i++){
        part = parts[i];
        part.xPos = xPos;
        part.yPos = yPos;
        stage.drawImage(img, part.sx, part.sy, partsWidth, partsHeight, xPos, yPos, partsWidth, partsHeight);
        stage.strokeRect(xPos, yPos, partsWidth,partsHeight);
        xPos += partsWidth;
        if(xPos >= imgWidth){
            xPos = 0;
            yPos += partsHeight;
        }
    }
    document.onmousedown = GameOnCick;
}
//random of array numbers
function RandomArray(o){
    for(let j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function GameOnCick({layerX, layerY, offsetX, offsetY}) {
    if(layerX || layerX == 0){
        mouse.x = layerX - canvas.offsetLeft;
        mouse.y = layerY - canvas.offsetTop;
    }
    else if(offsetX || offsetX == 0){
        mouse.x = offsetX - canvas.offsetLeft;
        mouse.y = offsetY - canvas.offsetTop;
    }
    currentPart = CheckClicked();
    if(currentPart != null){
        stage.clearRect(currentPart.xPos,currentPart.yPos,partsWidth,partsHeight);
        stage.save();
        stage.globalAlpha = .4;
        stage.drawImage(img, currentPart.sx, currentPart.sy, partsWidth, partsHeight, mouse.x - (partsWidth / 2), mouse.y - (partsHeight / 2), partsWidth, partsHeight);
        stage.restore();
        document.onmousemove = UpdateGame;
        document.onmouseup = PartsDropped;
    }
}
//Check clicked
function CheckClicked(){
    let i;
    let part;
    for(i = 0;i < parts.length;i++){
        part = parts[i];
        if(mouse.x < part.xPos || mouse.x > (part.xPos + partsWidth) || mouse.y < part.yPos || mouse.y > (part.yPos + partsHeight)){
            //PIECE NOT HIT
        }
        else{
            return part;
        }
    }
    return null;
}
//update the game
function UpdateGame({layerX, layerY, offsetX, offsetY}) {
    currentDropPart = null;
    if(layerX || layerX == 0){
        mouse.x = layerX - canvas.offsetLeft;
        mouse.y = layerY - canvas.offsetTop;
    }
    else if(offsetX || offsetX == 0){
        mouse.x = offsetX - canvas.offsetLeft;
        mouse.y = offsetY - canvas.offsetTop;
    }
    stage.clearRect(0,0,imgWidth,imgHeight);
    let i;
    let part;
    for(i = 0;i < parts.length;i++){
        part = parts[i];
        if(part == currentPart){
            continue;
        }
        stage.drawImage(img, part.sx, part.sy, partsWidth, partsHeight, part.xPos, part.yPos, partsWidth, partsHeight);
        stage.strokeRect(part.xPos, part.yPos, partsWidth, partsHeight);
        if(currentDropPart == null){
            if(mouse.x < part.xPos || mouse.x > (part.xPos + partsWidth) || mouse.y < part.yPos || mouse.y > (part.yPos + partsHeight)){
            }
            else{
                currentDropPart = part;
                stage.save();
                stage.globalAlpha = .4;
                stage.fillStyle = "white";
                stage.fillRect(currentDropPart.xPos,currentDropPart.yPos,partsWidth, partsHeight);
                stage.restore();
            }
        }
    }
    stage.save();
    stage.globalAlpha = .6;
    stage.drawImage(img, currentPart.sx, currentPart.sy, partsWidth, partsHeight, mouse.x - (partsWidth / 2), mouse.y - (partsHeight / 2), partsWidth, partsHeight);
    stage.restore();
    stage.strokeRect( mouse.x - (partsWidth / 2), mouse.y - (partsHeight / 2), partsWidth,partsHeight);
}

function PartsDropped(e){
    document.onmousemove = null;
    document.onmouseup = null;
    if(currentDropPart != null){
        const tmp = {xPos:currentPart.xPos,yPos:currentPart.yPos};
        currentPart.xPos = currentDropPart.xPos;
        currentPart.yPos = currentDropPart.yPos;
        currentDropPart.xPos = tmp.xPos;
        currentDropPart.yPos = tmp.yPos;
    }
    WinAndResetGame();
}

//Connect image part
function WinAndResetGame(){
    stage.clearRect(0,0,imgWidth,imgHeight);
    let gameWin = true;
    let i;
    let part;
    for(i = 0;i < parts.length;i++){
        part = parts[i];
        stage.drawImage(img, part.sx, part.sy, partsWidth, partsHeight, part.xPos, part.yPos, partsWidth, partsHeight);
        stage.strokeRect(part.xPos, part.yPos, partsWidth,partsHeight);
        if(part.xPos != part.sx || part.yPos != part.sy){
            gameWin = false;
        }
    }
    if(gameWin){
        setTimeout(End,500);
        alert("Good job! You did it! :)");
    }
}

function End(){
    document.onmousedown = null;
    document.onmousemove = null;
    document.onmouseup = null;
    initGame();
}












