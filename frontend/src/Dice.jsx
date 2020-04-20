import React from 'react';

export default function Dice({ number, onClick }) {
  return (
    <div className="dice">
      <img onClick={onClick} src={`/d-${number}.svg`}/>
    </div>
  );
}
