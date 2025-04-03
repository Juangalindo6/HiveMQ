const mqtt = require('mqtt');

//-------------------------------------------
const sound = require('sound-play');
const path = require('path');

// Ruta absoluta de la canción
const filePath = path.join(__dirname, './assets/cancion.mp3');

sound.play(filePath)
  .then(() => console.log('Reproduciendo cancion.mp3...'))
  .catch(err => console.error('Error al reproducir:', err));
//-------------------------------------------


const options = {
  host: "1c3cf37bcc4545b2abfa4f5891832a1f.s1.eu.hivemq.cloud",
  port: 8883,
  protocol: "mqtts",
  username: "ServidorMQTT",
  password: "ServidorMQTT123"
};

const client = mqtt.connect(options);

client.on("connect", () => {
  console.log("Conectado a HiveMQ 🎉");

  client.subscribe("cubo1", (err) => {
    if (!err) {
      console.log("Suscrito a cubo1");
    }
  });

  setInterval(() => {
    const message = `Hola desde Node.js!`;
    client.publish("cubo1", message);
    console.log(`Mensaje enviado: ${message}`);
  }, 5000); 
});

client.on("message", (topic, message) => {
  console.log(`Mensaje recibido en ${topic}: ${message.toString()}`);
});
