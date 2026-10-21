#!/usr/bin/env node

"use strict"

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



class Mulberry32 {
    //seed between 0 and 4,294,967,295 (=2^32-1)
    constructor(seed) {
        this.seed = seed >>> 0;   // seed >>> 0 converts any number to uint32 (even NaN)
    }
    restart(seed){
        this.seed = seed >>> 0;
    }
    next() {
        let t = this.seed += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
}
//const mulberry = new Mulberry32(42);



class PerlinNoise1D {
    constructor(seed=42) {
	this.mulberry = new Mulberry32(seed);
    // 1. Permutationstabelle (Zufällige Anordnung der Zahlen 0-255)
	const p = Array.from({ length: 512 }, (_, i) => i).sort(() => this.mulberry.next() - 0.5);
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
    let X = Math.floor(x) & 511;
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

const PERLIN=3;
const SPIRAL=2;
const LINE=1;
const STOP=0;

class Source extends EventEmitter {
    constructor(channel,interval){
	super();
	this.channel = channel;
	this.pos = new Vector(0,0);
	this.lastPos = new Vector(0,0);
	this.vel = new Vector(0,0);
	this.rot = new Vector(0,0);
	//this.dest= new Vector(0,0);
	this.interval = interval;
	this.timeout=null;
	this.mode=STOP
	this.xoffset=0;
	this.yoffset=0;
    }

    perlinSet(per,offset,factor){
	this.perlinOBJ = per
	this.perlinOffset = offset;
	this.perlinFactor = factor/50000;
	//process.stdout.write(JSON.stringify(this.perlinOBJ,null,2));	
    }

    modeSet(newmode){
	if(this.mode==PERLIN)this.last = true;
	this.mode=newmode
    }

    random(){
	return Math.random()-0.5
    }

    setPos(x,y){
	if(this.mode==STOP)this.pos= new Vector(x,y)
    }
    
    interpolate(cartesian,absolute,dest,points){
	//console.log('inter');
	//ziel rechnen
	let neu;
	if(cartesian){
	    if(absolute){
		neu=dest.clone();
	    }else{
		let p=this.pos.clone();
		neu=p.add(dest);
	    }
	}else{
	    if(absolute){
		neu=dest.clone();
	    }else{
		let { r, theta } = this.pos.toPolar();
		let p= new Vector( theta,r);
		neu=dest.clone();
		neu.add(p);
	    }
	}
	// geschwindikeiten rechnen

	if(points>1.1){
	    let ganzneu=neu.clone();
	    if(cartesian){
		this.rot= new Vector(0,0);
		this.vel= ganzneu.subtract(this.pos).divideScalar(points);
		//console.log('velo',this.vel);
		this.modeSet(LINE);
		//this.vel = new Vector(0.1,0.1);
	    }else{
		this.vel= new Vector(0,0);
		let { theta,r } = this.pos.toPolar();
		let p= new Vector(theta,r)
		this.rot = ganzneu.subtract(p).divideScalar(points);
		this.modeSet(SPIRAL);
	    }
	}else{
	    this.rot= new Vector(0,0);
	    this.vel= new Vector(0,0);
	    this.modeSet(STOP)
	}
	    
	//endpunkt setzen 
	if(cartesian){
	    return neu
	}else{
	    let theta = neu.x
	    let r = neu.y
	    return new Vector.fromPolar(theta,r);
	}
	
    }

    move(cartesian,absolute,dest,time,terminate){
	//console.log('move',dest.x,dest.y ,time);

	let points = time/this.interval;
	let ziel = this.interpolate(cartesian,absolute,dest,points);
	
	if(terminate){
	    if(this.timeout){
		clearTimeout(this.timeout);
		this.timeout = null
	    }
	    this.timeout = setTimeout( ()=> {
		this.timeout=null;
		this.modeSet(STOP)
		this.vel = new Vector(0,0);
		this.rot= new Vector(0,0);
		this.pos=ziel;
		this.emit('pos', this.channel,this.pos  )
		//this.out();
		//this.emit('linend');
	    },time,ziel);
	}
    }

    walking(speed){
	if(this.isWalking){
	    let v=speed/1000;
	    let dest = new Vector(this.random(),this.random());
	    let weg = dest.distance(this.pos)
	    let dauer = weg/v;
	    console.log('walking',v,weg,dauer);
	    this.move(true,true,dest,dauer,false);
	    setTimeout(this.walking,dauer,speed);
	}
    }

    walker(speed,duration,terminate=true){
	this.isWalking=true;
	this.walking(speed);
	if(this.walkerTimeout){
	    clearTimeout(this.walkerTimeout);
	    this.walkerTimeout = null
	}
	if(terminate)this.walkerTimeout=setTimeout( ()=> {
	    this.isWalking=false;
	    this.modeSet(STOP)
	},duration)
    }
    
    //move(cartesian,absolute,dest,time){
    lineTo(dest,duration,terminate=true){
	//console.log('lineto',duration);
	let v;
	if(dest){
	    v=dest;
	}else{
	    v = new Vector(this.random(),this.random());
	}
	this.move(true,true,v,duration,terminate);
    }

    lineBy(dest,duration,terminate=true){
	let v;
	if(dest){
	    v=dest;
	}else{
	    v = new Vector(this.random(),this.random());
	}
	this.move(true,false,v,duration,terminate);
    }

    spiralTo(dest,duration,terminate=true){
	let v;
	if(dest){
	    v=dest;
	}else{
	    let m=this.pos.mag();
	    v = new Vector(360*this.random(),m);
	}
	this.move(false,true,v,duration,terminate);
    }

    spiralBy(dest,duration,terminate=true){
	let v;
	if(dest){
	    v=dest;
	}else{
	    v = new Vector(360*this.random(),0);
	}
	this.move(false,false,v,duration,terminate);
    }

	stop(){
	    this.modeSet(STOP)
	    if(this.timeout){
		clearTimeout(this.timeout);
		this.timeout = null
	    }
	    if(this.walkerTimeout){
		clearTimeout(this.walkerTimeout);
		this.walkerTimeout = null
	    }
	    this.isWalking=false;
	}
 
    perlin(duration, terminate=true){
	this.first=true;
	this.modeSet(PERLIN);
	if(terminate){
	    if(this.timeout){
		clearTimeout(this.timeout);
		this.timeout = null
	    }
	    this.timeout = setTimeout( ()=> {
		this.timeout=null;
		this.modeSet(STOP)

	    },duration);
	}
    }
    
    update(time){

	let result=null;
	let param=this.perlinFactor*time+this.perlinOffset;
	let seconds=time/5000;
	
	const perlinPos = () =>{
	    let xoffset = 0;
	    let yoffset = Math.PI;
	    let x = scale*this.perlinOBJ.noise(param+xoffset);
	    let y = scale*this.perlinOBJ.noise(param+yoffset);
	    return new Vector(x,y);
	}

	let scale = 1;
	if(this.mode==PERLIN){
	   
	    //here does it ......
	    if(this.first){
		this.startPos=this.pos.clone();
		this.startTime=seconds;
		this.first=false;
	    }

	    let ziel=perlinPos();
	    
	    let elapsed = seconds - this.startTime;
	    let factor = mapper(elapsed,0,0.5,0,1,true);
	    if(factor<1){
		let clone=this.startPos.clone();
		this.pos = clone.mix(ziel,factor);
	    }else{
		this.pos=ziel
	    }
	    result = this.pos;
	}else{

	    //perlin fadeout
	    if(this.last){
		//this.stopPos =this.pos.clone();
		this.stopTime= seconds;
		this.last=false;
	    }

	    //update pos
	    if(this.mode==LINE){
		this.pos.add(this.vel);
	    }else if(this.mode==SPIRAL){
		this.pos.rotateByDeg(this.rot.x);
		let len=this.pos.mag();
		if(len>0.000001){
		    this.pos.resize(len+this.rot.y);
		}
	    }

	    //live mix with perlin
	    let elapsed = seconds - this.stopTime;
	    let factor = mapper(elapsed,0,0.05,0,1,true);
	    if(factor<1){
		let outer = perlinPos().mix(this.pos,factor);
		//this.out(outer);
		result=outer;
	    }else{
		if(this.mode==LINE || this.mode==SPIRAL){
		    //this.out(this.pos);
		    result=this.pos;
		}
	    }
	}
	return result
    }
/*
    out(pos){
	if(!pos)pos=this.pos;
	

	//let d=this.lastPos.distance(pos);
	//console.log(d)
	if(true){
	    //this.lastPos=pos
	    this.emit('position',this.channel,pos);
	}
    }
*/
    
} // class source



class Stage extends EventEmitter{
    constructor(num,interval){
	super();
	this.interval=interval;
	this.stage=[];

	this.setScale(4);
	
	this.perlinOBJ = new PerlinNoise1D();

	this.start = new Date().getTime();

	//create sources
	for(let i=0;i<num;i++){
	    this.newSource();
	}

	
	setInterval( () => {
	    let out=[];
	    //console.log('interval');
	    for(let i=0;i<this.stage.length;i++){
		let res = this.stage[i].update(this.time());
		if(res)out.push( [ i+1,res.x,res.y] );
	    }
	    if(out.length>0)this.emitPos(out);
	} ,this.interval);
	
    }

    newSource(){
	let i=this.stage.length;
	let source = new Source(i+1,this.interval);
	source.perlinSet(this.perlinOBJ,i*12.23452345,0.3);
	source.on('pos',(channel,pos) =>{
	    this.emitPos( [[channel,pos.x,pos.y]] );
	});
	source.on('linend',() =>{
	    this.emit('linend');
	});
	this.stage.push(source);
	return i+1;
    }

    emitPos(positions){
	for(let i=0;i<positions.length;i++){
	    let item=positions[i];
	    item[1]*=this.scale;
	    item[2]*=this.scale;
	}
	this.emit('position',positions);
    }
    
    setPos(ch,x,y){
	this.stage[ch-1].setPos(x,y);
    }
    
    random(){
	return Math.random()-0.5
    }
    
    setScale(skala){
	this.scale=skala;
    }
    
    time(){
	return new Date().getTime() - this.start
    }

    stop(channel){
	if(channel==0){
	    for(let i=0;i<8;i++)this.stage[i].stop();
	}else{
	    this.stage[channel-1].stop();    
	}
    }

    walker(channel,speed,duration,terminate=true){
	if(channel==0){
	    for(let i=0;i<8;i++)this.stage[i].walk(speed,duration,terminate)
	}else{
	    this.stage[channel-1].walker(speed,duration,terminate);
	}
    }
	

    perlin(channel,duration,terminate=true){
	if(channel==0){
	    for(let i=0;i<8;i++)this.stage[i].perlin(duration,terminate)
	}else{
	    this.stage[channel-1].perlin(duration,terminate);
	}
    }
    
    lineTo(channel,dest,duration,terminate=true){
	//console.log('linetostage',duration);
	if(channel==0){
	    for(let i=0;i<8;i++)this.stage[i].lineTo(dest,duration,terminate);
	}else{
	    this.stage[channel-1].lineTo(dest,duration,terminate);   
	}
    }
    
    lineBy(channel,dest,duration,terminate=true){
	if(channel==0){
	    for(let i=0;i<8;i++)this.stage[i].lineBy(dest,duration,terminate);
	}else{
	    this.stage[channel-1].lineBy(dest,duration,terminate);    
	}
    }
        
    spiralTo(channel,dest,duration,terminate=true){
	if(channel==0){
	    for(let i=0;i<8;i++)this.stage[i].spiralTo(dest,duration,terminate);
	}else{
	    this.stage[channel-1].spiralTo(dest,duration,terminate);    
	}
    }
    
    spiralBy(channel,dest,duration,terminate=true){
	if(channel==0){
	    for(let i=0;i<8;i++)this.stage[i].spiralBy(dest,duration,terminate);
	}else{
	    this.stage[channel-1].spiralBy(dest,duration,terminate);    
	}
    }
    
} //class stage




//https://gist.github.com/tedmiston/5935757
var net = require('net');

var connected=false;
var client = new net.Socket();
client.connect(1174, '127.0.0.1', function() {
    console.log('Connected');
    connected=true;
	//client.write('Hello, server! Love, Client.');
});

client.on('close', function() {
    console.log('Connection closed');
    connected=false;
});


const stage=new Stage(8,200);


client.on('data', function(data) {
    //console.log('Received: ' + data);
    // "src 8 pos -0.407755 0.549489 0.000000;"
 
    let s=data.toString().split(" ");
    let m=s[0];
    if(m=="src"&&s[2]=="pos"){
	let ch=Number(s[1]);
	let x=Number(s[3]);
	let y=Number(s[4]);
	//console.log('Reaaaaceived: '+m+" " +ch+" "+x+" "+y);
	stage.setPos(ch,x/stage.scale,y/stage.scale);
    }
});



stage.on('position',(positions)=>{
    //console.log(pos);
    //console.log(ms);
    if(connected){
	if(positions.length>0){
	    let msg='';
	    for(let i=0;i<positions.length;i++){
		let pos=positions[i];
		//if(i>0)msg+=';';
		let fac=1000
		let x=Math.round(fac*pos[1])/fac;
		let y=Math.round(fac*pos[2])/fac;
		let m='src '+pos[0]+' pos '+x+' '+y+';';
		msg+=m;
	    }
	    //msg=msg+';';
	    console.log(msg);
	    client.write(msg)
	}
    }
});

//stage.on('linend', ()=>{ sendOSC('/linend')})

// /src/walk speed dauer terminate
osc.on('/src/*/walk', (message) => {
    let a=message.address.split('/');
    let channel=Number(a[2]);
    let speed = message.args[0]
    let dauer = message.args[1]
    let terminate;
    if(message.args[2]){
	terminate = message.args[2]
    }else{
	terminate=true;
    }
    console.log(channel,speed,dauer,terminate);
    stage.walker(channel,speed,dauer,terminate);
});

osc.on('/src/*/{lineto,lineby,spiralto,spiralby}', (message)=>{
    //console.log('line');
    let a=message.address.split('/');
    let channel=Number(a[2]);
    let func = a[3];
    let dest = null;
    let x = message.args[0]
    let y = message.args[1]
    let dauer = message.args[2];
    let terminate;
    if(message.args[3]){
	terminate = message.args[3]
    }else{
	terminate=true;
    }
    if( x!=-999 && y!=-999 )dest= new Vector(x,y);
    
    switch(func){
    case 'lineto':
	//console.log('linetoOSC',channel,dest,dauer,terminate);
	stage.lineTo(channel,dest,dauer,terminate);
	break;
    case 'lineby':
	stage.lineBy(channel,dest,dauer,terminate);
	break;
    case 'spiralto':
	stage.spiralTo(channel,dest,dauer,terminate);
	break;
    case 'spiralby':
	stage.spiralBy(channel,dest,dauer,terminate);
	break;
    }
});

osc.on('/src/*/perlin', (message)=>{
    //console.log('perlin',message);
    let a=message.address.split('/');
    let channel=Number(a[2]);
    let dauer; 
    let terminate=true
    if(message.args[0]){
	dauer= message.args[0];
    }else{
	dauer=0;
	terminate=false
    }
    if(message.args[1]){
	terminate = (message.args[1]>0)
    }
    //console.log("*");
    //console.log(channel,dauer,terminate);
    stage.perlin(channel,dauer,terminate);
});


osc.on('/src/*/stop', (message) => {
    let a=message.address.split('/');
    let channel=Number(a[2]);
    stage.stop(channel);    
});

osc.on('/src/*/pos', (message)=>{
    let a=message.address.split('/');
    let channel=a[2];
    let x = message.args[0];
    let y = message.args[1];
    //FUDI
    stage.setPos( channel, x/stage.scale, y/stage.scale )
    let msg = 'src '+channel+' pos '+x+' '+y+';';
    console.log(msg);
    client.write(msg);

    /* OSC
    let msg= new OSC.Message(message.address);
    msg.args=message.args;
    osc.send(msg,{ host: host, port: outPort });
    */
});
osc.on('/src/*/{rot|mute|vol|model}', (message)=>{
    //FUDI
    let a=message.address.split('/');
    let channel=a[2];
    let func=a[3];
    let val = message.args[0];
    let msg = 'src '+channel+' '+func+' '+val+';';
    console.log(msg);
    client.write(msg);
    /*
    let msg= new OSC.Message(message.address);
    msg.args=message.args;
    osc.send(msg,{ host: host, port: outPort });
    */
});

let msg="subscribe scene;";
console.log(msg);
client.write(msg);


//demo
let start=0;
let dauer=16000

function scene(dauer){
setTimeout( ()=> {stage.lineTo(0,null,dauer)} ,start);
start+=dauer;
setTimeout( ()=>{stage.perlin(0,dauer)}, start);
start+=dauer;
setTimeout (()=> {stage.spiralBy(0,null,dauer)},start);
start+=dauer;
setTimeout( ()=> {let n= new Vector(0,0);stage.lineTo(0,n,dauer)}, start);
start+=dauer;
}

//scene(8000)


