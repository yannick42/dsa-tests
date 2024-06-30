
import { setUpCanvas, drawPointAt, drawArrow, drawLine } from '../common/canvas.helper.js';
import { randInt } from '../common/common.helper.js';
import { computeBézierCurve } from '../common/math.helper.js';

// hard-coded books
import { SICP } from './SICP.js';
import { CG } from './CG.js';

/**
 * TODO:
 * 
 * 

- start all closed (if no config. in localStorage)






 */























const bookListEl = document.getElementById("book_list");
const canvas = document.querySelector("canvas");
canvas.width = 1208;
canvas.height = 839;
const ctx = canvas.getContext("2d");


function main() {
    //document.querySelector("#refresh").addEventListener('click', (e) => redraw());
    redraw();
}


/**
 * TODO: get it from localStorage too ! (or backend ?!)
 */
function getBookList() {
    return [SICP, CG]
}

function createHtml(book) {
    const html = `
        <div id="${book.id}" class="book">
            <div class="toggle">${getVisibility(book.id) ? '➖' : '➕'}</div>

            <span class="title">${book.title}</span>${book.authors ? ` ${book.authors.join(', ')}` : ''}

            <div class="progress-bar">
                <div class="progress"></div>
                <span class="progress-value"></span>
            </div>

            <div class="level ${getVisibility(book.id) ? '' : 'toggled'}">
                ${createLevel(book, book.content, 0).join('')}
            </div>
        </div>
    `;

    if(! getProgress(book.id)) { // init to hidden
        setVisibility(book.id, true);
    }

    return html;
}

function createLevel(book, content, level) {
    //const content = el.content;

    return content.map(el => {
        const isChecked = el.id ? getProgressForId(book.id, el.id) : false;
        return `
        <div class="content ${el.content ? '' : 'leaf'}">

            <span${el.id ? ' id="'+el.id+'"' : ''} class="content_title_${level}${isChecked ? ' checked' : ''}">
                ${el.content ? '' : `<input type="checkbox" ${isChecked ? ' checked' : ''}/>`} ${el.title}
            </span>
            <span class="start_page">${el.start_page}</span>

            ${el.content ? createLevel(book, el.content, level + 1).join('') : ''}
        </div>
        `
    });
}


function findNextEntry(book, id) {
    book.content.forEach(content => {



    });

    return nextEntry;
}

function getProgress(bookId) {
    const bookProgress = _getLocalStorageObj('book_progress');
    return bookProgress.find(b => b.id === bookId);
}

function getProgressForId(bookId, id) {
    //console.log("checking if", id, " from book =", bookId, "is true -> ", getProgress(bookId)?.progress?.includes(id))
    return getProgress(bookId)?.progress?.includes(id);
}

function setProgress(bookId, newValue) {
    const booksProgress = _getLocalStorageObj('book_progress');
    const newProgress = booksProgress.filter(prog => prog.id !== bookId);
    newProgress.push(newValue);
    localStorage.setItem('book_progress', JSON.stringify(newProgress)); // in LocalStorage
}

function _getLocalStorageObj(itemName) {
    return JSON.parse(localStorage.getItem(itemName) ?? '[]');
}

function setVisibility(bookId, value) {
    console.log("setVisibility:", bookId, "to", value)
    const booksProgress = _getLocalStorageObj('book_progress');
    // get and keep unchanged books
    const newObject = booksProgress.filter(prog => prog.id !== bookId);
    // modify current book
    let currentBook = booksProgress.find(prog => prog.id === bookId);
    console.log("setVis:", currentBook)
    if(currentBook) { // if present
        currentBook['visibility'] = value;
    } else {
        currentBook = { 'id': bookId, 'visibility': value, 'progress': []}
    }
    // save it
    newObject.push(currentBook);
    localStorage.setItem('book_progress', JSON.stringify(newObject)); // in LocalStorage
    return value;
}

function getVisibility(bookId) {
    const booksProgress = _getLocalStorageObj('book_progress');
    return booksProgress.find(prog => prog.id === bookId)?.visibility ?? true;
}

