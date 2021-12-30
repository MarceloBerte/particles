const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const particlesArray = [];
const color = {
	r: 50,
	g: 205,
	b: 50,
};

class Particle {
	constructor(x, y, r, dx, dy) {
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.radius = r;
		this.color = `rgba(${color.r}, ${color.g}, ${color.b}, 1)`;
	}

	draw() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.closePath();
	}

	update() {
		if (this.x > canvas.width || this.x < 0) {
			this.dx = -this.dx;
		}
		if (this.y > canvas.height || this.y < 0) {
			this.dy = -this.dy;
		}
		this.x += this.dx;
		this.y += this.dy;
	}
}

function setCanvasDimension() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function createParticles(quantity, speed) {
	if (quantity > 0) {
		for (let i = 0; i < quantity; i++) {
			particlesArray.push(
				new Particle(
					Math.random() * window.innerWidth,
					Math.random() * window.innerHeight,
					2.5,
					Math.random() *
						(speed * (Math.round(Math.random()) ? 1 : -1)),
					Math.random() *
						(speed * (Math.round(Math.random()) ? 1 : -1))
				)
			);
		}
	}
}

function drawVectors(vectorSize) {
	if (particlesArray.length > 0) {
		for (let i = 0; i < particlesArray.length; i++) {
			for (let j = i; j < particlesArray.length; j++) {
				let distance =
					(particlesArray[i].x - particlesArray[j].x) *
						(particlesArray[i].x - particlesArray[j].x) +
					(particlesArray[i].y - particlesArray[j].y) *
						(particlesArray[i].y - particlesArray[j].y);

				if (
					distance <
					(canvas.width / vectorSize) * (canvas.height / vectorSize)
				) {
					ctx.beginPath();
					ctx.strokeStyle = `
                        rgba(
                            ${color.r}, 
                            ${color.g}, 
                            ${color.b}, 
                            ${1 - distance / 50000}
                        )`;
					ctx.lineWidth = 1;
					ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
					ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
					ctx.stroke();
					ctx.closePath();
				}
			}
		}
	}
}

function mountParticles() {
	particlesArray.forEach((particle) => {
		particle.update();
		particle.draw();
	});
	drawVectors(1);
}

function loop() {
	mountParticles();
}

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	loop();
	requestAnimationFrame(animate);
}

function init() {
	setCanvasDimension();
	createParticles(100, 1);
	animate();
}

document.addEventListener('load', init());
document.addEventListener('resize', setCanvasDimension());
