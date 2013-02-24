var puzzle;
var renderer;
var scene;
var camera;
var projector;

var height;
var width;

var cube_size = 50;
var cube_spacing = 0;
var particleMaterial;

var objects = [];

var BACKGROUND_COLOR = 0xf0f0f0;



var cube_array = new Array();

function onDocumentReady() {
	console.log("ready");
	width=$(window).width();
	height=$(window).height();
	initGameData();
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
}

function onDocumentMouseDown(event) {
	console.log("clicked");
	event.preventDefault();
	var vector = new THREE.Vector3( ( event.clientX / width ) * 2 - 1, - ( event.clientY / height ) * 2 + 1, 0.5 );
	console.log(vector);
	projector.unprojectVector( vector, camera );
	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
	var intersects = raycaster.intersectObjects( cube_array );
	console.log(intersects);
	if ( intersects.length > 0 ) {

					intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );

					var particle = new THREE.Particle( particleMaterial );
					particle.position = intersects[ 0 ].point;
					particle.scale.x = particle.scale.y = 8;
					scene.add( particle );

				}
}

function returnNewCube() {
	var geometry = new THREE.CubeGeometry(cube_size, cube_size, cube_size);
	var material = new THREE.MeshBasicMaterial({color: 0x333333, opacity : 0.7});
	return new THREE.Mesh(geometry, material);
}

function returnPos(cord) {
	if (!cord)
		return cord;
	return cord * (cube_size + cube_spacing);
}
function genCubes() {
	var objects = puzzle.returnAllCubes();
	for (var i=0; i < objects.length;i++) {
		var mesh = returnNewCube();
		
		cube_xyz = puzzle.ItoXYZ(i);

		mesh.position.set (returnPos(cube_xyz[0]),
							returnPos(cube_xyz[1]),
							returnPos(cube_xyz[2]));
		

		cube_array.push(mesh);
		scene.add(cube_array[i]);
	}
}

function initGameData() {
	console.log("Initializing PocketPicross3D game data.");
	puzzle = new Picross3D();
	puzzle.loadMask(puzzle_levels[1]);

	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(width, height);
	document.body.appendChild(renderer.domElement);

	renderer.setClearColorHex(BACKGROUND_COLOR, 1.0);
	renderer.clear();

	projector = new THREE.Projector();
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(
		45,         // Field of view
		width / height, // aspect ratio
		1,	        // near
		10000       // far
		);

	camera.position.z = 500;
	camera.lookAt(scene.position);
	scene.add(camera);

	genCubes();

	particleMaterial = new THREE.ParticleCanvasMaterial( {

					color: 0x000000,
					program: function ( context ) {

						context.beginPath();
						context.arc( 0, 0, 1, 0, PI2, true );
						context.closePath();
						context.fill();

					}

				} );


	//var light = new THREE.PointLight(0xFFFF00);
	//light.position.set(20,0,20);
	//scene.add(light);
	animate(new Date().getTime());

}

function animate(t) {
	//camera.position.x = Math.sin(t/10000) * 500;
	camera.position.y = 150;
	//camera.position.z = Math.cos(t/10000) * 500;
	camera.lookAt(scene.position);
	window.requestAnimationFrame(animate, renderer.domElement);
	renderer.render(scene, camera);
}

function init() {
	$(document).ready(function () {onDocumentReady()});
}