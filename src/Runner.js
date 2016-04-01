import {Point} from 'js/Point.js';
import {Utils} from 'js/Utils.js';

export class Runner {
	constructor(id, context) {
		this.id = id;
		this.context = context;
		this.walkedPath = [];
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
					this.y -= this.maze.wallThickness;
				}
				this.weCameFrom = Runner.DIRECTION_DOWN;
				break;
			case Runner.DIRECTION_RIGHT:
				if (cheat) {
					this.x += this.maze.wallThickness;
				}
				this.weCameFrom = Runner.DIRECTION_LEFT;
				break;
			case Runner.DIRECTION_DOWN:
				if (cheat) {
					this.y += this.maze.wallThickness;
				}
				this.weCameFrom = Runner.DIRECTION_UP;
				break;
			case Runner.DIRECTION_LEFT:
				if (cheat) {
					this.x -= this.maze.wallThickness;
				}
				this.weCameFrom = Runner.DIRECTION_RIGHT;
				break;
		}

		this.drawMyself(Runner.COLOR__NEW);

		this.lookAround();
	}

	lookAround() {

		if (this.killed) {
			return;
		}

		this.walkedPath.push(new Point(this.x, this.y));

		this.posibilities = [];

		if (this.areWeOutOfTheMaze()) {
			this.drawMyself(Runner.COLOR__EXIT);
			this.exitCallback(this);
			return;
		}

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
		this.decide();
	}

	decide() {
		if (this.posibilities.length === 0) {
			this.deadEndCallback(this);
			this.drawMyself(Runner.COLOR__DEAD_END);
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

				this.crossRoadCallback({x: nextPositionBasedOnDirection.x, y: nextPositionBasedOnDirection.y, direction: nextDirection}, this);
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
				point.y -= (this.maze.pathWidth + this.maze.wallThickness);
				break;

			case Runner.DIRECTION_RIGHT:
				point.x += (this.maze.pathWidth + this.maze.wallThickness);
				break;

			case Runner.DIRECTION_DOWN:
				point.y += (this.maze.pathWidth + this.maze.wallThickness);
				break;

			case Runner.DIRECTION_LEFT:
				point.x -= (this.maze.pathWidth + this.maze.wallThickness);
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

		this.drawMyself(Runner.COLOR__NORMAL);
		this.lookAround();
	}

	kill ()
	{
		this.crossRoadCallback = null;
		this.deadEndCallback = null;
		this.exitCallback = null;
		this.killed = true;
	}

	drawMyself (color)
	{
		this.context.fillStyle = color;
		this.context.fillRect(this.x, this.y, this.maze.pathWidth, this.maze.pathWidth);
	}

	//LOOK METHODS
	canWeGoUp()
	{
		//we are positioned on the top side of the path, so no need to use the pathWidth here
		return (Utils.isWhite(this.context, this.x, this.y - 1));
	}

	canWeGoRight()
	{
		return (Utils.isWhite(this.context, this.x + this.maze.pathWidth + 1, this.y));
	}

	canWeGoDown()
	{
		return (Utils.isWhite(this.context, this.x, this.y + this.maze.pathWidth + 1));
	}

	canWeGoLeft()
	{
		//we are positioned on the left side of the path, so no need to use the pathWidth here
		return (Utils.isWhite(this.context, this.x - 1, this.y));
	}

	areWeOutOfTheMaze() {
		return !this.maze.isInside(this.x, this.y);
	}
}

Runner.DIRECTION_UP = 'up';
Runner.DIRECTION_RIGHT = 'right';
Runner.DIRECTION_DOWN = 'down';
Runner.DIRECTION_LEFT = 'left';

Runner.COLOR__NEW = '#caff70';
Runner.COLOR__NORMAL = '#eee8cd';
Runner.COLOR__DEAD_END = '#ff7256';
Runner.COLOR__FINAL_PATH = '#ff1493';
Runner.COLOR__EXIT = '#bf3eff';
