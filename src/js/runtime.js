var puzzle;
var renderer;
var scene;
var camera;
var projector;
var controls;

var height;
var width;

var cube_size = 25;
var cube_spacing = 0;
var particleMaterial;

var objects = [];

var BACKGROUND_COLOR = 0xc0c0c0;



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
	projector.unprojectVector( vector, camera );
	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
	var intersects = raycaster.intersectObjects(cube_array);
	console.log(intersects);
	if ( intersects.length > 0 ) {
       getNewTexture(0, cube_size, true);
		intersects[ 0 ].object.material.map  = new THREE.Texture(getNewTexture(Math.floor((Math.random() * 9)+1), cube_size, true))
        intersects[ 0 ].object.material.map.needsUpdate = true;
	}
}

function getNewTexture(number, size, selected) {
    var x = document.createElement("canvas");
    var context = x.getContext("2d");
    x.width = x.height = size;
    font_size = 10;
    context.beginPath();
    context.rect(0,0, x.width, x.height);
    if (selected) {
        context.fillStyle = "#326878";
    } else {
        context.fillStyle = "#e3edf7";
    }
    context.fill()
    context.lineWidth = 2;
    context.strokeStyle = "#ffffff";
    context.stroke();
    context.fillStyle = "9ba7b0";
    context.font =  font_size.toString() + "px"; //font size should match cube size
    context.textAlign = 'center';
    context.fillText(number.toString(), x.width / 2, (x.height + font_size) / 2);
    return x;
}
function returnNewCube() {

    var xm = new THREE.MeshBasicMaterial({ map: new THREE.Texture(getNewTexture(Math.floor((Math.random() * 9)+1), cube_size, false)), transparent: true });
    xm.map.needsUpdate = true;
	var geometry = new THREE.CubeGeometry(cube_size, cube_size, cube_size);
	return new THREE.Mesh(geometry, xm);
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
		
		var line_geometry = new THREE.Geometry();
		//var line = new THREE.Line(line_geometry, new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 1 } ));
		//scene.add(line);

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
	controls = new THREE.OrbitControls(camera);
	genCubes();
    // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x555555);
    scene.add(ambientLight);

    // add directional light source
    var directionalLight = new THREE.DirectionalLight(0x555555);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);
	console.log(cube_array);

	animate();

}

function animate() {
	window.requestAnimationFrame(animate, renderer.domElement);
	controls.update();
	renderer.render(scene, camera);
}

function init() {
	$(document).ready(function () {onDocumentReady()});
}