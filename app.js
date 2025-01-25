let playing = false
let turn = 'x'
let winner = ''
const attempts = 10;

const cells = document.querySelectorAll(".cell")
const game = document.querySelector(".game");
const turnSpan = document.querySelector(".status span")
const winMessage = document.querySelector(".win-message")

let canProcess = true

document.addEventListener('click', function(event) {
    const resetButton = event.target.closest(".replay");
    const cell = event.target.closest(".cell");

    if (resetButton) {
        reset();
    } else if (cell) {
        if(canProcess && cell.textContent === ''){
            processCell(cell);
            canProcess = false;

            setTimeout(function(){
                let emptyCells = getEmptyCells();
                if(emptyCells.length > 0){
                    const randomCell = Math.floor(Math.random() * emptyCells.length);
                    processCell(emptyCells[randomCell]);
                    canProcess = true;
                } else {
                    checkWinner();
                }
            }, 500);
        }
    }
});

function processCell(cell) {
    const cellText = cell.querySelector(".cell-text")

    if(! cellText){
        const spanCellText = document.createElement("span")
        spanCellText.classList.add("cell-text")
        spanCellText.textContent = turn
        spanCellText.style.color = turn === 'x' ? "dimgrey" : "white";
        cell.appendChild(spanCellText)
    } else {
        cellText.textContent = turn
        cellText.style.color = turn === 'x' ? "dimgrey" : "white";
        cellText.style.animation = "none"
        cellText.style.offsetHeight
        cellText.style.animation = "drawText 0.5s steps(5) forwards"
    }

    cell.setAttribute('turn', turn);

    turn = turn === 'x' ? 'o' : 'x';
    turnSpan.innerHTML = `<span>${turn}</span>`;
    winner = checkWinner();
}

function getEmptyCells(){
    let emptyCells = [];
    cells.forEach(cell => {
        if(!cell.hasAttribute('turn')){
            emptyCells.push(cell);
        }
    });

    return emptyCells;
}

function reset() {
    turn = 'x';
    winner = '';
    turnSpan.innerHTML = `<span>${turn}</span>`;
    game.style.animation = "none";
    game.offsetHeight;
    game.style.animation = "fadeIn 0.5s ease-in-out forwards";

    cells.forEach(cell => {
        cell.textContent = "";
        cell.removeAttribute('turn');
    });

    for(const winningCombi of winning){
        const [a, b, c] = winningCombi;

        game.classList.remove(`winning-line-${a}-${b}-${c}`)
    }

    winMessage.style.display = "none";
    game.style.display = "grid";
}

function checkWinner(){
    for (const winningCombi of winning) {
        const [a, b, c] = winningCombi;

        if((cells[a].textContent === cells[b].textContent && cells[b].textContent === cells[c].textContent) && cells[a].textContent !== ""){
            const winner = cells[a].textContent;
            game.classList.add(`winning-line-${a}-${b}-${c}`);

            setTimeout(function(){
                winMessage.innerHTML = `<span style="color: ${winner === 'x' ? "dimgrey" : "white"}">${winner}</span><br>Gagnant!`;
                winMessage.style.display = "flex";
                game.style.display = "none";
                canProcess = true;
            }, 500);
            return winner;
        }
    }

    return "";
}
