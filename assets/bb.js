//found it from:https://codepen.io/yoksel/pen/EyZgLo
//wanna make it to be my bk
//Create an <svg> element using a namespace
function createSVGElements() {
    const svgDefs = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    //Create an <svg> element using a namespace and set a CSS class name for this SVG element, such as one that can be used to hide, locate, or set the size
    svgDefs.setAttribute("class", "svg svg--defs");
    //radialGradient is the gradient definition of SVG, and fx and fy control the gradient focus
    // to achieve soft light and shadow effects, such as spotlights, top or bottom lighting, and other visual layering effects
    svgDefs.innerHTML = `
        <radialGradient id="grad--bw" fx="25%" fy="25%">
            <stop offset="0%" stop-color="black"/>  
            <stop offset="30%" stop-color="black" stop-opacity=".2"/>
            <stop offset="97%" stop-color="white" stop-opacity=".4"/>
            <stop offset="100%" stop-color="black"/>
        </radialGradient>
     
        <mask id="mask" maskContentUnits="objectBoundingBox">
            <rect fill="url(#grad--bw)" width="1" height="1"></rect>
        </mask>
        
        <radialGradient id="grad--spot" fx="50%" fy="20%">
            <stop offset="10%" stop-color="white" stop-opacity=".7"/>  
            <stop offset="70%" stop-color="white" stop-opacity="0"/>
        </radialGradient>
        
        <radialGradient id="grad--bw-light" _fx="25%" fy="10%">
            <stop offset="60%" stop-color="black" stop-opacity="0"/>
            <stop offset="90%" stop-color="white" stop-opacity=".25"/>
            <stop offset="100%" stop-color="black"/>
        </radialGradient>
        
        <mask id="mask--light-top" maskContentUnits="objectBoundingBox">
            <rect fill="url(#grad--bw-light)" width="1" height="1" transform="rotate(180, .5, .5)"></rect>
        </mask>
        
        <mask id="mask--light-bottom" maskContentUnits="objectBoundingBox">
            <rect fill="url(#grad--bw-light)" width="1" height="1"></rect>
        </mask>
        
        <linearGradient id="grad" x1="0" y1="100%" x2="100%" y2="0">
            <stop offset="0%" stop-color="dodgerblue" class="stop-1"/>   
            <stop offset="50%" stop-color="fuchsia" class="stop-2"/>
            <stop offset="100%" stop-color="yellow" class="stop-3"/>
        </linearGradient> 
        
        <mask id="mask--collapse" maskContentUnits="objectBoundingBox">
            <circle r=".5" cx=".5" cy=".5" class="collapse-circle"></circle>
        </mask>
        
        <symbol id="splash">
            <g class="splash-group" fill="none" stroke="white" stroke-opacity=".8">
                <circle r="49%" cx="50%" cy="50%" stroke-width="3%" stroke-dasharray="1% 10%" class="splash-circle _hidden"></circle>
                <circle r="44%" cx="50%" cy="50%" stroke-width="2%" stroke-dasharray="1% 5%" class="splash-circle _hidden"></circle>
                <circle r="39%" cx="50%" cy="50%" stroke-width="1%" stroke-dasharray="1% 8%" class="splash-circle _hidden"></circle>
                <circle r="33%" cx="50%" cy="50%" stroke-width="3%" stroke-dasharray="1% 6%" class="splash-circle _hidden"></circle>
                <circle r="26%" cx="50%" cy="50%" stroke-width="1%" stroke-dasharray="1% 7%" class="splash-circle _hidden"></circle>
                <circle r="18%" cx="50%" cy="50%" stroke-width="1%" stroke-dasharray="1% 8%" class="splash-circle _hidden"></circle>
            </g>
        </symbol>
    `;

        //it is to apply SVG gradient and mask effects to a bubble-shaped SVG graphic to create a graphic effect with rich visual layers, lighting and a sense of luminescence
        //Insert the previously created <svg class="svg svg--defs"> into the.bubble-content DOM to ensure that <defs> is recognized by the rendering engine and can be referenced
    document.querySelector('.Bubble-content').appendChild(svgDefs);
//Create a wrapped element  ready to use/control the visibility of <defs>
// However, this container is not in use
    const defsContainer = document.createElement('div');
    defsContainer.className = 'Bubble-defs hidden';
//Create a bubble container with an SVG viewport of 200x200
    const bubbleSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    bubbleSVG.setAttribute("class", "svg bubble");
    bubbleSVG.setAttribute("viewBox", "0 0 200 200");

    //url(# grad-spot) : Used for creating high bright spots (such as light spots) 
//mask="url(#mask--light-top/bottom)" : Enhance the sense of direction of the light source 
//mask="url(#mask)" : Controls the transition of light and shadow at the edge of the main bubble 
//class="shape _hidden" : Indicates default hidden (possibly used to switch visibility during animation/interaction)
    bubbleSVG.innerHTML = `
        <g class="bubble-group">
          <ellipse rx="20%" ry="10%" cx="150" cy="150" fill="url(#grad--spot)" transform="rotate(-225, 150, 150)" class="shape _hidden"></ellipse>     
          <circle r="50%" cx="50%" cy="50%" fill="aqua" mask="url(#mask--light-bottom)" class="shape _hidden"></circle>
          <circle r="50%" cx="50%" cy="50%" fill="yellow" mask="url(#mask--light-top)" class="shape _hidden"></circle>             
          <ellipse rx="55" ry="25" cx="55" cy="55" fill="url(#grad--spot)" transform="rotate(-45, 55, 55)" class="shape _hidden"></ellipse> 
          <circle r="50%" cx="50%" cy="50%" fill="url(#grad)" mask="url(#mask)" class="shape _hidden"></circle> 
        </g>
        <use xlink:href="#splash" class="bubble-splash"/>
    `;

    //Insert bubbleSVG into the defsContainer container, and then mount the entire container under the.bubble-content node
    defsContainer.appendChild(bubbleSVG);
    document.querySelector('.Bubble-content').appendChild(defsContainer);
//Find the title container on your page
//Create another SVG (for title decoration), referring to <use xlink:href="#splash">, which is the bubble splash shape you mentioned earlier
    const titleElement = document.querySelector('.Bubble-title');
    const titleSplash = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    titleSplash.setAttribute("class", "svg Bubble-title-splash");
    titleSplash.setAttribute("viewBox", "0 0 200 200");
    titleSplash.innerHTML = `<use xlink:href="#splash"/>`;
//Insert this SVG into the title. Final effect: There will be an SVG decorative flash on your title
    titleElement.appendChild(titleSplash);
//Return this bubbleSVG element
    return bubbleSVG;
}
//Call the previously defined createSVGElements() function to return the created bubbleSVG
//shape is the SVG template to be copied or manipulated subsequently
const shape = createSVGElements();
//A maximum of 10 bubbles can be displayed simultaneously on the page
var maxBubbles = 10;
//Obtain the.bubble outer container and its dimensions to prepare for locating the Bubble
var container = document.querySelector('.Bubble');
var containerWidth = container.clientWidth;
var containerHeight = container.clientHeight;
//Add a custom property "splash" to the "title" object and reference the.bubbley-title-splash SVG generated previously
var content = document.querySelector('.Bubble-content');
var title = document.querySelector('.Bubble-title');
title.splash = document.querySelector('.Bubble-title-splash');
//Obtain the width and height of the original bubble pattern. It may be used for proportional scaling or positioning after subsequent cloning
var shapeWidth = shape.clientWidth;
var shapeHeight = shape.clientHeight;
//It is used to store all the bubble objects currently on the page
var bubbles = [];
//Minimum coordinate
var minX = 0;
var minY = 0;
//Define the maximum and minimum size ranges of the bubbles. Perhaps a size will be randomly selected each time a bubble is generated
var baseShapeSize = 200;
var minShapeSize = 50;

