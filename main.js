// Define the canvas and the dimensions
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// Remove the scrollbars and fixed inappropriate canvas size on some browsers
document.documentElement.style.overflow = 'hidden';
document.body.style.overflow = 'hidden';

// Set the canvas width and height to the viewport size
canvas.width = innerWidth;
canvas.height = innerHeight;

// Define the Player class
class Player {
  constructor() {
    // Initialize the velocity property
    this.velocity = {
      x: 0,
      y: 0
    };

    // Load the image and set the width and height properties
    // based on the image's dimensions and a scale factor
    const image = new Image();
    image.src = 'DurrrSpaceShip.png';
    image.onload = () => {
      const scale = 0.8;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20
      };
    };
  }

  // Draw the player on the canvas
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
  }

  // Update the player's position based on its velocity
  update() {
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x;
    }
  }
}

// Define the Projectile class
class Projectile{
  constructor({position, velocity}){
    this.position = position
    this.velocity = velocity
    this.radius = 4
  }

  // Draw the projectile on the canvas
  draw(){
    c.beginPath()
    c.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2)
    c.fillStyle = 'red'
    c.fill()
    c.closePath()
  }

  // Update the projectile's position based on its velocity
  update(){
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

// Define the Invader class
class Invader {
  constructor({position}) {
    // Initialize the velocity property
    this.velocity = {
      x: 0,
      y: 0
    };

    // Load the image and set the width and height properties
    // based on the image's dimensions and a scale factor
    const image = new Image();
    image.src = 'invader.png';
    image.onload = () => {
      const scale = 1;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = {
        x: position.x,
        y: position.y
      };
    };
  }

  // Draw the invader on the canvas
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
  }

  // Update the invaders's position based on its velocity
  update({velocity}) {
    if (this.image) {
      this.draw();
      this.position.x += velocity.x;
      this.position.y += velocity.y;
    }
  }
}
// Define the Grid class for the invaders
class Grid {
  constructor(){
    this.position = {
      x: 0,
      y: 0
    }

    this.velocity = {
      x: 3,
      y: 0
    }

    this.invaders = []

    // Create a number of invaders spawned in a collumn
    const cols = Math.floor(Math.random() * 10 + 5)
    
    // Create a number of invaders spawned in a row
    const rows = Math.floor(Math.random() * 5 + 2)

    this.width = cols * 45

    // Spawning invaders in rows and collumns using for loops
    for(let x = 0; x < cols; x++){
      for(let y = 0; y < rows; y++){
      this.invaders.push(new Invader({position: {
        x: x * 45,
        y: y * 35
      }}))
      }
    }
  }

  update(){

    // Move the grid along the x axis
    this.position.x += this.velocity.x

    // Setting the grid velocity along y axis to zero for each frame
    this.velocity.y = 0

    // Bouncing the grid when hitting the edge of the canvas and moving the grid down
    if(this.position.x + this.width > canvas.width || this.position.x <= 0){
      this.velocity.x = -this.velocity.x
      this.velocity.y = 35
    }
  }
}

// Create an instance of the Player class
const player = new Player();

// Create an array to store projectile objects
const projectiles = []

// Create an array to store grid objets
const grids = []

// Define the keys object to track the state of each key
const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ' ': {
    pressed: false
  }
};

// Initialize frames variable to keep track of frames passed
let frames = 0

// A random number to randomize intervals of Invader spawns
let randomInterval = Math.floor(Math.random() * 500 + 500)

// The animate function is called repeatedly to update the canvas
function animate() {
  window.requestAnimationFrame(animate);

  // Set the background of the canvas to black
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);

  // Update the player
  player.update();

  // Update all projectiles in the projectiles array
  projectiles.forEach((projectile, index) =>{

    // Remove the projectile from the array if it has gone off the top of the canvas
    if(projectile.position.y + projectile.radius <= 0){
      setTimeout(() => {
        projectiles.splice(index,1)
      }, 0);
    }
    else
      projectile.update()
  })

  // Update every invader in a grid
  grids.forEach(grid => {
    grid.update()
    grid.invaders.forEach((invader, i) => {
      invader.update({velocity: grid.velocity})

      // Collision detection for both the invader and the projectile + removing them from the game
      projectiles.forEach((projectile, j) => {
        if (projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
            projectile.position.x + projectile.radius >= invader.position.x &&
            projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
            projectile.position.y + projectile.radius >= invader.position.y) {

          setTimeout(() => {
            const invaderFound = grid.invaders.find((invader2) => invader2 === invader)
            const projectileFound = projectiles.find((projectile2) => projectile2 === projectile)

            if(invaderFound && projectileFound){
              grid.invaders.splice(i, 1) 
              projectiles.splice(j, 1)
            }
          }, 0)

        }
      });
    })
  });

  // Update the player's velocity based on the state of the keys
  if (keys.a.pressed && player.position.x >= 0) {
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
    player.velocity.x = 5;
  } else {
    player.velocity.x = 0;
  }

  // Spawns a new grid of Invaders if X frames passed
  if(frames % randomInterval === 0){
    grids.push(new Grid())
    randomInterval = Math.floor(Math.random() * 500 + 500)
    frames = 0
  }

  // Updates the variable when animation loop is finished
  frames++
}

// Start the animation loop
animate();

// Add event listeners to track the state of the keys
addEventListener('keydown', ({ key }) => {
  switch (key) {
    case 'a':
      keys.a.pressed = true;
      break;
    case 'd':
      keys.d.pressed = true;
      break;
    case ' ':
      // Add a new projectile object to the projectiles array when the space bar is pressed
      projectiles.push(new Projectile({
        position:{
          x:player.position.x+player.width/2,
          y:player.position.y
        },
        velocity:{
          x:0,
          y:-10
        }
      }))
      break;
  }
});

addEventListener('keyup', ({ key }) => {
  switch (key) {
    case 'a':
      keys.a.pressed = false;
      break;
    case 'd':
      keys.d.pressed = false;
      break;
    case ' ':
      break;
  }
});
