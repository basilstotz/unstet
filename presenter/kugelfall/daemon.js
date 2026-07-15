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


function freeSocket(socket){
    socket.busy=false;
}

function random(laenge){
    return Math.floor(laenge*Math.random())
}

const osc = new OSC({ plugin: new OSC.DatagramPlugin(options) });

osc.on('open', message => {
    console.log('OSC-Server listening on port 9000');
});


function doit(beamer,clip){

    let clients=io.sockets.sockets;
    //console.log(clients);

    if(clients.size>0){
	// make a map of free sockets;
	let free= new Map();
	for (const [socketID, socket] of clients) {
	    if(!socket.busy)free.set(socketID,socket);
	}
	//trigger one of them
	if(free.size>0){
	    //console.log("free",free);
	    //let choose=random(free.size);
            let choose=Math.floor(free.size*beamer);
	    // not funny solution
	    let count=0;
	    let id;
	    let socket;
	    for (const [key, value] of free) {
		//console.log(`${count} => ${key} = ${value}`);
		if(count==choose){
		    id=key;
		    socket=value;
		}
		count++;
	    }

	    /*
	    let idArr=free.keys();
	    console.log("idArr",idArr);
	    let id=idArr[choose];
	    let socket=free.values()[choose]
*/
	    //console.log("id,socket",id,socket);
	    if(socket){
		socket.busy=true;
		setTimeout(freeSocket,1000,socket);
		io.to(id).emit('osc',clip);
		console.log(free.size+"/"+clients.size+" clients => emit to "+choose);
	    }else{
		console.log("socket not ready");
	    }
	}else{
	    console.log("no free client");
	}
    }else{
	console.log("no clients");
    }
    
    //console.log(clients.size,choose,id);
    //https://socket.io/docs/v3/emit-cheatsheet/
}
/*
osc.on('/bang', message => {
    //console.log('recieved osc-message: '+JSON.stringify(message));
    doit(Math.random(),Math.random());
});
*/
osc.on('/rawbang', message => {
    //console.log('recieved osc-message: '+JSON.stringify(message));
    let beamer=Math.random();
    let clip=Math.random();
    
    if(message.args[1])beamer=message.args[1];
    if(message.args[2])clip=message.args[2];
    doit(beamer,clip);
});


osc.open();
