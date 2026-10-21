#!/usr/bin/env node                                                                                    
//const Unstet = require('./unstet.js').Unstet;
const OSC = require('osc-js');
const { Vector } = require('simple-vector');


let autoplay=true;
//send
let outPort=9001;
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


function sendAed(source,aed){
    let msg = new OSC.Message('/aed/'+source);
    for(let i=0;i<out.length;i++)msg.add(out[i]);
    osc.send(msg, { host: host, port: outPort } );
}

function jumper(bangmessage){
    let args=bangmessage.args;
    let ch=Math.floor(args[4]*8)+1;
    let aed=[];
    aed[0]=mapper(args[1],0,1,0,360,true);
    aed[1]=mapper(args[2],0,1,0,90,true);
    aed[2]=mapper(args[3],0,1,0,3);
    sendAed(ch,ead);
}

function linear(periodmessage){
    

}

class PerlinNoise1D {
  constructor() {
    // 1. Permutationstabelle (Zufällige Anordnung der Zahlen 0-255)
    const p = Array.from({ length: 256 }, (_, i) => i).sort(() => Math.random() - 0.5);
    // Verdoppeln für sicheren Indexzugriff bei (x + 1)
    this.permutation = [...p, ...p];
  }
  // 2. Fade-Funktion (Glättungskurve nach Ken Perlin)
  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  // 3. Lineare Interpolation (Lerp)
  lerp(t, a, b) {
    return a + t * (b - a);
  }
  // 4. 1D Gradientenfunktion: Bestimmt das Skalarprodukt basierend auf dem Hash
  grad(hash, x) {
    // Wenn das erste Bit des Hashes 0 ist, ist der Vektor +1, sonst -1
    return (hash & 1) === 0 ? x : -x;
  }
  // Hauptfunktion für 1D Noise
  noise(x) {
    // Bestimme die linke Gitterecke (Integer-Wert)
    let X = Math.floor(x) & 255;
    // Relative Position innerhalb der Zelle (0.0 bis 1.0)
    let xf = x - Math.floor(x);
    // Glättungsfaktor berechnen
    let u = this.fade(xf);
    // Hash-Werte für die linke (X) und rechte (X + 1) Ecke holen
    const a = this.permutation[X];
    const b = this.permutation[X + 1];
    // Skalarprodukte für beide Ecken berechnen
    const gradLeft = this.grad(a, xf);       // Abstand zur linken Ecke ist xf
    const gradRight = this.grad(b, xf - 1);  // Abstand zur rechten Ecke ist xf - 1
    // Finale Interpolation zwischen den beiden Werten
    return this.lerp(u, gradLeft, gradRight);
  }
}

let perlin = new PerlinNoise1D();



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


class Source extends EventEmitter {
    constructor(channel,interval){
	super();
	this.channel = channel;
	this.pos = new Vector(0,0);
	this.vel = new Vector(0,0);
	this.rot = new Vector(0,0);
	this.dest= new Vector(0,0);
	this.interval = interval;
	this.timeout=null;
    }

    line(dest,time){
	//console.log('line');
	//let t = Math.ceil(time/this.interval);
	let t = time/this.interval
	this.dest=dest;
	//console.log('uhu',t,this.dest,this.pos)
	if(t>1){
	    this.vel = this.dest.clone().subtract(this.pos).divideScalar(t);
	}else{
	    this.vel = new Vector(0,0);
	}
	//console.log('gaga',this.vel);
	if(this.timeout){
	    clearTimeout(this.timeout);
	    this.timeout = null
	}
	this.timeout = setTimeout( ()=> {
	    this.timeout=null;
	    this.vel = new Vector(0,0);
	    this.rot= new Vector(0,0);
	    this.pos=this.dest;
	    this.out();
	    //this.emit('linend');
	},time);
    }

    spiral(dest,time){
	//console.log('spiral');
	//let t = Math.ceil(time/this.interval);
	let t = time/this.interval
	this.dest=dest;
	console.log('uhu',t,this.dest,this.pos)
	if(t>1){
	    //console.log('inspiral');
	    let p=this.pos.clone();
	    let pp=p.toPolar();
	    let pr=pp.r;
	    let pa=pp.theta;
	    let d=this.dest.clone();
	    let pd=d.toPolar()
	    let dr=pd.r;
	    let da=pd.theta;

	    let diffA = (da-pa)/t;
	    let diffD = (dr-pr)/t;
	    console.log(diffA,diffD);
	    this.rot = new Vector(diffA,diffD);
	    console.log('gaga',this.rot);
	}else{
	    this.rot = new Vector(0,0);
	}
	//console.log('gaga',this.vel);
	if(this.timeout){
	    clearTimeout(this.timeout);
	    this.timeout = null
	}
	this.timeout = setTimeout( ()=> {
	    this.timeout=null;
	    this.vel = new Vector(0,0);
	    this.pos=this.dest;
	    this.out();
	    //this.emit('linend');
	},time);
    }

    
    
