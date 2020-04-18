import React from 'react';
import Match from './Match';
import Landing from './Landing';
import Game from './Game';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/:id/play/:token">
            <Game/>
          </Route>
          <Route path="/:id">
            <Match/>
          </Route>
          <Route path="/">
            <Landing/>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
