import React, { createRef, useState } from 'react';

const pieceColors = [
  '#ff00ff',
  '#008800',
  '#0000ff',
  '#ffAA00',
  '#666666'
];

export default function Board({ mouseMove, cursors, pieces, movePiece, username }) {

  const boardRef = createRef();
  const [movingPiece, setMovingPiece] = useState();

  const handleMouseMove = (event) => {
    const rect = boardRef.current.getBoundingClientRect();
    // Relative position to Element
    const relX = event.clientX - rect.left;
    const relY = event.clientY - rect.top;
    // Convert to percentage
    const x = relX / rect.width;
    const y = relY / rect.height;
    // Propagate
    mouseMove(x, y);

    if (movingPiece) {
      movePiece(movingPiece, x, y);
    }
  };

  const renderCursors = () => {
    return Object.entries(cursors).map(c => {
      const name = c[0];
      const pos = c[1];
      return (
        <div key={name} className="cursor anim" style={{ top: `${pos.y * 100}%`, left: `${pos.x * 100}%` }}>
          {name}
        </div>
      );
    });
  };

  const renderPieces = () => {
    return Object.entries(pieces).map((c, i) => {
      const name = c[0];
      const pos = c[1];
      const style = { backgroundColor: pieceColors[i % pieceColors.length], top: `${pos.y * 100}%`,left: `${pos.x * 100}%` };

      const move = () => {
        if (!movingPiece) {
          if (name == username) setMovingPiece(name);
        } else {
          setMovingPiece(undefined);
        }
      };
      
      return (
        <div key={name} className={name !== movingPiece ? 'anim-pience' : 'piece'} style={style} onClick={move}>
          {name.substring(0,2)}
        </div>
      );
    });
  };
  
  return (
    <div>
      <img
        ref={boardRef}
        onClick={() => setMovingPiece(undefined)}
        onMouseMove={handleMouseMove} src="/board.jpg" width="100%"/>
      {renderCursors()}
      {renderPieces()}
    </div>
  );
}
