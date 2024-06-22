
import { setUpCanvas, drawPointAt, drawLine, drawAxis, convertToGraphCoords, convertToCanvasCoords } from '../common/canvas.helper.js';
import { randInt } from '../common/common.helper.js';
import { matMul, transpose, showShape, round } from '../common/math.helper.js';

const SQUARE_SIZE = 25,
    dataPoints = [];

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let eta = 0.01; // learning rate
let NB_EPOCHS = 250;

const etaEl = document.querySelector("#eta");
const epochsEl = document.querySelector("#epochs");

function main() {
    document.querySelector("#refresh").addEventListener('click', (e) => redraw());
    etaEl.addEventListener('change', (e) => eta = e.target.value);
    epochsEl.addEventListener('change', (e) => NB_EPOCHS = e.target.value);

    etaEl.value = eta;
    epochsEl.value = NB_EPOCHS;

    redraw();
}

// https://en.wikipedia.org/wiki/Normal_distribution
function gaussian(x, sigma=1, mean=0) {
    return 1 / (sigma * Math.sqrt(2 * Math.PI)) * Math.exp(-1/2 * Math.pow((x - mean) / sigma, 2));
}

//
// __Rejection sampling__ to get random values following a given probability distribution
//  -> the most basic Monte-Carlo sampler (but less efficient than other methods : MCMCs, SMCs ??)
//  -> it's trivially parallelizable !
// p(x) is a target distribution => here, Gaussian (with mean = 0 and sigma = 1)
// q(x) is the proposal distribution = uniform only in JS ...
//
function rejectionSampling(proposalDist, targetDist) {
    let reject = true; // init.

    let randomX = proposalDist(); // uniform: -0.5 to 0.5 along the x-axis
    let randomY = proposalDist(); // uniform: -0.5 to 0.5 along the y-axis
    //console.log("at:", randomX);
    let y = targetDist(randomX); // true y-value of the target p(x)

    let i = 0;
    while(reject && i < 10) {
        if(randomY > y) {
            // reject, and try again!
            randomX = proposalDist();
            randomY = proposalDist();
            y = targetDist(randomX);
        } else {
            // accept
            reject = false;
        }
        i++;
    }

    return randomY;
}


/**
 * Batch GD !
 */
function gradientDescent(points) {

    const m = points.length;


    document.querySelector("#eta").innerText = eta;
    document.querySelector("#epochs").innerText = NB_EPOCHS;
    document.querySelector("#nbPoints").innerText = m;

    console.log(`eta: ${eta} \t epochs: ${NB_EPOCHS} \t m: ${m}`);

    //console.log(points); // [[-5, -0.5], [X value (abscisses), Y value (valeur..)], ...] ???!!!

    const Xs = points.map(point => [1, point[0]]); // only one feature -> 500 x 2
    const Ys = [points.map(point => point[1])]; // 1 x 500

    //console.log("Ys:", Ys)

    let thetas = [[Math.random() - 0.5], [Math.random() - 0.5]]; // intercept, theta_1 (slope)
    drawSolution(thetas[0][0], thetas[1][0], 0); // initial state..

    let gradients;

    for(let epoch = 1; epoch <= NB_EPOCHS; epoch++) {

        // (X @ thetas - y)
        let test = matMul( // 500 x 1
            Xs, // 500 x 2
            thetas // 2 x 1
        ).map( // same shape : 500 x 1
            (res, idx) => {
                return [res - Ys[0][idx]]; // = error
            }
        );

        // TODO : sum ?!

        console.log("> test =", test);
        console.log("matMal( Xs, thetas ) - y");
        showShape(test);

        // X.T @ (X @ thetas - y)
        gradients = matMul( // 2 x 1
            transpose(Xs), // 2 x 500
            test // 500 x 1
        );

        console.log("gradient =");
        showShape(gradients);

        //console.log("factor:", 2/m);
        gradients[0][0] *= (2 / m);
        gradients[1][0] *= (2 / m);

        console.log("gradients:", JSON.stringify(gradients));
        console.log("thetas (before):", JSON.stringify(thetas));

        // update model parameters
        thetas = thetas.map((theta, i) => ([
            theta[0] - eta * gradients[i][0]
        ]));
        console.log("thetas (after):", JSON.stringify(thetas)); // 1 x 2

        if(epoch % 10 === 0) {
            drawSolution(thetas[0][0], thetas[1][0], epoch); // draw temporary solution !
        }
    }

    return [thetas[0][0], thetas[1][0]]; // intercept, slope
}





