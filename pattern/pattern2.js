#!/usr/bin/env node

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
 

class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener);
  }

  once(event, listener) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      listener(...args);
    };
    this.on(event, wrapper);
  }

  emit(event, ...args) {
    if (!this.events[event]) return;
    this.events[event].forEach(listener => listener(...args));
  }

  off(event, listener) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(l => l !== listener);
  }

  removeAllListeners(event) {
    if (this.events[event]) delete this.events[event];
  }
}





class Phase extends EventEmitter {
    //this.teilerArray=[];
    
    constructor(teilerArray){
	super();
	this.teilerArray = teilerArray;
        this.phasePrototype = this.makePhasePrototype(teilerArray);
    }

    setTeiler(teilerArray){
	this.teilerArray = teilerArray;	
	this.phasePrototype = this.makePhasePrototype(teilerArray);
    }

    getPhase(length){
	let bang={};
	let factor=length/10000.0;
	//XSconsole.log("lf ",length,factor)
	for (const [key, value] of Object.entries(this.phasePrototype)) {
	    let newtime=Math.round(key*factor);
	    //console.log(key,newtime,value);
	    bang[newtime]=value
	}
	return bang;
    }

    //private
    makePhasePrototype(teilerArray){
	let length=10000;
	let bang={};

	//this.teilerArray=teilerArry;
	
	//let maxTime=0;
	//for all teiler do
	for(let i=0;i<teilerArray.length;i++){
	    let teiler=teilerArray[i];
	    let delta=length/teiler;
	    let time=0;
	    for(let j=0;j<teiler;j++){
		let roundTime=Math.round(time);
		let b=bang[roundTime];
		if(b){
		    bang[roundTime]=b+1;
		}else{
		    bang[roundTime]=1
		}
		time+=delta;
	    }
	    //if(time>maxTime)maxTime=time;
	}
	//console.log(maxTime);
	return bang;
    }


}

class Period extends Phase {
    
    constructor(teilerArray){
	super(teilerArray);
	//this.phase= new Phase(teilerArray);
	//console.log(this.phase)
	//this.events= new EventEmitter();
	//this.gaga="gaga";
    }

    setTeiler(teilerArray){
	this.setTeiler(teilerArray);
    }

    playPeriod(timeArray){

	//console.log("ta ",timeArray);
	
        let phase=this.phase;
	let events=this.events;
	
	const makePeriod = (timeArray) => {
	    let bang={};
	    let current=0;

	    let b;
	    //calc forward
	    for(let i=0;i<timeArray.length;i++){
		let time=timeArray[i];
		//console.log("i time",i,time);
		
		//console.log("pha",pha);
		b=this.getPhase(time);
		//console.log("bang",b);
		//console.log(b);
		for (const [key, value] of Object.entries(b)) {
		    let t=Number(current)+Number(key);
		    bang[t]=Number(value);
		}
		current+=time;
	    }
	    //add krebs
	    for (const [key, value] of Object.entries(b)) {
		let k=Number(key);
		if(k!=0){
		    let t=2*current-k
		    bang[t]=Number(value);
		}
	    }
	    return bang;
	} //makePeriod

	const playBang = (bang) => {
	    
	    const arpDelay = 30;
	    const random = laenge => Math.floor(laenge*Math.random()) ;
	    
	    const beep = (value) => { this.emit('bang',value) };

	    const playArpeggio = (start, v, delay) => {
		let choosen=random(arpeggio.length);
		let arp = arpeggio[choosen];
		for(let i=0;i<arp.length;i++){
		    setTimeout(beep,start+arp[i]*delay,v)
		}
	    };
	    const playTuple = ( start, v) => { for(let i=0;i<v;i++){ setTimeout(beep,start,v) } };

	    for (const [key, value] of Object.entries(bang)) {
		//console.log(`${key} ${value}`);
		let k=Number(key);
		let v=Number(value);
		if(v==this.teilerArray.length){
		    playArpeggio(k, v, arpDelay);
		}else{
		    playTuple(k,v);
		}
	    }
	} //playBang

	let bang=makePeriod(timeArray);
	console.log(bang);
	playBang(bang);
	let sum=0;
	timeArray.forEach( (time) => { sum+=time });
	sum*=2;
	setTimeout(() => {this.emit('periodended')},sum);
	return sum;
    } //playPeriod



}

class Zyklus extends Period {

    constructor(teilerArray,zyklus){
	super(teilerArray);
	this.zyklus=zyklus;
	this.counter=0;
	this.playing=false;
	//console.log(this.phase)
    }

    setZyklus(zyklus){
	this.zyklus=zyklus;
    }

    play(){
	this.playing=true;
	this.cycle();
    }

    stop(){
	this.playing=false;
	this.counter=0;
    }

    pause(){
	this.playing=false;
    }

    //private
    krebs(laenge,index){
	let ind=index%(2*laenge)
	if(ind<laenge){
	    return ind
	}else{
	    return 2*laenge-ind-1;
	}
    }

    //private 
    cycle(){
	if(this.playing){
	    let index = this.krebs(this.zyklus.length,this.counter);
	    let time = this.playPeriod(this.zyklus[index]);
	    this.counter++;
	    setTimeout(this.cycle,time)
	}
    }
}




function makePhaseTimes2(phases,addArray){
    
    array=[];
    for(let i=0;i<addArray.length;i++)array.push(0);
    for(let i=0;i<addArray.length;i++)array.push(addArray[i]);

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
 
let phases   = [ 8000, 13000, 21000, 34000 ];
let addArray = [ 800,   1600,  2400,  4000 ];

let arpeggio = [
    [ 0, 1, 2, 3 ],   //kurz
    [ 0, 1, 2, 4 ],   //halb-kurz
    [ 0, 2, 3, 4 ],
    [ 0, 1, 3, 4 ],
    [ 0, 1, 2, 5 ],   //halb-lang
    [ 0, 2, 3, 5 ],
    [ 0, 2, 4, 5 ],
    [ 0, 3, 4, 5 ],
    [ 0, 1, 4, 5 ],
    [ 0, 1, 3, 5 ],
    [ 0, 2, 4, 6 ],  //lang
    [ 0, 1, 4, 6 ],
    [ 0, 1, 4, 6 ],  //ist gleich wie vorher ?
    [ 0, 2, 3, 6 ],
    [ 0, 1, 2, 6 ],
    [ 0, 4, 5, 6 ],
    [ 0, 1, 5, 6 ],
    [ 0, 1, 3, 6 ],
    [ 0, 3, 4, 6 ],
    [ 0, 3, 5, 6 ]
];

	
///////////////////////////////////////////////////////////////////////////////////////////






let phasesTimes=makePhaseTimes2(phases,addArray);


//console.log(phasesTimes);

let period = new Period(teilerArray);

period.on('bang', (value) => {
    process.stdout.write('\u0007');
    osc.send(new OSC.Message('/bang',value ))
});

period.on('periodended', (value) => {
    max.send(new OSC.Message('/unstet/periodended'));
});

period.playPeriod([5,5]);


/*
let zyklus = new Zyklus(teilerArray,phasesTimes);

zyklus.on('bang', (value) => {
    process.stdout.write('\u0007');
    osc.send(new OSC.Message('/bang',value ))
});

zyklus.on('periodended', (value) => {
    max.send(new OSC.Message('/unstet/periodended'));
});

zyklus.play();
*/

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
