#!/usr/bin/env node


//https://github.com/adzialocha/osc-js                                                                                                      
const readline = require('readline');
const OSC = require('osc-js');
const Utils = require('./common.js');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
})
const osc = new OSC({ plugin: new OSC.DatagramPlugin() });

/*
function send(packet,options){
    osc.send(packet,options);
    if(verbose)console.log(Utils.serializePacket(packet)+" --> "+options.host+":"+options.port);
}
*/

//{ offset: 24, address: '/beamer1/video', types: ',i', args: [ 41 ] } 1683723690477

/*
let pos= [ [ 0,45], [140,90], [ 260,0], [45,45] ]; 
let x=0;
let y=45;

function iterate(ort){
    let x=ort[0];
    let y=ort[1];
    let fac=10;
    x+=fac*(Math.random()-0.5);
    if(x>180)x-=360;
    if(x<-180)x+=360;
    y+=fac*(Math.random()-0.5);
    if(y>180)y-=360;
    if(y<-180)y+=360;
    x=Math.round(x);
    y=Math.round(y);
    ort[0]=x
    ort[1]=y
}

function doit(){
    iterate(pos[0])
    iterate(pos[1])
    iterate(pos[2])
    iterate(pos[3])
}

setInterval(doit,100);
*/

let oldaddr='';

function trigger(addr){
    let  opts= { port: 5510, host: 'localhost' };
    let msg;
    msg = new OSC.Message(addr,1);    
    osc.send(msg,opts);
    setTimeout(() => {
	osc.send(new OSC.Message(addr,0),opts);
    },200);
}

rl.on('line', (line) => {
    Utils.forEachMessage(JSON.parse(line), (message,timestamp) => {
	let arg=message.args[0];
	let port=5510;
	let addr='/unstet/';
	let msg;
        switch(message.address){
	case '/beamer1/video':
	    addr+='beamer1/'+arg
	    break;
	case '/beamer2/video':
	    addr+='beamer2/'+arg
	    break;
	case '/beamer3/video':
	    addr+='beamer3/'+arg
	    break;
	case '/beamer4/video':
	    addr+='beamer4/'+arg
	    break;
	}
	trigger(addr);
    });
});

rl.once('close', () => {
    process.exit();
 });

