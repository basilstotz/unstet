#!/usr/bin/env node                                                                                    
//const Unstet = require('./unstet.js').Unstet;
const OSC = require('osc-js');


let autoplay=true;
//send
let outPort=9000;
let host='localhost';
//listen
let inPort=9002;


let myIP='127.0.0.1';

//let shift=0;
for(let i=2;i<process.argv.length;i++){
    let item=process.argv[i];
    switch(item){
    case '-m':
	myIP=process.argv[i+1];
	break;
    case '-n':
	autoplay=false;
	break;
    case '-p':
	outPortort=process.argv[i+1];
	break;
    case '-h':
	host=process.argv[i+1];
	break;
    }
}

console.log(autoplay,host,outPort);

//process.exit();

const osc = new OSC({ plugin: new OSC.DatagramPlugin() });
osc.open( { host: '0.0.0.0', port: inPort } );

function sendOSC(...args){
    osc.send(new OSC.Message(...args),{ host: host, port: outPort });
}

function blender(factor,first,second){
    return first*factor+(1-factor)*second;
}

function mapper(x, x1, x2, y1, y2, clip=false) {
    let y = y1 + ((x - x1) * (y2 - y1)) / (x2 - x1);
    if(clip){
        if(y>y2)y=y2;
        if(y<y1)y=y1;
    }
    return y
}


//utility sendosc( host, port, address, ...args )
osc.on('/rawbang', (message) => {
    //console.log(message);
    let args=message.args;
    let ch=Math.floor(args[4]*8)+1;
    let msg = new OSC.Message('/aed/'+ch);
    let out=[];
    out[0]=mapper(args[1],0,1,0,300,true);
    out[1]=mapper(args[2],0,1,0,90,true);
    out[2]=mapper(args[3],0,1,0,3);
    for(let i=0;i<out.length;i++)msg.add(out[i]);
    osc.send(msg, { host: host, port: outPort } );
});


