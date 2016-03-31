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
		this.findDimensionsOfMaze();

		// this.lookForEntrance();
		// this.spawnWorker();
	}

	findTopLeftCorner ()
	{
		find_top_corner_loop:
		for( let iy = 0; iy < this.img.height - 1; iy++ ) {
			for( let ix = 0; ix < this.img.width - 1; ix++) {

				if (this.isBlack(ix , iy)) {
					this.topLeftCorner = new Point(ix, iy);
					break find_top_corner_loop;
				}
			}
		}

		console.log('Found topLeftCorner: ' + this.topLeftCorner);

		this.drawPixel(this.topLeftCorner);
	}

	findTopRightCorner()
	{
		let currentY = this.topLeftCorner.y;

		for (let x = this.img.width - 1; x > this.topLeftCorner.x; x--) {
			if (this.isBlack(x, currentY)) {
				this.topRightCorner = new Point(x, currentY);
				break;
			}
		}

		console.log('Found topRightCorner: ' + this.topRightCorner);
		this.drawPixel(this.topRightCorner);
	}

	findBottomRightCorner()
	{
		let currentX = this.topRightCorner.x;

		for (let y = this.img.height - 1; y > this.topRightCorner.y; y--) {
			if (this.isBlack(currentX, y)) {
				this.bottomRightCorner = new Point(currentX, y);
				break;
			}
		}

		console.log('Found bottomRightCorner: ' + this.bottomRightCorner);
		this.drawPixel(this.bottomRightCorner);
	}

	defineBottomLeftCorner ()
	{
		this.bottomLeftCorner = new Point(this.topLeftCorner.x, this.bottomRightCorner.y);

		console.log('bottomLeftCorner defined: ' + this.bottomLeftCorner);
		this.drawPixel(this.bottomLeftCorner);
	}

	findDimensionsOfMaze ()
	{
		this.findTopLeftCorner();
		this.findTopRightCorner();
		this.findBottomRightCorner();
		this.defineBottomLeftCorner();

        this.determineWallThickness();

		this.findEntrance();
	}

    determineWallThickness() {

    }

	findEntrance ()
	{
		console.log('- findEntrance');
		
		this.entrance = new Doorway();

		let currentX = this.topLeftCorner.x,
			currentY = this.topLeftCorner.y,
			previousX,
			previousY;

		while( !this.entrance.isDefined() ) {
			if(this.isWhite(currentX, currentY)) {
				if (this.entrance.getLeftPost() === null) {
					//Math.min -> so we don't need to remember if we are going horizontal or vertical
					this.entrance.setLeftPost(Math.min(currentX, previousX), Math.min(currentY, previousY));
				}
			} else { //black
				if (this.entrance.getLeftPost() && this.entrance.getRightPost() === null) {
					this.entrance.setRightPost(currentX, currentY);
				}
			}

			currentX++;

			if (currentX > this.topRightCorner.x) {
				currentX = this.topRightCorner.x;
				currentY++;
			}

			if (currentY > this.bottomRightCorner.y) {
				currentY = this.bottomRightCorner.y;
				currentX--;
			}
		}
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

	isBlack (x, y)
	{
		let b = !this.isWhite(x, y);

		if (b) {
			console.log('###isBlack###');
			console.log(this.getPixel(x, y));
		}
		return b;
	}

	spawnWorker ()
	{
		let w = new Worker(pix);
		w.addEventListener(Events.CROSSROAD_FOUND, this.crossroadFoundHandler.bind(this));
		w.work();
	}

	drawPixel (startPoint)
	{
        if(Application.DEBUG) {
            this.context.fillStyle = '#FF0000';
            this.context.fillRect(startPoint.x, startPoint.y, 4, 4);
        }
	}
}

Application.DEBUG = true;