import { createStore, applyMiddleware, compose } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import ReduxThunk from 'redux-thunk';

const initialState = {
  gameId: undefined,
  userToken: undefined,
  users: [],
  match_open: true,
  username: ''
};

function reducer(state = initialState, action) {
  switch (action.type) {
  case 'start_game':
    return { ...state, gameId: action.id};
  case 'set_game_id':
    return { ...state, gameId: action.id };
  case 'get_match_status':
    return { ...state, users: action.users, match_open: action.open };
  case 'join_match':
    return { ...state, token: action.token };
  case 'close_match':
    return { ...state, match_open: false };
  case 'set_game_token':
    return { ...state, userToken: action.token };
  case 'set_user_name':
    return { ...state, username: action.name };

  default:
    return state;
  }
}

export default createStore(reducer, compose(applyMiddleware(ReduxThunk), devToolsEnhancer()));

