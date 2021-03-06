import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) {
  const squareClass = 'square' + (props.highlight ? ' highlight' : '');

  return (
    <button className = {squareClass} onClick = {props.onClick}>
      {props.value}
    </button>
  );
}

/*
class Square extends React.Component {
  render() {
    return (
      <button 
        className="square" 
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}
*/

function calculateWinner (squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  
  for (let i = 0; i < lines.length; ++i) {
    const[a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        name: squares[a],
        line: lines[i]
      };
    }
  }

  return {
    name: null,
    line: null
  };
}

class Board extends React.Component {
  renderSquare (i) {
    return (
      <Square 
        key = {i}
        highlight = {this.props.line && this.props.line.includes(i)}
        value = {this.props.squares[i]}
        onClick = {() => this.props.onClick(i)}
      />
    );
  }

  render () {
    let squares = [];
    let rows = [];
    let pos = 0;
    const size = 3;

    for (let i = 0; i < size; ++i) {
      squares = [];
      for (let j = 0; j < size; ++j) {
        //console.log (pos);
        squares.push (this.renderSquare(pos));
        //console.log(squares.length);
        pos++;
      }
      rows.push (<div key = {i} className = 'board-row'> {squares} </div>);
      //console.log(rows);
    }

    return (
      <div>
        {rows}
      </div>
    );

    /*return (
      <div>
        <div className = 'board-row'>
          {this.renderSquare (0)}
          {this.renderSquare (1)}
          {this.renderSquare (2)}
        </div>

        <div className = 'board-row'>
          {this.renderSquare (3)}
          {this.renderSquare (4)}
          {this.renderSquare (5)}
        </div>

        <div className = 'board-row'>
          {this.renderSquare (6)}
          {this.renderSquare (7)}
          {this.renderSquare (8)}
        </div>
      </div>
    );*/
  }
}

class Game extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      order: true,
    };
  }

  jumpTo (step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleClick (i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares).name || squares[i]) return;

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState ({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  setOrder () {
    this.setState ({
      order: !this.state.order
    });
  }

  render () {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const name = winner.name;
    const line = winner.line;

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
        
      let moveClassName = (this.state.stepNumber === move) ? 'move current' : 'move';
      return (
        <li key = {move}>
          <button className = {moveClassName} onClick = {() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    });

    if (!this.state.order) moves.reverse();

    let status;
    if (name) 
      status = 'Winner: ' + name;
    else if (!current.squares.includes(null)) 
      status = 'It\'s a draw';
    else 
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    let order = <button onClick = {() => this.setOrder(history)}> Change order </button>

    return (
      <div className = 'game'>
        <div className = 'game-board'>
          <Board 
            squares = {current.squares}
            onClick = {(i) => this.handleClick(i)}  
            line = {line}
          />
        </div>
        <div className = 'game-info'>
          <div> 
            {status}
          </div>
          <div>
            {order}
          </div>
          <ol>
            {moves}
          </ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render (
  <Game />,
  document.getElementById('root')
);