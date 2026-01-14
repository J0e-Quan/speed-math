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
            displayManager.showGame()
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
            }
        }
    })();


    const displayManager = (function () {
        function showGame() {
            initial.remove()
            let content = document.querySelector('content')
            let game = document.createElement('div')
            game.classList.add('game')
            let numpad = document.createElement('div')
            numpad.classList.add('numpad')
            game.appendChild(numpad)
            content.appendChild(game)
            //appendchild game isn't working for some reason :(
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

        return {showGame}
    })();

    return {gameManager, playerManager, displayManager}
})();
