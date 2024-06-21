
import { setUpCanvas, drawPointAt, drawArrow, drawLine } from '../common/canvas.helper.js';
import { randInt } from '../common/common.helper.js';
import { lerp, distance } from '../common/math.helper.js';

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const POINT_COLOR = 'black',
    POINT_RADIUS_BIG = 8,
    POINT_RADIUS_NORMAL = 4,
    ARROW_WIDTH = 2,
    ARROW_HEAD_BIG = 10,
    ARROW_HEAD_NORMAL = 5,
    ARROW_COLOR = 'black',
    LINE_WIDTH = 3,
    LINE_COLOR = 'orange',
    BG_COLOR = 'white',
    points = [],
    arrows = [],
    NB_CURVE_POINTS = 30;

let POINT_RADIUS = POINT_RADIUS_NORMAL,
    ARROW_HEAD = 4;

function isWithinRangeOf(point, x, y, byHowManyPixels=POINT_RADIUS) {
    return distance(point[0], point[1], x, y) <= byHowManyPixels;
}

let selectedPointIndex = null,
    selectedArrowIndex = null;

function main() {
    // events:
        // refresh button
    document.querySelector("#refresh").addEventListener('click', (e) => {
        pickRandom();
        redraw();
    });



    //
    // Handle moving around points and arrows !
    //
    canvas.addEventListener('mousemove', (e) => {

        if(selectedPointIndex === null && selectedArrowIndex === null) { // nothing selected (mouse pressed)
            //
            // POINTS
            //
            const point1WithinRange = isWithinRangeOf(points[0], e.offsetX, e.offsetY);
            const point2WithinRange = isWithinRangeOf(points[1], e.offsetX, e.offsetY);
            const pointWithinRange = point1WithinRange  || point2WithinRange;

            if(pointWithinRange && POINT_RADIUS !== POINT_RADIUS_BIG) {
                POINT_RADIUS = POINT_RADIUS_BIG;
                redraw(); // TODO: do not recompute curve ...
            }
            if(!pointWithinRange && POINT_RADIUS === POINT_RADIUS_BIG) {
                POINT_RADIUS = POINT_RADIUS_NORMAL;
                redraw();
            }

            //
            // ARROW HEAD
            //
            const arrowHead1WithinRange = isWithinRangeOf([arrows[0][2], arrows[0][3]], e.offsetX, e.offsetY, 20);
            const arrowHead2WithinRange = isWithinRangeOf([arrows[1][2], arrows[1][3]], e.offsetX, e.offsetY, 20);
            const arrowHeadWithinRange = arrowHead1WithinRange  || arrowHead2WithinRange;

            if(arrowHeadWithinRange && ARROW_HEAD !== ARROW_HEAD_BIG) {
                ARROW_HEAD = ARROW_HEAD_BIG;
                redraw();
            }
            if(!arrowHeadWithinRange && ARROW_HEAD === ARROW_HEAD_BIG) {
                ARROW_HEAD = ARROW_HEAD_NORMAL;
                redraw();
            }

        } else {

            if(selectedPointIndex !== null) {
                // change point position and redraw/recompute
                points[selectedPointIndex][0] = e.offsetX;
                points[selectedPointIndex][1] = e.offsetY;

                arrows[selectedPointIndex][0] = e.offsetX;
                arrows[selectedPointIndex][1] = e.offsetY;
            }

            if(selectedArrowIndex !== null) {
                // change point position and redraw/recompute
                arrows[selectedArrowIndex][2] = e.offsetX;
                arrows[selectedArrowIndex][3] = e.offsetY;
            }

            redraw(); // as we move a point or an arrow's head
        }
    });

    canvas.addEventListener('mouseout', (e) => {
        POINT_RADIUS = POINT_RADIUS_NORMAL;
        ARROW_HEAD = ARROW_HEAD_NORMAL;
        redraw();
    })

    canvas.addEventListener('mousedown', (e) => {
        if(POINT_RADIUS === POINT_RADIUS_BIG) {
            const point1WithinRange = isWithinRangeOf(points[0], e.offsetX, e.offsetY);
            const point2WithinRange = isWithinRangeOf(points[1], e.offsetX, e.offsetY);

            if (point1WithinRange) {
                selectedPointIndex = 0;
            } else if (point2WithinRange) {
                selectedPointIndex = 1;
            } else {
                selectedPointIndex = null;
            }
        }

        if(ARROW_HEAD === ARROW_HEAD_BIG) {
            const arrowHead1WithinRange = isWithinRangeOf([arrows[0][2], arrows[0][3]], e.offsetX, e.offsetY, 20);
            const arrowHead2WithinRange = isWithinRangeOf([arrows[1][2], arrows[1][3]], e.offsetX, e.offsetY, 20);

            if (arrowHead1WithinRange) {
                selectedArrowIndex = 0;
            } else if (arrowHead2WithinRange) {
                selectedArrowIndex = 1;
            } else {
                selectedArrowIndex = null;
            }
        }
    });

    canvas.addEventListener('mouseup', (e) => {
        selectedPointIndex = null;
        selectedArrowIndex = null;
    });

    // start...
    pickRandom();
    redraw();
}

