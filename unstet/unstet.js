////////////////////////////////params/////////////////////////////////////////////////////
//let teilerArray=[ 1, 2, 3, 5, 8, 13];
 
//let phases   = [ 8000, 13000, 21000, 34000 ];
//let addArray = [ 800,   1600,  2400,  4000 ];

const STOP = 0;
const PAUSE = 1;
const PLAY = 2;

const ORNAMENT = 0;
const SIMPLE = 1;
const ARPEGGIO = 2;

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
	console.log("setTeiler ",teilerArray);	
	this.teilerArray = teilerArray;	
	this.phasePrototype = this.makePhasePrototype(teilerArray);
    }

    getPhase(length){
	let bang={};
	let factor=length/10000.0;
	//console.log("lf ",length,factor)
	for (const [key, value] of Object.entries(this.phasePrototype)) {
	    let newtime=Math.round(Number(key)*factor);
	    //let newvalue=value;
	    //for(let i=2;i<7;i++)newvalue[i]=Math.random();
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
	
	//for all teiler do
	for(let i=0;i<teilerArray.length;i++){
	    let teiler=teilerArray[i];
	    let delta=length/teiler;
	    let time=0;
	    for(let j=0;j<teiler;j++){
		let roundTime=Math.round(time);
		let b=bang[Number(roundTime)];
		if(b){
		    b[0]=b[0]+1;
		}else{
		    bang[roundTime]=[];
		    bang[roundTime].push(1);
		    bang[roundTime].push(teilerArray.length);
		}
		time+=delta;
	    }
	}
	//console.log(bang)
	return bang;
	
    }


}


class Period extends Phase {
    
    constructor(teilerArray){
	super(teilerArray);
	this.playSpeed = 1.0;
	this.bang = {};
	this.periodTime=0; //??????????????
    }


    getPeriodTime(timeArray){
	let dur = 0;
	for(let i=0;i<timeArray.length;i++)dur+=timeArray[i];

	return 2*dur
    }
    
    makePeriod(timeArray){
	
	const calcPeriod = (timeArray) => {
	    let bang={};
	    let current=0;

	    //calc forward
	    for(let i=0;i<timeArray.length;i++){
		let time=timeArray[i];
		//console.log("i time",i,time);
		
		let b=this.getPhase(time);
		for (const [key, value] of Object.entries(b)) {
		    let t=current+Number(key);
		    bang[t]=value;
		}
		current+=time;
	    }
	    //contains the last (unplyaed) item!!!
	    return bang;
	} //makePeriod

///////////////////////////////////////////////////////////////////////////////////////////////

	const ornamentBang = (bang) => {

	    let current = 0;

	    const addRandom = (value ) => {
		for(let i=3;i<9;i++){
		    value[i]=Math.random();
		}
	    }
	    
	    const makeArpeggio = (start, value) => {

		const arpDelay = 30;

		const random = laenge => Math.floor(laenge*Math.random()) ;
		let choosen=random(arpeggio.length);
		let arp = arpeggio[choosen];

		value[2] = ARPEGGIO;
		addRandom(value);
		
		// start with one (not zero)
		for(let i=1;i<arp.length;i++){
		    let time=start+arp[i]*arpDelay;
		    bang[time]=[];
		    bang[time][0] = 0;
		    bang[time][1] = 0;
		    bang[time][2] = ORNAMENT;
		    addRandom(bang[time]);
		}
	    };

	    const makeTuple = ( start, value) => {

		let length = value[0];
		value[2] = SIMPLE;
		addRandom(value);
		// start with one (not zero)
		for(let i=1;i<length;i++){
		    let time=start+i;
		    bang[time] = [];
		    bang[time][0] = 0;
		    bang[time][1] = 0;
		    bang[time][2] = ORNAMENT;
		    addRandom(bang[time]);
		}
	    };

	    const bangArray = Object.entries(bang);
		
	    // all, but the last!!
	    for(let i=0;i<bangArray.length-1;i++){
		    
		const [ key,value ] = bangArray[i];
		if(value[0]==value[1]){
		    makeArpeggio(Number(key), value);
		}else{
		    makeTuple(Number(key),value);
		}
	    }
	    const [ key,value ] = bangArray[bangArray.length-2];

	    //return time of last bang
	    return Number(key);
	}// ornamentBang


	this.periodTime=this.getPeriodTime(timeArray);

	
	this.bang=calcPeriod(timeArray);
	ornamentBang(this.bang);
	//console.log(bang);
	//let fullTime=playBang(this.bang);
	
	return this.bang

    }// makePeriod;

