import React from 'react';
import HashLoader from 'react-spinners/HashLoader';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as actions from './actions';

export default function Landing(props) {

  const dispatch = useDispatch();
  const history = useHistory();
  const gameId = useSelector(state => state.gameId);

  if (gameId) {
    history.push(`/${gameId}`);
  }

  const startNewGame = () => {
    dispatch(actions.startNewGame());
  };
  
  return (
    <div className="match">
      <div className="window container">
        <div className="title-bar">
          <div className="title-bar-text">DAS BRETTSPIEL</div>
          <div className="title-bar-controls">
          </div>
        </div>
        <div className="window-body center">
          <p>Willkommen beim Brettspiel!</p>
          <button onClick={startNewGame}>Start new game</button>
        </div>
      </div>
    </div>
  );
}