function pickRandom() {

    points.splice(0, points.length); // clear const array of points
    // pick 2 random points
    points.push([randInt(0, canvas.width), randInt(0, canvas.height)]);
    points.push([randInt(0, canvas.width), randInt(0, canvas.height)]);

    // add 2 arrows
    arrows.splice(0, arrows.length);
    points.forEach(point => {
        const x = point[0], y = point[1];
        const arrow = [x, y, randInt(0, canvas.width), randInt(0, canvas.height)];
        arrows.push(arrow);
    });

}

function redraw() {

    setUpCanvas(ctx, canvas.width, canvas.height, BG_COLOR);

    // draw the arrows
    arrows.forEach(arrow => {
        drawArrow(ctx, arrow[0], arrow[1], arrow[2], arrow[3], ARROW_COLOR, ARROW_WIDTH, ARROW_HEAD);
    });

    const STEP_SIZE = 1 / NB_CURVE_POINTS;

    const t0 = performance.now();
    const curvePoints = computeCurve(points, arrows, STEP_SIZE);
    
    //
    // draw curve
    //
    const nbCurvePoints = curvePoints.length;
    curvePoints.forEach((point, i) => {
        if(i + 1 === nbCurvePoints) return; // last point

        drawLine(ctx, point[0], point[1], curvePoints[i+1][0], curvePoints[i+1][1], LINE_WIDTH, LINE_COLOR);
    });

    const t1 = performance.now();
    document.querySelector("#timing").innerText = '...computed and drawn in ' + Math.round((t1 - t0) * 1000)/1000 + ' milliseconds';

    // draw the 2 points (last = above)
    points.forEach(point => {
        const x = point[0], y = point[1];
        drawPointAt(ctx, x, y, POINT_RADIUS, POINT_COLOR);
        drawPointAt(ctx, x, y, POINT_RADIUS, POINT_COLOR);
    });

}

function computeCurve(points, arrows, STEP_SIZE) {

    const curvePoints = [points[0][0], points[0][1]]; // add starting point
    for (let i = 0; i < 1; i += STEP_SIZE) {

        // LERP along the 1st arrow
        const x1 = lerp(arrows[0][0], arrows[0][2], i);
        const y1 = lerp(arrows[0][1], arrows[0][3], i);

        // mid "arrow" ... from the end of the first one to the head of the other
        const x_mid = lerp(arrows[0][2], arrows[1][2], i);
        const y_mid = lerp(arrows[0][3], arrows[1][3], i);

        // LERP along the 2nd arrow (in reverse : from head to tail)
        const x2 = lerp(arrows[1][2], arrows[1][0], i);
        const y2 = lerp(arrows[1][3], arrows[1][1], i);

        // mid LERP
        const x1_ = lerp(x1, x_mid, i);
        const y1_ = lerp(y1, y_mid, i);
        
        const x2_ = lerp(x_mid, x2, i);
        const y2_ = lerp(y_mid, y2, i);

        // final LERP
        const x = lerp(x1_, x2_, i);
        const y = lerp(y1_, y2_, i);


        if(selectedPointIndex !== null || selectedArrowIndex !== null) {
            drawLine(ctx, x1, y1, x_mid, y_mid, 0.25, 'green');
            drawLine(ctx, x_mid, y_mid, x2, y2, 0.25, 'yellowgreen');
            //
            drawLine(ctx, x1_, y1_, x2_, y2_, 1, 'darkorange');
        }


        curvePoints.push([x, y]);
    }
    curvePoints.push([points[1][0], points[1][1]]);

    return curvePoints;
}

main();
