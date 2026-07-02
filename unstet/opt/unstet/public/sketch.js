let b=[];
let v=[];
let vready=[];
let m=[];

let w,h;
let ds=0;

var fader=0;;

var intro=false;

let disp=0;
let playing=false;
let modes=3;                   // 0: show last frame
                              // 1: show first frame
                              // 2: show black 
                              // 3: fader
let fframes=15;

let config={ buttons: false };
let assets={};

//let div;

let gmessage="no osc message yet";



let bildRatio=1280.0/720.0 //brete zu höhe 
let bildBreite;
let bildHoehe;
let bildLeft;
let bildTop;

let socketio=true;


function preload(){
    //config=loadJSON('config.json');
    assets=loadJSON('assets/assets.json');
}


function set_mode(num){
    if(config.buttons){
       let t;
       switch(num){
       case 0: t='last';
	   break;
       case 1: t='first';
	   break;
       case 2: t='black';
	   break;
       case 3: t='fade';
	   break;
       }
       m[num]=createButton(t); 
       m[num].position(100,10+num*30);
       m[num].mousePressed(function(){
	   modes=num;
	   if(modes==1)v[disp].time(0.0);
	   if(modes==0)v[disp].time(v[disp].duration());
       });
    }
}


function button(num){
    if(config.buttons){
        b[num]=createButton(assets.videos[num]+""); 
        b[num].position(10,10+num*30);
	b[num].mousePressed(function(){showVideo(num)});
    }
}


function setupVideo(video){
    console.log("setupvideo",video);
}

function calcBild(x,y){
    let f=bildRatio;
    bildBreite = Math.min(x,y*f);
    bildHoehe = Math.min(y,x/f);
    bildLeft=(w-bildBreite)/2.0;
    bildTop=(h-bildHoehe)/2.0;
}

function setup() {

    //div=createDiv('messages are dipslyd here');
    //div.position(20,400);
    
    w=windowWidth;
    h=windowHeight;
    createCanvas(w,h);
     calcBild(w,h);
    background(0);

    console.log(bildLeft,bildTop,bildBreite,bildHoehe);
/*
    case 0: t='das letze Frame';
	break;
    case 1: t='das erste Frame';
	break;
    case 2: t='schwarz';
	break;
    case 3: t='ausblenden';
*/

/*
    let sf=createP("Ende");
    sf.position(100,100);
    let select= createSelect();
    select.position(200,100);
    select.option('letztes Frame');
    select.option('erstes Frame');
    select.option('schwarz');
    select.option('weiss');

    select.selected('schwarz')

    let select2= createSelect();
    select2.position(200,200);
    select2.option('nichts');
    select2.option('einblenden');
    select2.option('ausblenden');
    select2.option('beides');

    select2.selected('beides')
*/

    
    
    for (var i = 0; i < assets.videos.length; i++) {
	let file='assets/'+assets.videos[i] + '.' +assets.extension;
	console.log(file);
	/*
	v[i] = createVideo(file, (loaded) => {
	    loaded.hide();
	    loaded.volume(1);
	    loaded.onended(endedVideo);
	});
*/
        v[i] = createVideo(file);
	//vr[i]=false;
	v[i].hide();
	v[i].volume(1);
	v[i].onended(endedVideo);
	v[i].elt.oncanplaythrough = (e) => { console.log("trough ",e)};
	//if(i==0){v[i].autoplay(true);}else{v[i].autoplay(false);};
	if(config.buttons){button(i);}
    }


    for(var j=0;j<4;j++){
	set_mode(j);
    }

    
    if(socketio){
	socket = io();
    //socket = io.connect('http://192.168.1.112:3000');

/*                                                                              
Message {                                                                       
  offset: 36,                                                                   
  address: '/accelerometer',                                                    
  types: ',fff',                                                                
  args: [ -0.06041877344250679, -0.7016952633857727, 9.782157897949219 ]        
*/
  
	socket.on('osc',
	      // When we receive data
	      function(message) {
		  //console.log("websocket-message");
		  //div.html(JSON.stringify(message));
		  gmessage=JSON.stringify(message);
		  //if(config.buttons){console.log(message);}
		  if(frameCount>661){
		      //if(message.address=='/video'){
			  //console.log("Got: " + message.args[0]);
			  //showVideo(assets.videos.indexOf(message.args[0]));
			  //let leange=v.length;
			  //let choosen=Math.floor(leange*Math.random())
		      //showVideo(choosen);
		      bang();
		      //}
		  }
	      });
	
    }else{
	//setTimeout(banger,10000);
    }

}

/*
function windowResized() {
  const css = getComputedStyle(canvas.parentElement),
        marginWidth = round(float(css.marginLeft) + float(css.marginRight)),
        marginHeight = round(float(css.marginTop) + float(css.marginBottom)),
        w = windowWidth - marginWidth, h = windowHeight - marginHeight;

  resizeCanvas(w, h, true);
}
*/


function banger(){
    setInterval(bang,2000);
}

function bang(){
    let leange=v.length;
    let choosen=Math.floor(leange*Math.random())
    showVideo(choosen);
}

function windowResized() {
    w=windowWidth;
    h=windowHeight;
    resizeCanvas(w,h);
     calcBild(w,h);  
}

function endedVideo(){
    playing=false;
    fader=0;
    if(modes==1)v[disp].time(0.0);
}

function showVideo(num){
    v[disp].stop();
    disp=num;
    playing=true;
    fader=0;
    v[disp].play();
}


function draw() {


    image(v[disp],bildLeft,bildTop,bildBreite,bildHoehe); 
    //image(v[disp],0,0,w,h);
    //fill(128,128,128,128);
    if(!playing){
	if(modes==2){
	    fill(0);
	    rect(0,0,w,h);
	}
	if(modes==3){
	    fader++;   
	    fill(0,0,0,map(fader,0,fframes,0,255,true));
	    rect(0,0,w,h);
	}
        
    }else{
	if(modes==3){
            fader++;
	    fill(0,0,0,map(fader,0,20,255,0,true));
	    rect(0,0,w,h);
	}
    }
    
    fill(255,0,0);
    var t;
    switch(modes){
    case 0: t='das letze Frame';
	break;
    case 1: t='das erste Frame';
	break;
    case 2: t='schwarz';
	break;
    case 3: t='ausblenden';
	break;
    }
    if(config.buttons){
        textSize(20);
        text('Am Clipende wird '+t+' angezeigt',150,30);    
	text(gmessage,100,150);
    }
    
    textAlign(CENTER,CENTER);
    textSize(120)
    if(frameCount>0 && frameCount<600){
	fill(255,255,255,map(frameCount,0,600,0,255,true));
	text("un-stet",w/2,h/2);
    }else if(frameCount>=600 && frameCount<660){
	fill(255,255,255,map(frameCount,600,660,255,0,true));
	text("un-stet",w/2,h/2);
    }
    /*
	//fill(255);
	text("un-stet",w/2,h/2);
    }else{
	if(!intro){
	    intro=true;
	    bang();
	}
    }
   */
}

