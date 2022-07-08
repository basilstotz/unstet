#!/usr/bin/env node

const lineByLine = require('n-readlines');
const OSC = require('osc-js');


//change here///////////////////////////////////////////////////////

let dest= [ "192.168.10.1","192.168.10.2","192.168.10.3","192.168.10.4" ];


//////////////////////////////////////


const osc = new OSC({ plugin: new OSC.DatagramPlugin() })
osc.open() // bind udp socket to port 41234


const hosts = [ '192.168.1.10','192.168.1.11','192.168.1.23','192.168.1.13'];

let file;
const myArgs = process.argv.slice(2);
if(myArgs[0]){
    file=myArgs[0];
}else{
    file='messages.txt';
}

const liner = new lineByLine(file);
let line;

let bundle={ time: -1 };

function play(){

    let video;
    let host;
    let address;
    let options;

    if(bundle.time >= 0){

	//console.log(JSON.stringify(bundle.message));
	
        address = bundle.message.address;
        video = bundle.message.args[0];

	host  = dest[bundle.message.args[1]-1];
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
    }
}

play();    
//console.log('end of line reached');