    update(){
	if(this.vel.mag()>0.000000001){
	    this.pos.add(this.vel);
	    this.out()
	}else if(this.rot.mag()>0.0000001){
	    this.pos.rotateByDeg(this.rot.x);
	    let len=this.pos.mag();
	    if(len>0.000001){
		this.pos.resize(len+this.rot.y);
	    }
	    this.out()
	}
    }

    out(){
	//console.log(this.rot);
	this.emit('position',this.channel,this.pos);
    }
	
}


class Stage extends EventEmitter{
    constructor(num,interval){
	super();
	this.interval=interval;
	this.stage=[];
	for(let i=0;i<num;i++){
	    this.stage[i]= new Source(i+1,this.interval);
	    this.stage[i].on('position',(channel,pos) =>{
		this.emit('position',channel,pos);
	    });
	    this.stage[i].on('linend',() =>{
		this.emit('linend');
	    });
	}
	setInterval( () => {
	    //console.log('interval');
	    for(let i=0;i<this.stage.length;i++){
		this.stage[i].update();
	    }
	} ,this.interval);
	
    }

    line(channel,dest,time){
	this.stage[channel-1].line(dest,time);
    }
    spiral(channel,dest,time){
	this.stage[channel-1].spiral(dest,time);
    }
    
}




//https://gist.github.com/tedmiston/5935757
var net = require('net');

var connected=false;
var client = new net.Socket();
client.connect(1174, '127.0.0.1', function() {
    console.log('Connected');
    connected=true;
	//client.write('Hello, server! Love, Client.');
});

client.on('data', function(data) {
	console.log('Received: ' + data);
	//client.destroy(); // kill client after server's response
});

client.on('close', function() {
    console.log('Connection closed');
    connected=false;
});


const stage=new Stage(8,100);


stage.on('position',(channel,pos)=>{
    //console.log(pos);
    //console.log(ms);
    if(connected){
	// FUDI
	let ms='src '+channel+' pos '+pos.x+' '+pos.y+';';
	client.write(ms)
    }else{
	// OSC
	let p=pos.toPolar();
	let azimuth= p.theta*(180/Math.PI)
	let elevation = 0
	let radius = p.r

	let msg = new OSC.Message('/aed/'+channel);
	let out=[];
	out[0]=azimuth;
	out[1]=elevation;
	out[2]=radius;
	for(let i=0;i<out.length;i++)msg.add(out[i]);
	osc.send(msg, { host: host, port: outPort } );
    }
});

stage.on('linend', ()=>{ sendOSC('/linend')})


//utility sendosc( host, port, address, ...args )
osc.on('/rawbang', (message) => {
    //console.log(message);
});



let start = new Date().getTime()

//setInterval(movePerlin,stage.interval);

function movePerlin(){
    let now= new Date().getTime();
    let elapsed=(now-start)/50000;
    //console.log(elapsed);
    for(let i=0;i<8;i++){
	let x= 4*perlin.noise(elapsed+i*9.354)
        let y= 4*perlin.noise(elapsed+89.2345+i*11.2354)
//if(i==7)console.log(x,y);
	let v= new Vector(x,y);
	stage.line(i+1,v,stage.interval);
    }
}

let first=true;

osc.on('/period', (message) => {
    console.log('period');
    //sendOSC('/fader',stage.interval);
    let index=message.args[0];
    let time=message.args[2];
    for(let i=0;i<8;i++){
	let x=6*(Math.random()-0.5);
	let y=6*(Math.random()-0.5);
	//let z=0;
	let p= new Vector(x,y);
	console.log(index);
	if(first||index%2==0){
	    stage.line(i+1,p,time);
	}else{
	    stage.spiral(i+1,p,time);
	}
    }
    first=false;
});




osc.on('/line', (message)=>{
    //console.log(message);
    let args=message.args;
    let dest= new Vector(args[1],args[2]);
    stage.line(args[0],dest,args[4]);
});
