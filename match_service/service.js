const express = require('express');
const uuid = require('uuid');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser());

const matches = {};

function matchExists(id) {
  return matches[id] !== undefined;
}

app.get('/', (req, res) => {
  res.send('Match Service OK');
});

app.get('/new', (req, res) => {
  const matchId = uuid.v4();

  // Create match
  matches[matchId] = {
    created: new Date(),
    users: {},
    open: true
  };
  
  res.send({ id: matchId });
});

app.get('/:id/status', (req, res) => {
  if (!matchExists(req.params.id)) {
    res.sendStatus(400);
    return;
  }

  const match = matches[req.params.id];
  
  const userNames = Object.entries(match.users)
        .map(user => user[1].name);

  res.json({
    users: userNames,
    open: match.open
  });
});

app.post('/:id/close', (req, res) => {
  if (!matchExists(req.params.id)) {
    res.sendStatus(400);
    return;
  }
  matches[req.params.id].open = false;
  res.json({ ok: true });
});

app.post('/:id/join', (req, res) => {
  if (!matchExists(req.params.id) || !matches[req.params.id].open) {
    res.sendStatus(400);
    return;
  }
  const userToken = uuid.v4().substring(0,5);
  matches[req.params.id].users[userToken] = {
    name: req.body.name
  };
  res.json({ ok: true, token: userToken });
});

app.get('/:id/:user/validate', (req, res) => {
  if (!matchExists(req.params.id)) {
    res.sendStatus(400);
    return;
  }
  res.json({ valid: matches[req.params.id].users[req.params.user] !== undefined });
});

app.get('/:id/:user/name', (req, res) => {
  if (!matchExists(req.params.id)) {
    res.sendStatus(400);
    return;
  }
  res.json({ name: matches[req.params.id].users[req.params.user].name });
});

app.listen(8000);
