
import { setUpCanvas, drawPointAt, drawLine, drawLineThroughPoints } from '../common/canvas.helper.js';
import { choice } from '../common/common.helper.js';

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const epsilonEl = document.querySelector("#epsilon");
const hideOriginalEl = document.querySelector("#hide_original");

let isSimplified = false;
let hideOriginal = false;

// 
// shapes
//
const heart = {
    pointSize: 3,
    path: [[242,380],[231,368],[212,347],[201,331],[187,314],[171,294],[162,281],[153,269],[147,255],[143,241],[141,228],[141,213],[142,199],[150,186],[163,174],[175,167],[192,163],[222,166],[236,172],[249,187],[257,204],[260,215],[262,222],[269,220],[289,214],[306,204],[328,197],[349,197],[369,207],[387,225],[394,243],[389,266],[374,289],[348,324],[332,339],[310,359],[281,372],[260,381],[244,385]]
};
const star = {
    pointSize: 3,
    path: [[83,209],[88,209],[98,206],[109,203],[119,199],[128,199],[141,197],[151,196],[165,195],[173,193],[182,192],[189,190],[192,190],[195,180],[196,168],[197,157],[199,146],[203,134],[208,122],[214,108],[220,95],[227,85],[233,75],[238,65],[239,66],[243,83],[244,95],[248,107],[252,119],[261,137],[265,151],[267,162],[268,172],[270,185],[272,189],[273,193],[280,194],[292,195],[312,200],[317,200],[328,203],[339,205],[351,208],[363,214],[377,219],[385,224],[394,226],[385,238],[368,249],[354,256],[342,259],[329,263],[313,267],[300,272],[289,274],[278,278],[271,284],[282,303],[297,322],[305,338],[307,352],[310,367],[314,378],[317,393],[317,400],[290,386],[285,379],[278,371],[271,363],[258,351],[243,334],[239,330],[230,317],[224,312],[219,307],[207,306],[193,321],[179,340],[157,355],[144,366],[128,377],[115,384],[104,389],[103,389],[117,359],[126,345],[132,332],[137,321],[145,307],[151,295],[153,291],[156,284],[166,267],[168,261],[167,258],[155,248],[140,238],[126,230],[112,221],[98,211],[88,207]]
};
const Europe = {
    pointSize: 1,
    path: [[372,42],[370,44],[368,44],[366,44],[364,46],[362,44],[360,44],[358,44],[356,44],[354,44],[354,46],[352,46],[350,48],[348,48],[346,48],[346,50],[346,52],[344,52],[342,54],[342,56],[342,58],[344,58],[344,60],[344,60],[344,62],[346,64],[348,64],[350,64],[350,64],[352,64],[352,66],[352,68],[352,70],[352,72],[352,74],[352,76],[354,78],[352,80],[352,82],[350,82],[348,82],[346,82],[344,80],[344,78],[342,78],[340,76],[340,74],[338,74],[336,76],[334,76],[332,78],[332,80],[332,82],[332,84],[332,86],[330,88],[330,90],[330,92],[330,94],[330,96],[332,98],[332,100],[332,102],[332,104],[334,104],[334,106],[334,108],[336,110],[338,110],[340,110],[342,110],[344,110],[346,110],[348,112],[348,114],[348,116],[348,118],[348,120],[348,120],[346,120],[344,120],[342,120],[340,120],[338,120],[336,122],[334,122],[332,122],[330,122],[328,122],[326,122],[324,122],[322,124],[320,124],[318,124],[316,122],[314,122],[314,120],[316,120],[316,120],[316,118],[314,118],[312,118],[310,118],[308,118],[306,120],[304,120],[302,122],[300,122],[298,124],[298,126],[296,126],[294,128],[292,128],[290,128],[290,130],[288,130],[286,132],[284,132],[282,132],[282,134],[284,134],[284,136],[284,136],[282,136],[280,136],[278,134],[278,132],[278,130],[276,130],[274,130],[272,128],[270,126],[268,126],[268,126],[266,128],[264,130],[262,130],[260,130],[260,132],[258,134],[256,132],[254,132],[254,130],[256,130],[256,128],[254,128],[252,128],[250,126],[248,126],[246,126],[246,126],[248,124],[246,122],[244,120],[244,118],[242,118],[244,116],[244,114],[244,112],[244,110],[246,110],[248,108],[246,106],[248,106],[248,104],[250,102],[250,102],[252,102],[254,102],[254,100],[254,98],[252,98],[250,96],[250,94],[250,92],[250,92],[250,90],[252,88],[252,86],[250,84],[252,82],[250,82],[248,82],[248,84],[246,86],[244,86],[244,88],[242,90],[240,90],[238,90],[236,90],[236,92],[234,94],[234,96],[236,96],[238,94],[238,92],[240,90],[242,92],[242,94],[242,96],[240,94],[238,96],[238,98],[236,98],[234,96],[234,98],[234,100],[232,102],[232,104],[234,106],[234,106],[232,108],[234,110],[234,112],[236,114],[236,116],[236,116],[236,118],[236,120],[238,122],[238,124],[238,126],[238,126],[236,128],[238,128],[238,130],[238,132],[238,134],[240,134],[242,136],[244,138],[244,138],[244,138],[242,136],[242,134],[240,134],[238,134],[236,134],[234,136],[234,138],[234,140],[234,140],[234,138],[232,140],[232,140],[232,138],[230,136],[228,136],[226,136],[224,136],[224,138],[222,140],[224,142],[222,140],[220,140],[218,140],[216,140],[214,140],[212,140],[210,140],[210,142],[208,144],[206,144],[204,146],[204,146],[202,148],[202,150],[202,152],[200,154],[200,154],[198,156],[196,158],[196,160],[196,162],[198,162],[196,164],[198,164],[196,166],[196,164],[194,162],[192,162],[192,164],[194,166],[196,166],[198,166],[196,166],[194,166],[192,166],[190,166],[188,166],[186,166],[184,168],[182,168],[180,170],[178,170],[176,170],[174,170],[174,172],[174,174],[174,176],[172,178],[172,180],[172,182],[170,182],[168,182],[166,184],[164,184],[162,184],[160,186],[158,186],[160,188],[162,188],[160,190],[158,190],[156,190],[154,190],[152,188],[150,188],[148,188],[148,186],[146,184],[146,184],[144,184],[142,182],[142,184],[142,186],[142,188],[144,190],[142,192],[142,194],[142,196],[144,198],[142,198],[140,196],[138,196],[138,196],[136,196],[134,196],[132,196],[130,196],[130,194],[128,192],[126,192],[124,192],[122,192],[120,192],[118,192],[116,192],[114,192],[114,194],[114,196],[116,196],[118,198],[116,198],[114,198],[116,198],[116,200],[114,200],[114,202],[116,202],[116,204],[118,204],[120,204],[122,206],[124,206],[126,208],[126,208],[128,210],[128,210],[130,210],[132,212],[130,214],[132,214],[134,214],[136,216],[138,216],[136,216],[134,216],[134,218],[134,218],[134,220],[134,222],[136,224],[136,226],[138,228],[140,228],[140,230],[140,232],[140,234],[140,236],[140,238],[140,236],[140,238],[142,240],[142,242],[144,244],[144,246],[144,248],[144,248],[142,246],[142,244],[142,242],[140,240],[140,242],[138,244],[138,246],[138,248],[138,250],[136,252],[138,250],[138,252],[136,254],[136,256],[136,258],[134,260],[134,262],[134,262],[132,264],[132,266],[130,268],[128,268],[126,268],[124,268],[122,268],[120,266],[120,266],[118,266],[116,266],[114,264],[112,264],[110,264],[108,262],[106,262],[104,262],[102,262],[100,262],[98,260],[96,260],[96,260],[94,258],[92,258],[90,256],[88,256],[86,256],[84,256],[82,256],[80,256],[78,254],[76,254],[76,252],[74,252],[72,252],[70,252],[68,252],[68,254],[66,254],[64,254],[62,254],[60,254],[58,254],[56,256],[56,258],[58,260],[58,260],[58,262],[58,264],[60,264],[58,266],[58,266],[60,268],[58,270],[56,270],[58,272],[56,274],[56,276],[56,276],[56,278],[56,280],[56,282],[56,284],[56,286],[54,288],[54,290],[52,292],[52,294],[52,296],[50,296],[50,298],[48,300],[48,302],[46,304],[44,304],[44,306],[42,308],[42,310],[42,312],[42,314],[44,314],[46,312],[46,310],[48,310],[48,310],[46,312],[46,314],[44,314],[44,316],[44,318],[46,316],[46,318],[48,318],[46,318],[46,320],[46,322],[46,324],[44,324],[46,326],[44,328],[44,330],[44,332],[42,334],[40,336],[42,336],[44,336],[46,336],[48,338],[50,338],[52,340],[54,340],[56,338],[58,338],[60,338],[62,338],[64,338],[64,340],[64,342],[66,342],[68,344],[68,344],[70,344],[68,346],[68,348],[68,350],[68,352],[70,354],[70,354],[72,356],[74,358],[74,358],[76,356],[78,356],[78,354],[80,354],[82,354],[84,354],[86,354],[88,352],[90,352],[92,352],[94,352],[96,352],[98,354],[100,354],[102,354],[104,354],[106,354],[108,354],[108,354],[110,354],[112,356],[114,354],[116,354],[116,352],[118,350],[118,348],[120,348],[122,346],[124,346],[126,348],[128,348],[130,346],[128,344],[130,342],[130,340],[132,340],[132,338],[134,336],[136,336],[138,336],[140,334],[140,332],[140,332],[138,330],[138,328],[136,326],[136,324],[136,322],[138,320],[140,320],[140,318],[142,316],[144,314],[144,314],[146,312],[148,310],[148,308],[150,308],[150,308],[150,306],[152,304],[154,304],[156,304],[156,302],[158,302],[160,302],[162,302],[164,302],[166,300],[168,300],[170,298],[172,298],[174,296],[176,296],[176,294],[178,292],[176,290],[178,290],[178,288],[176,286],[176,284],[176,282],[176,280],[178,278],[178,278],[180,276],[182,276],[184,274],[186,274],[188,272],[188,274],[190,274],[192,276],[194,276],[196,276],[196,276],[198,276],[200,278],[202,278],[204,280],[204,280],[206,282],[208,280],[210,280],[212,280],[214,278],[214,276],[216,276],[218,274],[220,272],[222,272],[224,272],[224,272],[226,270],[228,270],[230,268],[230,266],[232,264],[234,264],[236,264],[238,266],[240,266],[242,266],[242,268],[244,268],[246,270],[248,270],[248,272],[248,274],[250,276],[250,278],[250,280],[252,282],[252,284],[254,284],[254,286],[256,288],[256,288],[258,290],[258,292],[260,292],[262,292],[262,294],[264,296],[266,296],[268,298],[268,300],[270,300],[272,302],[272,304],[274,304],[276,306],[278,306],[280,306],[282,306],[284,306],[284,308],[286,308],[288,310],[288,312],[290,312],[292,312],[292,314],[292,314],[294,314],[296,314],[296,316],[298,316],[298,318],[298,320],[300,322],[302,322],[304,322],[306,322],[306,324],[308,326],[308,328],[310,330],[310,332],[310,334],[312,336],[312,338],[312,338],[310,340],[308,342],[308,344],[308,344],[306,346],[306,348],[308,350],[310,350],[312,350],[312,348],[314,346],[314,344],[316,342],[316,342],[316,340],[316,338],[318,336],[320,336],[322,334],[322,334],[322,332],[322,330],[320,328],[318,326],[316,326],[314,326],[314,324],[316,322],[316,320],[316,318],[318,316],[320,314],[320,314],[322,316],[324,316],[326,316],[328,316],[330,318],[330,320],[332,322],[334,322],[334,320],[334,318],[334,316],[334,316],[332,314],[330,312],[328,312],[326,310],[324,310],[324,310],[322,308],[320,306],[318,306],[316,306],[314,306],[312,304],[310,304],[308,302],[306,302],[306,300],[308,298],[310,298],[308,296],[306,296],[304,296],[302,296],[300,296],[298,296],[296,296],[294,294],[292,294],[292,292],[290,290],[288,290],[286,288],[286,286],[286,284],[284,282],[284,280],[284,278],[282,276],[282,274],[280,274],[278,272],[276,272],[274,270],[272,270],[272,268],[270,266],[270,266],[268,264],[268,262],[268,260],[270,258],[270,258],[270,256],[268,254],[268,252],[268,250],[270,250],[270,248],[270,250],[272,248],[274,248],[276,246],[276,246],[278,246],[280,244],[282,246],[282,248],[280,248],[280,250],[282,252],[282,254],[282,256],[284,258],[286,256],[286,254],[288,254],[288,252],[290,250],[290,252],[292,254],[294,254],[294,256],[294,258],[294,260],[296,262],[298,262],[300,264],[298,264],[296,264],[298,266],[298,268],[300,270],[302,270],[304,272],[306,272],[306,274],[308,274],[310,274],[312,274],[314,274],[316,276],[316,278],[318,278],[320,280],[322,280],[322,280],[322,278],[320,278],[318,276],[318,274],[316,274],[314,272],[314,270],[312,270],[310,268],[308,266],[308,266],[306,264],[306,262],[304,260],[304,258],[302,258],[302,256],[302,254],[302,252],[304,252],[306,254],[308,254],[308,252],[310,250],[312,250],[314,250],[316,250],[318,250],[320,252],[320,250],[322,252],[324,250],[326,250],[328,250],[330,250],[332,252],[332,254],[334,252],[334,250],[334,250],[336,248],[336,248],[336,248],[334,246],[332,244],[332,244],[332,242],[330,240],[332,238],[332,238],[334,238],[336,236],[338,234],[340,234],[342,234],[344,234],[344,236],[346,238],[348,238],[350,240],[350,242],[350,244],[352,244],[354,244],[356,246],[356,246],[356,248],[358,248],[356,250],[358,250],[358,252],[360,252],[362,252],[364,254],[366,252],[368,250],[368,252],[370,252],[368,254],[368,256],[370,256],[370,258],[370,260],[368,260],[368,262],[368,264],[370,266],[372,268],[372,268],[374,270],[376,272],[374,274],[374,274],[372,276],[372,278],[372,280],[372,280],[372,282],[372,284],[372,286],[374,286],[376,286],[378,288],[378,290],[378,292],[378,294],[378,296],[376,296],[376,298],[374,298],[372,298],[370,300],[368,300],[368,302],[366,304],[364,304],[362,304],[360,304],[360,306],[360,308],[360,310],[358,310],[358,312],[358,314],[356,316],[354,316],[354,318],[354,320],[354,322],[352,322],[352,322],[354,324],[354,326],[356,326],[358,328],[358,328],[360,330],[362,330],[364,330],[364,330],[362,330],[360,332],[362,332],[362,334],[364,336],[364,338],[366,338],[368,336],[368,338],[370,338],[372,336],[374,336],[376,336],[378,336],[378,336],[380,336],[382,336],[384,336],[386,336],[386,338],[384,338],[384,340],[382,340],[380,338],[378,338],[376,338],[374,338],[374,338],[372,338],[370,340],[368,340],[368,342],[366,342],[366,344],[368,346],[368,346],[370,348],[372,350],[372,350],[372,352],[372,354],[374,356],[374,358],[376,358],[376,356],[378,354],[378,356],[380,356],[382,358],[382,360],[382,360],[382,358],[384,356],[384,356],[386,358],[388,358],[390,360],[390,358],[388,356],[388,354],[388,354],[386,352],[386,350],[384,348],[384,346],[384,346],[386,346],[388,348],[390,348],[392,346],[390,346],[390,344],[388,344],[386,342],[386,340],[388,340],[390,338],[392,338],[394,340],[396,340],[396,342],[398,340],[396,338],[396,336],[396,334],[394,334],[392,334],[390,332],[388,332],[386,330],[386,330],[384,330],[382,330],[380,328],[382,328],[382,328],[384,326],[382,326],[382,324],[382,322],[384,322],[384,324],[386,324],[386,322],[386,320],[384,320],[382,318],[380,316],[380,316],[378,314],[378,312],[378,310],[378,308],[378,306],[378,306],[380,306],[380,308],[382,308],[384,310],[384,310],[386,312],[388,312],[388,312],[386,312],[386,310],[386,308],[388,310],[390,310],[392,312],[392,310],[390,308],[388,308],[390,306],[392,308],[394,308],[394,308],[394,306],[392,306],[390,306],[390,304],[388,302],[388,302],[390,302],[392,300],[394,298],[396,298],[398,298],[398,298],[400,296],[402,296],[404,296],[406,296],[408,296],[410,296],[412,296],[412,296],[414,294],[412,292],[412,290],[414,288],[416,286],[414,284],[412,284],[412,284],[412,282],[414,280],[414,280],[416,278],[418,278],[420,276],[422,278],[424,278],[426,276],[426,276],[426,276],[424,274],[424,272],[422,272],[422,270],[422,268],[424,266],[424,266],[424,264],[424,262],[424,260],[424,258],[426,256],[428,256],[428,254],[428,252],[428,250],[428,248],[428,246],[426,244],[428,242],[428,240],[428,240],[428,238],[428,236],[428,234],[428,234],[430,236],[430,236],[432,236],[434,234],[434,232],[434,230],[434,228],[432,228],[430,228],[428,228],[426,230],[424,230],[424,232],[422,232],[420,230],[418,230],[418,228],[418,226],[418,224],[416,222],[416,220],[416,218],[416,216],[416,214],[416,212],[414,210],[412,210],[412,208],[410,206],[408,206],[406,204],[406,202],[404,202],[404,200],[402,198],[400,196],[400,196],[398,196],[396,196],[394,198],[394,200],[392,200],[390,202],[388,202],[386,202],[386,204],[384,206],[382,206],[380,204],[378,204],[376,204],[376,204],[374,204],[372,204],[370,204],[368,204],[366,204],[364,206],[364,204],[362,204],[360,204],[358,202],[358,200],[356,200],[356,198],[358,196],[358,194],[358,192],[360,192],[362,192],[360,190],[360,188],[360,186],[358,184],[360,182],[360,182],[362,180],[362,178],[364,176],[364,174],[366,172],[368,172],[368,170],[368,168],[368,166],[368,166],[366,164],[366,162],[364,160],[364,160],[362,158],[362,156],[362,154],[362,152],[362,150],[360,148],[358,148],[356,146],[358,144],[358,142],[360,142],[362,140],[362,138],[360,136],[360,134],[360,132],[358,132],[358,130],[356,128],[356,126],[356,124],[358,124],[360,124],[362,124],[362,122],[364,122],[366,120],[366,120],[368,118],[370,116],[370,118],[372,118],[372,116],[370,116],[370,114],[372,112],[370,110],[370,108],[372,106],[374,106],[374,104],[376,104],[376,102],[376,100],[374,100],[374,98],[374,96],[376,96],[376,94],[378,94],[380,92],[382,92],[382,90],[382,88],[384,86],[384,84],[382,82],[382,82],[380,80],[380,78],[378,78],[378,76],[378,74],[378,72],[376,72],[374,70],[374,70],[374,68],[374,66],[376,64],[374,64],[372,62],[372,60],[370,58],[370,56],[368,56],[366,54],[366,52],[368,50],[370,50],[372,48],[372,46],[372,46],[372,44]]
};