function redraw() {

    setUpCanvas(ctx, canvas.width, canvas.height, 'white');
    dataPoints.splice(0, dataPoints.length); // erase points

    // true parameters to retrieve...
    const a = 0.7; // ax + b (line)
    const b = 3;

    drawAxis(canvas, SQUARE_SIZE /* square size */);

    const MEAN = 0, SIGMA = 1;

    const nb_points = 100; // nb of points to generate
    const from = -5;
    const to = 15;
    const step = (to - from) / (nb_points - 0.5); // why 0.5... ?
    for (let i = from; i < to; i += step) {

        //const randX = rejectionSampling((min=-4, max=4) => Math.random() * (max - min) + min, (x) => gaussian(x, SIGMA, MEAN));
        const randY = rejectionSampling((min=-4, max=4) => Math.random() * (max - min) + min, (x) => gaussian(x, SIGMA, MEAN));
        //console.warn(randX, randY);

        // in graph-coordinates
        const valueX = i; // + randX;
        const valueY = a * i + b + randY * 0.5;

        const [pixelX, pixelY] = convertToCanvasCoords(canvas, valueX, valueY, SQUARE_SIZE);
        
        // to draw point around the origin (in pixel coordinates)
        //const [zeroX, zeroY] = convertToCanvasCoords(canvas, 0, 0, SQUARE_SIZE);
        drawPointAt(ctx, pixelX, pixelY, 3, 'grey');

        //console.error(valueX, valueY, pixelX, pixelY);
        // to graph coordinates
        dataPoints.push([valueX, valueY]);
    }

    //console.log(dataPoints);

    const [intercept, slope] = gradientDescent(dataPoints);

    document.querySelector("#intercept").innerText = round(intercept, 4);
    document.querySelector("#slope").innerText = round(slope, 4);

    drawSolution(intercept, slope); // final linear model solution
}

// solution lines
const colors = ['gray'];

function drawSolution(intercept, slope, epoch=null) {

    //console.log("intercept:", intercept);
    //console.log("slope:", slope);

    const point1X = -5;
    const point1Y = slope * point1X + intercept;
    const point2X = 15;
    const point2Y = slope * point2X + intercept;

    // from graph-coordinate to pixel/canvas-coordinates
    const [pt1X , pt1Y] = convertToCanvasCoords(canvas, point1X, point1Y, SQUARE_SIZE);
    const [pt2X , pt2Y] = convertToCanvasCoords(canvas, point2X, point2Y, SQUARE_SIZE);
    //console.log(pt1X, pt1Y, pt2X, pt2Y)

    // offset ?!
    //const [zeroX, zeroY] = convertToCanvasCoords(canvas, 0, 0, SQUARE_SIZE);
    //console.log("zeros:", zeroX, zeroY);
    //console.log(">>>>", pt1X, zeroY - pt1Y, pt2X, zeroY - pt2Y)

    const size = epoch == null ? 2.5 : 0.33;
    const color = epoch == null ? "red" : colors[epoch % colors.length];

    drawLine(
        ctx,
        pt1X, // left point x
        pt1Y, // left point y
        //zeroY - pt1Y,
        pt2X, // right x
        pt2Y, // right y
        //zeroY - pt2Y,
        size,
        color
    );
}

main();
