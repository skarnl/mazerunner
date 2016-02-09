import {Worker} from 'js/Worker.js';

export class Application 
{
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
		
		this.img.src = "media/maze.png";
		this.img.crossOrigin = "Anonymous";
	}

	imageSuccessHandler (event) {
		console.log(event);
		console.log('success');

		this.context.drawImage(this.img, 0, 0, this.img.width, this.img.height);

		this.spawnWorker();
	}

	imageErrorHandler (event) {
		console.log('ERROR');
	}

	spawnWorker() {
		var imgd = this.context.getImageData(0, 0, this.img.width, this.img.height);
		var pix = imgd.data;

		let w = new Worker(pix);
		w.work();
	}
}
