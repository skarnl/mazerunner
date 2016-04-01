export class Maze {
    constructor(x, y, width, height) {
		this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.pathWidth = null;
        this.wallThickness = null;
	}

    isInside (x, y) {
        return (x > this.x
            && x < this.x + this.width
            && y > this.y
            && y < this.y + this.height
        )
    }
}