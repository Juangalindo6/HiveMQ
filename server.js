const mqtt = require('mqtt');
const sound = require('sound-play');
const path = require('path');

const filePath = path.join(__dirname, './assets/cancion.mp3');
let segundos = 0;
let timer = null;

// Función para iniciar el temporizador
function iniciarTemporizador(client) {
  segundos = 0;
  timer = setInterval(() => {
    segundos++;
    console.log(`Tiempo transcurrido: ${segundos} segundos`);

    if (segundos === 1) enviarMensaje(client, "cubo1", "Secuencia 1");
    if (segundos === 3) enviarMensaje(client, "cubo2", "Mensaje solo para cubo2");
    if (segundos === 5) enviarMensaje(client, "cubo1", "Secuencia 2");
    if (segundos === 7) enviarMensaje(client, "cubo2", "Otro mensaje para cubo2");
    if (segundos === 10) enviarMensaje(client, "cubo1", "Secuencia 3");

  }, 1000);
}

// Función para enviar mensajes a los tópicos
function enviarMensaje(client,topico, mensaje) {
  client.publish(topico, mensaje);
  console.log(`Mensaje enviado: "${mensaje}" a ${topico}`);
}

// Configuración de MQTT
const options = {
  host: "1c3cf37bcc4545b2abfa4f5891832a1f.s1.eu.hivemq.cloud",
  port: 8883,
  protocol: "mqtts",
  username: "ServidorMQTT",
  password: "ServidorMQTT123"
};

const client = mqtt.connect(options);

client.on("connect", () => {
  console.log("onectado a HiveMQ");

  client.subscribe(["cubo1", "cubo2"], (err) => {
    if (!err) {
      console.log("Suscrito a cubo1 y cubo2");

      iniciarTemporizador(client);
      sound.play(filePath)
        .then(() => {
          console.log('Reproduciendo cancion.mp3...');
          clearInterval(timer);
          console.log("Canción terminada");
        })
        .catch(err => console.error('Error al reproducir:', err));
    } else {
      console.error("Error al suscribirse a los tópicos", err);
    }
  });
});

