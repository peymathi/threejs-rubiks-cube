// Globals defined. Initialized in init function
let camera, main_cube, faces, renderer, scene, tester_cube, timer;
let frameCounter = 0;
const CUBE_SIZE = 0.7;

// Constants for the arrays of faces
const POS_X = 0;
const NEG_X = 1;
const POS_Y = 2;
const NEG_Y = 3;
const POS_Z = 4;
const NEG_Z = 5;

// Constants for indexing array of cubes for each face
const UPPER_LEFT = 0;
const UPPER_MIDDLE = 1;
const UPPER_RIGHT = 2;
const MIDDLE_LEFT = 3;
const CENTER = 4;
const MIDDLE_RIGHT = 5;
const BOTTOM_LEFT = 6;
const BOTTOM_MIDDLE = 7;
const BOTTOM_RIGHT = 8;

// Class representing the entire rubik's cube
class MainCube {
    constructor() {

        this.group = new THREE.Group();
        this.faces = [];
    }
    
    build_faces() {

        // Build the faces
        // Groups for each of the faces stored in array indexed by constants. All groups added to main_cube group
        for (let i = 0; i < 6; i++) {
            this.faces[i] = new Face(i);
            this.group.add(this.faces[i].group);
        }
    }

}

// Class representing a face of the rubik's cube
class Face {
    constructor(position) {
        this.postiion = position;
        this.group = new THREE.Group();
        this.cubes = [];
    }
}

// Class representing a single piece of the rubik's cube
class Cube {
    constructor(cube, main_cube) {
        this.cube = cube;
        this.cur_parents = [];
        this.cur_parent = main_cube;
        main_cube.add(this.cube);
    }
}

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

// Constants for indexing the materials array
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

    // Group for all groups. The entire cube.
    main_cube = new MainCube();
    main_cube.build_faces();
    scene.add(main_cube.group);

    /*
        Creating cubes
    */

    // Geometry used for each cube
    let cube_geom = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);

    // Array full of black materials (default face color)
    let black_mats = []
    for (let i = 0; i < 6; i++) {
        black_mats[i] = materials[BLACK_MAT];
    }

    // Variables to hold the new cube and the materials used to make the cube
    let new_cube;
    let new_mats;

    // pos-x red center
    new_mats = black_mats.slice();
    new_mats[POS_X] = materials[RED_MAT];
    new_cube = new THREE.Mesh(cube_geom, new_mats);
    // ADD CUBE TO CORRECT GROUPS IN CLASS AND THREE.JS
    new_cube.position.x += CUBE_SIZE;

    // pos-y white center
    new_mats = black_mats.slice();
    new_mats[POS_Y] = materials[WHITE_MAT];
    new_cube = new THREE.Mesh(cube_geom, new_mats);

    new_cube.position.y += CUBE_SIZE;

    // pos-z green center
    new_mats = black_mats.slice();
    new_mats[POS_Z] = materials[GREEN_MAT];
    new_cube = new THREE.Mesh(cube_geom, new_mats);

    new_cube.position.z += CUBE_SIZE;

    // neg-x blue center
    new_mats = black_mats.slice();
    new_mats[NEG_X] = materials[BLUE_MAT];
    new_cube = new THREE.Mesh(cube_geom, new_mats);

    new_cube.position.x -= CUBE_SIZE;

    // neg-y yellow center
    new_mats = black_mats.slice();
    new_mats[NEG_Y] = materials[YELLOW_MAT];
    new_cube = new THREE.Mesh(cube_geom, new_mats);

    new_cube.position.y -= CUBE_SIZE;

    // neg-z orange center
    new_mats = black_mats.slice();
    new_mats[NEG_Z] = materials[ORANGE_MAT];
    new_cube = new THREE.Mesh(cube_geom, new_mats);

    new_cube.position.z -= CUBE_SIZE;
}