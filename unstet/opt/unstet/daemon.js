#!/usr/bin/env node

// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html


// Using express: http://expressjs.com/
var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 3000, listen);

app.use(express.static('public'));

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}


// https://stackoverflow.com/questions/64725626/how-to-fix-400-error-bad-request-in-socket-io
var io = require('socket.io')(server,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
         credentials: true
    },
    allowEIO3: true
});

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  function (socket) {

        console.log("We have a new client: " + socket.id);
      
        socket.on('disconnect', function() {
          console.log('Client '+ socket.id + ' has disconnected');
        });

  }
);


//https://github.com/adzialocha/osc-js
const OSC = require('osc-js');

const options = {
  type: 'udp4',         // @param {string} 'udp4' or 'udp6'
  open: {
    host: '0.0.0.0',    // @param {string} Hostname of udp server to bind to
    port: 9000,          // @param {number} Port of udp server to bind to
    exclusive: false      // @param {boolean} Exclusive flag
  }
}

console.log('OSC-Server litening on port 9000');

const osc = new OSC({ plugin: new OSC.DatagramPlugin(options) });
osc.open();


osc.on('*', message => {
    console.log('recieved osc-message: '+message);
    io.sockets.emit('osc',message);
});

