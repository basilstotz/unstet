#!/usr/bin/env node                                                                                    
const Unstet = require('./unstet.js').Unstet;
const OSC = require('osc-js');

// setup osc
const host = 'localhost';
const port = 9000;

const osc = new OSC({ plugin: new OSC.DatagramPlugin() });

//setup unstet
let teiler = [ 1, 2, 3, 5, 8, 13];
let phase = [ 8000, 13000, 21000, 34000 ];
let addon = [ 0, 0, 0, 0, 800,   1600,  2400,  4000 ]; 
let unstet = new Unstet( teiler, phase, addon );

// add osc output to event 'bang'
unstet.on( 'bang', () => {
    osc.send(new OSC.Message('/bang'), { host: host, port: port })
});

unstet.play();

