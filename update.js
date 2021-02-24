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

    // Visual testing rotations. Allows vision on each side of the main cube
    if (frameCounter === 100) {
        console.log("yo");
        main_cube.group.rotation.x += Math.PI;
    }
    // main_cube.group.rotation.x += 0.01;
    // main_cube.group.rotation.y += 0.04;

    // Rerender the scene and camera
    renderer.render(scene, camera);
}