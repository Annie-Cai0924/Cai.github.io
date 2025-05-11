//defined which is used to set a "full-page scrolling" effect
//Define a function called setupFullPageScroll to set the full-page scrolling logic
function setupFullPageScroll() {
    //Select all the elements with the class name '.section 'in the page, which usually represent each full-screen paragraph
    const sections = document.querySelectorAll('.section');
    //Record the total number of the.section elements in the page, that is, the total number of full-screen areas
    const totalSections = sections.length;
//Initialize the variable "currentSection" to track which section page is currently in
    let currentSection = 0;
    //Declare a flag variable to avoid triggering scrolling multiple times during the scrolling animation process
    let isScrolling = false;
    //Set the body of the entire page to be scrollable. By default, some full-page scrolling implementations prohibit scrolling. Here, scrolling is explicitly allowed
    document.body.style.overflow = 'auto';
    //Change the page scrolling behavior to "smooth scrolling", so that when jumping from one section to the next, it won't be abrupt
    document.body.style.scrollBehavior = 'smooth';
    const fallingLinks = setupFallingLinks();

    //defined to smoothly scroll to this section based on the passed-in section number
    // //Receive a parameter index, indicating the section number to be scrolled to
    function scrollToSection(index) {
       //If the passed-in index is less than 0, it is forcibly set to 0 to avoid out-of-bounds
        if (index < 0) index = 0;
        if (index >= totalSections) index = totalSections - 1;
        //If the target section is the current section or is scrolling, interrupt the function to prevent repeated scrolling or interruption of the scrolling animation
        if (index === currentSection || isScrolling) return;
        //Mark as "scrolling" to prevent it from being triggered again during the animation
        isScrolling = true;
        //Record the current section you are in
        const previousSection = currentSection;
        //Update the current section to the target section
        currentSection = index;
  //Calculate the vertical position to scroll to based on the height of the section
        const targetPosition = index * window.innerHeight;
        //Scroll smoothly to the calculated target position
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        //if scroll to the second section (with index starting from 0), call restartTypingAnimation()
        if (currentSection === 1) {
            restartTypingAnimation();
        }
        //If you scroll to the third section, restart the fallingLinks animation
        if (currentSection === 2) {
            fallingLinks.restart();
        }
        //Set an 800-millisecond timer to allow scrolling again after the animation ends
        setTimeout(() => {
            isScrolling = false;
        }, 800);
    }
    //The event listener is triggered when the user scrolls the mouse wheel. e is the event object
    window.addEventListener('wheel', function (e) {
        //block the default scrolling behavior and exit the function in advance to prevent the animation from being interrupted or the scrolling from being triggered multiple times
        if (isScrolling) {
            //default behavior is also prevented because it is hoped to control everything with a custom smooth scrolling logic
            e.preventDefault();
            return;
        }
        //e.deltaY > 0 indicates scrolling down to jump to the next section 
        //e.deltaY < 0 indicates scrolling up to jump to the previous section.
        e.preventDefault();
        if (e.deltaY > 0) {
            scrollToSection(currentSection + 1);
        } else {
            scrollToSection(currentSection - 1);
        }
        //Intercept the default mouse scrolling behavior and precisely control the up and down switching of page sections based on the direction of the scroll wheel to achieve a full-screen scrolling effect
    }, { passive: false });

    //Realize the function of sliding your finger to switch sections on mobile devices
    let touchStartY = 0;
    window.addEventListener('touchstart', function (e) {
        touchStartY = e.touches[0].clientY;
    });
    window.addEventListener('touchmove', function (e) {
        if (isScrolling) return;
        const touchY = e.touches[0].clientY;
        const diff = touchStartY - touchY;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                scrollToSection(currentSection + 1);
            } else {
                scrollToSection(currentSection - 1);
            }
        }
    });
    //When the user scrolls the page manually, it automatically jumps to the nearest section
    window.addEventListener('scroll', function () {
        //If scrolling is currently being controlled by code, no processing is done to prevent conflicts or multiple triggers
        if (isScrolling) return;
        //Clear the previously set scrollEndTimer
        clearTimeout(window.scrollEndTimer);
        //Set a new timer to execute the following logic 100 milliseconds after stopping scrolling. The purpose is to determine the current scrolling position after the user finishes scrolling
        window.scrollEndTimer = setTimeout(() => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const newSection = Math.round(scrollPosition / windowHeight);
            if (newSection !== currentSection) {
                scrollToSection(newSection);
            }
        }, 100);
    });
    window.scrollTo(0, 0);
}
//Set a typewriter animation effect
function setupTypingAnimation() {
    const textContainer = document.querySelector('.body-content-two');
    let originalHTML;
    if (textContainer.dataset.originalHtml) {
        originalHTML = textContainer.dataset.originalHtml;
    } else {
        originalHTML = textContainer.innerHTML;
        textContainer.dataset.originalHtml = originalHTML;
    }
    while (textContainer.firstChild) {
        textContainer.removeChild(textContainer.firstChild);
    }
    const lines = originalHTML.split('<br>');
    let currentLineIndex = 0;
    let currentCharIndex = 0;
    const textContent = document.createElement('div');
    textContent.className = 'typing-content';
    textContainer.appendChild(textContent);
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.textContent = '|';
    cursor.style.position = 'relative';
    cursor.style.display = 'inline-block';
    textContent.appendChild(cursor);

    //The typeNextChar() function is defined to simulate the typewriter effect word by word.
    function typeNextChar() {
        //Determine whether all rows have been completed
        if (currentLineIndex >= lines.length) {
            setTimeout(() => {
                cursor.remove();
            }, 100);
            return;
        }
        //Obtain the text of the line that is currently being typed
        const currentLine = lines[currentLineIndex];
        //Try to find out if there is already a <span> container for this line
        let lineContainer = textContent.querySelector(`[data-line="${currentLineIndex}"]`);
        //If this container is not available, create a new <span> element to hold the text of the current line, set the data-line attribute as a tag, and place it in front of the cursor
        if (!lineContainer) {
            lineContainer = document.createElement('span');
            lineContainer.setAttribute('data-line', currentLineIndex);
            textContent.insertBefore(lineContainer, cursor);
            if (currentLineIndex > 0) {
                const br = document.createElement('br');
                textContent.insertBefore(br, lineContainer);
            }
        }

        //This code is the final part of the typing animation
        if (currentCharIndex < currentLine.length) {
            //Extract the content of this line from the beginning to the current character index and update it to the line container to achieve the effect of typing one character
            lineContainer.innerHTML = currentLine.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            setTimeout(typeNextChar, 100);
        } else {
            currentLineIndex++;
            currentCharIndex = 0;
            if (currentLineIndex < lines.length) {
                typeNextChar();
            } else {
                typeNextChar();
            }
        }
    }
    typeNextChar();
}
//Set up a falling link animation and use the Matter.js physics engine to make the links fall naturally like objects
function restartTypingAnimation() {
    setupTypingAnimation();
}
function setupFallingLinks() {
    //Select all the links with the.body-content-link class it could be the <a> tag or something else, and these elements will be the objects that will drop later
    const links = document.querySelectorAll('.body-content-link');
    //Find the containers that wrap these links to determine the size of the falling area
    const linksContainer = document.querySelector('.body-content-three');
    const engineContainer = document.createElement('div');
    //Set the style of engineContainer: absolute positioning, full-screen coverage, and no impact on mouse operation
    engineContainer.style.position = 'absolute';
    engineContainer.style.top = '0';
    engineContainer.style.left = '0';
    engineContainer.style.width = '100%';
    engineContainer.style.height = '100%';
    engineContainer.style.pointerEvents = 'auto';
    engineContainer.style.zIndex = '-1';
    engineContainer.id = 'matter-container';
    linksContainer.appendChild(engineContainer);
    links.forEach(link => {
        link.style.opacity = '0';
        link.style.position = 'absolute';
        link.style.zIndex = '10';
    });
    //Create an instance of the Matter.js physics engine to control the operation of the entire physical world like gravity, collisions, motion, 
    const engine = Matter.Engine.create();
    //Obtain the world object in this engine. All objects (links, floors) should be added to this World
    const world = engine.world;
    //Create a renderer called render, which is responsible for "drawing" the physical world on web pages. The rendering results are displayed in the engineContainer container
    const render = Matter.Render.create({
        element: engineContainer,
        engine: engine,
        options: {
            width: linksContainer.offsetWidth,
            height: linksContainer.offsetHeight,
            wireframes: false,
            background: 'transparent',
            showAngleIndicator: false,
            showCollisions: false,
            showShadows: false
        }
    });
    //Create a floor
    const ground = Matter.Bodies.rectangle(
        linksContainer.offsetWidth / 2,
        linksContainer.offsetHeight + 30,
        linksContainer.offsetWidth * 2,
        60,
        { isStatic: true, render: { visible: false } }
    );

    //A fallingAnimation animation object was defined, which is responsible for allowing the linked elements to restart the physical simulation with a "drop" effect
    //Reintroduce the ground into the physical world
    Matter.World.add(world, [ground]);
    const linkBodies = [];
    const linkElements = [];
    //Create an object named fallingAnimation, which contains a  restart()method to retrigger the animation that has dropped from the link
    const fallingAnimation = {
        restart: function () {
    //Clear the existing data in the current physical world and the engine
            Matter.World.clear(world, false);
            Matter.Engine.clear(engine);
            Matter.World.add(world, [ground]);
    //Clear the previously saved rigid body array of links and get ready to add them again
            linkBodies.length = 0;
        //Traverse all the linked elements and put them back into the physical world one by one
            links.forEach((link, index) => {
        //Obtain the width and height of the current link to create a rigid body of the corresponding size
                const width = link.offsetWidth;
                const height = link.offsetHeight;
        //Set the initial position of the linked object
                const x = linksContainer.offsetWidth / 2 + (Math.random() * 200 - 100);
                const y = -100 - (index * 50);
        //Create a physical rectangular body
                const linkBody = Matter.Bodies.rectangle(x, y, width, height, {
                    restitution: 0.6,
                    friction: 0.1,
                    frictionAir: 0.05,
                    angle: Math.random() * Math.PI
                });
        //Add this linked rigid body to the physical world
                Matter.World.add(world, linkBody);
                linkBodies.push(linkBody);
                linkElements.push(link);
                link.style.opacity = '1';
            });
        //Start the physics engine and the object begins to fall for simulation
            Matter.Engine.run(engine);
        },
        //Another method, cleanup(), defined for the fallingAnimation object is used to stop and cleanup the physics engine and the world
        cleanup: function () {
            Matter.Engine.clear(engine);
            Matter.World.clear(world);
        }
    };
        //This function will synchronize the position of each linked element in real time with its corresponding physical rigid body
    function updateLinkPositions() {
        linkBodies.forEach((body, index) => {
            const link = linkElements[index];
            link.style.transform = `translate(${body.position.x - link.offsetWidth / 2}px, ${body.position.y - link.offsetHeight / 2}px) rotate(${body.angle}rad)`;
        });

        requestAnimationFrame(updateLinkPositions);
    }
    //Immediately start a position synchronization and begin the loop rendering of the physical animation
    updateLinkPositions();
    //Return the entire fallingAnimation object containing the restart() and cleanup() methods for external invocation
    return fallingAnimation;
}
    //When the entire page is fully loaded, call setupFullPageScroll(), which is the entry function of the entire scrolling logic. It will also call setupFallingLinks() to activate the dropped links effect.
window.addEventListener('load', function () {
    setupFullPageScroll();
});