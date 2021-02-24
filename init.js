// Globals defined. Initialized in init function
let camera, main_cube, faces, renderer, scene, tester_cube, timer;
let frameCounter = 0;
const CUBE_SIZE = 0.7;

// Constants for the arrays of faces
const POS_X = 0; // RED
const NEG_X = 1; // BLUE
const POS_Y = 2; // WHITE
const NEG_Y = 3; // YELLOW
const POS_Z = 4; // GREEN
const NEG_Z = 5; // ORANGE

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
        this.faces = new Array(6);
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
        this.cubes = new Array(9);
    }
}

// Class representing a single piece of the rubik's cube
class Cube {
    constructor(cube, main_cube) {
        this.cube = cube;
        this.cur_parents = [];
        this.cur_parent = main_cube;
        main_cube.group.add(this.cube);
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
    let new_cube_obj;
    let new_mats;


    // Centers
    // pos-x red center
    // Colors the cube accordingly
    new_mats = black_mats.slice();
    new_mats[POS_X] = materials[RED_MAT];
    // Creates the Three.js cube
    new_cube = new THREE.Mesh(cube_geom, new_mats);
    // Creates the cube object
    new_cube_obj = new Cube(new_cube, main_cube);
    // Adds the cube to the appropriate face object
    main_cube.faces[POS_X].cubes[CENTER] = new_cube_obj;
    // Set the position of the new cube
    new_cube.position.x += CUBE_SIZE;

    // pos-y white center
    new_mats = black_mats.slice();
    new_mats[POS_Y] = materials[WHITE_MAT];
    new_cube = new THREE.Mesh(cube_geom, new_mats);
    new_cube_obj = new Cube(new_cube, main_cube);
    main_cube.faces[POS_Y].cubes[CENTER] = new_cube_obj;
    new_cube.position.y += CUBE_SIZE;

    // pos-z green center
    new_mats = black_mats.slice();
    new_mats[POS_Z] = materials[GREEN_MAT];
    new_cube = new THREE.Mesh(cube_geom, new_mats);
    new_cube_obj = new Cube(new_cube, main_cube);
    main_cube.faces[POS_Z].cubes[CENTER] = new_cube_obj;
    new_cube.position.z += CUBE_SIZE;

    // neg-x blue center
    new_mats = black_mats.slice();
    new_mats[NEG_X] = materials[BLUE_MAT];
    new_cube = new THREE.Mesh(cube_geom, new_mats);
    new_cube_obj = new Cube(new_cube, main_cube);
    main_cube.faces[NEG_X].cubes[CENTER] = new_cube_obj;
    new_cube.position.x -= CUBE_SIZE;

    // neg-y yellow center
    new_mats = black_mats.slice();
    new_mats[NEG_Y] = materials[YELLOW_MAT];
    new_cube = new THREE.Mesh(cube_geom, new_mats);
    new_cube_obj = new Cube(new_cube, main_cube);
    main_cube.faces[NEG_Y].cubes[CENTER] = new_cube_obj;
    new_cube.position.y -= CUBE_SIZE;

    // neg-z orange center
    new_mats = black_mats.slice();
    new_mats[NEG_Z] = materials[ORANGE_MAT];
    new_cube = new THREE.Mesh(cube_geom, new_mats);
    new_cube_obj = new Cube(new_cube, main_cube);
    main_cube.faces[NEG_Z].cubes[CENTER] = new_cube_obj;
    new_cube.position.z -= CUBE_SIZE;

    // Green Face
    for (let loc = 0; loc < 9; loc++)
    {
        // Determine the color of the materials for the new cube
        new_mats = black_mats.slice();
        new_mats[POS_Z] = materials[GREEN_MAT];
        switch(loc) {
            case UPPER_LEFT:
                new_mats[NEG_X] = materials[BLUE_MAT];
                new_mats[POS_Y] = materials[WHITE_MAT];
                break;
            case UPPER_MIDDLE:
                new_mats[POS_Y] = materials[WHITE_MAT];
                break;
            case UPPER_RIGHT:
                new_mats[POS_Y] = materials[WHITE_MAT];
                new_mats[POS_X] = materials[RED_MAT];
                break;
            case MIDDLE_LEFT:
                new_mats[NEG_X] = materials[BLUE_MAT];
                break;
            case MIDDLE_RIGHT:
                new_mats[POS_X] = materials[RED_MAT];
                break;
            case BOTTOM_LEFT:
                new_mats[NEG_X] = materials[BLUE_MAT];
                new_mats[NEG_Y] = materials[YELLOW_MAT];
                break;
            case BOTTOM_MIDDLE:
                new_mats[NEG_Y] = materials[YELLOW_MAT];
                break;
            case BOTTOM_RIGHT:
                new_mats[NEG_Y] = materials[YELLOW_MAT];
                new_mats[POS_X] = materials[RED_MAT];
        }

        // Create the cube and add it to the green face
        new_cube = new THREE.Mesh(cube_geom, new_mats);
        new_cube_obj = new Cube(new_cube, main_cube);
        main_cube.faces[POS_Z].cubes[loc] = new_cube_obj;
        new_cube.position.z += CUBE_SIZE;

        // Add the cube to the appropriate other faces and change the position accordingly
        switch (loc) {
            case UPPER_LEFT:
                main_cube.faces[NEG_X].cubes[loc] = new_cube_obj;
                main_cube.faces[POS_Y].cubes[loc] = new_cube_obj;
                new_cube.position.x -= CUBE_SIZE;
                new_cube.position.y += CUBE_SIZE;
                break;
            case UPPER_MIDDLE:
                main_cube.faces[POS_Y].cubes[loc] = new_cube_obj;
                new_cube.position.y += CUBE_SIZE;
                break;
            case UPPER_RIGHT:
                main_cube.faces[POS_Y].cubes[loc] = new_cube_obj;
                main_cube.faces[POS_X].cubes[loc] = new_cube_obj;
                new_cube.position.y += CUBE_SIZE;
                new_cube.position.x += CUBE_SIZE;
                break;
            case MIDDLE_LEFT:
                main_cube.faces[NEG_X].cubes[loc] = new_cube_obj;
                new_cube.position.x -= CUBE_SIZE;
                break;
            case MIDDLE_RIGHT:
                main_cube.faces[POS_X].cubes[loc] = new_cube_obj;
                new_cube.position.x += CUBE_SIZE;
                break;
            case BOTTOM_LEFT:
                main_cube.faces[NEG_X].cubes[loc] = new_cube_obj;
                main_cube.faces[NEG_Y].cubes[loc] = new_cube_obj;
                new_cube.position.x -= CUBE_SIZE;
                new_cube.position.y -= CUBE_SIZE;
                break;
            case BOTTOM_MIDDLE:
                main_cube.faces[NEG_Y].cubes[loc] = new_cube_obj;
                new_cube.position.y -= CUBE_SIZE;
                break;
            case BOTTOM_RIGHT:
                main_cube.faces[POS_X].cubes[loc] = new_cube_obj;
                main_cube.faces[NEG_Y].cubes[loc] = new_cube_obj;
                new_cube.position.x += CUBE_SIZE;
                new_cube.position.y -= CUBE_SIZE;
        }
    }

    // Orange Face
    for (let loc = 0; loc < 9; loc++)
    {
        // Determine the color of the materials for the new cube
        
        // Blue
        if (loc === UPPER_LEFT) {}

        // Red

        // White

        // Yellow

        // Create the cube and add it to the orange face

        // Add the cube to the appropriate other faces and change the position accordingly

    }
}