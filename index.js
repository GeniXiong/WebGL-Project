
var gl;
var fovy = 19.0;
var aspect;
var program;

var mvMatrix, pMatrix;
var modelView, projection;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var lightPosition = vec4(1.0, 0.0, 0.0, 0.0 );
var lightDir = normalize(vec3(0.0, 0.0, -1.0));
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient;
var materialDiffuse;
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialShininess = 20.0;

var stack = [];
var theta = 0.0;
var alpha = 0.0;
var delta = 0.0;

var flatShading = true;

/* add key down switch function to change between different mode */
document.addEventListener('keydown', controls);

function main()
{

    // Retrieve <canvas> element
    var canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = WebGLUtils.setupWebGL(canvas, undefined);
    if (!gl)
    {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Initialize shaders
    // This function call will create a shader, upload the GLSL source, and compile the shader
    program = initShaders(gl, "vshader", "fshader");

    // We tell WebGL which shader program to execute.
    gl.useProgram(program);

    gl.viewport( 0, 0, canvas.width, canvas.height );
    aspect =  canvas.width/canvas.height;
    // Set clear color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.enable(gl.CULL_FACE);
    // Clear <canvas> by clearing the color buffer
    gl.enable(gl.DEPTH_TEST);

    render();
}

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // seat at root unchanged sphere
    var sphere = loadSphere();
    var cube = loadCube();

    var rootLines = root();
    var secondLines = second();

    theta += 1.0;
    alpha -= 2.0;
    delta += 3.0;

    //set projection matrix
    pMatrix = perspective(fovy, aspect, .1, 10);

    //set model view matrix
    var eye_z = 4.0;
    eye = vec3(0, 0, eye_z);
    mvMatrix = lookAt(eye, at , up);

    mvMatrix = mult(translate(0.0,0.0,eye_z), mvMatrix);
    stack.push(mvMatrix);
    mvMatrix = mult(translate(0.0,0.4,0.0), mvMatrix);
    mvMatrix = mult(rotateY(theta), mvMatrix);
    mvMatrix = mult(translate(0.0,0.0,-eye_z), mvMatrix);

    drawShape(sphere, vec4(0.0,0.0,1.0,1.0));
    drawLines(rootLines, vec4(1.0,1.0,1.0,1.0));

    mvMatrix = stack.pop();
    stack.push(mvMatrix);
    mvMatrix = mult(rotateY(alpha), mvMatrix);
    mvMatrix = mult(translate(-0.4,0.0,0.0), mvMatrix);
    mvMatrix = mult(rotateY(theta), mvMatrix);
    mvMatrix = mult(translate(0.0,0.0,-eye_z), mvMatrix);
    drawShape(cube, vec4(0.0,1.0,0.0,1.0));
    drawLines(secondLines, vec4(1.0,1.0,1.0,1.0));

    mvMatrix = stack.pop();
    stack.push(mvMatrix);
    mvMatrix = mult(rotateY(alpha), mvMatrix);
    mvMatrix = mult(translate(0.4,0.0,0.0), mvMatrix);
    mvMatrix = mult(rotateY(theta), mvMatrix);
    mvMatrix = mult(translate(0.0,0.0,-eye_z), mvMatrix);
    drawShape(sphere, vec4(0.0,1.0,1.0,1.0));
    drawLines(secondLines, vec4(1.0,1.0,1.0,1.0));

    mvMatrix = stack.pop();
    stack.push(mvMatrix);
    mvMatrix = mult(rotateY(delta), mvMatrix);
    mvMatrix = mult(translate(-0.2,-0.4,0.0), mvMatrix);
    mvMatrix = mult(rotateY(alpha), mvMatrix);
    mvMatrix = mult(translate(-0.4,0.0,0.0), mvMatrix);
    mvMatrix = mult(rotateY(theta), mvMatrix);
    mvMatrix = mult(translate(0.0,0.0,-eye_z), mvMatrix);
    drawShape(cube, vec4(1.0,0.0,0.0,1.0));

    mvMatrix = stack.pop();
    stack.push(mvMatrix);
    mvMatrix = mult(rotateY(delta), mvMatrix);
    mvMatrix = mult(translate(0.2,-0.4,0.0), mvMatrix);
    mvMatrix = mult(rotateY(alpha), mvMatrix);
    mvMatrix = mult(translate(-0.4,0.0,0.0), mvMatrix);
    mvMatrix = mult(rotateY(theta), mvMatrix);
    mvMatrix = mult(translate(0.0,0.0,-eye_z), mvMatrix);
    drawShape(cube, vec4(1.0,1.0,0.0,1.0));

    mvMatrix = stack.pop();
    stack.push(mvMatrix);
    mvMatrix = mult(rotateY(delta), mvMatrix);
    mvMatrix = mult(translate(-0.2,-0.4,0.0), mvMatrix);
    mvMatrix = mult(rotateY(alpha), mvMatrix);
    mvMatrix = mult(translate(0.4,0.0,0.0), mvMatrix);
    mvMatrix = mult(rotateY(theta), mvMatrix);
    mvMatrix = mult(translate(0.0,0.0,-eye_z), mvMatrix);
    drawShape(sphere, vec4(0.47,0.47,0.47,1.0));

    mvMatrix = stack.pop();
    stack.push(mvMatrix);
    mvMatrix = mult(rotateY(delta), mvMatrix);
    mvMatrix = mult(translate(0.2,-0.4,0.0), mvMatrix);
    mvMatrix = mult(rotateY(alpha), mvMatrix);
    mvMatrix = mult(translate(0.4,0.0,0.0), mvMatrix);
    mvMatrix = mult(rotateY(theta), mvMatrix);
    mvMatrix = mult(translate(0.0,0.0,-eye_z), mvMatrix);
    drawShape(sphere, vec4(1.0,0.0,1.0,1.0));

    mvMatrix = stack.pop();

    requestAnimationFrame(render);

}

