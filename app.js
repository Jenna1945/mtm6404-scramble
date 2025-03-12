/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending on the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle(src) {
    const copy = [...src]

    const length = copy.length
    for (let i = 0; i < length; i++) {
        const x = copy[i]
        const y = Math.floor(Math.random() * length)
        const z = copy[y]
        copy[i] = z
        copy[y] = x
    }

    if (typeof src === 'string') {
        return copy.join('')
    }

    return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/
const { useState, useEffect } = React

const words = [
    'bucharest', 'amsterdam', 'barcelona', 'naples', 'lisbon',
    'brussels', 'berlin', 'moscow', 'minsk', 'helsinki', 'palermo'
]

function ScrambleGame() {
    const [wordList, setWordList] = useState(words)
    const [current, setCurrent] = useState("")
    const [wordScramble, setWordScramble] = useState("")
    const [guess, setGuess] = useState("")
    const [score, setScore] = useState(0)
    const [strike, setStrike] = useState(0)
    const [pass, setPass] = useState(3)

    useEffect(() => {
        const storedState = localStorage.getItem('scrambleGameState')
        if (storedState) {
            const { savedWordList, savedCurrent, savedWordScramble, savedScore, savedStrike, savedPass } = JSON.parse(storedState)
            setWordList(savedWordList)
            setCurrent(savedCurrent)
            setWordScramble(savedWordScramble)
            setScore(savedScore)
            setStrike(savedStrike)
            setPass(savedPass)
        } else {
            startNewGame()
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('scrambleGameState', JSON.stringify({ wordList, current, wordScramble, score, strike, pass }))
    }, [wordList, current, wordScramble, score, strike, pass])

    const startNewGame = () => {
        const shuffledWords = shuffle([...words])
        setWordList(shuffledWords)
        setCurrent(shuffledWords[0])
        setWordScramble(shuffle(shuffledWords[0]))
        setScore(0)
        setStrike(0)
        setPass(3)
    }

    const guessDealer = (e) => {
        e.preventDefault()
        if (guess.toLowerCase() === current.toLowerCase()) {
            setScore(score + 1)
            handleNextWord()
        } else {
            setStrike(strike + 1)
            if (strike + 1 >= 3) {
                alert(`Game over! You scored ${score} points with ${strike + 1} strikes. Better luck next time!`)
                resetGame()
            }
        }
        setGuess("")
    }

    const passDealer = () => {
        if (pass > 0) {
            setPass(pass - 1)
            handleNextWord(true)
        } else {
            alert("You have no passes left. Keep trying!")
        }
    }

    const handleNextWord = (skipped = false) => {
        const newWordList = wordList.filter(word => word !== current)
        if (newWordList.length > 0) {
            const newWord = shuffle(newWordList)[0]
            setWordList(newWordList)
            setCurrent(newWord)
            setWordScramble(shuffle(newWord))
        } else {
            alert(`Great job! You've completed the game with ${score} points!`)
            resetGame()
        }
    }

    const resetGame = () => {
        setWordList(words)
        startNewGame()
        localStorage.removeItem('scrambleGameState')
    }

   return (
    <div>
        <h1>Scramble Game</h1>
        <div id="gameContainer">
            <button onClick={resetGame} className="actionButton">Start New Game</button>
            <p><strong>Scrambled Word:</strong> {wordScramble}</p>

            <form onSubmit={guessDealer}>
                <input
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    placeholder="Your guess"
                />
                <button type="submit" className="actionButton">Submit Guess</button>
            </form>

            <p>You have {pass} passes left!</p>
            <button onClick={passDealer} disabled={pass <= 0} className="actionButton">Pass</button>

            <div>
                <p>Score: {score} | Strikes: {strike}</p>
            </div>

            {strike >= 3 && (
                <div>
                    <p>Game Over! You scored {score} points.</p>
                    <button onClick={resetGame} className="actionButton">Try Again</button>
                </div>
            )}
        </div>
    </div>
);

}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<ScrambleGame />)
