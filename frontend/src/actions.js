import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:9000' : '';

/*
  REDUX actions
*/

export function setGameId(id) {
  return { type: 'set_game_id', id };
}

export function setGameToken(token) {
  return { type: 'set_game_token', token };
}

export function startNewGame() {
  return dispatch => {
    axios.get(`${BASE_URL}/match/new`).then(data => {
      dispatch({ type: 'start_game', id: data.data.id });
    });
  };
}

export function joinMatch(id, name) {
  return dispatch => {
    axios.post(`${BASE_URL}/match/${id}/join`, { name }).then(data => {
      dispatch({ type: 'join_match', token: data.data.token });
    });
  };
}

export function getMatchStatus(id) {
  return dispatch => {
    axios.get(`${BASE_URL}/match/${id}/status`).then(data => {
      dispatch({ type: 'get_match_status', users: data.data.users, open: data.data.open });
    });
  };
}

export function closeMatch(id) {
  return dispatch => {
    axios.post(`${BASE_URL}/match/${id}/close`).then(data => {
      dispatch({ type: 'close_match' });
    });
  };
}

export function setUserName(id, uid) {
  return dispatch => {
    axios.get(`${BASE_URL}/match/${id}/${uid}/name`).then(data => {
      dispatch({ type: 'set_user_name', name: data.data.name });
    });
  };
}

export function rollDice(id, uid) {
  return dispatch => {
    axios.post(`${BASE_URL}/dice/roll/${id}/${uid}`).then(data => {
      dispatch({ type: 'roll_dice' });
    });
  };
}