var time = 5;
var minTime = 2;
//Define from which side the bubble can enter the container, which may be used for setting the initial animation direction
var posibleSides = ['top', 'right', 'bottom', 'left'];

//This code defines a constructor function named Bubble(pos) for generating and managing individual bubbles, and begins to define a prototype function of the collapse() method
function Bubble(pos) {
    //Clone the SVG template created before and use it as this new bubble
    this.bubble = shape.cloneNode(true);
    //Initialize the size, position and animation of the bubbles. These are the methods you need to implement or have defined
    this.setSize();
    this.setPos();
    this.addAnimation();
    //Insert the bubbles into the.bubble-content container
    content.appendChild(this.bubble);
    //Obtain the internal structure of SVG to facilitate subsequent control
    this.content = this.bubble.querySelector('.bubble-group');
    this.splash = this.bubble.querySelector('.bubble-splash');
    //Set the initial state to uncontracted to prevent repeated triggering of collapse
    this.isCollapsed = false;
    var that = this;
//Add a click event to make the bubble collapse only once. Use the writing method of "that = this" to be compatible with old browsers
    this.bubble.onclick = function () {
        if (!that.isCollapsed) {
            that.isCollapsed = true;
            that.collapse();
        }
    }
}

//This logic restores the bubble to its original state after waiting for a period of time (with a delay of 2 seconds), allowing for another click. This means that you want the bubbles to be clickable repeatedly and change cyclically
Bubble.prototype.collapse = function () {
    var that = this;

    function resetBubble() {
        var tl = new TimelineLite();
        that.setSize();
        that.setPos();

        tl.to(that.content, .3, {
            'scale': 1,
            'opacity': 1,
            'delay': 2,
            'onComplete': function () {
                that.isCollapsed = false;
            }
        });
    }

    //Use the timeline of GreenSock to concatenate animations
    var tl = new TimelineLite();
    //Immediately shrink and hide the main bubble.bubble-group
    tl.set(this.content, {
        'scale': 0,
        'transform-origin': '100px 100px',
        'opacity': 0
    });
    //Set the splash effect to half size and make it visible
    tl.set(this.splash, {
        'scale': .5,
        'transform-origin': '100px 100px',
        'opacity': 1,
    });
    //Play the expansion and disappearance animation of the splash effect, and then call resetBubble() to restore the bubbles
    tl.to(this.splash, .15, {
        'scale': 1.5,
        'opacity': 0,
        'ease': Power1.easeOut,
        'onComplete': resetBubble
    });
}

