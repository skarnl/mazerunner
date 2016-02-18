import {Point} from 'js/Point.js';

export class Doorway
{
	constructor ()
	{
		this.leftPost = null;
		this.rightPost = null;
	}

	getLeftPost ()
	{
		return this.leftPost;
	}

	setLeftPost(x, y)
	{
		this.leftPost = new Point(x, y);
	}

	getRightPost ()
	{
		return this.rightPost;
	}

	setRightPost(x, y)
	{
		this.rightPost = new Point(x, y);
	}

	getWidth ()
	{
		if (this.leftPost.y === this.rightPost.y) {
			return Math.abs(this.leftPost.x - this.rightPost.x);
		} else {
			return Math.abs(this.leftPost.y - this.rightPost.y);
		}
	}
}