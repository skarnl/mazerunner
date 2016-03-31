import {Point} from 'js/Point.js';
import {Utils} from 'js/Utils.js';

export class Runner {
	constructor(id, context) {
		this.id = id;
		this.context = context;
	}

	startRunning(point, direction) {
		console.log(this, '--- startRunning ---');

		this.x = point.x;
		this.y = point.y;
		this.direction = direction;

		this.iterations = 0;

		//let's start inside the walls
		switch(direction) {
			case Runner.DIRECTION_DOWN:
				this.y += this.wallThickness;
				this.weCameFrom = Runner.DIRECTION_UP;
				break;
		}

		this.debugDrawPixel("#ff0000");

		this.start();
	}

	start ()
	{
		this.iterations++;
		
		if(this.iterations < 12) {
			this.lookAround();
			this.decide();
		}
	}

	lookAround()
	{
		this.posibilities = [];

		if (this.weCameFrom != Runner.DIRECTION_UP) {
			if (this.canWeGoUp()) {
				this.posibilities.push(Runner.DIRECTION_UP);
			}
		}

		if (this.weCameFrom != Runner.DIRECTION_RIGHT) {
			if (this.canWeGoRight()) {
				this.posibilities.push(Runner.DIRECTION_RIGHT);
			}
		}

		if (this.weCameFrom != Runner.DIRECTION_DOWN) {
			if (this.canWeGoDown()) {
				this.posibilities.push(Runner.DIRECTION_DOWN);
			}
		}

		if (this.weCameFrom != Runner.DIRECTION_LEFT) {
			if (this.canWeGoLeft()) {
				this.posibilities.push(Runner.DIRECTION_LEFT);
			}
		}
		
		console.log(this.posibilities);
	}

	decide ()
	{
		if (this.posibilities.length === 0) {
			this.deadEndCallback(this);
			return;
		}

		//we have multiple possible directions to go
		if (this.posibilities.length > 1) {

			let index = this.posibilities.indexOf(this.direction);

			if (index > -1) {
				//strip out our own direction, since we can just continue
				this.posibilities = this.posibilities.splice(index, 1);
			} else {
				//pick one and remove it - delegate the other to the crossRoadCallback
				this.direction = this.posibilities[0];
				this.posibilities = this.posibilities.splice(0, 1);
			}

			for(let i = 0; i < this.posibilities.length; i++) {
				console.log('crossroad found!');
				console.log(this.posibilities[i]);

				this.crossRoadCallback({x: this.x, y: this.y, direction: this.posibilities[i]});
			}
		} else {
			this.direction = this.posibilities[0];
		}

		this.moveInDirection();
	}

	moveInDirection ()
	{
		console.log('Runner::moveInDirection');
		console.log(this.direction);
		
		switch(this.direction) {
			case Runner.DIRECTION_UP:
				this.y -= this.pathWidth;
				this.weCameFrom = Runner.DIRECTION_DOWN;
				break;

			case Runner.DIRECTION_RIGHT:
				this.x += this.pathWidth;
				this.weCameFrom = Runner.DIRECTION_LEFT;
				break;

			case Runner.DIRECTION_DOWN:
				this.y += this.pathWidth;
				this.weCameFrom = Runner.DIRECTION_UP;
				break;

			case Runner.DIRECTION_LEFT:
				this.x -= this.pathWidth;
				this.weCameFrom = Runner.DIRECTION_RIGHT;
				break;
		}

		this.debugDrawPixel('#00ffcc');
		this.start();
	}

	kill ()
	{
		this.crossRoadCallback = null;
		this.deadEndCallback = null;
	}

	debugDrawPixel (color)
	{
		this.context.fillStyle = color;
		this.context.fillRect(this.x, this.y, this.pathWidth, this.pathWidth);
		this.context.fillStyle = '#0000ff';
		this.context.fillRect(this.x, this.y, 1, 1);
	}

	//LOOK METHODS
	canWeGoUp()
	{
		//we are positioned on the top side of the path, so no need to use the pathWidth here
		return (Utils.isWhite(this.context, this.x, this.y - 1));
	}

	canWeGoRight()
	{
		return (Utils.isWhite(this.context, this.x + this.pathWidth + 1, this.y));
	}

	canWeGoDown()
	{
		return (Utils.isWhite(this.context, this.x, this.y + this.pathWidth + 1));
	}

	canWeGoLeft()
	{
		//we are positioned on the left side of the path, so no need to use the pathWidth here
		return (Utils.isWhite(this.context, this.x - 1, this.y));
	}
}

Runner.DIRECTION_UP = 'up';
Runner.DIRECTION_RIGHT = 'right';
Runner.DIRECTION_DOWN = 'down';
Runner.DIRECTION_LEFT = 'left';
