// Globals defined. Initialized in init function
let camera, cube, renderer, scene, tester_cube, timer;
let frameCounter = 0;

let loader = new THREE.TextureLoader();
loader.setPath("textures/cube_faces/");

// Array of materials be used for each cube. Indexable by constants
let materials = [
    new THREE.MeshBasicMaterial({ map: loader.load('red.png') }), // pos-x
    new THREE.MeshBasicMaterial({ map: loader.load('blue.png') }), // neg-x
    new THREE.MeshBasicMaterial({ map: loader.load('green.png') }), // pos-y
    new THREE.MeshBasicMaterial({ map: loader.load('yellow.png') }), // neg-y
    new THREE.MeshBasicMaterial({ map: loader.load('orange.png') }), // pos-z
    new THREE.MeshBasicMaterial({ map: loader.load('white.png') }), // neg-z
    new THREE.MeshPhongMaterial({ color: 000000 }),
];

const RED_MAT = 0;
const BLUE_MAT = 1;
const GREEN_MAT = 2;
const YELLOW_MAT = 3;
const ORANGE_MAT = 4;
const WHITE_MAT = 5;
const BLACK_MAT = 6;

// This function initializes the scene, camera, renderer, and all objects in the scene
function init() {

    // Sets up the renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Sets up the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color("rgb(100, 100, 100)");

    // Basic lightsources
    const directionalLight = new THREE.DirectionalLight(0x888888);
    directionalLight.position.set(0, 0, 6);

    scene.add(directionalLight.target);
    scene.add(directionalLight);
    scene.add(new THREE.AmbientLight(0x777777));

    /*
        Three different camera types. Perspective camera tries to mimic the way the human eye sees.
        Parameters are FOV, Aspect ratio, near clipping plane, and far clipping plane. Aspect ratio should always be the
        size of the window. Near and far clipping panes determine the limits for the distance to the camera in which items are rendered.
    */
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Moves the camera back from the origin so that the objects can be seen
    camera.position.z = 6;

    // Basic multicolor cube for testing lights, cameras, scene, etc.
    let tester_cube_materials = [
        new THREE.MeshBasicMaterial({ map: loader.load('red.png') }), // pos-x
        new THREE.MeshBasicMaterial({ map: loader.load('blue.png') }), // neg-x
        new THREE.MeshBasicMaterial({ map: loader.load('green.png') }), // pos-y
        new THREE.MeshBasicMaterial({ map: loader.load('yellow.png') }), // neg-y
        new THREE.MeshBasicMaterial({ map: loader.load('orange.png') }), // pos-z
        new THREE.MeshBasicMaterial({ map: loader.load('white.png') }), // neg-z
    ];

    let tester_cube_geom = new THREE.BoxGeometry(1, 1, 1);
    tester_cube = new THREE.Mesh(tester_cube_geom, tester_cube_materials);
    scene.add(tester_cube);

}

// Function that is meant to be called once per frame
function update() {

    // This line sends this function callback to a THREE.js function which will automatically handle the framerate
    requestAnimationFrame(update);

    // Compute the delta time and count total frames since start. Delta is in ms
    frameCounter += 1;
    let delta = 0;
    let d = new Date();
    if (timer !== null) {
        delta = d.getTime() - timer;
    }
    // Starts timer for next delta time computation
    timer = d.getTime();

    /*
        Make changes to all objects in the scene
    */

    tester_cube.rotation.x += 0.01;
    tester_cube.rotation.y += 0.04;

    // Rerender the scene and camera
    renderer.render(scene, camera);
}

// Sets up all of the vanilla JS stuff
function main() {

    window.onresize = resize;
}

// Function handler that resizes the renderer and camera on window resize
function resize() {

    renderer.setSize(window.innerWidth, window.innerHeight);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 6;
}

main();
init();
update();