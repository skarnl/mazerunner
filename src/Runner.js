import {Point} from 'js/Point.js';
import {Utils} from 'js/Utils.js';

export class Runner {
	constructor(id, context) {
		this.id = id;
		this.context = context;
	}

	startRunning(point, direction, cheat = false) {
		console.log(this, '--- startRunning ---');

		this.x = point.x;
		this.y = point.y;
		this.direction = direction;

		this.iterations = 0;

		//let's start inside the walls
		switch (direction) {
			case Runner.DIRECTION_UP:
				if (cheat) {
					this.y -= this.wallThickness;
				}
				this.weCameFrom = Runner.DIRECTION_DOWN;
				break;
			case Runner.DIRECTION_RIGHT:
				if (cheat) {
					this.x += this.wallThickness;
				}
				this.weCameFrom = Runner.DIRECTION_LEFT;
				break;
			case Runner.DIRECTION_DOWN:
				if (cheat) {
					this.y += this.wallThickness;
				}
				this.weCameFrom = Runner.DIRECTION_UP;
				break;
			case Runner.DIRECTION_LEFT:
				if (cheat) {
					this.x -= this.wallThickness;
				}
				this.weCameFrom = Runner.DIRECTION_RIGHT;
				break;
		}

		this.debugDrawPixel("#ff0000");

		this.start();
	}

	start() {
		this.iterations++;

		//todo: is this needed?
		if (this.iterations < 300) {
			this.lookAround();
			this.decide();
		}
	}

	lookAround() {
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

	decide() {
		if (this.posibilities.length === 0) {
			this.deadEndCallback(this);
			return;
		}

		//we have multiple possible directions to go
		if (this.posibilities.length > 1) {

			//can we continue in the direction we already are using?
			let index = this.posibilities.indexOf(this.direction);

			if (index > -1) {
				//strip out our own direction, since we can just continue
				this.posibilities.splice(index, 1);
			} else {
				//pick one and remove it - delegate the other to the crossRoadCallback
				this.direction = this.posibilities[0];
				this.posibilities.splice(0, 1);
			}

			for (let i = 0; i < this.posibilities.length; i++) {
				console.log('crossroad found!');
				console.log(this.posibilities);
				console.log(this.posibilities[i]);

				let nextDirection = this.posibilities[i],
					nextPositionBasedOnDirection = this.calculateNextPosition(this.x, this.y, nextDirection);

				console.log('----- CROSSSROAD -----');
				console.log(nextDirection);
				console.log(this.x, this.y);
				console.log(nextPositionBasedOnDirection.x, nextPositionBasedOnDirection.y);

				this.crossRoadCallback({x: nextPositionBasedOnDirection.x, y: nextPositionBasedOnDirection.y, direction: nextDirection});
			}
		} else {
			this.direction = this.posibilities[0];
		}

		this.moveInDirection();
	}

	calculateNextPosition(x, y, direction)
	{
		let point = new Point(this.x, this.y);

		switch(direction) {
			case Runner.DIRECTION_UP:
				point.y -= (this.pathWidth + this.wallThickness);
				break;

			case Runner.DIRECTION_RIGHT:
				point.x += (this.pathWidth + this.wallThickness);
				break;

			case Runner.DIRECTION_DOWN:
				point.y += (this.pathWidth + this.wallThickness);
				break;

			case Runner.DIRECTION_LEFT:
				point.x -= (this.pathWidth + this.wallThickness);
				break;
		}

		return point;
	}

	moveInDirection ()
	{
		console.log('Runner::moveInDirection');
		console.log(this.direction);

		let nextPositionBasedOnDirection = this.calculateNextPosition(this.x, this.y, this.direction);

		switch(this.direction) {
			case Runner.DIRECTION_UP:
				this.weCameFrom = Runner.DIRECTION_DOWN;
				break;

			case Runner.DIRECTION_RIGHT:
				this.weCameFrom = Runner.DIRECTION_LEFT;
				break;

			case Runner.DIRECTION_DOWN:
				this.weCameFrom = Runner.DIRECTION_UP;
				break;

			case Runner.DIRECTION_LEFT:
				this.weCameFrom = Runner.DIRECTION_RIGHT;
				break;
		}

		this.x = nextPositionBasedOnDirection.x;
		this.y = nextPositionBasedOnDirection.y;

		this.debugDrawPixel('#00ffcc');
		this.start();
	}

	kill ()
	{
		this.crossRoadCallback = null;
		this.deadEndCallback = null;
		this.exitCallback = null;
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