function drawShape(shape, color) {
    materialAmbient = color;
    materialDiffuse = color;
    materialShininess = 20;

    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);
    var ambientProduct = mult(lightAmbient, materialAmbient);

    // //       html          <=>  js
    // // bind diffuseProduct <=> diffuseProduct
    gl.uniform4fv(gl.getUniformLocation(program,
        "diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program,
        "specularProduct"), flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program,
        "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program,
        "lightPosition"), flatten(lightPosition));
    gl.uniform3fv(gl.getUniformLocation(program,
        "lightDir"), flatten(lightDir));
    gl.uniform1f(gl.getUniformLocation(program,
        "shininess"), materialShininess);

    var normalsArray = [];

    if (flatShading){
        for(var i = 0; i < shape.length; i = i + 3)
        {
            var s = shape[i];
            normalsArray.push(s[0],s[1], s[2], 0.0);
            normalsArray.push(s[0],s[1], s[2], 0.0);
            normalsArray.push(s[0],s[1], s[2], 0.0);
        }
    }
    else{
        for(var i = 0; i < shape.length; i++)
        {
            var s = shape[i];

            normalsArray.push(vec4(s[0],s[1], s[2], 0.0));
        }
    }

    // create points buffer
    // html    <=>   buffer <=>  array in js
    // vPosition <=> pBuffer <=> shape
    var pBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(shape), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program,  "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // create lighting buffer
    // html    <=>   buffer <=>  array in js
    // vNormal <=> vBuffer2 <=> normalsArray
    // use this normalArray to calculate lighting color
    var vBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

    var vNormal = gl.getAttribLocation( program, "vNormal");
    gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);


    projection = gl.getUniformLocation(program, "projectionMatrix");
    gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );

    modelView = gl.getUniformLocation(program, "modelViewMatrix");
    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );

    gl.drawArrays( gl.TRIANGLES, 0, shape.length );

}

