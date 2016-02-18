import {Doorway} from 'js/Doorway.js';
import {Events} from 'js/Events.js';
import {Point} from 'js/Point.js';
import {Worker} from 'js/Worker.js';

export class Application 
{
	constructor()
	{
		this.createCanvas();
	}


	run ()
	{
		console.log('Application.start');

		this.loadImage();

		// determine the entrance
		// seal the rest ^^
		// enter the maze, start a worker
	}


	createCanvas ()
	{
		this.canvas = document.getElementById('canvas');
		this.canvas.width = 1000;
		this.canvas.height = 1000;

		this.context = this.canvas.getContext('2d');
	}


	loadImage ()
	{
		this.img = new Image();
		
		this.img.addEventListener('load', this.imageSuccessHandler.bind(this));
		this.img.addEventListener('error', this.imageErrorHandler.bind(this));
		
		// this.img.src = "media/maze.png";
		this.img.src = "media/maze20x20.gif";
		this.img.crossOrigin = "Anonymous";
	}

	imageSuccessHandler (event)
	{
		console.log(event);
		console.log('success');

		this.context.drawImage(this.img, 0, 0, this.img.width, this.img.height);

		this.startSequence();
	}

	imageErrorHandler (event)
	{
		console.log('ERROR');
	}

	startSequence ()
	{
		this.findMazeTopLeftCorner();

		this.findDimentionsOfMaze();
		// this.lookForEntrance();
		// this.spawnWorker();
	}

	findMazeTopLeftCorner ()
	{
		find_top_corner_loop:
		for( let iy = 0; iy < this.img.height; iy++ ) {
			for( let ix = 0; ix < this.img.width; ix++) {

				if (!this.isWhite(ix , iy)) {
					this.topLeftCorner = new Point(ix, iy);
					
					console.log('Found topLeftCorner: ' + this.topLeftCorner);
					break find_top_corner_loop;
				}
			}
		}
	}

	findDimentionsOfMaze ()
	{
		this.entrance = new Doorway();
		this.exit = new Doorway();
		
		//horizontal
		for ( let ix = this.topLeftCorner.x; ix < this.img.width; ix++) {
			
			if (this.isWhite(ix, this.topLeftCorner.y)) {
				if (this.entrance.getLeftPost() && this.entrance.getRightPost()) {
					this.topRightCorner = new Point(ix, this.topLeftCorner.y);
					break;
				}

				if (this.entrance.getLeftPost() === null) {
					this.entrance.setLeftPost(ix - 1, this.topLeftCorner.y);
				}
			} else { //black
				if (this.entrance.getLeftPost() && this.entrance.getRightPost() === null) {
					this.entrance.setRightPost(ix, this.topLeftCorner.y);
				}
			}
		}

		/*for (let iy = this.topLeftCorner.y; iy < this.img.height; iy++ )) {
			if (this.isWhite(this.topRightCorner.x, iy)) {
				if (this.entrance.getLeftPost() && this.entrance.getRightPost() ) {
					this.bottomRightCorner = new Point(this.topRightCorner.x, iy);
					break;
				}

				if (this.entrance.getLeftPost() === null) {
					this.entrance.setLeftPost(ix - 1, this.topLeftCorner.y);
				}
			} else { //black
				if (this.entrance.getLeftPost() && this.entrance.getRightPost() === null) {
					this.entrance.setRightPost(ix, this.topLeftCorner.y);
				}
			}
		}*/
	}

	getPixel (x, y)
	{
    	return this.context.getImageData(x, y, 1, 1).data;
	}

	isWhite (x, y)
	{
		let pixelData = this.getPixel(x, y);
		return pixelData[0] === 255 && pixelData[1] === 255 && pixelData[2] === 255;
	}

	spawnWorker ()
	{
		

		let w = new Worker(pix);
		w.addEventListener(Events.CROSSROAD_FOUND, this.crossroadFoundHandler.bind(this));
		w.work();
	}

	drawPixel (startPoint, endPoint)
	{
		this.context.beginPath();
		this.context.lineWidth = 1;

		// set line color
		this.context.strokeStyle = '#E60E7D';
  		this.context.moveTo(startPoint.x, startPoint.y);
  		this.context.lineTo(endPoint.x, endPoint.y);
  		this.context.stroke();
	}
}
