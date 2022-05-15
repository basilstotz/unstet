#!/usr/bin/env node

const lineByLine = require('n-readlines');
const OSC = require('osc-js');


const options = {
  type: 'udp4',
  open: {
    host: 'localhost',
    port: 9010,
    exclusive: false
  },
  send: {
    host: 'localhost', 
    port: 9000
  }
}



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
let lineNumber = 0;
let bundle={ time: -1 };



function play(){
    if(bundle.time >= 0){

	//console.log(hosts[bundle.message.args[1]] + ':' + JSON.stringify(bundle.message));
	console.log(JSON.stringify(bundle.message));
       m=new OSC.Message(bundle.message.address,bundle.message.args[0]);
	osc.send(m , { host: 'localhost', hostport: 9000 });
    }
    
    if(line = liner.next()){
        bundle=JSON.parse(line.toString('ascii'));
	setTimeout(play,bundle.time);
    }else{
	osc.close();
    }
}

play();    
console.log('end of line reached');
