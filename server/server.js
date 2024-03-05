const debug = require('debug')('integracao-node:server');
const http = require('http');
const https = require('https');
const app = require('./app');
const fs = require('fs');

const PORT = normalizePort(process.env.PORT || '3000');
app.set('port', PORT);

// let server;

if (process.env.AMBIENTE === 'production') {
    const options = {
        key: fs.readFileSync('privkey.pem'),
        cert: fs.readFileSync('fullchain.pem')
    };

    server = https.createServer(options, app);
} else {
    server = http.createServer(app);
}

server.listen(PORT, () => {
    console.log(`Ouvindo servidor na porta ${PORT}... https://127.0.0.1:${PORT}`);
});
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof PORT === 'string'
        ? 'Pipe ' + PORT
        : 'Port ' + PORT;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);

        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);

        default:
            throw error;
    }
}

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
