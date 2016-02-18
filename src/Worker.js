export class Worker {
	
	constructor(imageData) {
		this.id = Math.random() * 10000;
		this.imageData = imageData;
	}

	work () {
		console.log(this.id + ' - start working');

		let pix = this.imageData;
		
		// Loop over each pixel and invert the color.
		for (var i = 0, n = pix.length; i < n; i += 4) {
		    pix[i  ] = 255 - pix[i  ]; // red
		    pix[i+1] = 255 - pix[i+1]; // green
		    pix[i+2] = 255 - pix[i+2]; // blue
		    // i+3 is alpha (the fourth element)

		    // console.log(pix)
		}
	}
}