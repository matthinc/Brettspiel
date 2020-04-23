import React, { useEffect, useState, useCallback, useRef } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch, useHistory } from 'react-router-dom';
import update from 'immutability-helper';
import * as actions from './actions';
import Board from './Board';
import Dice from './Dice';
import Window from './Window';
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
  const [diceHistory, setDiceHistory] = useState([]);

  // Workaround
  const piecesRef = useRef();
  piecesRef.current = pieces;

  // Workaround
  const usernameRef = useRef();
  usernameRef.current = username;

  // Workaround
  const messageManagerRef = useRef();
  messageManagerRef.current = messageManager;

  // Workaround
  const diceHistoryRef = useRef();
  diceHistoryRef.current = diceHistory;

  // Workaround
  const gameIdRef = useRef();
  gameIdRef.current = gameId;

  const onMqttMessage = useCallback((message) => {
    const payload = message.payloadString;
    // Dice movement
    if (message.topic.endsWith('/dice')) {
      const fields = payload.split('_');
      setDiceNumber(fields[0]);
      const newHistory = [`${fields[1]} (${fields[0]})`, ...diceHistoryRef.current];
      setDiceHistory([newHistory[0]]);
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
    // New player
    if (message.topic.endsWith('/new')) {
      // Send current position
      const username = usernameRef.current;
      const userPiece = piecesRef.current[username];

      messageManagerRef.current.sendPiece(username, userPiece.x, userPiece.y);

      // Load new users
      dispatch(actions.getMatchStatus(gameIdRef.current));
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
    if (!Object.keys(pieces).length) {
      const initialPieces = {};
      let index = 0;
      for (let user of users) {
        initialPieces[user] = { x: (index % 3) * 0.05 + 0.06, y: 0.75 + Math.floor(index / 3) * 0.05};
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

      if (!messageManager) {
        setMessageManager(new MessageManager(gameId, token, onMqttMessage));
      }
    }
  }, [gameId, token]);

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
    <div className="game">
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6">
            <Window title="Brettspiel.exe" className="noselect">
              <Board pieces={pieces} cursors={cursors} mouseMove={mouseMove} username={username} movePiece={movePiece}/>
            </Window>
          </div>
          <div className="col-md-6">
            <Window title="Dice.exe">
              <p>Playing as {username}</p>
              <button className="mb-3" onClick={rollDice}>Roll dice</button>
              <Dice number={diceNumber}/>
              <ul className="tree-view mt-3">
                { diceHistory.map(h => <li key={h}>{h}</li>)}
              </ul>
            </Window>
            <Window className="mt-2" title="Players.exe">
              <span className="mr-2">Copy this link to invite players:</span>
              <pre><code>{`https://${window.location.host}/${gameId}`}</code></pre>
              <p className="mt-3">Players in this game:</p>
              <ul className="tree-view mt-3">
                { users.map(h => <li key={h}>{h}</li>)}
              </ul>
            </Window>
          </div>
        </div>
      </div>
    </div>
  );
}
