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

main();
