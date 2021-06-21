var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;

var feed, lastFed;
var gameState = "hungry";
var bedroomImg,gardenImg,washroomImg;


function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
bedroomImg = loadImage("BedRoom.png");
gardenImg = loadImage("Garden.png");
washroomImg = loadImage("Wash Room.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  readState = database.ref('gameState');
  readState.on('value',function(data){
    gameState = data.val();

  })
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

 
 feed = createButton("Feed the Dog");
 feed.position(700,95);
 feed.mousePressed(feedDog)

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  currentTime = hour();
  if(currentTime == (lastFed+1)){
    update("Playing");
    foodObj.garden();
  }
  else if(currentTime== (lastFed+2)){
    update("Bedroom");
    foodObj.bedroom();
  }
  else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
    udtate("Bathroom");
    foodObj.bathroom();
  }
  else{
    background(46,139,87);
    update("Hungary");
    foodObj.display();
  }

  //write code to read fedtime value from the database 
  fedTime = database.ref('FeedTime');
  fedTime.on('value',function(data){
    lastFed = data.val();
  })


fill(255,255,255)
textSize(15);
  if(lastFed>=12){
  text('Last Feed:'+ lastFed%12 + "PM",350,30);
  }
  else if(lastFed==0){
    text("Last Feed: 12 AM", 350,30);
  }
  else{
    text("Last Feed: "+ lastFed + "AM",350,30);
  }

  if(gameState !== "hungry"){

    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }

 

 
  drawSprites();

 
  
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);

  //write code here to update food stock and last fed time
  var food_stock_val = foodObj.getFoodStock();
  if(food_stock_val<=0){
    foodObj.updateFoodStock(food_stock_val*0)
  }
  else{
    foodObj.updateFoodStock(food_stock_val-1)
  }

  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })

}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//function to update gameState in database
function update(state){
  database.ref("/").update({
    gameState: state
  })
}
