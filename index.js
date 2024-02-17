import * as THREE from 'three';

// Sets up all of the vanilla JS stuff and then calls init and update functions when ready.
function main() {
    window.onresize = resize;

    init();
    update();
}

// Function handler that resizes the renderer and camera on window resize
function resize() {

    renderer.setSize(window.innerWidth, window.innerHeight);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 6;
}

let camera, main_cube, faces, renderer, scene, tester_cube;

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
        this.position = position;
        this.group = new THREE.Group();
        this.cubes = new Array(9);
    }

    rotate() {
        for (let i = 0; i < 9; i++) {
            this.group.add(this.cubes[i].cube);
        }
    }

    finishRotation() {
        for (let i = 0; i < 9; i++)
        {
            this.cubes[i].reset();
        }
    }
}

// Class representing a single piece of the rubik's cube
class Cube {
    constructor(cube, main_cube) {
        this.cube = cube;
        this.cur_parents = [];
        this.cur_parent = main_cube;
        this.main_cube = main_cube;
        main_cube.group.add(this.cube);
    }

    reset() {
        this.main_cube.group.add(this.cube);
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
    new THREE.MeshPhongMaterial({ color: 0x000000 }),
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
        if (loc !== CENTER)
        {
            // Determine the color of the materials for the new cube
            new_mats = black_mats.slice();
            new_mats[POS_Z] = materials[GREEN_MAT];
            
            // Red
            if (loc === UPPER_RIGHT || loc === MIDDLE_RIGHT || loc === BOTTOM_RIGHT) {
                new_mats[POS_X] = materials[RED_MAT];
            }

            // Blue
            if (loc === UPPER_LEFT || loc === MIDDLE_LEFT || loc === BOTTOM_LEFT) {
                new_mats[NEG_X] = materials[BLUE_MAT];
            }

            // White
            if (loc === UPPER_LEFT || loc === UPPER_MIDDLE || loc === UPPER_RIGHT) {
                new_mats[POS_Y] = materials[WHITE_MAT];
            }

            // Yellow
            if (loc === BOTTOM_LEFT || loc === BOTTOM_MIDDLE || loc === BOTTOM_RIGHT) {
                new_mats[NEG_Y] = materials[YELLOW_MAT];
            }

            // Create the cube and add it to the green face
            new_cube = new THREE.Mesh(cube_geom, new_mats);
            new_cube_obj = new Cube(new_cube, main_cube);
            main_cube.faces[POS_Z].cubes[loc] = new_cube_obj;
            new_cube.position.z += CUBE_SIZE;

            // Add the cube to the appropriate other faces and change the position accordingly
            switch (loc) {
                case UPPER_LEFT:
                    main_cube.faces[NEG_X].cubes[UPPER_RIGHT] = new_cube_obj;
                    main_cube.faces[POS_Y].cubes[BOTTOM_LEFT] = new_cube_obj;
                    new_cube.position.x -= CUBE_SIZE;
                    new_cube.position.y += CUBE_SIZE;
                    break;
                case UPPER_MIDDLE:
                    main_cube.faces[POS_Y].cubes[BOTTOM_MIDDLE] = new_cube_obj;
                    new_cube.position.y += CUBE_SIZE;
                    break;
                case UPPER_RIGHT:
                    main_cube.faces[POS_Y].cubes[BOTTOM_RIGHT] = new_cube_obj;
                    main_cube.faces[POS_X].cubes[UPPER_LEFT] = new_cube_obj;
                    new_cube.position.y += CUBE_SIZE;
                    new_cube.position.x += CUBE_SIZE;
                    break;
                case MIDDLE_LEFT:
                    main_cube.faces[NEG_X].cubes[MIDDLE_RIGHT] = new_cube_obj;
                    new_cube.position.x -= CUBE_SIZE;
                    break;
                case MIDDLE_RIGHT:
                    main_cube.faces[POS_X].cubes[MIDDLE_LEFT] = new_cube_obj;
                    new_cube.position.x += CUBE_SIZE;
                    break;
                case BOTTOM_LEFT:
                    main_cube.faces[NEG_X].cubes[BOTTOM_RIGHT] = new_cube_obj;
                    main_cube.faces[NEG_Y].cubes[UPPER_LEFT] = new_cube_obj;
                    new_cube.position.x -= CUBE_SIZE;
                    new_cube.position.y -= CUBE_SIZE;
                    break;
                case BOTTOM_MIDDLE:
                    main_cube.faces[NEG_Y].cubes[UPPER_MIDDLE] = new_cube_obj;
                    new_cube.position.y -= CUBE_SIZE;
                    break;
                case BOTTOM_RIGHT:
                    main_cube.faces[POS_X].cubes[BOTTOM_LEFT] = new_cube_obj;
                    main_cube.faces[NEG_Y].cubes[UPPER_RIGHT] = new_cube_obj;
                    new_cube.position.x += CUBE_SIZE;
                    new_cube.position.y -= CUBE_SIZE;
            }
        }
    }

