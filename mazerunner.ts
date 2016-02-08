// import Worker from 'worker';


class Application 
{
	canvas: any;
	context: CanvasRenderingContext2D;
	img: any;

	constructor() {
		this.createCanvas();
	}


	run () {

		console.log('Application.start');

		this.loadImage();

		// determine the entrance
		// seal the rest ^^
		// enter the maze, start a worker
	}


	createCanvas () {
		this.canvas = document.getElementById('canvas');
		this.canvas.width = 1000;
		this.canvas.height = 1000;

		this.context = this.canvas.getContext('2d');
		this.context.scale(4, 4);
	}


	loadImage () {
		this.img = new Image();
		
		this.img.addEventListener('load', this.imageSuccessHandler.bind(this));
		this.img.addEventListener('error', this.imageErrorHandler.bind(this));
		
		this.img.src = "maze.png";
	}

	imageSuccessHandler (event:Event) {
		console.log(event);
		console.log('success');

		this.context.drawImage(this.img, 0, 0, this.img.width, this.img.height);

		this.spawnWorker();
	}

	imageErrorHandler (event:Event) {
		console.log('ERROR');
	}

	spawnWorker() {
		let w = new Worker();
	}
}

class Worker {
	
}

//kickstart
var a = new Application();
a.run();