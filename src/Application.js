import {Doorway} from 'js/Doorway.js';
import {Events} from 'js/Events.js';
import {Maze} from 'js/Maze.js';
import {Point} from 'js/Point.js';
import {Runner} from 'js/Runner.js';
import {Utils} from 'js/Utils.js';

export class Application
{
    DEBUG = true;
    DEBUG_PIXEL_SIZE = 1;

	constructor()
	{
		this.createCanvas();
	}


	gogogo ()
	{
		console.log('Application.gogogo');

		//loading the image is the kickstart of the whole story ^^
		this.loadImage();
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
		//this.img.src = "media/maze50x40.gif";
		this.img.crossOrigin = "Anonymous";
	}

	imageSuccessHandler (event)
	{
		this.context.drawImage(this.img, 0, 0, this.img.width, this.img.height);

		//we have an image, let's go with tha banana
		this.startSequence();
	}

	imageErrorHandler (event)
	{
		console.log('ERROR');
	}

	startSequence ()
	{
		this.findDimensionsOfMaze();
		this.determineWallThickness();
		this.findEntrance();

        this.defineMaze();

		this.spawnFirstRunner();
	}

	findTopLeftCorner ()
	{
		find_top_corner_loop:
		for( let iy = 0; iy < this.img.height - 1; iy++ ) {
			for( let ix = 0; ix < this.img.width - 1; ix++) {

				if (Utils.isBlack(this.context, ix , iy)) {
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
			if (Utils.isBlack(this.context, x, currentY)) {
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
			if (Utils.isBlack(this.context, currentX, y)) {
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
	}

    determineWallThickness()
	{
		let x = this.topLeftCorner.x,
			y = this.topLeftCorner.y,
			wallThicknessCounter = 0,
			found = false;

		while (!found) {
			x += 1;
			y += 1;
			wallThicknessCounter++;

			if (Utils.isWhite(this.context, x, y)) {
				found = true;
			}

			if (wallThicknessCounter > 10) {
				console.log('Walls are too thick!');
				break;
			}
		}
		
		console.log(wallThicknessCounter);
		this.wallThickness = wallThicknessCounter;
	}

	findEntrance ()
	{
		this.entrance = new Doorway();

		let currentX = this.topLeftCorner.x,
			currentY = this.topLeftCorner.y,
			mode = 'horizontal';

		this.direction = Runner.DIRECTION_DOWN;

		while( !this.entrance.isDefined() ) {
			if(Utils.isWhite(this.context, currentX, currentY)) {
				if (this.entrance.getLeftPost() === null) {
					this.entrance.setLeftPost(currentX, currentY);
				}
			} else { //black
				if (this.entrance.getLeftPost() && this.entrance.getRightPost() === null) {
					this.entrance.setRightPost(currentX, currentY);
				}
			}

			if (mode == 'horizontal') {
				currentX++;
			}
			else {
				currentY++;
			}

			if (currentX > this.topRightCorner.x) {
				if (mode == 'horizontal') {
					currentX = this.topRightCorner.x;
					currentY++;

					mode = 'right_vertical';
					this.direction = Runner.DIRECTION_LEFT;
				} else {
					console.log('We did not find an entrance!');
					break;
				}
			}

			if (currentY > this.bottomRightCorner.y) {
				if (mode == 'right_vertical') {
					currentX = this.topLeftCorner.x;
					currentY = this.topLeftCorner.y + 1;

					mode = 'leftvertical';
					this.direction = Runner.DIRECTION_RIGHT;
				} else {
					currentY = this.bottomLeftCorner.y;
					currentX = this.bottomLeftCorner.x + 1;
					mode = 'bottom_horizontal';

					this.direction = Runner.DIRECTION_UP;
				}
			}
		}

		console.log('Entrance found: ' + this.entrance);

        this.drawLine(this.entrance.getLeftPost(), this.entrance.getRightPost());
		this.pathWidth = this.entrance.getWidth();
	}

    defineMaze() {

        let width = this.topRightCorner.x - this.topLeftCorner.x,
            height = this.bottomRightCorner.y - this.topRightCorner.y;

        this.maze = new Maze(this.topLeftCorner.x, this.topLeftCorner.y, width, height);
        this.maze.pathWidth = this.pathWidth;
        this.maze.wallThickness = this.wallThickness;
    }

	spawnFirstRunner ()
	{
		let runner = this.makeRunner();
		runner.startRunning(this.entrance.getLeftPost(), this.direction, true);
	}

    makeRunner ()
    {
        let runner = new Runner();
		runner.context = this.context;
		runner.maze = this.maze;

        //todo: add the maze dimensions, so the runner knows if he's outside the maze

        runner.crossRoadCallback = this.crossRoadHandler.bind(this);
		runner.deadEndCallback = this.deadEndHandler.bind(this);
		runner.exitCallback = this.exitHandler.bind(this);

        return runner;
    }

    /**
     *
     * HANDLERS
     *
     **/
    crossRoadHandler (paramsObject)
	{
		console.log('Application::crossRoadHandler');
		console.log(paramsObject);

        //todo: clone the previous runner, to keep it's path-history

        let runner = this.makeRunner();
		runner.startRunning(new Point(paramsObject.x, paramsObject.y), paramsObject.direction);
	}

	deadEndHandler (runner)
	{
		console.log('Application::deadEndHandler');
		console.log(runner);

		runner.kill();
	}

	exitHandler (runner)
	{
		console.log('Application::exitHandler');
		console.log(runner);
	}

	drawPixel (startPoint)
	{
        if(this.DEBUG) {
            this.context.fillStyle = '#ff0000';
            this.context.fillRect(startPoint.x, startPoint.y, this.DEBUG_PIXEL_SIZE, this.DEBUG_PIXEL_SIZE);
        }
	}

    drawLine (firstPoint, secondPoint)
	{
        if(this.DEBUG) {
           this.drawPixel(firstPoint);
           this.drawPixel(secondPoint);
        }
    }
}