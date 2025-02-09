/************************************************************************/
/* Initialized some variables for CSS, and also it computes the initial

position for the CSS cube based on the Three Cube */
/************************************************************************/
function initCSS3D() {
    screenWhalf = screenWidth / 2;
    screenHhalf = screenHeight / 2;

    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;

    divCSSWorld = document.getElementById('css-world');
    divCSSCamera = document.getElementById('css-camera');
    divCube = document.getElementById('shape');

    fovValue = 0.5 / Math.tan(camera.fov * Math.PI / 360) * screenHeight;

    setCSSWorld();
    // setDivPosition(divCube, glCube);
}

/************************************************************************/
/* Applies CSS3 styles to the css-world div                             */
/************************************************************************/
function setCSSWorld() {
    divCSSWorld.style.WebkitPerspective = fovValue + "px";
    divCSSWorld.style.WebkitPerspectiveOrigin = "50% 50%";
    divCSSWorld.style.MozPerspective = fovValue + "px";
    divCSSWorld.style.MozPerspectiveOrigin = "50% 50%";
}

/************************************************************************/
/*  Applies CSS3 styles to css-camera div                               */
/************************************************************************/
function setCSSCamera(camera, fovValue) {
    var cameraStyle = getCSS3D_cameraStyle(camera, fovValue);
    divCSSCamera.style.WebkitTransform = cameraStyle;
    divCSSCamera.style.MozTransform = cameraStyle;
}

/************************************************************************/
/* Return the CSS3D transformations from the Three camera               */
/************************************************************************/
function getCSS3D_cameraStyle(camera, fov) {
    camera.updateProjectionMatrix();
    var cssStyle = "";
    cssStyle += "translate3d(0,0," + epsilon(fov) + "px) ";
    cssStyle += toCSSMatrix(camera.matrixWorldInverse, true);
    cssStyle += " translate3d(" + screenWhalf + "px," + screenHhalf + "px, 0)";
    return cssStyle;
}

/************************************************************************/
/* Fixes the difference between WebGL coordinates to CSS coordinates    */
/************************************************************************/
function toCSSMatrix(threeMat4, b, offsetX, offsetY) {
    var a = threeMat4,
        f;
    if (b) {
        f = [
            a.elements[0], -a.elements[1], a.elements[2], a.elements[3],
            a.elements[4], -a.elements[5], a.elements[6], a.elements[7],
            a.elements[8], -a.elements[9], a.elements[10], a.elements[11],
            a.elements[12], -a.elements[13], a.elements[14], a.elements[15]
        ];
    } else {
        f = [
            a.elements[0], a.elements[1], a.elements[2], a.elements[3],
            a.elements[4], a.elements[5], a.elements[6], a.elements[7],
            a.elements[8], a.elements[9], a.elements[10], a.elements[11],
            a.elements[12] + (offsetX || 0), a.elements[13] + (offsetY || 0), a.elements[14], a.elements[15]
        ]; // Hack to make sure the text is centered
    }
    for (var e in f) {
        f[e] = epsilon(f[e]);
    }
    return "matrix3d(" + f.join(",") + ")";
}

/************************************************************************/
/* Computes CSS3D transformations based on a Three Object                */
/************************************************************************/
function setDivPosition(cssObject, glObject, scale) {
    glObject.updateMatrix();
    cssObject.style.position = "absolute";
    var transformation = CSStransform(1.0, 3.5, glObject.matrixWorld, scale);
    //Webkit:
    cssObject.style.WebkitTransformOrigin = "0% 0%";
    cssObject.style.WebkitTransform = transformation;
    //Mozilla:
    cssObject.style.MozTransformOrigin = "0% 0%";
    cssObject.style.MozTransform = transformation;
}

/************************************************************************/
/* Helper function to convert to CSS3D transformations                  */
/************************************************************************/
function CSStransform(width, height, matrix, scale) {
    return [toCSSMatrix(matrix, false, width, height),
        "scale3d(" + scale + ", -" + scale + ", " + scale + ")",
        "translate3d(0,0,0)"
    ].join(" ");
}

/************************************************************************/
/* Rounding error                                                       */
/************************************************************************/
function epsilon(a) {
    if (Math.abs(a) < 0.000001) {
        return 0
    }
    return a;
}