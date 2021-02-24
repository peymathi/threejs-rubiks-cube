# threejs-rubiks-cube
Low-level project made for CS438. Uses three.js to make an interactive rubik's cube.

## Objects

There 36 are objects in the scene:

- 1 perspective camera
- 2 light sources: one ambient and one directional
- 7 groups: one group for each face and each group is a part of the entire cube's group
- 6 center piece cubes: each center piece is a part of one face group
- 8 corner piece cubes: each corner piece is a part of 3 face groups
- 12 middle piece cubes: each middle piece is a part of 2 face groups

### MainCube

MainCube is a class to represent the entire cube. It contains the Group which has all of the Face groups. It has a method to build each of the faces.

### Face

Face is a class to represent a face of the cube. It contains a position (posx, negx, posy, etx.), a Group, and an array of the current cubes in the group.

### Cube

Cube is a class to represent a single piece. Because an Object3D can only be a part of one group at a time in THREE.js, the cube class has a reference to the current group (default is the MainCube) and an array of all the faces that the cube is a currently a part of. 

## Cubes

Each cube is a Mesh made from a BoxGeometry and array of basic and phong materials. Basic materials load a PNG texture to represent a color of the Rubik's cube whereas Phong materials are just the color black. Every cube is a part of 1 or more faces. The cubes themselves do not move or rotate,
but the groups move which moves the cubes in each group. Corner and middle piece cubes will have to leave and join groups from rotating to different faces of the cube. 

## User Input

The user will view one side of the Rubik's Cube at a time. In order to rotate the entire cube, the user will use WASD. In order to rotate a face of the cube, the user will use the arrow keys and space bar to select a face to rotate (top, right, left, bottom, space bar for current) and then the arrow keys again to choose which direction to rotate. Selecting a face to rotate will give some kind of indication that the face is selected. The visual indication is not decided yet but changing the alpha of the color would suffice. 

A button on screen will allow the user to randomize the cube. 

The user will be able to pan the camera slightly with their mouse. The mouse's position on the screen relative to the center will slightly move the camera relatively in the direction of the mouse's distance from the center.

There will be a description of the user's controls on screen.
