const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

let bitacoraRacionamientos = [];

app.get('/racionamientos', (req, res) => {
    res.json({
        zona: "Los Hornos, Palo Negro",
        total: bitacoraRacionamientos.length,
        registro: bitacoraRacionamientos
    });
});

io.on('connection', (socket) => {
    console.log('🟢 Un usuario se ha conectado al radar de alertas.');

    socket.on('nuevo-reporte', (data) => {
        const nuevoRegistro = {
            id: bitacoraRacionamientos.length + 1,
            vecino: data.vecino || "Vecino",
            horaCorte: data.horaCorte || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            fecha: new Date().toLocaleDateString(),
            comentario: data.comentario || "Sin observaciones"
        };

        bitacoraRacionamientos.unshift(nuevoRegistro);
        console.log(`⚡ [ALERTA EN VIVO] Corte reportado a las ${nuevoRegistro.horaCorte} por ${nuevoRegistro.vecino}`);

        io.emit('alerta-global', nuevoRegistro);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Servidor en tiempo real activo en http://localhost:${PORT}`);
});