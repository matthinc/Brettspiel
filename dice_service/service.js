const express = require('express');
const mqtt = require('mqtt');
const axios = require('axios');

const client = mqtt.connect('mqtt://mosquitto');

const app = express();

client.on('connect', function () {
  console.log('Connected to MQTT');
});

app.post('/roll/:game/:user', (req, res) => {
  axios.get(`http://match_service:8000/${req.params.game}/${req.params.user}/name`)
    .then(data => {
      const { name } = data.data;
      const value = Math.floor(Math.random() * 6) + 1;

      const result = client.publish(`${req.params.game}/dice`, `${value}_${name}`,{ qos: 2 }, (err) => console.log(err));
      res.send(`OK - ${req.params.game}`);
    }).catch(error => console.log(error));
});

app.listen(8000);
