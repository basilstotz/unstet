#!/usr/bin/env node

const Unstet = require('./unstet.js');


//import { OSC } from "osc-js"

//import pkg from 'osc-js';
//const { OSC } = pkg;

const OSC=require('osc-js');


/*
// Example usage:
const numbers = [1, 2, 3];
console.log(getPermutations(numbers));
[
  [1, 2, 3],
  [1, 3, 2],
  [2, 1, 3],
  [2, 3, 1],
  [3, 1, 2],
  [3, 2, 1]
]
*/
/*
function getPermutations(arr) {
  // Base case: if array has 0 or 1 elements, return it wrapped in an array
  if (arr.length <= 1) return [arr];
  
  const result = [];  
  for (let i = 0; i < arr.length; i++) {
    // Extract the current element
    const current = arr[i];
    // Get the remaining elements by filtering out the current index
    const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
    // Recursively get permutations of the remaining elements
    const remainingPermutations = getPermutations(remaining);
    // Combine the current element with each sub-permutation
    for (let j = 0; j < remainingPermutations.length; j++) {
      result.push([current, ...remainingPermutations[j]]);
    }
  }
  return result;
}


function isEqual(a,b){
   let equal=true;
    for(let j=0;j<a.length/2;j++){
	if(a[j]!=b[j])equal=false;
    }
    return equal;
}
 


function makePhaseTimes2(phases,addArray){
    
    //let array=[];
    //for(let i=0;i<addArray.length;i++)array.push(0);
    //for(let i=0;i<addArray.length;i++)array.push(addArray[i]);
    let array=addArray;

    
    let p=getPermutations(array)

    let ppp=[];
    for(let i=0;i<p.length;i++){
	let item=p[i];
	includes=false;
	for(let j=0;j<ppp.length;j++){
	    if(isEqual(ppp[j],item))includes=true;
	}
	if(!includes){
	    ppp.push(item);
	}
    }

    let laenge=0;
    let pppp=[];
    for(let i=0;i<ppp.length;i++){
	let item=ppp[i];
	let out=[];
	for(let j=0;j<item.length/2;j++){
	    out.push(item[j]);
	    laenge+=item[j];
	}
	pppp.push(out);
    }

    //add grundzeit
    for(let i=0;i<pppp.length;i++){
	line=pppp[i];
	for(let j=0;j<line.length;j++){
	    line[j]+=phases[j];
	}
    }
    
    console.log(laenge/60000);
    return pppp;
}


function makePhaseTimes(addArray){
//calc zero  and permutations
    let perms=getPermutations(addArray);
    let permutations=[];
    let zero=[]
    for(let i=0;i<perms[0].length;i++)zero.push(0);
    for(let i=perms.length-1;i>=0;i--)permutations[i+1]=perms[i];
    permutations[0]=zero;
    return permutations;
}

*/

// osc pattern output
//setup osc

let config= {
  type: 'udp4',         // @param {string} 'udp4' or 'udp6'
  open: {
    host: 'localhost',    // @param {string} Hostname of udp server to bind to
    port: 9001,          // @param {number} Port of udp server to bind to
    exclusive: false      // @param {boolean} Exclusive flag
  },
  send: {
    host: 'localhost',    // @param {string} Hostname of udp client for messaging
    port: 9000           // @param {number} Port of udp client for messaging
  }
}


const osc = new OSC({ plugin: new OSC.DatagramPlugin(config) })
osc.open() // bind udp socket to port 9001


// max/msp

let configMax= {
  type: 'udp4',         // @param {string} 'udp4' or 'udp6'
  open: {
    host: 'localhost',    // @param {string} Hostname of udp server to bind to
    port: 8000,          // @param {number} Port of udp server to bind to
    exclusive: false      // @param {boolean} Exclusive flag
  },
  send: {
    host: 'localhost',    // @param {string} Hostname of udp client for messaging
    port: 8001           // @param {number} Port of udp client for messaging
  }
}


const max = new OSC({ plugin: new OSC.DatagramPlugin(configMax) })
max.open() // bind udp socket to port 9001

// {"offset":40,"address":"/unstet/set/teiler","types":",iii","args":[3,5,8]}

max.on('/unstet/set/teiler', (message) => {
    console.log('recieved osc-message: '+JSON.stringify(message));
    let t=[];
    for(let i=0;i<args.length;i++)t.push(args[i]);
    teilerArray=t
});

max.on('/unstet/set/phasen', (message) => {
    console.log('recieved osc-message: '+JSON.stringify(message));
});

max.on('/unstet/set/zusatz', (message) => {
    console.log('recieved osc-message: '+JSON.stringify(message));
});

max.on('/unstet/set/oscout', (message) => {
    console.log('recieved osc-message: '+JSON.stringify(message));
});

max.on('/unstet/play/zyklus', (message) => {
    console.log('recieved osc-message: '+JSON.stringify(message));
    
});
max.on('/unstet/play/period', (message) => {
    console.log('recieved osc-message: '+JSON.stringify(message));
});

//setup unstet;

////////////////////////////////params/////////////////////////////////////////////////////
let teilerArray=[ 1, 2, 3, 5, 8, 13];
 
let phaseArray   = [ 8000, 13000, 21000, 34000 ];
//let addArray = [ 800,   1600,  2400,  4000 ];
let addonArray = [ 0, 0, 0, 0, 800,   1600,  2400,  4000 ];



//let phasesTimes=makePhaseTimes2(phases,addArray);


//console.log(phasesTimes);
/*
let period = new Period(teilerArray);

period.on('bang', (value) => {
    process.stdout.write('\u0007');
    osc.send(new OSC.Message('/bang',value ))
});

period.on('periodended', (value) => {
    max.send(new OSC.Message('/unstet/periodended'));
});

period.playPeriod([10000,10000]);
*/

/*
let zyklus = new Unstet.Zyklus(teilerArray,phasesTimes);

zyklus.on('bang', (value) => {
    process.stdout.write('\u0007');
    osc.send(new OSC.Message('/bang',value ))
});

zyklus.on('periodended', (value) => {
    max.send(new OSC.Message('/unstet/periodended'));
});

zyklus.play();
*/

let unstet = new Unstet.Unstet(teilerArray,phaseArray,addonArray);

unstet.on('bang', (value) => {
    process.stdout.write('\u0007');
    osc.send(new OSC.Message('/bang',value ))
});

unstet.on('periodended', (value) => {
    max.send(new OSC.Message('/unstet/periodended'));
});

unstet.play();



/*
let len=2*phasesTimes.length;
let count=0;

function zyklus(){
    let cycle=krebs(phasesTimes.length,count)
    let phaseTime=phasesTimes[cycle];
    let time=[];
    for(let i=0;i<phases.length;i++){
	time.push(phases[i]+phaseTime[i]);
    }
    console.log(count,cycle+"/"+len,time,phaseTime);
    let delay= playPeriod(time);
    setTimeout(zyklus,delay);
    count++;
}



function krebs(laenge,index){
    let ind=index%(2*laenge)
    if(ind<laenge){
	return ind
    }else{
	return 2*laenge-ind-1;
    }
}

*/