/*

Go to : https://upload.wikimedia.org/wikipedia/commons/7/73/Global_European_Union.svg
- find a path ..... (hard)

use this to preview the found shapes: https://yqnn.github.io/svg-path-editor/

save a file containing only <svg><path d="....."></path></svg>

Send it to : (visualize and __generate points list__, save it as "shape-europe.csv", it contains decimal values)
https://shinao.github.io/PathToPoints/


Find min values for X (first column): --> only on int values ?
awk -F, 'NR == 1 || $1 < min {min = $1} END {print min}' europe.csv
-> 290

Find min values for Y (second column):
awk -F, 'NR == 1 || $2 < min {min = $2} END {print min}' europe.csv
-> 591

Shift the shape to the up and left
awk -F, '{print int($1 - 270)*2 "," int($2 - 570)*2}' shape-europe.csv > europe.csv


// SVG Path commands :
m = move to
h = horizontal line to
l = line to ?
v = vertical line to
z = end

*/



// available shapes
const shapes = [heart, star, Europe];

let shape = Europe;
let points = shape.path;
console.log("Initial number of points :", points.length);


function main() {

    //
    // UI Event listeners
    //
    document.querySelector("#clear").addEventListener('click', (e) => {    
        hideOriginal = false;
        hideOriginalEl.checked = false;
        
        shape = null;
        points = [];
        clear();
    });
    document.querySelector("#simplify").addEventListener('click', (e) => simplify());
    epsilonEl.addEventListener('change', (e) => {
        if(isSimplified) {
            clear();
            if(! hideOriginal) {
                redraw();
            }
            simplify();
        }
    });

    hideOriginalEl.addEventListener('click', (e) => {
        hideOriginal = e.target.checked;
        console.log(">>hideOriginal:", hideOriginal);
        clear();
        if(! hideOriginal) {
            redraw();
        }
        simplify(); // redraw only simplified lines/points
    });

    document.querySelector("#random").addEventListener('click', (e) => {
        clear();
        hideOriginal = false;
        hideOriginalEl.checked = false;
        shape = choice(shapes);
        points = shape.path;
        redraw();
    });

    canvas.addEventListener('click', (e) => {
        const point = [e.offsetX, e.offsetY];
        drawPointAt(ctx, point[0], point[1], shape?.pointSize ?? 4, 'black');

        if(points.length > 0) { // a previous point is present
            const prevPoint = points[points.length - 1  ];
            drawLine(ctx, prevPoint[0], prevPoint[1], point[0], point[1], 2, 'black');
        }

        points.push(point);

        //console.log(points);
    })

    clear();
    redraw();
}

