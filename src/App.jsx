import { useEffect, useState } from "react";
import "./App.css";

//Square
function Square({ style, onSquareClick, value }) {
  const styleX = {
    color: "#ff004c", // red-pink neon
    textShadow: "0 0 10px #ff004c",
    fontWeight: "bold",
  };

  const styleO = {
    color: "#00aaff", // blue neon
    textShadow: "0 0 10px #00aaff",
    fontWeight: "bold",
  };

  let valueStyles = value == "X" ? styleX : value == "O" ? styleO : {};

  return (
    <button
      onClick={onSquareClick}
      className="square"
      style={{ ...style, ...valueStyles }}
    >
      {value}
    </button>
  );
}

//Calculate the winner
function calculateWinner(squares) {
  const ways = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < ways.length; i++) {
    let [a, b, c] = ways[i];
    if (squares[a] && squares[a] == squares[b] && squares[a] == squares[c]) {
      return {
        value: squares[a],
        winPath: [a, b, c],
      };
    }
  }
  return null;
}

function FullBoard() {
  const [winPath, setWinPath] = useState(null);
  const [toggler, setToggler] = useState(false);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [coordinates, setCoordinates] = useState(Array(9));

  let squares = history[currentMove];
  const xNext = !(currentMove % 2);
  const handleClick = (i) => {
    if (squares[i] || calculateWinner(squares)) return;
    const col = (i % 3) + 1;
    const row = i - (i % 3) == 0 ? 1 : i - (i % 3) == 3 ? 2 : 3;
    const coord = [...coordinates];
    coord[currentMove] = { row, col };
    setCoordinates([...coord]);
    const newSquares = squares.slice();
    newSquares[i] = xNext ? "X" : "O";
    setCurrentMove(currentMove + 1);
    const saveSquaresHistory = history.slice(0, currentMove + 1);
    setHistory([...saveSquaresHistory, newSquares]);
  };

  const winner = calculateWinner(squares);

  useEffect(() => {
    if (winner) setWinPath(winner.winPath);
    if (!winner) setWinPath(null);
  }, [winner]);

  const jump = (index) => {
    setCurrentMove(index);
  };

  const moves = history.map((squares, index) => {
    return index == currentMove ? (
      <li key={index}>You are at move #{index}</li>
    ) : index > currentMove ? null : (
      <li key={index}>
        <button onClick={() => jump(index)} className="moveButton">
          {!index
            ? "Go to start"
            : `Go to move #${index} with coordinats (${coordinates[index].row}, ${coordinates[index].col})`}
        </button>
      </li>
    );
  });

  const fromWinPath = (index) => {
    return winPath && winPath.includes(index);
  };

  const reverseMoves = [...moves].reverse();

  let board = Array(3);
  let boardRow = Array(3);

  const reverseOrder = () => {
    setToggler(!toggler);
  };

  const winStyle = {
    background: "linear-gradient(135deg, #ff004c, #7b00ff, #006aff)",
    color: "white",
    border: "none",
    boxShadow:
      "0 0 18px rgba(123, 0, 255, 0.8), 0 0 30px rgba(0, 106, 255, 0.6)",
    transform: "scale(1.05)",
    transition: "transform 0.2s ease, box-shadow 0.3s ease",
  };

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      boardRow[j] = (
        <Square
          style={fromWinPath(j + i * 3) ? winStyle : {}}
          key={j + i * 3}
          onSquareClick={() => handleClick(j + i * 3)}
          value={squares[j + i * 3]}
        />
      );
    }
    board[i] = [...boardRow];
  }

  const gameStatus = winner ? winner.value + " is winner" : "No winner yet";
  const playerStatus = winner ? "Game ends" : xNext ? "X" : "O";

  return (
    <div className="fullBoard">
      <div className="stats">
        <p className="states">
          <span>Game State : </span> {gameStatus}
        </p>
        <div className="sectionSeparator"></div>
        <p className="states">
          <span>Next Player : </span>
          {playerStatus}
        </p>
      </div>
      <div className="gameBoard">
        <div className="board">{board}</div>
      </div>
      <div className="gameNavigation">
        <ol className="gameMoves">{toggler ? reverseMoves : moves}</ol>
        <button onClick={reverseOrder} className="toggleButton">
          Toggle
        </button>
      </div>
    </div>
  );
}

//App
export default function App() {
  return <FullBoard />;
}
