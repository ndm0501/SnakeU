console.log("js works");
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = '#333';
var snake = new Snake(ctx);
var food = new Food(ctx);
var tileCount = 20;
var speed = 6;
let lastPaintTime = 0
let points = 0;

function init(){
    snake = new Snake(ctx);
    food = new Food(ctx);
    tileCount = 20;
    speed = 6;
    lastPaintTime = 0
    points = 0;
}

function animate(renderTime){
    requestAnimationFrame(animate)
    
    
    //control speed using renderTime, controls the number of times the canvas re-renders in a time window
    if((renderTime-lastPaintTime)/1000 < 1/speed){
        return
    }
    lastPaintTime = renderTime;

    //clear canvas before repaint
    ctx.fillStyle = '#333';
    ctx.fillRect(0,0, canvas.width, canvas.height);
    //create food and moving snake(with head)
    food.create(tileCount);
    snake.create(tileCount);
    snake.move();
    if(snake.hasEatenItself()){
        init();
        alert("Game Over");
    }
    

    if(snake.hasEatenFood(food)){
        const foodX = Math.floor(Math.random()*(canvas.width/tileCount));
        const foodY = Math.floor(Math.random()*(canvas.width/tileCount));
        food = new Food(ctx, 20, foodX, foodY);
        
        snake.body.push(new SnakePart(snake.x, snake.y))
        points+=10
        if(points === 100){
            
            points = 0;
        }
    }
}
animate();

function Food(context, size = 20, x = 5, y = 5){
    this.x = x;
    this.y = y;
    this.context = context;
    this.size = size;

    this.create = function(tileCount){
        this.context.fillStyle = 'red';
        this.context.fillRect(this.x*tileCount, this.y*tileCount, size-2, size-2);
    }
}
function SnakePart( x, y){
    this.x = x;
    this.y = y;
}
function Snake(context, size=20, x=0, y=0, xSpeed = 1, ySpeed=0){
    this.x = x;
    this.y = y;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.context = context;
    this.size = size;
    this.body = [];

    this.create = function(tileCount){
        this.context.fillStyle = '#e7e7e7';
        this.context.fillRect(this.x*tileCount, this.y*tileCount, size-2, size-2);
        
        ctx.fillStyle = 'blue';
        for(let i=0; i<this.body.length; i++){
            let part = this.body[i];
            ctx.fillRect(part.x*tileCount, part.y*tileCount, size-2, size-2);
        }
        this.body.push(new SnakePart(this.x, this.y));
        if(this.body.length> 0){
            this.body.shift();
        }
        
    }
    this.move = function(){
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        if(this.x*tileCount >= canvas.width){
            this.x = 0;
        }else if(this.x*tileCount<0){
            this.x = canvas.width/tileCount;
        }
        if(this.y*tileCount >= canvas.height){
            this.y = 0;
        }else if(this.y<0){
            this.y = canvas.height/tileCount;
        }
    }
    this.hasEatenFood = function(food){
        
        if((this.x == food.x && this.y ==food.y)){
            
            return true;
        }
        return false;
    }
    this.hasEatenItself = function(){
        for(let part of this.body){
            if(this.x== part.x && this.y == part.y){
                return true
            }
        }
        return false
    }
}

//Game controls

document.addEventListener('keydown', keyDown);
function keyDown(e){
    
    if(e.key == 'ArrowUp'){
        if(snake.ySpeed == 1){
            return    
        }
        snake.ySpeed = -1;
        snake.xSpeed = 0;
    }else if(e.key == 'ArrowDown'){
        if(snake.ySpeed == -1){
            return
        }
        snake.ySpeed = 1;
        snake.xSpeed = 0;
        
    }else if(e.key == 'ArrowLeft'){
        if(snake.xSpeed == 1){
            return 
        }
        snake.ySpeed = 0;
        snake.xSpeed = -1;
        
    }else if(e.key == 'ArrowRight'){
        if(snake.xSpeed == -1){
            return
        }
        snake.ySpeed = 0;
        snake.xSpeed = 1;
    }
}