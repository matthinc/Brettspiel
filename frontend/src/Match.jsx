import React, { useEffect, useRef } from 'react';
import HashLoader from 'react-spinners/HashLoader';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch, useHistory } from 'react-router-dom';
import * as actions from './actions';

export default function Match(props) {

  const history = useHistory();
  const dispatch = useDispatch();
  const gameId = useSelector(state => state.gameId);
  const users = useSelector(state => state.users);
  const open = useSelector(state => state.match_open);
  const token = useSelector(state => state.token);
  const routeId = useRouteMatch('/:id').params.id;
  const nicknameRef = useRef();

  if (!gameId) {
    dispatch(actions.setGameId(routeId));
  }

  if (token && gameId) {
    window.location.href = `/${gameId}/play/${token}`;
  }

  useEffect(() => {
    if (gameId) {
      dispatch(actions.getMatchStatus(gameId));
    }
  }, [gameId]);

  const joinMatch = () => {
    const nickname = nicknameRef.current.value;

    // Rick roll
    if (nickname.toLowerCase() === 'marcel') {
      window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ?autoplay=1';
    }
    
    dispatch(actions.joinMatch(gameId, nickname));
  };

  const renderJoin = () => {
    if (token) {
      return <p className="already-joined">Already joined.</p>;
    } else {
      return (
        <div>
          <input type="text" placeholder="Nickname" ref={nicknameRef}/>
          <button className="ml-2" onClick={joinMatch}>Join Game</button>
        </div>
      );
    }
  };

  const renderUsers = () => {
    return (
      <div>
        <p className="mt-3">Users in this match:</p>
        <ul className="tree-view">
          {users.map(user => <li key={user}>{user}</li>)}
        </ul>
      </div>
      );
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
          <div className="join">
            {renderJoin()}
          </div>
          {renderUsers()}
        </div>
      </div>
    </div>
  );
}
