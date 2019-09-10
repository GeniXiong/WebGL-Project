# WebGL Project
- Gouraud Lighting (smooth shading): Draw all your meshes in your hierarchy as solid meshes (not wireframes). Implement shaders for Gouraud lighting (as demonstrated in class) and flat shading. You will switch between shading types using keystrokes below. Apply some interesting colors and material properties to your 3D meshes. Don't forget to enable depth testing and hidden surface removal.

- Implement a spotlight: The spotlight is like a cone, and light only reaches objects inside the cone. Objects outside a certain angle--called the cutoff angle, phi--gets no light from the spotlight (although it may still receive ambient light from the environment). Make the cutoff angle a variable that can be controlled with a keystroke. Make sure the presence of the spotlight is obvious!

- Matrix stack: You will need to implement a matrix stack, including stack.push() and stack.pop() routines. You may use a simple linked list to store the stack or use a more sophisticated tree structure.

- Animation: Be mindful of performance issues while you implement this homework. As your scene size grows, avoid unnecessary re-initialization, file reopening, etc. that could slow down your program considerably. 

- Key Strokes
-- (User hits 'p'): Increase spotlight cut off angle (increase cone angle)
-- (User hits 'P'): Decrease spotlight cut off angle (decrease cone angle) 
-- (User hits 'm'): The scene is shaded using Gouraud lighting (smooth shading)
-- (User hits 'M'): The scene is shaded using flat shading 
