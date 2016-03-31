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

		//let's start inside the walls
		switch(direction) {
			case Runner.DIRECTION_DOWN:
				this.y += this.wallThickness;
				this.weCameFrom = Runner.DIRECTION_UP;
				break;
		}

		this.debugDrawPixel(new Point(this.x, this.y));

		this.lookAround();
		//this.decide();
		//this.callback if we are at crossroad
		//continue in our initial direction - if possible, otherwise we go from UP, RIGHT, DOWN, LEFT
	}

	lookAround()
	{
		let posibilities = [];

		if (this.weCameFrom != Runner.DIRECTION_UP) {
			if (this.canWeGoUp()) {
				posibilities.push(Runner.DIRECTION_UP);
			}
		}

		if (this.weCameFrom != Runner.DIRECTION_RIGHT) {
			if (this.canWeGoRight()) {
				posibilities.push(Runner.DIRECTION_UP);
			}
		}

		if (this.weCameFrom != Runner.DIRECTION_DOWN) {
			if (this.canWeGoDown()) {
				posibilities.push(Runner.DIRECTION_UP);
			}
		}

		if (this.weCameFrom != Runner.DIRECTION_LEFT) {
			if (this.canWeGoLeft()) {
				posibilities.push(Runner.DIRECTION_UP);
			}
		}
		
		console.log(posibilities);
	}

	decide ()
	{
		switch(this.direction) {
			case Runner.DIRECTION_UP:
				//if (Utils.isWhite(this.x + 1, this.y)) {
				//	this.y++;
				//}
				break;

			case Runner.DIRECTION_RIGHT:
				//if (Utils.isWhite(this.x + 1, this.y)) {
				//	this.y++;
				//}
				break;

			case Runner.DIRECTION_DOWN:
				if (Utils.isWhite(this.context, this.x, this.y + this.pathWidth + 1)) {
					console.log('We can go DOWN');
					this.y++;
				}
				break;

			case Runner.DIRECTION_LEFT:
				//if (Utils.isWhite(this.x + 1, this.y)) {
				//	this.y++;
				//}
				break;
		}

		this.lookAround();
	}

	debugDrawPixel (point)
	{
		this.context.fillStyle = '#ff00ff';
		this.context.fillRect(point.x, point.y, this.pathWidth, this.pathWidth);
		this.context.fillStyle = '#00ff33';
		this.context.fillRect(point.x, point.y, 1, 1);
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
