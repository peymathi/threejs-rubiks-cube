
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
