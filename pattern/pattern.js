#!/usr/bin/env node



let t4=[
    [ 0000, 1000, 2000, 3000, 4000, 5000, 6000, 7000 ],                      // a   8 sekunden
    [ 8000, 9625, 11250, 12875, 14500, 16125, 17750, 19375 ],                // b  13
    [ 21000, 23625, 26250, 28875, 31500, 34125, 36750, 39375 ],              // c  21
    [ 42000, 46250, 50500, 54750, 59000, 63250, 67500, 71750 ],              // d  34
    [ 80250, 84500, 88750, 93000, 97250, 101500, 105750 ],                   // e  34
    [ 110000, 112625, 115250, 117875, 120500, 123125, 125750, 128375 ],      // f  21
    [ 131000, 132625, 134250, 135875, 137500, 139125, 140750, 142375 ],      // g  13
    [ 144000, 145000, 146000, 147000, 148000, 149000, 150000, 151000 ]       // h  8
];

//           a   b   c   d   e   f   g   h
let t4A = [ 000,000,000,000,000,000,000,000 ];

//           a   b   c   d   e   f   g   h
let t4B = [ 100,200,300,500,500,300,200,100 ];

//           a   b   c   d   e   f   g   h
let t4C = [ 200,300,500,800,800,500,300,200 ];

//           a   b   c    d    e   f   g   h
let t4D = [ 300,500,800,1300,1300,800,500,300 ];


function T(out,raster,add){
    let extra=0;
    for(let i=0;i<raster.length;i++){
	let phase=raster[i];

	for(let j=0;j<phase.length;j++){
	    let t=phase[j];
	    out.push(max+t+extra)
	    extra+=add[i];
	}
    }
    max=152000+max+extra;
}

let max = 0;
let T4 = [];
T(T4,t4,t4A);
T(T4,t4,t4B);
T(T4,t4,t4C);
T(T4,t4,t4D);
T(T4,t4,t4C);
T(T4,t4,t4B);
T(T4,t4,t4A);

//console.log(T4);

    
let t3= [
    [ 000, 1600, 3200, 4800, 6400 ],              // a
    [ 8000, 10600, 13200, 15800, 18400 ],         // b
    [ 21000, 25200, 29400, 33600, 37800 ],        // c
    [ 42000, 48800, 55600, 62400, 69200 ],        // d
    [ 82000, 89600, 96400, 103200 ],              // e
    [ 110000, 114200, 118400, 122600, 126800 ],   // f
    [ 131000, 133600, 136200, 138800, 141400 ],   // g
    [ 144000, 145600, 147200, 148800, 150400]    // h
];

//           a   b   c   d   e   f   g   h
let t3A = [ 000,000,000,000,000,000,000,000 ];
//           a   b   c   d   e   f   g   h
let t3B = [ 100,320,480,800,800,480,320,100 ];
//           a   b   c   d    e   f   g   h
let t3C = [ 320,500,500,1280,1280,500,500,320 ];
//           a   b   c    d    e   f   g   h
let t3D = [ 300,500,800,1280,1280,800,500,300 ];

max = 0;
let T3 = [];
T(T3,t3,t3A);
T(T3,t3,t3B);
T(T3,t3,t3C);
T(T3,t3,t3D);
T(T3,t3,t3C);
T(T3,t3,t3B);
T(T3,t3,t3A);

//console.log(T3);



let t2 = [
    [ 000, 2666, 5333 ],         // a
    [ 8000, 12333, 16666 ] ,      // b
    [ 21000, 28000, 35000 ],     // c
    [ 42000, 53334, 64668 ],     // d
    [ 87332, 98664 ],            // e
    [ 110000, 117000, 124000 ],  // f
    [ 131000, 135333, 139666 ],  // g
    [ 144000, 146667, 149334]   // h
];

//           a   b   c   d   e   f   g   h
let t2A = [ 000,000,000,000,000,000,000,000 ];
//           a   b   c   d    e    f   g   h
let t2B = [ 267,533,800,1333,1334,800,534,268 ];
//           a   b   c   d    e   f   g   h
let t2C = [ 200,300,500,2133,2134,500,300,200 ];
//           a   b   c    d    e   f   g   h
let t2D = [ 300,500,800,3466,3467,800,500,300 ];

max = 0
let T2 = [];
T(T2,t2,t2A);
T(T2,t2,t2B);
T(T2,t2,t2C);
T(T2,t2,t2D);
T(T2,t2,t2C);
T(T2,t2,t2B);
T(T2,t2,t2A);

//console.log(T2);



let t1 = [
    [ 0000, 4000 ],            // a
    [ 8000, 14500 ],           // b
    [ 21000, 31500 ],          // c
    [ 42000, 59000 ],          // d
    [ 76000, 93000 ],          // e
    [ 110000, 120500 ],        // f
    [ 131000, 137500 ],        // g
    [ 144000, 148000 ]         // h
];


//           a   b   c   d   e   f   g   h
let t1A = [ 000,000,000,000,000,000,000,000 ];
//           a   b    c    d    e    f   g   h
let t1B = [ 400,800,1200,2000,2000,1200,800,400];
//           a   b   c   d    e    f   g   h
let t1C = [ 200,300,500,3200,3200,500,300,200];
//           a   b   c    d    e    f   g   h
let t1D = [  300,500,800,5200,5200,800,500,300];

max = 0;
let T1 = [];
T(T1,t1,t1A);
T(T1,t1,t1B);
T(T1,t1,t1C);
T(T1,t1,t1D);
T(T1,t1,t1C);
T(T1,t1,t1B);
T(T1,t1,t1A);

console.log(max/60000);

//console.log(T1);

let old=0;
let multi=[];
let delay=0;

for(let tick=0;tick<max;tick++){
    let res=[];
    if(T1.includes(tick))res.push(1);
    if(T2.includes(tick))res.push(2);
    if(T3.includes(tick))res.push(3);
    if(T4.includes(tick))res.push(4);
    let len=res.length;
    if(len>0){
	let delta=tick-(old+delay);
	old=tick;
	delay=0;
	multi.push(delta);
	if(len>1){
	    for(let i=1;i<len;i++){
		multi.push(30);
		delay+=30;
	    }
	}
	
	//console.log(tick, res);
    }
    
}

console.log(multi)

let speed=4;
let index=0;
let maxindex=multi.length;


function play(){
    process.stdout.write('\u0007');
    if(index<maxindex){
	let len=multi[index++]/speed;
	if(len<1)len=1;
	setTimeout(play,len);
	if(index==maxindex)index=0;
    }
    
}

play();

/*
let diff=Object.entries(multi);
let count=diff.length;

for( ([key,value ]) in Object.entries(multi){

}
*/


/*
let tick=0;

setInterval(ticks,1);

function ticks(){
    let res=[];
    if(T1.includes(tick))res.push(1);
    if(T2.includes(tick))res.push(2);
    if(T3.includes(tick))res.push(3);
    if(T4.includes(tick))res.push(4);
    if(res.length>0)console.log(tick, res);
    tick++;
    if(tick>max)tick=0;
}


*/
