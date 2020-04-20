import React, { useEffect, useState, useCallback, useRef } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch, useHistory } from 'react-router-dom';
import update from 'immutability-helper';
import * as actions from './actions';
import Board from './Board';
import Dice from './Dice';
import MessageManager from './messages';

export default function Game(props) {

  const dispatch = useDispatch();

  const token = useSelector(state => state.userToken);
  const users = useSelector(state => state.users);
  const gameId = useSelector(state => state.gameId);
  const routeParams = useRouteMatch('/:id/play/:token').params;
  const routeId = routeParams.id;
  const username = useSelector(state => state.username);
  const routeToken = routeParams.token;

  const [messageManager, setMessageManager] = useState(undefined);
  const [cursors, setCursors] = useState({});
  const [pieces, setPieces] = useState({});
  
  const [diceNumber, setDiceNumber] = useState(1);
  const [diceName, setDiceName] = useState(undefined);

  // Workaround
  const piecesRef = useRef();
  piecesRef.current = pieces;

  // Workaround
  const usernameRef = useRef();
  usernameRef.current = username;

  const onMqttMessage = useCallback((message) => {
    const payload = message.payloadString;
    // Dice movement
    if (message.topic.endsWith('/dice')) {
      const fields = payload.split('_');
      setDiceNumber(fields[0]);
      setDiceName(fields[1]);
    }
    // Cursor movement
    if (message.topic.endsWith('/cursor')) {
      const fields = payload.split('_');
      if (fields[2] === usernameRef.current) return;
      setCursors({ ...cursors, [fields[2]]: { x: Number(fields[0]), y: Number(fields[1]) }});
    }
    // Piece movement
    if (message.topic.endsWith('/piece')) {
      const fields = payload.split('_');
      if (fields[2] === usernameRef.current) return;
      setPieces(update(piecesRef.current, { [fields[2]]: { $set: { x: Number(fields[0]), y: Number(fields[1]) } } }));
    }
  }, [pieces, cursors]);

  if (!gameId) {
    dispatch(actions.setGameId(routeId));
  }

  if (!token) {
    dispatch(actions.setGameToken(routeToken));
  }

  // Load game pieces initially
  useEffect(() => {
    if (!Object.keys(pieces).lengh) {
      const initialPieces = {};
      let index = 0;
      for (let user of users) {
        initialPieces[user] = { x: (index % 3) * 0.05 + 0.03, y: 0.75 + Math.floor(index / 3) * 0.05};
        index++;
      }
      setPieces(initialPieces);
    }
  }, [users]);
  
  useEffect(() => {
    if (gameId) {
      dispatch(actions.getMatchStatus(gameId));
    }
    if (gameId && token) {
      dispatch(actions.setUserName(gameId, token));
      setMessageManager(new MessageManager(gameId, token, onMqttMessage));
    }
  }, [gameId, token, username]);

  const mouseMove = (x, y) => {
    if (messageManager) {
      messageManager.sendCursor(username, x, y);
    }
  };

  const movePiece = (piece, x, y) => {
    setPieces({ ...pieces, [piece]: { x, y } });
    if (messageManager) {
      messageManager.sendPiece(piece, x, y);
    }
  };

  const rollDice =() => {
    dispatch(actions.rollDice(gameId, token));
  };

  return (
    <div className="game noselect">
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6">
            <Board pieces={pieces} cursors={cursors} mouseMove={mouseMove} username={username} movePiece={movePiece}/>
          </div>
          <div className="col-md-6">
            <h2>Playing as {username}</h2>
            <p>Click to roll. {diceName && <p>Last rolled by {diceName}</p>}</p>
            <Dice onClick={rollDice} number={diceNumber}/>
          </div>
        </div>
      </div>
    </div>
  );
}