    // Orange Face
    for (let loc = 0; loc < 9; loc++)
    {
        if (loc !== CENTER)
        {
            // Determine the color of the materials for the new cube
            new_mats = black_mats.slice();
            new_mats[NEG_Z] = materials[ORANGE_MAT];

            // Blue
            if (loc === UPPER_LEFT || loc === MIDDLE_LEFT || loc === BOTTOM_LEFT) {
                new_mats[NEG_X] = materials[BLUE_MAT];
            }

            // Red
            if (loc === UPPER_RIGHT || loc === MIDDLE_RIGHT || loc === BOTTOM_RIGHT) {
                new_mats[POS_X] = materials[RED_MAT];
            }

            // White
            if (loc === BOTTOM_LEFT || loc === BOTTOM_MIDDLE || loc === BOTTOM_RIGHT) {
                new_mats[POS_Y] = materials[WHITE_MAT];
            }

            // Yellow
            if (loc === UPPER_LEFT || loc === UPPER_MIDDLE || loc === UPPER_RIGHT) {
                new_mats[NEG_Y] = materials[YELLOW_MAT];
            }

            // Create the cube and add it to the orange face
            new_cube = new THREE.Mesh(cube_geom, new_mats);
            new_cube_obj = new Cube(new_cube, main_cube);
            main_cube.faces[NEG_Z].cubes[loc] = new_cube_obj;
            new_cube.position.z -= CUBE_SIZE;

            // Add the cube to the appropriate other faces and change the position accordingly
            switch (loc) {
                case UPPER_LEFT:
                    main_cube.faces[NEG_X].cubes[BOTTOM_LEFT] = new_cube_obj;
                    main_cube.faces[NEG_Y].cubes[BOTTOM_LEFT] = new_cube_obj;
                    new_cube.position.x -= CUBE_SIZE;
                    new_cube.position.y -= CUBE_SIZE;
                    break;
                case UPPER_MIDDLE:
                    main_cube.faces[NEG_Y].cubes[BOTTOM_MIDDLE] = new_cube_obj;
                    new_cube.position.y -= CUBE_SIZE;
                    break;
                case UPPER_RIGHT:
                    main_cube.faces[POS_X].cubes[BOTTOM_RIGHT] = new_cube_obj;
                    main_cube.faces[NEG_Y].cubes[BOTTOM_RIGHT] = new_cube_obj;
                    new_cube.position.x += CUBE_SIZE;
                    new_cube.position.y -= CUBE_SIZE;
                    break;
                case MIDDLE_LEFT:
                    main_cube.faces[NEG_X].cubes[MIDDLE_LEFT] = new_cube_obj;
                    new_cube.position.x -= CUBE_SIZE;
                    break;
                case MIDDLE_RIGHT:
                    main_cube.faces[POS_X].cubes[MIDDLE_RIGHT] = new_cube_obj;
                    new_cube.position.x += CUBE_SIZE;
                    break;
                case BOTTOM_LEFT:
                    main_cube.faces[NEG_X].cubes[UPPER_LEFT] = new_cube_obj;
                    main_cube.faces[POS_Y].cubes[UPPER_LEFT] = new_cube_obj;
                    new_cube.position.x -= CUBE_SIZE;
                    new_cube.position.y += CUBE_SIZE;
                    break;
                case BOTTOM_MIDDLE:
                    main_cube.faces[POS_Y].cubes[UPPER_MIDDLE] = new_cube_obj;
                    new_cube.position.y += CUBE_SIZE;
                    break;
                case BOTTOM_RIGHT:
                    main_cube.faces[POS_X].cubes[UPPER_RIGHT] = new_cube_obj;
                    main_cube.faces[POS_Y].cubes[UPPER_RIGHT] = new_cube_obj;
                    new_cube.position.x += CUBE_SIZE;
                    new_cube.position.y += CUBE_SIZE;
            }
        }
    }

    // Blue
    new_mats = black_mats.slice();
    new_mats[NEG_X] = materials[BLUE_MAT];
    new_mats[POS_Y] = materials[WHITE_MAT];
    new_cube = new THREE.Mesh(cube_geom, new_mats);
    new_cube_obj = new Cube(new_cube, main_cube);
    main_cube.faces[POS_Y].cubes[MIDDLE_LEFT] = new_cube_obj;
    main_cube.faces[NEG_X].cubes[UPPER_MIDDLE] = new_cube_obj;
    new_cube.position.x -= CUBE_SIZE;
    new_cube.position.y += CUBE_SIZE;

