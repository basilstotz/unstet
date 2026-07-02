////////////////////////////////params/////////////////////////////////////////////////////
//let teilerArray=[ 1, 2, 3, 5, 8, 13];
 
//let phases   = [ 8000, 13000, 21000, 34000 ];
//let addArray = [ 800,   1600,  2400,  4000 ];

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


function krebs(laenge,index){
    let ind=index%(2*laenge)
    if(ind<laenge){
	return ind
    }else{
	return 2*laenge-ind-1;
    }
}

function permutations(arr) {
  // Base case: if array has 0 or 1 elements, return it wrapped in an array
  if (arr.length <= 1) return [arr];
  
  const result = [];  
  for (let i = 0; i < arr.length; i++) {
    // Extract the current element
    const current = arr[i];
    // Get the remaining elements by filtering out the current index
    const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
    // Recursively get permutations of the remaining elements
    const remainingPermutations = permutations(remaining);
    // Combine the current element with each sub-permutation
    for (let j = 0; j < remainingPermutations.length; j++) {
      result.push([current, ...remainingPermutations[j]]);
    }
  }
  return result;
}

function reducedPermutations(array,outLength){


    const isEqual = ( a, b, len ) => {
	let equal=true;
	for(let j=0;j<len;j++){
            if(a[j]!=b[j])equal=false;
	}
	return equal;
    };

    let p=permutations(array);
    
    if(outLength<array.length){
	//filter out duplacates
	let pp=[];
	for(let i=0;i<p.length;i++){
	    let item=p[i];
	    includes=false;
	    for(let j=0;j<pp.length;j++){
		if(isEqual(pp[j],item,outLength)){
		    includes=true;
		    break
		}
	    }
	    if(!includes){
		pp.push(item);
	    }
	}
	//reduce to len
	//let laenge=0;
	let ppp=[];
	for(let i=0;i<pp.length;i++){
	    let item=pp[i];
	    let out=[];
	    for(let j=0;j<outLength;j++){
		out.push(item[j]);
		//laenge+=item[j];
	    }
	    ppp.push(out);
	}
	return ppp
    }else{
	return p
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

	    //calc forward
	    for(let i=0;i<timeArray.length;i++){
		let time=timeArray[i];
		//console.log("i time",i,time);
		
		//console.log("pha",pha);
		let b=this.getPhase(time);
		//console.log("bang",b);
		//console.log(b);
		for (const [key, value] of Object.entries(b)) {
		    let t=Number(current)+Number(key);
		    bang[t]=Number(value);
		}
		current+=time;
	    }
	    //add krebs
	    for (const [key, value] of Object.entries(bang)) {
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
    cycle(){
	if(this.playing){
	    let index = krebs(this.zyklus.length,this.counter);
	    let time = this.playPeriod(this.zyklus[index]);
	    this.counter++;
	    setTimeout(this.cycle,time)
	}
    }
}

class Unstet extends Zyklus {

    constructor(teilerArray,phaseArray,addonArray){
	super(teilerArray,[]);
	let zyklus = this.calcZyklus(phaseArray,addonArray);
	this.setZyklus(zyklus);
    }

    makeZyklus(phaseArray,addonArray){
	let zyklus=calcZylus(phaseArray,addonArray)
	this.setZyklus(zyklus);
    }
    
    //private
    calcZyklus(phaseArray,addonArray){

	const isZero = (a) => {
	    let z=false;
	    for(let i=0;i<a.length;i++){ if(a[i]==0){ z=true;break}}
	    return z
	}

	const isNotZero = (a) => {
	    let n=true;
	    for(let i=0;i<a.length;i++){ if(a[i]==0){ n=false;break}}
	    return n;
	}
	    
	
	let zyklus=reducedPermutations(addonArray,phaseArray.length);
	// maybe add a zero-vector at beginn
	if(isNotZero(addonArray) && isNotZero(zyklus[0])){
	    let zero=[];
	    for(let i=0;i<zyklus[0].length;i++)zero.push(0);
	    for(let i=zyklus.length-1;i>=0;i--)zyklus[i+1]=zyklus[i];
	    zyklus[0]=zero;
	}   
	//add grundzeit
	for(let i=0;i<zyklus.length;i++){
	    let line=zyklus[i];
	    for(let j=0;j<line.length;j++){
		line[j]+=phaseArray[j]
	    }
	}
	return zyklus
    }
}

exports.Phase = Phase;
exports.Period = Period;
exports.Zyklus = Zyklus;
exports.Unstet = Unstet;
