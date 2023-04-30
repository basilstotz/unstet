#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

// utilty functions
function read(name){
    return fs.readFileSync(name,{encoding:'utf8', flag:'r'});
}

function write(name,data){
    fs.writeFileSync(name,data,{encoding:'utf8', flag:'w'});
}

function shell(command){
    //console.log(args);
    let opts= { encoding: 'utf8' };
    return execSync(command,[], opts);
}
// utility functions


const lineByLine = require('n-readlines');
const OSC = require('osc-js');



const config=JSON.parse(read('replay-conf.json'));
const file=config.file;
const hosts=config.hosts;
const port=config.port;

const options={
  type: 'udp4',         // @param {string} 'udp4' or 'udp6'
  open: {
    host: 'localhost',    // @param {string} Hostname of udp server to bind to
    port: 9010,          // @param {number} Port of udp server to bind to
    exclusive: false      // @param {boolean} Exclusive flag
  },
  send: {
    host: 'localhost',    // @param {string} Hostname of udp client for messaging
    port: 9000           // @param {number} Port of udp client for messaging
  }
}

const osc = new OSC({ plugin: new OSC.DatagramPlugin(options) })

//change here///////////////////////////////////////////////////////

osc.open() // bind udp socket to port 41234

const liner = new lineByLine(file);
let line;

let bundle={ time: -1 };


/*
{"time":39,"message":{"offset":24,"address":"/beamer4/video","types":",i","args":[32]}}
{"time":41,"message":{"offset":24,"address":"/beamer3/video","types":",i","args":[13]}}
{"time":2424,"message":{"offset":24,"address":"/beamer1/video","types":",i","args":[41]}}
{"time":1575,"message":{"offset":24,"address":"/beamer4/video","types":",i","args":[32]}}
{"time":1050,"message":{"offset":24,"address":"/beamer1/video","types":",i","args":[43]}}
{"time":1750,"message":{"offset":24,"address":"/beamer2/video","types":",i","args":[21]}}
*/

function play(){


    let video;
    let host;
    let address='/video';
    let options;

    if(bundle.time >= 0){

	//console.log(JSON.stringify(bundle.message));
	
	switch(bundle.message.address){
	case '/beamer1/video':
	    host=hosts[0];
	    break;
	case '/beamer2/video':
	    host=hosts[1];
	    break;
	case '/beamer3/video':
	    host=hosts[2];
	    break;
	case '/beamer4/video':
	    host=hosts[3];
	    break;
	}
	//host  = dest[bundle.message.args[1]-1];
	
        video = bundle.message.args[0];

	options = { send: { host: host, port: 9000}};
	msg = new OSC.Message(address,video);
	
	osc.send(msg ,options );
	console.log(JSON.stringify(msg) + ' -> ' +JSON.stringify(options));
    }
    
    if(line = liner.next()){
        bundle=JSON.parse(line.toString('ascii'));
	setTimeout(play,bundle.time);
    }else{
	osc.close();
	console.log('end of file reached');
    }
}

play();    
