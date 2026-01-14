const game = (function () {
    const gameManager = (function() {
        let currentScore = 0
        let timeTaken = 0
        let startTime = 0
        let endTime = 0
        let isPlayer1Turn = true
        let answer
        let question = 0
        function newRound() {
            isPlayer1Turn = !isPlayer1Turn
            question = 0
            currentScore = 0
            timeTaken = 0
        }
        function incrementScore() {
            currentScore++
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
                incrementScore()
                displayManager.updateScoreIcon(question, true)
            } else if (answer !== Number(inputAnswer)) {
                question++
                displayManager.updateScoreIcon(question, false)
            }
        }
        function endRound() {
            getEndTime()
            calcCurrentTime()
            if (isPlayer1Turn === true) {
                playerManager.player1.roundScore = currentScore
                playerManager.player1.roundTime = timeTaken
                displayManager.transition()
            } else if (isPlayer1Turn === false) {
                playerManager.player2.roundScore = currentScore
                playerManager.player2.roundTime = timeTaken
                displayManager.showResult()
            }
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
            newRound,
            newQuestion,
            getStartTime,
            getEndTime,
            checkAnswer,
            endRound
        }
    })();


    const playerManager = (function() {
        let nameBtn = document.querySelector('.submit-name')
        nameBtn.addEventListener('click', () => {
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

        function determineWinner() {
            if (player1.roundScore > player2.roundScore) {
                return 'player1'
            } else if (player1.roundScore < player2.roundScore) {
                return 'player2'
            } else if (player1.roundScore === player2.roundScore) {
                if (player1.roundTime < player2.roundTime) {
                    return 'player1'
                } else if (player1.roundTime > player2.roundTime) {
                    return 'player2'
                } else if (player1.roundTime === player2.roundTime) {
                    return 'tie'
                }
            }
        }

        function createPlayer (playerName) {
            let score = 0
            const name = playerName

            function incrementScore() {
                score = score++
            }

            return {
                get roundScore() {
                    return this._roundScore
                },
                get roundTime() {
                    return this._roundTime
                },
                set roundScore(currentScore) {
                    this._roundScore = currentScore
                },
                set roundTime(timeTaken) {
                    this._roundTime = timeTaken
                },
                get score() {
                    return this._score
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
            determineWinner
        }
    })();


    const displayManager = (function () {
        function hideInitial() {
            tutorialBtn.classList.add('hidden')
            initial.classList.add('hidden')
            newGame()
        }
        function newGame() {
            window.removeEventListener('keydown', detectKeyboardInput)
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
            updateInstruction('Input the answer as fast as you can!')
            gameManager.getStartTime()
            gameManager.newQuestion()            
            detectNumpadInput()
        }

        function removeGame() {
            let game = document.querySelector('.game')
            game.remove()
        }

        function transition() {
            removeGame()
            let content = document.querySelector('.content')
            let transitionCard = document.createElement('div')      
            transitionCard.classList.add('transitionCard')  
            let transitionTitle = document.createElement('h2')
            transitionTitle.classList.add('transitionTitle')
            transitionTitle.textContent = "Time for " + playerManager.player2.name + " to play! Press the button below when you're ready!"
            transitionCard.appendChild(transitionTitle)
            let transitionPlayerIcon = document.createElement('div')
            transitionPlayerIcon.classList.add('player', 'two', 'icon')
            transitionPlayerIcon.innerHTML =   '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 8 8" width="15rem"><path d="M0 6 6 6C6 5 6 4 5 4L3 4C4 4 5 3 5 2 5 1 4 0 3 0 2 0 1 1 1 2 1 3 2 4 3 4L1 4C0 4 0 5 0 6 Z" stroke="#a7a7a7" stroke-width="0"/></svg>'
            transitionCard.appendChild(transitionPlayerIcon)     
            let transitionButton = document.createElement('button')
            transitionButton.type = 'button'
            transitionButton.classList.add('transitionButton')  
            transitionButton.textContent = "Let's Play!"
            transitionCard.appendChild(transitionButton)
            content.appendChild(transitionCard) 
            updateInstruction('Waiting for the next player...')  
            detectNextRound()
        }

        function removeTransition() {
            let transitionCard = document.querySelector('.transitionCard')
            transitionCard.remove()
        }

        function showResult() {
            removeGame()
            let content = document.querySelector('.content')
            let resultsCard = document.createElement('div')
            let showPlayer1Results = true
            resultsCard.classList.add('resultsCard')
            for (i = 0; i < 2; i++) {
                let playerResults = document.createElement('div')
                playerResults.classList.add('playerResults')
                let playerName = document.createElement('h2')
                playerName.classList.add('playerName')
                playerResults.appendChild(playerName)
                let playerIcon = document.createElement('div')
                playerIcon.classList.add('result', 'icon')
                playerIcon.innerHTML =   '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 8 8" width="15rem"><path d="M0 6 6 6C6 5 6 4 5 4L3 4C4 4 5 3 5 2 5 1 4 0 3 0 2 0 1 1 1 2 1 3 2 4 3 4L1 4C0 4 0 5 0 6 Z" stroke="#a7a7a7" stroke-width="0"/></svg>'
                playerResults.appendChild(playerIcon)
                let playerScore = document.createElement('h3')
                playerScore.classList.add('playerScore')
                playerResults.appendChild(playerScore)
                let playerTime = document.createElement('h3')
                playerTime.classList.add('playerTime')
                playerResults.appendChild(playerTime)
                resultsCard.appendChild(playerResults)
                if (showPlayer1Results === true) {
                    playerResults.classList.add('one')
                    playerName.textContent = playerManager.player1.name
                    playerIcon.classList.add('one')
                    playerScore.textContent = 'Correct answers: ' + playerManager.player1.roundScore
                    playerTime.textContent = 'Time taken: ' + playerManager.player1.roundTime + ' seconds'
                    showPlayer1Results = !showPlayer1Results
                    continue
                } else if (showPlayer1Results === false) {
                    playerResults.classList.add('two')
                    playerName.textContent = playerManager.player2.name
                    playerIcon.classList.add('two')
                    playerScore.textContent = 'Correct answers: ' + playerManager.player2.roundScore
                    playerTime.textContent = 'Time taken: ' + playerManager.player2.roundTime + ' seconds'
                    continue            
                }
            }
            content.appendChild(resultsCard)
            showWinner(playerManager.determineWinner())
        }

        function showWinner(winner) {
            if (winner === 'player1') {
                let winResults = document.querySelector('.playerResults.one')
                winResults.classList.add('winner')
                updateInstruction(playerManager.player1.name + ' wins! Refresh the page or click the logo to play again...')
            } else if (winner === 'player2') {
                let winResults = document.querySelector('.playerResults.two')
                winResults.classList.add('winner')
                updateInstruction(playerManager.player2.name + ' wins! Refresh the page or click the logo to play again...')
            } else if (winner === 'tie') {
                let winResults = document.querySelectorAll('.playerResults')
                winResults.forEach(element => {
                    element.classList.add('winner')
                })               
                updateInstruction("It's a tie! Refresh the page or click the logo to play again...")
            }
        }

        let instruction = document.querySelector('.instruction')
        function updateInstruction(inputText) {
            instruction.textContent = inputText
        }

        function updateScoreIcon(question, result) {
            if (question < 10) {
                let scoreIconList = document.querySelectorAll('.scoreIcon')
                let targetScoreIcon = scoreIconList[(question-1)]         
                if (result === true) {
                    targetScoreIcon.classList.add('correct')
                } else if (result === false) {
                    targetScoreIcon.classList.add('wrong')
                }
                gameManager.newQuestion()
            } else if (question >= 10) {
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
            //event listener for clicking/touching the numpad
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
            //event listener for keyboard input 
            window.addEventListener('keydown', detectKeyboardInput)
        }

        function detectNextRound() {
            let transitionButton = document.querySelector('.transitionButton')
            transitionButton.addEventListener('click', () => {
                removeTransition()
                gameManager.newRound()
                newGame()
            })
        }

        function detectKeyboardInput(press) {
            let questionBox = document.querySelector('.questionBox')
            if (press.repeat) {
                return
            }
            if (press.key >= '0' && press.key <= '9') {
                let value = Number(press.key)
                questionBox.textContent = questionBox.textContent + value
            } else if (press.key === 'Backspace') {
                if (questionBox.textContent.length > questionLength) {
                    questionBox.textContent = questionBox.textContent.slice(0, -1)
                }                    
            } else if (press.key === 'Enter') {
                let inputAnswer = questionBox.textContent.slice(questionLength)
                gameManager.checkAnswer(inputAnswer)                    
            }
        }

        return {hideInitial, newGame, transition, showResult, updateInstruction, updateScoreIcon, showQuestion}
    })();

    return {gameManager, playerManager, displayManager}
})();