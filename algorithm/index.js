#!/usr/bin/env node                                                                                    
const Unstet = require('./unstet.js').Unstet;
const OSC = require('osc-js');


let autoplay=true;
let port=9000;
let host='localhost';
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
	port=process.argv[i+1];
	break;
    case '-h':
	host=process.argv[i+1];
	break;
    }
}

console.log(autoplay,host,port);

//process.exit();

const osc = new OSC({ plugin: new OSC.DatagramPlugin() });
osc.open( { host: '0.0.0.0', port: port+1 } );

function sendOSC(...args){
    osc.send(new OSC.Message(...args),{ host: host, port: port });
}

//setup unstet
let teiler = [ 1, 2, 3, 5, 8, 13];
//let phase = [ 8000, 13000, 21000, 34000 ];
//let addon = [ 0, 0, 0, 0, 800,   1600,  2400,  4000 ]; 
let phase = [ 0, 0, 0, 0];
let addon = [ 5000,8000,13000,21000,34000,55000 ]; 
let unstet = new Unstet( teiler, phase, addon );

//osc.send(new OSC.Message('/hello'),{ host: host, port: port })

setInterval( () => { sendOSC('/hello',myIP,port+1) },5000);
//setInterval( () => {osc.send(new OSC.Message('/hello'),{ host: host, port: port })},5000);

// send bangs
unstet.on( 'bang', () => { sendOSC('/bang')});
unstet.on( 'rawbang', (value, max ) => { sendOSC('rawbang',value, max )});
unstet.on( 'periodended', () => { sendOSC('/periodend')});
unstet.on( 'playstart', () => { sendOSC('/playstart')});
unstet.on( 'playstop', () => { sendOSC('/playstop')});

// receive commands
osc.on('/play', () => { unstet.play() });
osc.on('/stop', () => { unstet.stop() });
osc.on('/pause', () => { unstet.pause() });
//osc.on('/teiler', (...args) => { unstet.setTeiler(...args) };
//osc.on('/periode', (...args) => { unstet.setPeriode(...args) };
//osc.on('/variation', (...args) => { unstet.setVariation(...args) };


if(autoplay)unstet.play()



/*
//https://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
// Source - https://stackoverflow.com/a/9542157
// Posted by Xedecimal, modified by community. See post 'Timeline' for change history
// Retrieved 2026-07-04, License - CC BY-SA 4.0

const dns = require('node:dns');
const os = require('node:os');

const options = { family: 4 };

dns.lookup(os.hostname(), options, (err, addr) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`IPv4 address: ${addr}`);
  }
});

console.log(os.hostname());
*/

/*
// Source - https://stackoverflow.com/a/8440736
// Posted by nodyou, modified by community. See post 'Timeline' for change history
// Retrieved 2026-07-04, License - CC BY-SA 4.0

//'use strict';

const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
        if (net.family === familyV4Value && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}

console.log(results);
*/
