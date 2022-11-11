document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const ScoreDisplay = document.querySelector("#score");
    const StartButton = document.querySelector("#start-button");
    const width = 10;
    let nextRandom = 0;
    let timerId;
    let score = 0;
    const colors = [
        "orange",
        "red",
        "purple",
        "yellow",
        "blue"
    ]

    //Blocks

    const lBlock = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ];

    const tBlock = [
        [1, width, width+1,width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ];
     
    const zBlock = [
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1]
    ];

    const oBlock = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ];

    const iBlock = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]

    const allBlocks =[lBlock,zBlock, tBlock, oBlock, iBlock];

    let currentPosition = 4;
    let currentRotatation = 0;

    //chooses random block shape
    let random = Math.floor(Math.random()*allBlocks.length);
    let current = allBlocks[random][currentRotatation];

    //Draws a random block
     function draw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.add('block')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
     };

     //Erases the block
     function erase(){
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('block')
            squares[currentPosition + index].style.backgroundColor = ''
        })
     };

     //assigns functions to keys
     function control(e){
        if(e.keyCode === 37){
            moveLeft()
        } else if (e.keyCode === 38){
            rotate()
        } else if(e.keyCode === 39){
            moveRight()
        }else if (e. keyCode === 40){
            moveDown()
        }
     }
     document.addEventListener('keyup', control)

    // Moves block down
    function moveDown(){
        erase()
        currentPosition += width
        draw()
        pause()
    } ;

    //Pauses game

    function pause(){
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            //start another block
            random = nextRandom
            nextRandom = Math.floor(Math.random() * allBlocks.length)
            current = allBlocks[random][currentRotatation]
            currentPosition = 4
            addScore()
            draw()
            displayShape()
            gameOver()
        }
    }

    //prevents blocks from moving outside of the grid

    function moveLeft(){
        erase()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if (!isAtLeftEdge) currentPosition -=1
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition +=1
        }

        draw()
    }

    // moves block to the right

    function moveRight(){
        erase()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)

        if(!isAtRightEdge) currentPosition +=1
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition -=1
        }
        draw()
    }

    // rotates the block

    function rotate(){
        erase()
        currentRotatation ++
        if(currentRotatation === current.length) {
            currentRotatation = 0
        }
        current = allBlocks[random][currentRotatation]
        draw()
    }

     //displays next block in mini-grid
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0

    const upNextBlock = [
        [1, displayWidth+1, displayWidth*2+1, 2],
        [0, displayWidth, displayWidth+1, displayWidth*2+1],
        [1, displayWidth, displayWidth+1, displayWidth+2],
        [0,1,displayWidth, displayWidth+1],
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]
    ]

    function displayShape(){
            displaySquares.forEach(square => {
                square.classList.remove('block')
                square.style.backgroundColor = ''
            })
            upNextBlock[nextRandom].forEach(index =>{
                displaySquares[displayIndex + index].classList.add('block')
                displaySquares[displayIndex + index].style.backgroundColor = colors [nextRandom]
            })
        }
    
        StartButton.addEventListener('click', () =>{
            if (timerId){
                clearInterval(timerId)
                timerId = null
            } else {
                draw()
                timerId = setInterval (moveDown, 1000)
                nextRandom = Math.floor(Math.random()*allBlocks.length)
                displayShape()
            }
        })
     
     function addScore(){
        for(let i =0; i<199; i++){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index =>squares[index].classList.contains('taken'))){
                score += 10
                ScoreDisplay.innerHTML = score
                row.forEach(index =>{
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('block')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
     }

     function gameOver(){
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            ScoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
        }
     }



})

