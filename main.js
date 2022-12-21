const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

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

    this.radius = 3
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

// Create an instance of the Player class
const player = new Player();

// Create an array to store projectile objects
const projectiles = []

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

  // Update the player's velocity based on the state of the keys
  if (keys.a.pressed && player.position.x >= 0) {
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
    player.velocity.x = 5;
  } else {
    player.velocity.x = 0;
  }
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
