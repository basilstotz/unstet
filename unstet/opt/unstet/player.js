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


<<<<<<< HEAD
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
=======
//change here///////////////////////////////////////////////////////

let dest= [ "192.168.10.1","192.168.10.2","192.168.10.3","192.168.10.4" ];


//////////////////////////////////////


const osc = new OSC({ plugin: new OSC.DatagramPlugin() })
>>>>>>> c3ed76d2f24bdd2e1b834ae2ce5be1324001c188
osc.open() // bind udp socket to port 41234

/*
let dest= [ "192.168.10.1","192.168.10.2","192.168.10.3","192.168.10.4" ];
const hosts = [ '192.168.1.10','192.168.1.11','192.168.1.23','192.168.1.13'];
let file;
const myArgs = process.argv.slice(2);
if(myArgs[0]){
    file=myArgs[0];
}else{
    file='messages.txt';
}
*/

const liner = new lineByLine(file);
let line;

let bundle={ time: -1 };

<<<<<<< HEAD
/*
{"time":39,"message":{"offset":24,"address":"/beamer4/video","types":",i","args":[32]}}
{"time":41,"message":{"offset":24,"address":"/beamer3/video","types":",i","args":[13]}}
{"time":2424,"message":{"offset":24,"address":"/beamer1/video","types":",i","args":[41]}}
{"time":1575,"message":{"offset":24,"address":"/beamer4/video","types":",i","args":[32]}}
{"time":1050,"message":{"offset":24,"address":"/beamer1/video","types":",i","args":[43]}}
{"time":1750,"message":{"offset":24,"address":"/beamer2/video","types":",i","args":[21]}}
*/
=======
function play(){
>>>>>>> c3ed76d2f24bdd2e1b834ae2ce5be1324001c188

    let video;
    let host;
    let address;
    let options;

<<<<<<< HEAD
function play(){

    let video;
    let host;
    let address='/video';
    let options;

=======
>>>>>>> c3ed76d2f24bdd2e1b834ae2ce5be1324001c188
    if(bundle.time >= 0){

	//console.log(JSON.stringify(bundle.message));
	
<<<<<<< HEAD
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

=======
        address = bundle.message.address;
        video = bundle.message.args[0];

	host  = dest[bundle.message.args[1]-1];
>>>>>>> c3ed76d2f24bdd2e1b834ae2ce5be1324001c188
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
<<<<<<< HEAD

=======
//console.log('end of line reached');
>>>>>>> c3ed76d2f24bdd2e1b834ae2ce5be1324001c188
