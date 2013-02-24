/* Cords system where 0 ... 3 are indexes in array and z cord is
 * a floor in a cube i += (n*n*z)
 *      y
 *     0  2
 *  x  1  3
 */
  
function Picross3D() {
	
	this.size = 0;
	this.puzzle_graphics_mask = null; // Defines graphics mask (non-empty itemps)
	this.puzzle_number_mask = null;

	this.returnAllCubes = function () {
		return this.puzzle_graphics_mask;
	}
	this.isCube = function() {
		return !Boolean(this.size % 1);
	}

	this.loadMask = function (puzzle_array) {
		/* puzzle_array would be an array of 1, 0 */
		this.size = Math.pow(puzzle_array.length, 1.0/3.0)
		if (! this.isCube()) {
			throw "not a cube";	
		}

		console.log("Using cube with size " + this.size);

		if (puzzle_array instanceof Array) {
			this.puzzle_graphics_mask = puzzle_array;
		} else {
			console.log("Error: expected array as input");
		}
	}

	this.getXYZBlocksInRow= function(x,y,z) {
		// returns mask ask (x,y,z)
		// means there must n cubes on x axis, o cubes on y axis ...
		var x_cubes = 0;
		var y_cubes = 0;
		var z_cubes = 0;

		for (var i=0; i < this.size; i++) {
			x_cubes += this.isXYZMasked(i, y, z);
			y_cubes += this.isXYZMasked(x, i, z);
			z_cubes += this.isXYZMasked(x, y, i);
		}
		return [x_cubes, y_cubes, z_cubes];

	}

	this.XYZtoI = function(x,y,z) {
		// transforms XYZ chords into array index;
		return (z * Math.pow(this.size,2)) + (y * this.size) + x;
	}

	this.ItoXYZ = function(i) {
		// transforms XYZ chords into array index;
		var h = i;
		var z = Math.floor(h / Math.pow(this.size, 2));
		h = h % Math.pow(this.size, 2);
		var y = Math.floor(h / this.size);
		h = h % this.size;

		console.log([h,y,z]);
		return [h, y, z];
	}

	this.isXYZMasked = function (x,y,z) {		
		return Boolean(this.puzzle_graphics_mask[this.XYZtoI(x,y,z)]);
	}

}