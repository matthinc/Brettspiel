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

  if (!open && gameId) {
    history.push(`/${gameId}/play/${token}`);
  }

  useEffect(() => {
    let interval;
    if (gameId) {
      interval = window.setInterval(() => dispatch(actions.getMatchStatus(gameId)), 2500);
    }
    return () => interval && window.clearInterval(interval);
  }, [gameId]);

  const joinMatch = () => {
    const nickname = nicknameRef.current.value;

    // Rick roll
    if (nickname.toLowerCase() === 'marcel') {
      window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ?autoplay=1';
    }
    
    dispatch(actions.joinMatch(gameId, nickname));
  };

  const closeMatch = () => {
    // Only allow this action when user has joined the game
    if (token)
      dispatch(actions.closeMatch(gameId));
  };

  const renderJoin = () => {
    if (token) {
      return <p className="already-joined">Already joined.</p>;
    } else {
      return (
        <div>
          <input placeholder="Nickname" ref={nicknameRef}/>
          <button onClick={joinMatch}>Join Game</button>
        </div>
      );
    }
  };

  const renderUsers = () => {
    if (users.length === 0) {
      return (
        <div className="loader">
          Waiting for players to join
          <HashLoader size="20" color="#33ffff" css="margin: 20px auto"/>
        </div>
      );
    } else {
      return (
        <div className="loader">
          <u>Players in this match:</u>
          {users.map(user => <div key={user} className="user">{user}</div>)}
          <HashLoader size="20" color="#33ffff" css="margin: 20px auto"/>
        </div>
      );
    }
  };
  
  return (
    <div className="match">
      <div className="container">
        <div className="title">
          DAS Brettspiel
        </div>
        <div className="join">
          {renderJoin()}
        </div>
        {renderUsers()}
        <button className="start-game" onClick={closeMatch}>Start game</button>
      </div>
    </div>
  );
}
