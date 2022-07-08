#!/usr/bin/env node

//https://github.com/adzialocha/osc-js

let port;

const Args = process.argv.slice(2);
if(Args[0]){
    port=Args[0];
}else{
    port=9001;
}


//########################################################

const OSC = require('osc-js');
const options = { open: { host: '0.0.0.0', port: port }};
const osc = new OSC({ plugin: new OSC.DatagramPlugin(options) });

var init = true;
var last;

osc.open();
console.log('recorder listening on localhost:' + port);

osc.on('*', message => {

    let diff,now,bundle;
    
    now = new Date().getTime();    

    if(init){
	diff = 100; init = false;
    }else{
        diff = now - last;
    }
    
    last = now;
    
    bundle= { time: diff, message: message };
    process.stdout.write(JSON.stringify(bundle)+'\n');
    
});