//Move the bubble to the random position returned by getSide()
Bubble.prototype.setPos = function () {
    var target = this.getSide();
    this.bubble.style.transform = 'translate3d(' + target.coords.x + 'px, ' + target.coords.y + 'px, 0)';
}
//Randomly set the size of the bubbles between minShapeSize and baseShapeSize
Bubble.prototype.setSize = function () {
    this.shapeSize = Math.round(Math.random() * (baseShapeSize - minShapeSize)) + minShapeSize;
    this.bubble.style.width = this.shapeSize + 'px';
    this.bubble.style.height = this.shapeSize + 'px';

    this.maxX = containerWidth - this.shapeSize;
    this.maxY = containerHeight - this.shapeSize;
}
//Some variables of the animation, such as duration and delay, were initialized, and the TimelineLite() timeline was created
Bubble.prototype.addAnimation = function () {

    var minX = 0;
    var newTime = Math.random() * time + minTime;
    var elem = this.bubble;
    var delay = Math.random() * time;
    var tl = new TimelineLite();
    var that = this;

    animate();
//It is hoped that Bubble remembers its last direction and generates a new target position based on this in getSide() - which is very suitable for achieving smooth and continuous animations like "bubble floating"
    function animate() {
        var target = that.getSide(that.side);
        that.side = target.side;
        var propSet = {
            x: target.coords.x,
            y: target.coords.y,
            ease: SlowMo.easeInOut,
            delay: delay,
            onComplete: animate
        };
        tl.to(elem, newTime, propSet);

        if (delay) {
            delay = 0;
        }
    }
}
//It has pre-calculated the target coordinates for all four sides
Bubble.prototype.getSide = function () {
    var targetParams = {
        side: '',
        coords: {}
    };
    var maxRandX = Math.round(Math.random() * this.maxX);
    var maxRandY = Math.round(Math.random() * this.maxY);

    var sides = {
        'top':
        {
            x: maxRandX,
            y: minY
        },
        'right':
        {
            x: this.maxX,
            y: maxRandY
        },
        'bottom':
        {
            x: maxRandX,
            y: this.maxY
        },
        'left': {
            x: minX,
            y: maxRandY
        }
    };

    delete sides[this.side];
    var keys = Object.keys(sides);
    var randPos = Math.floor(Math.random() * keys.length);
    var newSide = keys[randPos];

    targetParams.side = newSide;
    targetParams.coords = sides[newSide];

    return targetParams;

}
//When the size of the browser window changes, dynamically adjust the position and size of the bubbles on the page to ensure that they remain in the correct position within the container
function addBubble() {
    var bubble = new Bubble(i);
    bubbles.push(bubble);
}

//Create up to maxBubbles through a for loop. Call addBubble() in each loop to generate a new bubble object and add it to the bubbles array
for (var i = 0; i < maxBubbles; i++) {
    addBubble();
}

//An event listener has been set up to obtain the new width of the container when the window size changes
window.onresize = function () {
    containerWidth = container.clientWidth;
    containerHeight = container.clientHeight;
//The forEach method traverses each bubble in the bubbles array. For each bubble object item, it updates the maximum X and Y coordinates (maxX and maxY) of the bubble to ensure that the bubble does not exceed the boundary within the container
    bubbles.forEach(function (item) {
        item.maxX = containerWidth - item.shapeSize;
        item.maxY = containerHeight - item.shapeSize;
    });
}

//This piece of code sets the click event for the.bubble-title element on the page. When the user clicks on the title, an animation with visual effects will be triggered: the bubble element "disappears" and then recovers.
title.onclick = function () {
    var that = this;

    function resetElem() {
        var tl = new TimelineLite();

        tl.to(that.content, .3, {
            'scale': 1,
            'opacity': 1,
            'onComplete': function () {
                that.isCollapsed = false;
            }
        });
    }

    var tl = new TimelineLite();
    tl.set(this.content, {
        'scale': 0,
        'opacity': 0
    });
    tl.set(this.splash, {
        'scale': .5,
        'opacity': 1,
    });
    //Create an animation with TimelineLite: Restore the scaling of title.content to 1 and the opacity to 1 is reappear. The animation lasts for 0.3 seconds
    tl.to(this.splash, .15, {
        'scale': 1.5,
        'opacity': 0,
        'ease': Power1.easeOut,
        'onComplete': resetElem
    });
}