    emitPeriod(bang){

	const emitBang = (value) => {
	    switch(value[2]){
	    case SIMPLE:
		this.emit('simple');
		break;
	    case ARPEGGIO:
		this.emit('arpeggio');
		break;
	    case ORNAMENT:
		this.emit('ornament');
		break;
	    }	
	    this.emit('bang');
	    let sub=[];
	    for(let i=2;i<value.length;i++)sub.push(value[i]);
	    this.emit('rawbang',sub);
	}	    
	

	//console.log(bang);
	//console.log(ornament);
	//console.log(bang);	    
	const bangArray = Object.entries(bang);

	//forward
	// all, but the last!!
	for(let i=0;i<bangArray.length-1;i++){
	    const [ key,value ] = bangArray[i];
	    setTimeout(emitBang,Number(key),value);
	}
	// krebs
	for(let i=0;i<bangArray.length-1;i++){
	    const [ key,value ] = bangArray[i];
	    let time = 2*this.periodTime-Number(key)
	    setTimeout(emitBang,time,value);
	}
	setTimeout(() => {this.emit('periodend')},this.periodTime);
	
	return this.periodTime
    }
    
}// class period


class Zyklus extends Period {

    constructor(teilerArray,zyklus){
	super(teilerArray);
	
	this.zyklus=zyklus;
	this.bangArray=[];
	this.counter=0;
	
	this.playCommand = STOP;
	this.playing=false;
	//console.log(this.phase)
    }

    setZyklus(zyklus){
	this.zyklus=zyklus;
	this.bangArray=[];
	this.counter=0;
    }

    play(){
	console.log("method: play")
	this.playCommand = PLAY;
	if(!this.playing){
	    console.log("status: play");
	    this.playing=true;
	    this.emit('playstart');
	    this.cycle(this);
	}
    }

    stop(){
	console.log("method: stop")
	this.playCommand = STOP;
    }

    pause(){
	console.log("method: pause")	
	this.playCommand = PAUSE;
    }


    //private 
    cycle(that){
	if(that.playCommand == PLAY){
	    let index = krebs(that.zyklus.length,that.counter);
	    let period = that.zyklus[index];
	    let playTime = that.getPeriodTime(period);
	    
	    if(!that.bangArray[index]){
		//console.log("info: makePeriod");
		that.bangArray[index]=that.makePeriod(period);
	    }
	    that.emitPeriod(that.bangArray[index]);

	    console.log(that.counter,playTime,period);

	    if( that.counter>0 && that.counter%(2*that.zyklus.length)==0 ){
		that.counter=0;
		that.bangArray=[];
		that.emit('zyklusend')
	    }

	    that.counter++;
	    
	    //recursive call!!!!
	    setTimeout(that.cycle,playTime,that)
	}else{
	    console.log("status: stop");
	    if(that.playCommand == STOP){
		that.playing = false;
		that.counter = 0;
	    }else{ //PAUSE
	    console.log("status: pause");
		that.playing = false;
	    }
	    that.emit('playend');
	}
    }
}

class Unstet extends Zyklus {

    constructor(teilerArray,phaseArray,addonArray){
	super(teilerArray,[]);
	this.setZyklus(phaseArray,addonArray);
    }

    setZyklus(phaseArray,addonArray){
	this.phaseArray = phaseArray;
	this.addonArray = addonArray;
	this.zyklus = this.calcZyklus(this.phaseArray,this.addonArray)
    }

    setPeriode(phaseArray){
	console.log("setPeriode ",phaseArray);
	this.phaseArray = phaseArray;
	this.zyklus = this.calcZyklus(this.phaseArray,this.addonArray)
    }
    
    setVariation(addonArray){
	console.log("setVariation ",addonArray);
	this.addonArray = addonArray;
	this.zyklus = this.calcZyklus(this.phaseArray,this.addonArray)
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
	/*
	if(isNotZero(addonArray) && isNotZero(zyklus[0])){
	    let zero=[];
	    for(let i=0;i<zyklus[0].length;i++)zero.push(0);
	    for(let i=zyklus.length-1;i>=0;i--)zyklus[i+1]=zyklus[i];
	    zyklus[0]=zero;
	} 
        */  
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


/////////////////////////////////////////////////////////////////////////////////////////7
	/*
	const emitBang = ( value ) => {

	    const arpDelay = 30;
	    
	    const beep = (value) => { this.emit('bang',value) };

	    const emitArpeggio = (start, value, delay) => {

		const random = laenge => Math.floor(laenge*Math.random()) ;
		let choosen=random(arpeggio.length);
		let arp = arpeggio[choosen];

		this.emit('arpeggio');
		for(let i=0;i<arp.length;i++){
		    setTimeout(beep,start+arp[i]*delay,value)
		}
	    };

	    const emitTuple = ( start, value) => {
		this.emit('simple');
		for(let i=0;i<value;i++){ setTimeout(beep,start,value) }
	    };

	    this.emit('rawbang',value );

	    if(value[0]==value[1]){
		emitArpeggio(0, value[0], arpDelay);
	    }else{
		emitTuple(0,value[0]);
	    }
	};
	
	const playBang = (bang) => {
	    
	    const bangArray = Object.entries(bang);

	    // all, but the last!!
	    for(let i=0;i<bangArray.length-1;i++){
		const [ key,value ] = bangArray[i];

		let k=Math.round(Number(key)*this.playSpeed);
		let v=value;

		setTimeout(emitBang,k,v);
	    }
	    //handle the last
	    const [ key,value ] = bangArray[bangArray.length-1];
	    return Math.round(key*this.playSpeed); // =full time

	} //playBang
	
	
    } //emitPeriod

}
*/
