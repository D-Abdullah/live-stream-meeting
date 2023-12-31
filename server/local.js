/*jshint esversion: 6 */
/*jshint node: true */
"use strict";

require('dotenv').config();

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: process.env.DOMAIN //allow only the specified domain to connect
    }
});
const listner = server.listen(process.env.PORT, function() {
	console.log('Listening on', listner.address().port);
});

require('./socket')(io);

app.get('/', function (req, res) {
	res.send('Ok');
});