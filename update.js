let rotation = 0;
let swap = true;
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
    main_cube.group.rotation.y += 0.0008 * delta;

    // Rotate green, orange, and main
    if (frameCounter)
    {
        console.log("?")
        if (swap)
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
                swap = false;
            }
        }

        else
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
                swap = true;
            }
        }
    }

    // Rerender the scene and camera
    renderer.render(scene, camera);
}