function clear() {
    console.log("clear !");
    setUpCanvas(ctx, 500, 500, '#F2F4F4');
    isSimplified = false;
}

function simplify() {
    isSimplified = true;
    //clear(); // clear canvas to initial color

    console.log("apply simplification!");
    const simplifiedPoints = douglasPeucker(points, epsilonEl.value ?? 10);
    //console.log("simplified points : ", simplifiedPoints);

    drawLineThroughPoints(ctx, simplifiedPoints, (shape?.pointSize ?? 2) * 2, 'red');
    simplifiedPoints.forEach(point => drawPointAt(ctx, point[0], point[1], (shape?.pointSize ?? 2) * 2, 'red'));

    // overlay debugging info.
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "black";

    const compressionRate = (1 - simplifiedPoints.length / points.length) * 100;

    ctx.fillText(`simplified from ${points.length} points to ${simplifiedPoints.length} (compressed by -${Math.round(compressionRate * 10)/10}%)`, 15, 25);
}

/**
 * https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
 */
function perpDist(point, line) {

    const P0 = line[0],
        P1 = line[1];
    
    const num = Math.abs( (P1[1] - P0[1]) * point[0] - (P1[0] - P0[0]) * point[1] + P1[0] * P0[1] - P1[1] * P0[0])
    const den = Math.sqrt( Math.pow(P1[1] - P0[1], 2) + Math.pow(P1[0] - P0[0], 2) );

    return num / den;
}

function douglasPeucker(points, epsilon) {

    let distMax = 0; // to find the point with maximum distance
    let index = 0; // its index ?
    const size = points.length;
    const line = [points[0], points[size - 1]]; // current "line"

    for(let i = 1; i < size - 1; i++) {
        const d = perpDist(points[i], line);
        if(d > distMax) {
            index = i;
            distMax = d;
        }
    }

    // recursively simplify
    if(distMax > epsilon) {

        const segment1 = points.slice(0, index + 1);
        const segment2 = points.slice(index);
        //console.log("points:", points, "seg1:", segment1, "seg2:", segment2);

        const res1 = segment1.length > 1 ? douglasPeucker(segment1, epsilon) : segment1;
        const res2 = segment2.length > 1 ? douglasPeucker(segment2, epsilon) : segment2;

        return res1.concat(res2.slice(1));
    } else {
        return line; // simplify to a line !
    }
}

// shape only (black one)
function redraw() {
    console.log("draw original shape :", points.length, "points");
    drawLineThroughPoints(ctx, points, 1, 'black');
    points.forEach(point => drawPointAt(ctx, point[0], point[1], shape?.pointSize ?? 4, 'black'));
}

main();