    new_mats = black_mats.slice();
    new_mats[NEG_X] = materials[BLUE_MAT];
    new_mats[NEG_Y] = materials[YELLOW_MAT];
    new_cube = new THREE.Mesh(cube_geom, new_mats);
    new_cube_obj = new Cube(new_cube, main_cube);
    main_cube.faces[NEG_X].cubes[BOTTOM_MIDDLE] = new_cube_obj;
    main_cube.faces[NEG_Y].cubes[MIDDLE_LEFT] = new_cube_obj;
    new_cube.position.x -= CUBE_SIZE;
    new_cube.position.y -= CUBE_SIZE;

    // Red
    new_mats = black_mats.slice();
    new_mats[POS_X] = materials[RED_MAT];
    new_mats[POS_Y] = materials[WHITE_MAT];
    new_cube = new THREE.Mesh(cube_geom, new_mats);
    new_cube_obj = new Cube(new_cube, main_cube);
    main_cube.faces[POS_X].cubes[UPPER_MIDDLE] = new_cube_obj;
    main_cube.faces[POS_Y].cubes[MIDDLE_RIGHT] = new_cube_obj;
    new_cube.position.x += CUBE_SIZE;
    new_cube.position.y += CUBE_SIZE;

    new_mats = black_mats.slice();
    new_mats[POS_X] = materials[RED_MAT];
    new_mats[NEG_Y] = materials[YELLOW_MAT];
    new_cube = new THREE.Mesh(cube_geom, new_mats);
    new_cube_obj = new Cube(new_cube, main_cube);
    main_cube.faces[NEG_Y].cubes[MIDDLE_RIGHT] = new_cube_obj;
    main_cube.faces[POS_X].cubes[BOTTOM_MIDDLE] = new_cube_obj;
    new_cube.position.x += CUBE_SIZE;
    new_cube.position.y -= CUBE_SIZE;

}

let rotation = 0;
let swap = 0;
const X = 0;
const Y = 1;
const Z = 2;
let frameCounter = 0;
let timer;

// Function that is meant to be called once per frame
function update() {

    // This line sends this function callback to a THREE.js function which will automatically handle the framerate
    requestAnimationFrame(update);
    
    // Compute the delta time and count total frames since start. Delta is in ms
    frameCounter += 1;
    let delta = 0;
    let d = new Date();
    if (timer) {
        delta = d.getTime() - timer;
    }
    // Starts timer for next delta time computation
    timer = d.getTime();

    /*
        Make changes to all objects in the scene
    */

    // Visual testing rotations. Allows vision on each side of the main cube
    // if (frameCounter === 1) {
    //     main_cube.group.rotation.x -= Math.PI / 2;
    // }

    main_cube.group.rotation.x += 0.0006 * delta;
    main_cube.group.rotation.y += 0.0006 * delta;
    main_cube.group.rotation.z += 0.0006 * delta;

    // Rotate each one of the faces in a dimension once and then switch dimensions
    if (swap === Z)
    {
        let face = main_cube.faces[NEG_Z];
        let face_two = main_cube.faces[POS_Z];
        if (rotation < (2 * Math.PI))
        {
            rotation += 0.0008 * delta;
            face.rotate();
            face_two.rotate();
            face.group.rotation.z += 0.0008 * delta;
            face_two.group.rotation.z -= 0.0008 * delta;
        }

        else
        {
            face.group.rotation.z = 0;
            face_two.group.rotation.z = 0;

            rotation = 0;
            face.finishRotation();
            face_two.finishRotation();
            swap = X;
        }
    }

    else if (swap === X)
    {
        let face = main_cube.faces[POS_X];
        let face_two = main_cube.faces[NEG_X];
        if (rotation < (2 * Math.PI)) {
            rotation += 0.0008 * delta;
            face.rotate();
            face_two.rotate();
            face.group.rotation.x += 0.0008 * delta;
            face_two.group.rotation.x -= 0.0008 * delta;
        }

        else {
            face.group.rotation.x = 0;
            face_two.group.rotation.x = 0;

            rotation = 0;
            face.finishRotation();
            face_two.finishRotation();
            swap = Y;
        }
    }

    else if (swap === Y)
    {
        let face = main_cube.faces[POS_Y];
        let face_two = main_cube.faces[NEG_Y];
        if (rotation < (2 * Math.PI)) {
            rotation += 0.0008 * delta;
            face.rotate();
            face_two.rotate();
            face.group.rotation.y += 0.0008 * delta;
            face_two.group.rotation.y -= 0.0008 * delta;
        }

        else {
            face.group.rotation.y = 0;
            // face_two.group.rotation.y = 0;

            rotation = 0;
            face.finishRotation();
            face_two.finishRotation();
            swap = Z;
        }
    }

    // Rerender the scene and camera
    renderer.render(scene, camera);
}

main();
