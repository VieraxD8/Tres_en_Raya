import { useState } from "react"
import confetti from "canvas-confetti"
import { Square } from "./components/Square.jsx"
import { TURNS } from "../constants.js"
import { checkWinner, checkEndGame } from "./logic/board.js"
import WinnerModal from "./components/WinnerModal.jsx"




function App() {

  const [board, setBoard] = useState( () => {
    const boardFromStorage = window.localStorage.getItem('board')
    if(boardFromStorage) return JSON.parse(boardFromStorage)
    return Array(9).fill(null)
    
  })

  const [turn, setTurn] = useState ( () => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ??  TURNS.X
  
  })
  const [winner, setWinner] = useState(null) // null es que no hay un ganador, false hay un empate



  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }


  

  const updateBoard = (index) => {
    //no actualizamos esta posicion
    //si ya tiene algo
    if(board[index] || winner) return
    //actualizar el tablero
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    //cambiar el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)

    //guardar aqui partida
    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', newTurn)

    // revisar si hay un ganador

    const newWinner = checkWinner(newBoard)

    if(newWinner){
      confetti()
      setWinner(newWinner)
    }else if(checkEndGame(newBoard)) {
      setWinner(false) // empate 
    }

  }

  return (
    <main className="board">
      <h1>TRES EN RAYA</h1>
      <button onClick={resetGame}>Reset del juego</button>
      <section className="game">
        {
          board.map((square, index) => {
            return (
              <Square
                key={index}
                index={index}
                updateBoard={updateBoard}
              >
                  {square}
              </Square>
            )
          })
        }


      </section>


      <section className="turn">  
        <Square isSelected={turn === TURNS.X} >{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      <section>

      </section>
        
        <WinnerModal 
          resetGame={resetGame}
          winner={winner}
        
        />

    </main>
  )
}

export default App
