//Load boards manually
const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
];
const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
];
const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
];

//Create variables ******
var timer;
var timeRemaining;
var lives;
var selectedNum;
var selectedTile;
var disableSelect;



window.onload = function () {
    //Run startgame function when buton is clicked  ********
    id("start-btn").addEventListener("click", startGame);

    //add event listener to numbers in number container
    for (let i = 0; i < id('number-container').children.length; i++) {
        id('number-container').children[i].addEventListener('click', function () {

            // if selecting is not disabled
            if (!disableSelect) {
                //if number is already selected
                if (this.classList.contains('selected')) {
                    //remove selection
                    this.classList.remove('selected');
                    selectedNum = null;
                } else {
                    //deselect all others
                    for (let i = 0; i < 9; i++) {
                        id('number-container').children[i].classList.remove('selected');
                    }
                    // select it and update selectedNum variable
                    this.classList.add('selected');
                    selectedNum = this;
                    updateMove();
                }
            }
        });
    }
}

function startGame() {
    //Selection of board difficulty  ******
    let board;
    if (id("diff-1").checked) board = easy[0];
    else if (id("diff-2").checked) board = medium[0];
    else board = hard[0];


    //Set lives to 3 and enable selecting numbers and tiles ****
    lives = 3;
    disableSelect = false;
    id("lives").textContent = `Lives Remaining: ${lives}`;

    //Generate board  ******
    generateBoard(board);

    // Timer  *******
    startTimer();

    //Set theme based on input    ********
    if (id('theme-1').checked) {
        qs("body").classList.remove('dark');
    } else {
        qs('body').classList.add('dark');
    }
    //Show numbers  ***** 
    id(`number-container`).classList.remove('hidden');
}

function startTimer() {
    // Display tim remaining******
    if (id('time-1').checked) timeRemaining = 180;
    else if (id('time-2').checked) timeRemaining = 300;
    else timeRemaining = 600;

    // Settimer  *******
    id('timer').textContent = timeConversion(timeRemaining);

    // Update ever second   ********
    timer = setInterval(function () {
        timeRemaining--;
        //if no time is remaining end game   ******
        if (timeRemaining === 0) endGame();
        id('timer').textContent = timeConversion(timeRemaining);
    }, 1000)

    //Convert time into string   *****
    function timeConversion(time) {
        let minutes = Math.floor(time / 60);
        if (minutes < 10) minutes = `0${minutes}`;
        let seconds = time % 60;
        if (seconds < 10) seconds = `0${seconds}`;
        return `${minutes}:${seconds}`;
    }
}

function generateBoard(board) {
    //Clear previous board     ****
    clearPrevious();
    // increment tile id's   *******
    let idCount = 0;
    //Create tiles
    for (let i = 0; i < 81; i++) {
        //create new element  ******
        let tile = document.createElement('p');
        // if tile is not suppose to be blank    ******
        if (board.charAt(i) != "-") {
            //Set tile text content
            tile.textContent = board.charAt(i);
        } else {
            //add event listener to tile   
            tile.addEventListener('click', function () {
                //if selecting is not disabled
                if (!disableSelect) {
                    if (tile.classList.contains('selected')) {
                        tile.classList.remove('selected');
                        selectedTile = null;
                    } else {
                        // deselect all tiles
                        for (let i = 0; i < 81; i++) {
                            qsa('.tile')[i].classList.remove('selected');
                        }
                        // add selection and update variable
                        tile.classList.add('selected');
                        selectedTile = tile;
                        updateMove();
                    }
                }
            });
        }
        // assign tile id  ******
        tile.id = idCount;
        //increment for next tile  ******
        idCount++;
        //Add class to all tiles  *******
        tile.classList.add('tile');
        if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)) {
            tile.classList.add('bottomBorder');
        }
        if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
            tile.classList.add('rightBorder');
        }
        // Add tile to board   *****
        id('board').appendChild(tile);
    }
}

function updateMove(){
    //if tile and number is selected
    if(selectedTile && selectedNum){
        // set tile to the correct number
        selectedTile.textContent = selectedNum.textContent;
        // if number matches corresponding number in the solution key
        if(checkCorrect(selectedTile)){
            //deselect tiles
            selectedTile.classList.remove('selected')
        }
    }
}

function checkCorrect(tile){
    // set spution based on difficulty
    let solution;
    if (id('diff-1').checked) solution = easy[1];
    else    if (id('diff-2').checked) solution = medium[1];
    else solution = hard[1];

    // if tiles number is equal to solutions number
    if(solution.charAt(tile.id)=== tile.textContent) return true;
    else return false;
}

function clearPrevious() {
    //Access all times   *******
    let tiles = qsa(".tile");
    //remove each tile  ******
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].remove();
    }
    // clear all  ****
    if (timer) clearTimeout(timer);
    // deselect numbers    *******
    for (let i = 0; i < id('number-container').children.length; i++) {
        id('number-container').children[i].classList.remove('selected');
    }
    // clear variables   *****
    selectedTile = null;
    selectedNum = null;
}

// Helper functions *****
function id(id) {
    return document.getElementById(id);
}
//   ******
function qs(selector) {
    return document.querySelector(selector);
}
// ******
function qsa(selector) {
    return document.querySelectorAll(selector);
}