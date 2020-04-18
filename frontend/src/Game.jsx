import React, { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch, useHistory } from 'react-router-dom';
import * as actions from './actions';
import Paho from 'paho-mqtt';

export default function Game(props) {
  
  const dispatch = useDispatch();

  const token = useSelector(state => state.userToken);
  const gameId = useSelector(state => state.gameId);
  const routeParams = useRouteMatch('/:id/play/:token').params;
  const routeId = routeParams.id;
  const username = useSelector(state => state.username);
  const routeToken = routeParams.token;

  if (!gameId) {
    dispatch(actions.setGameId(routeId));
  }

  if (!token) {
    dispatch(actions.setGameToken(routeToken));
  }
  
  useEffect(() => {
    if (gameId) {
      dispatch(actions.getMatchStatus(gameId));
    }
    if (gameId && token) {
      dispatch(actions.setUserName(gameId, token));
    }
  }, [gameId, token]);

  //TODO: Deleteme
  const mqtt = new Paho.Client("ws://localhost:9000/cursor", "bcli");
  mqtt.onMessageArrived = message => console.log(message);
  mqtt.connect({ onSuccess: () => mqtt.subscribe("a")});

  return (
    <div className="game">
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6">
            <img src="/board.jpg" width="100%"/>
          </div>
          <div className="col-md-6">
            <h2 onClick={() => mqtt.publish("a","b")}>Playing as {username}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
