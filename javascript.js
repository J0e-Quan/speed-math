/*
GAME MANAGER IIFE
method for randomly generating question (FORMAT: x (+ or -) y = ?)
getStartTime method that runs performance.now()
getEndTime method that runs performance.now()
calcRoundTime that takes endTime - startTime
addRoundScore that increments roundScore
declare private roundScore and roundTime vars with getters
*/

/*
DISPLAY MANAGER IIFE
WhoGoesFirst method adjusts ui for selection of first player
Upon selection, show game content and set firstPlayer var to selected player
For main gameplay, show current player details, number of questions and current question
Trigger GameManager to get timeStart with performance.now()
Upon game end, remove everything and show results screen with current player score and time and next player darkened 
Repeat for next player...
Once both rounds done, results screen shows winner and score
event listener for button to play again
*/
const game = (function () {
    const gameManager = (function() {
        let currentScore = 0
        let timeTaken = 0
        let startTime = 0
        let endTime = 0
        let isPlayer1Turn = true
        let answer
        let question = 0
        function toggleIsPlayer1Turn() {
            isPlayer1Turn = !isPlayer1Turn
        }
        function incrementScore() {
            currentScore = currentScore++
        }
        function getStartTime() {
            startTime = performance.now()
        }
        function getEndTime() {
            endTime = performance.now()
        }
        function calcCurrentTime() {
            //performance.now() gives time in ms, this rounds and converts output to s
            timeTaken = (Math.floor((endTime - startTime)/1000))
        }
        function newQuestion() {
            if (question <= 10) {
                let num1 = Math.floor(Math.random()*99)+1
                let num2 = Math.floor(Math.random()*99)+1
                let operator
                let operatorChoice = Math.floor(Math.random()*2)
                if (operatorChoice === 0) {
                    operator = '+'
                } else if (operatorChoice === 1) {
                    operator = '-'
                }
                if (operator === '-' && num2 > num1) {
                    newQuestion()
                } else {
                    determineAnswer(num1, operator, num2)
                    displayManager.showQuestion(num1, operator, num2)
                }
            } 
        }
        function determineAnswer(num1, operator, num2) {
            if (operator === '+') {
                answer = num1 + num2
            } else if (operator === '-') {
                answer = num1 - num2
            }
        }
        function checkAnswer(inputAnswer) {
            if (answer === Number(inputAnswer)) {
                question++
                displayManager.updateScoreIcon(question, true)
            } else if (answer !== Number(inputAnswer)) {
                question++
                displayManager.updateScoreIcon(question, false)
            }
        }
        function endRound() {
            console.log('game end!!!!!!!!!!!!1')
            getEndTime()
            calcCurrentTime()
            displayManager.showRoundResult(currentScore, timeTaken)
        }
        return {
            get currentScore() {
                return currentScore
            },
            get timeTaken() {
                return timeTaken
            },
            get isPlayer1Turn() {
                return isPlayer1Turn
            },
            toggleIsPlayer1Turn,
            newQuestion,
            getStartTime,
            getEndTime,
            checkAnswer,
            endRound
        }
    })();


    const playerManager = (function() {
        let nameBtn = document.querySelector('.submit-name')
        nameBtn.addEventListener('click', () =>{
            let player1NameInput = document.querySelector('.one.name')
            let player2NameInput = document.querySelector('.two.name')
            player1name = player1NameInput.value
            if (player1name === '' || player1name === null) {
                player1name = 'Player 1'
            }
            player2name = player2NameInput.value
            if (player2name === '' || player2name === null) {
                player2name = 'Player 2'
            }
            player1 = createPlayer(player1name)
            player2 = createPlayer(player2name)
            displayManager.hideInitial()
        })

        function createPlayer (playerName) {
            let score = 0
            const name = playerName
            let roundScore = 0
            let roundTime = 0

            function incrementScore() {
                score = score++
            }

            return {
                get roundScore() {
                    return roundScore
                },
                get roundTime() {
                    return roundTime
                },
                set roundScore(currentScore) {
                    roundScore = currentScore
                },
                set roundTime(timeTaken) {
                    roundTime = timeTaken
                },
                get score() {
                    return score
                },
                name,
                incrementScore
            }
        }

        let player1name
        let player2name
        let player1
        let player2

        return {
            get player1() {
                return player1
            },
            get player2() {
                return player2
            },
        }
    })();


    const displayManager = (function () {
        function hideInitial() {
            tutorialBtn.classList.add('hidden')
            initial.classList.add('hidden')
            showGame()
        }
        function showGame() {
            let content = document.querySelector('.content')
            let game = document.createElement('div')
            game.classList.add('game')
            let numpad = document.createElement('div')
            numpad.classList.add('numpad')
            let iconArr = [
                './assets/nine.png', './assets/eight.png', './assets/seven.png',
                './assets/six.png', './assets/five.png', './assets/four.png',
                './assets/three.png', './assets/two.png', './assets/one.png',
                './assets/submit.png', './assets/zero.png', './assets/backspace.png'
            ]
            iconArr.forEach((src, index) => {
                let numpadBtn = document.createElement('button')
                if (index === 11) {
                    numpadBtn.dataset.action = 'backspace'
                } else if (index === 9) {
                    numpadBtn.dataset.action = 'submit'
                } else if (index === 10) {
                    numpadBtn.dataset.action = '0'
                } else {
                    numpadBtn.dataset.action = (9 - index)
                }
                let icon = document.createElement('img')
                icon.src = src
                numpadBtn.classList.add('numpadBtn')
                icon.classList.add('numpadBtn-icon')
                numpadBtn.appendChild(icon)
                numpad.appendChild(numpadBtn)
            })
            game.appendChild(numpad)
            let questionBox = document.createElement('div')
            questionBox.classList.add('questionBox')
            questionBox.textContent = '1 + 1 = 11'
            game.appendChild(questionBox)
            let currentPlayerInfo = document.createElement('div')
            currentPlayerInfo.classList.add('currentPlayerInfo')
            let currentPlayerNameText = document.createElement('h2')
            currentPlayerNameText.classList.add('currentPlayerNameText')
            if (gameManager.isPlayer1Turn === true) {
                currentPlayerNameText.textContent = "It's " + playerManager.player1.name + "'s turn!"
            } else if (gameManager.isPlayer1Turn === false) {
                currentPlayerNameText.textContent = "It's " + playerManager.player2.name + "'s turn!"
            }
            currentPlayerInfo.appendChild(currentPlayerNameText)
            let currentPlayerIcon = document.createElement('div')
            currentPlayerIcon.classList.add('player', 'info', 'icon')
            currentPlayerIcon.innerHTML =   '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 8 8" width="15rem"><path d="M0 6 6 6C6 5 6 4 5 4L3 4C4 4 5 3 5 2 5 1 4 0 3 0 2 0 1 1 1 2 1 3 2 4 3 4L1 4C0 4 0 5 0 6 Z" stroke="#a7a7a7" stroke-width="0"/></svg>'
            if (gameManager.isPlayer1Turn === true) {
                currentPlayerIcon.classList.add('one')
            } else if (gameManager.isPlayer1Turn === false) {
                currentPlayerIcon.classList.add('two')
            }
            currentPlayerInfo.appendChild(currentPlayerIcon)
            game.appendChild(currentPlayerInfo)
            let scoreGrid = document.createElement('div')
            scoreGrid.classList.add('scoreGrid')
            for (i = 0 ; i < 10; i++) {
                let scoreIcon = document.createElement('div')
                scoreIcon.classList.add('scoreIcon')
                scoreIcon.innerHTML = '<svg width="100" height="100"><circle cx="50" cy="50" r="35" stroke="rgb(187, 187, 187)" stroke-width="5"></circle></svg>'
                scoreGrid.appendChild(scoreIcon)
            }
            currentPlayerInfo.appendChild(scoreGrid)
            content.appendChild(game)
            detectNumpadInput()
            updateInstruction('Input the answer as fast as you can!')
            gameManager.getStartTime()
            gameManager.newQuestion()
        }

        let instruction = document.querySelector('.instruction')
        function updateInstruction(inputText) {
            instruction.textContent = inputText
        }

        function updateScoreIcon(question, result) {
            if (question <= 10) {
                console.log(question)
                let scoreIconList = document.querySelectorAll('.scoreIcon')
                let targetScoreIcon = scoreIconList[(question-1)]         
                if (result === true) {
                    targetScoreIcon.classList.add('correct')
                } else if (result === false) {
                    targetScoreIcon.classList.add('wrong')
                }
                gameManager.newQuestion()
            } else if (question > 10) {
                gameManager.endRound()
            }
        }

        let questionLength
        function showQuestion(num1, operator, num2) {
            let questionBox = document.querySelector('.questionBox')
            questionBox.textContent = num1 + ' ' + operator + ' ' + num2 + '= '
            questionLength = questionBox.textContent.length
        }

        //event listeners for initial + tutorial buttons
        let tutorialBtn = document.querySelector('.tutorial-button')
        let tutorial = document.querySelector('.tutorial')
        let initial = document.querySelector('.initial')
        tutorialBtn.addEventListener('click', () => {
            initial.classList.add('hidden')
            tutorialBtn.classList.add('hidden')
            tutorial.classList.remove('hidden')
        })
        let tutorialCloseBtn = document.querySelector('.close-tutorial')
        tutorialCloseBtn.addEventListener('click', () => {
            initial.classList.remove('hidden')
            tutorialBtn.classList.remove('hidden')
            tutorial.classList.add('hidden')
        })

        function detectNumpadInput() {
            let numpad = document.querySelector('.numpad')
            let questionBox = document.querySelector('.questionBox')
            numpad.addEventListener('click', (btn) => {
                let targetBtn = btn.target
                if (targetBtn.dataset.action === 'submit') {
                    let inputAnswer = questionBox.textContent.slice(questionLength)
                    gameManager.checkAnswer(inputAnswer)
                } else if (targetBtn.dataset.action === 'backspace') {
                    if (questionBox.textContent.length > questionLength) {
                        questionBox.textContent = questionBox.textContent.slice(0, -1)
                    }
                } else {
                    questionBox.textContent = questionBox.textContent + targetBtn.dataset.action
                }
            })
        }

        return {showGame, updateInstruction, updateScoreIcon, showQuestion}
    })();

    return {gameManager, playerManager, displayManager}
})();