function addEvents() {

    //
    // handle toggle book view : list vs progress_only
    //
    const toggleEls = document.querySelectorAll("#book_list .toggle");
    toggleEls.forEach(el => {
        el.addEventListener('click', (e) => {
            const bookId = e.target.offsetParent.id;
            const currentVisibility = getVisibility(bookId);

            const newVisibility = setVisibility(bookId, !currentVisibility);

            if(newVisibility) {
                e.target.offsetParent.querySelector('.level').classList.remove('toggled');
                e.target.innerText = '➖';
                const test = getBookList().filter(book => book.id != bookId).forEach(book => document.querySelector("#"+book.id+" .toggle").click());
            } else {
                e.target.offsetParent.querySelector('.level').classList.add('toggled');
                e.target.innerText = '➕';
            }

            updateArrows();
        });
    });


    const titleEls = document.querySelectorAll("#book_list [class^='content_title']")
    // for each book section/title ? -> tick a checkbox ! 
    titleEls.forEach(el => {
        if(el.id) {
            el.addEventListener('click', (e) => {
                const bookId = e.target.offsetParent.id; // use nearest positionned parent ? (because of position: relative ?)
                
                const checkbox = e.target.querySelector("input[type='checkbox']");
                checkbox.checked = !checkbox.checked; // toggle

                const book = getProgress(bookId);
                if(checkbox.checked) {
                    e.target.classList.add('checked');

                    if(! book.progress.includes(e.target.id)) book.progress.push(e.target.id) // add to completed ids (eg. 1.1.1, ...)

                } else {
                    e.target.classList.remove('checked');

                    if(book.progress.includes(e.target.id)) book.progress = book.progress.filter(id => id !== e.target.id); // remove
                }
                // save new progress to localStorage
                setProgress(bookId, book);

                updateProgressBar(book)
            })
        }
    })
}

function updateArrows() {

    setUpCanvas(ctx, canvas.width, canvas.height, 'white')

    const pointSize = 5, color = "#467799";

    const SICPBBox = document.getElementById("SICP").getBoundingClientRect();
    const pt1 = [
        SICPBBox.left + canvas.offsetLeft,
        (SICPBBox.bottom - SICPBBox.top) / 2 + SICPBBox.top - 10 - pointSize/2
    ];

    const CGBBox = document.getElementById("CG").getBoundingClientRect();
    const pt2 = [
        CGBBox.left + canvas.offsetLeft,
        (CGBBox.bottom - CGBBox.top) / 2 + CGBBox.top - 10 - pointSize/2
    ];
    drawPointAt(ctx, pt1[0], pt1[1], 5, color); // starting point only (end = arrow)
    
    const arrows = [
        [pt1[0], pt1[1], pt1[0]-100, pt1[1]],
        [pt2[0], pt2[1], pt2[0]-100, pt2[1]]
    ];
    const curvePoints = computeBézierCurve(ctx, [pt1, pt2], arrows, 1/25);

    // draw curve
    const nbCurvePoints = curvePoints.length;
    curvePoints.forEach((point, i) => {
        if(i + 1 === nbCurvePoints) return; // last point
        drawLine(ctx, point[0], point[1], curvePoints[i+1][0], curvePoints[i+1][1], 2, color);
    });
        
    drawArrow(ctx, curvePoints[nbCurvePoints-2][0], curvePoints[nbCurvePoints-2][1], curvePoints[nbCurvePoints-1][0], curvePoints[nbCurvePoints-1][1], color, 2 /*width*/, /*head_len*/ 10);
}

// TODO
// compute "true" progression using pages
//      by getting the "next" element (even if it is an other chapter !) then (next_start_page - start_page)
// sum everything and divide by the total pages of the book (easy)
function updateProgressBar(book) {

    function countIds(content) {
        // add current level ids
        count += content.map(c => c.id ? 1 : 0).reduce((acc, value) => acc += value, 0);
        // recursive call on children
        content.forEach(c => c.content?.length && countIds(c.content));
    }
    
    let count = 0;

    const bookItem = getBookList().find(b => b.id == book.id);
    countIds(bookItem.content);

    const value = Math.round(count ? (book.progress?.length ?? 0) / count * 100 : 0);

    document.querySelector("#"+bookItem.id+" .progress").style.width = value + '%';
    document.querySelector("#"+bookItem.id+" .progress-value").innerText = `${value} %`;
}

function redraw() {
    // get all books
    const books = getBookList();
    // get html structure
    const booksHtml = books.map(book => createHtml(book))
    // add it to the DOM
    booksHtml.forEach(html => bookListEl.innerHTML += html);

    // UI: on clicks, ...
    addEvents();

    // update initial progress
    const bookProgress = JSON.parse(localStorage.getItem('book_progress') ?? '[]');
    bookProgress.forEach(b => {
        const book = getProgress(b.id);
        updateProgressBar(book)
    });

    updateArrows();
}

main();