function drawLines(shape) {
    materialAmbient = vec4(1.0,1.0,1.0,0.0);
    materialDiffuse = vec4(1.0,1.0,1.0,0.0);
    materialShininess = 0;

    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);
    var ambientProduct = mult(lightAmbient, materialAmbient);

    // //       html          <=>  js
    // // bind diffuseProduct <=> diffuseProduct
    gl.uniform4fv(gl.getUniformLocation(program,
        "diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program,
        "specularProduct"), flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program,
        "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program,
        "lightPosition"), flatten(lightPosition));
    gl.uniform3fv(gl.getUniformLocation(program,
        "lightDir"), flatten(lightDir));
    gl.uniform1f(gl.getUniformLocation(program,
        "shininess"), materialShininess);

    var pBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(shape), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program,  "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    projection = gl.getUniformLocation(program, "projectionMatrix");
    gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );

    modelView = gl.getUniformLocation(program, "modelViewMatrix");
    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );

    gl.drawArrays( gl.LINES, 0, shape.length );
}

function loadCube() {
    var verts = [];
    verts = verts.concat(quad(1,0,3,2));
    verts = verts.concat(quad(2,3,7,6));
    verts = verts.concat(quad(3,0,4,7));
    verts = verts.concat(quad(6,5,1,2));
    verts = verts.concat(quad(4,5,6,7));
    verts = verts.concat(quad(5,4,0,1));

    return verts;
}

function quad(a, b, c, d) {
    var verts = [];
    var vertices = [
        vec4( -0.1, -0.1,  0.1, 1.0 ),
        vec4( -0.1,  0.1,  0.1, 1.0 ),
        vec4(  0.1,  0.1,  0.1, 1.0 ),
        vec4(  0.1, -0.1,  0.1, 1.0 ),
        vec4( -0.1, -0.1, -0.1, 1.0 ),
        vec4( -0.1,  0.1, -0.1, 1.0 ),
        vec4(  0.1,  0.1, -0.1, 1.0 ),
        vec4(  0.1, -0.1, -0.1, 1.0 )
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices
    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        verts.push( vertices[indices[i]] );
    }
    return verts;
}


function loadSphere() {
    var points = loadSpherePoints();
    return points;
}

function root() {
    var points = [];
    points.push(vec4(0.0,0.0,0.0,1.0));
    points.push(vec4(0.0,-0.2,0.0,1.0));
    points.push(vec4(-0.4,-0.2,0.0,1.0));
    points.push(vec4(0.4,-0.2,0.0,1.0));
    points.push(vec4(-0.4,-0.2,0.0,1.0));
    points.push(vec4(-0.4,-0.4,0.0,1.0));
    points.push(vec4(0.4,-0.2,0.0,1.0));
    points.push(vec4(0.4,-0.4,0.0,1.0));
    return points;
}

function second() {
    var points = [];
    points.push(vec4(0.0,0.0,0.0,1.0));
    points.push(vec4(0.0,-0.2,0.0,1.0));
    points.push(vec4(-0.2,-0.2,0.0,1.0));
    points.push(vec4(0.2,-0.2,0.0,1.0));
    points.push(vec4(-0.2,-0.2,0.0,1.0));
    points.push(vec4(-0.2,-0.4,0.0,1.0));
    points.push(vec4(0.2,-0.2,0.0,1.0));
    points.push(vec4(0.2,-0.4,0.0,1.0));
    return points;
}

function controls(e) {
    if (e.key == "p") {
        lightDir[0] += 0.02;
        console.log(lightDir);
        gl.uniform3fv(gl.getUniformLocation(program,
            "lightDir"), flatten(lightDir));
    }

    if (e.key == "P") {
        lightDir[0] -= 0.02;
        console.log(lightDir);
        gl.uniform3fv(gl.getUniformLocation(program,
            "lightDir"), flatten(lightDir));
    }

    if (e.key == "m"){
        flatShading = false;
    }

    if (e.key == "M"){
        flatShading = true;
    }
}


