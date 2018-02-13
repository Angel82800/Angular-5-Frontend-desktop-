window.requestAnimFrame = (function (callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

//create particle
function Particle(x, y, r, a, v) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.vX = v * Math.cos(a);
    this.vY = v * Math.sin(a);
}

Particle.prototype = {
    constructor: Particle,
    draw: function () {
        //generate random colors
        var red = Math.floor(Math.random() * 255 + 1);
        var green = Math.floor(Math.random() * 255 + 1);
        var blue = Math.floor(Math.random() * 255 + 1);
        //get context and begin drawing
        var context = document.getElementById("canvas").getContext("2d");
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        //context.fillStyle = 'rgb('+red+','+green+','+blue+')';

        //var img = new Image();
        //img.src = "http://www.phppowerhousedemo.com/webroot/design/demos/desktopnexus/images/con-dia.png";
  		//     img.onload = function () {
		//     var pattern = ctx.createPattern(img, "repeat");
		//     context.fillStyle = pattern;
		//     context.fillRect(0, 0, w, h);
		// };

        context.fillStyle = 'rgb(111,247,255)';
        context.fill();
        //var pattern = context.createPattern(img, "repeat");
		    //context.fillStyle = pattern;
		    //context.fill();
		    //context.fillRect(0, 0, w, h);
    },
    update: function () {
        //x will have minimal movement
        this.x += this.vX;
        //y velocity should be more than x
        this.y += this.vY;
    }
};

function Emitter() {
    this.particles = [];
}

Emitter.prototype = {
    constructor: Emitter,
    create: function (x, y, r, a, v) {
        this.particles.push(new Particle(x, y, r, a, v));
    },
    update: function () {
        for (i = 0; i < this.particles.length; i++) {
            this.particles[i].update();
        }
    },
    draw: function () {
        for (i = 0; i < this.particles.length; i++) {
            this.particles[i].draw();
        }
    }
};
var emitter = new Emitter();
//create 100 particles

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var wid = canvas.width = window.innerWidth;
var hei = canvas.height = window.innerHeight;

for (i = 0; i < 300; i++) {
    emitter.create(wid/2, 240, 2, Math.random() * 2 * Math.PI, Math.random()*10+1);
}

function animate() {
    emitter.update();
    context.clearRect(0, 0, canvas.width, canvas.height);
    emitter.draw();
    requestAnimFrame(animate);
}


// ///////////////////////////////////

//CreateBubbles(".bubble_bl1");
function CreateBubbles(x){

//var bubble = document.getElementById("bubble"),
    var bubble = document.querySelector(x);
    //var bubble = document.getElementsByClassName("bubble_bl"),
    //we'll put all the dots into this container so that we can move the "explosion" wherever we please.
    container = document.createElement("div"),
    //the following variables make things configurable. Play around. 
    bubbleSize = 100,
    dotQuantity = 30,
    dotSizeMax = 30,
    dotSizeMin = 10,
    speed = 1,
    gravity = 1;
    var ClassSplit = x.split('.')[1];
    container.className = "aClassName"+ClassSplit;

//setup the container with the appropriate styles
container.style.cssText = "position:absolute; left:0; top:0; overflow:visible; z-index:5000; pointer-events:none;";
document.body.appendChild(container);

//just for this demo, we're making the bubble's size dynamic and we set xPercent/yPercent to -50 to accurately center it.
TweenLite.set(bubble, {width:bubbleSize, height:bubbleSize, xPercent:-50, yPercent:-50});

//The "explosion" is just a TimelineLite instance that we can play()/restart() anytime. This helps ensure performance is solid (rather than recreating all the dots and animations every time the user clicks)
var explosion = createExplosion(container);

function createExplosion(container) {
  var tl = new TimelineLite(),
      angle, length, dot, i, size;
  //create all the dots
  for (i = 0; i < dotQuantity; i++) {
    dot = document.createElement("div");
    dot.className = "dot";
    size = getRandom(dotSizeMin, dotSizeMax);
    container.appendChild(dot);
    angle = Math.random() * Math.PI * 2; //random angle
    //figure out the maximum distance from the center, factoring in the size of the dot (it must never go outside the circle), and then pick a random spot along that length where we'll plot the point. 
    length = Math.random() * (bubbleSize / 2 - size / 2); 
    //place the dot at a random spot within the bubble, and set its size.
    TweenLite.set(dot, {
      x:Math.cos(angle) * length, 
      y:Math.sin(angle) * length, 
      width:size, 
      height:size, 
      xPercent:-50, 
      yPercent:-50,
      force3D:true
    });
    //this is where we do the animation...
    tl.to(dot, 1 + Math.random(), {
      opacity:0,
      
      //physics2D:{
        //angle:angle * 180 / Math.PI, //translate radians to degrees
        //velocity:(100 + Math.random() * 250) * speed, //initial velocity
        //gravity:500 * gravity //you could increase/decrease this to give gravity more or less pull
      //}
      
      //if you'd rather not do physics, you could just animate out directly by using the following 2 lines instead of the physics2D:
      x:Math.cos(angle) * length * 6, 
      y:Math.sin(angle) * length * 6
    }, 0);
  }
  return tl;
}

//just pass this function an element and it'll move the explosion container to its center and play the explosion animation. 
function explodeP(element) {
  var bounds = element.getBoundingClientRect();
  TweenLite.set(container, {x:bounds.left + bounds.width / 2, y:bounds.top + bounds.height / 2});
  explosion.restart();
}

function getRandom(min, max) {
  return min + Math.random() * (max - min);
}

//explode initially, and then whenever the user presses on the dot. 
explodeP(bubble);
bubble.onmousedown = bubble.ontouchstart = function() {
  explodeP(bubble);
}

}




function ParticleRain(){
//TweenMax.set("img",{xPercent:"-50%",yPercent:"-50%"})

var svgNS = "http://www.w3.org/2000/svg";  

var total = 50;
var w = $("#mySVG").width();
var h = $("#mySVG").height();
 
for (i=0; i<total; i++){ 
var myCircle = document.createElementNS(svgNS,"circle"); 
myCircle.setAttributeNS(null,"class","dot"); 
myCircle.setAttributeNS(null,"r",5);
document.getElementById("mySVG").appendChild(myCircle);  
TweenMax.set($(".dot")[i],{x:Random(w),y:0 ,scale:Random(0.5)+0.5,fill:"hsl(" + random(0,150) + ",50%,50%)"});
 animm($(".dot")[i]);
 }
 
 function animm(elm){   
 TweenMax.to(elm,Random(5)+3,{y:h,ease:Linear.easeNone,repeat:-1, delay:-5});
 TweenMax.to(elm,Random(5)+1,{x:'+=70', repeat:-1,yoyo:true,ease:Sine.easeInOut})
 TweenMax.to(elm,Random(1)+0.5,{fill:"rgba(0,0,0,0)",repeat:-1,yoyo:true,ease:Sine.easeInOut})
 };

function Random (max) {
return Math.random()*max;
}

function random(min, max) {
return min + Math.floor( Math.random() * (max - min));
}

}


