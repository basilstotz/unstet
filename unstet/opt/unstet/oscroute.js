#!/usr/bin/env node


//https://github.com/adzialocha/osc-js                                                                                                      
const OSC = require('osc-js');
const osc = new OSC({ plugin: new OSC.DatagramPlugin() });

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

function end(){
    console.log("usage: oscroute /pfad port [/pfad2 port2]...[/pfadn portn]  ip1 [ip2 ... ipn]");
    process.exit();
}

//const lineByLine = require('n-readlines');

let table=[];

const Args = process.argv.slice(2);

const path=process.env.HOME+'/.oscroute.rc';
//console.log(path);


if(Args[1]){
    for(i=0;i<Args.length;i++){
	if(Args[i].startsWith('/')){
	    let route=Args[i];
	    i++;
	    let dest=Args[i].split(":");
	    table.push( { route: route, ip: dest[0], port: dest[1] } )
	}
    }
    write(path,JSON.stringify(table));    
}else{
    if(fs.existsSync(path)){
	table=JSON.parse(read(path));
    }else{
	process.exit(1);
    }    
}


console.log(JSON.stringify(table,null,2));


/*
{"clock":1682961843314,"time":3405,"message":{"offset":32,"address":"/beamer/2/video","types":",is","args":[25,"sdfsdaf"]}}
*/

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
})


rl.on('line', (line) => {
    route(JSON.parse(line));
});

rl.once('close', () => {
    process.exit();
 });


function route(message){

    let response;
    let host;
    let port;
    let destAddress;
    
    for(let i=0;i<table.length;i++){
	if(message.address.indexOf(table[i].route)==0){
	    host=table[i].ip;
	    port=table[i].port;
	    if(table.length==1){
		destAddress=message.address;
	    }else{
		destAddress='/'+message.address.split('/').slice(3).join('/');
	    }
	    response = new OSC.Message(destAddress);
	    for(let j=0;j<message.args.length;j++){
		response.add(message.args[j]);
	    }
	    osc.send(response,{ port: port, host: host })
	    //console.log(JSON.stringify(message)+" --> "+host+":"+port+" "+JSON.stringify(response));
	    console.log(JSON.stringify(response)+" -> "+host+":"+port);	
	    break;
	}
    }    
}
    
    