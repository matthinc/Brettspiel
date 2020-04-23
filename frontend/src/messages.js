import Paho from 'paho-mqtt';

const MQTT_URL = process.env.NODE_ENV === 'development' ? 'ws://localhost:9000/msg' : `wss://${window.location.host}/msg`;

export default class MessageManager {
  constructor(game, token, callback) {
    this.game = game;
    this.token = token;
    this.client = new Paho.Client(MQTT_URL, `${token}`);

    this.client.onMessageArrived = callback;
    this.connected = false;

    this.client.connect({
      onSuccess: () => {
        this.client.subscribe(`${game}/cursor`);
        this.client.subscribe(`${game}/piece`);
        this.client.subscribe(`${game}/dice`);
        this.client.subscribe(`${game}/new`);
        this.connected = true;

        // New player
        this.client.publish(`${this.game}/new`, `no_data`, 0);
      }
    });
  }

  isConnected() {
    return this.connected;
  }

  close() {
   // this.client.close();
  }

  sendCursor(username, x, y) {
    if (this.connected) {
      x = String(x).substring(0,4);
      y = String(y).substring(0,4);
      this.client.publish(`${this.game}/cursor`, `${x}_${y}_${username}`, 0);
    }
  }

  sendPiece(piece, x, y) {
    if (this.connected) {
      x = String(x).substring(0,4);
      y = String(y).substring(0,4);
      this.client.publish(`${this.game}/piece`, `${x}_${y}_${piece}`, 0);
    }
  }
}
