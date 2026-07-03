import oscP5.*;
import netP5.*;

import java.net.InetAddress;
import java.net.UnknownHostException;

OscP5 oscP5;

NetAddress RemoteLocation[];

int port=9000;

String hosts[]={"raspi1.unstet", "raspi2.unstet", "raspi3.unstet", "raspi4.unstet"};
int map[]= {11,12,13,21,22,23,31,32,33,41,42,43};

int num;
int clip;
int raspiNum;

int bang=5;


void setup() {
  int k;
  size(400,400);
  frameRate(25);
  /* start oscP5, listening for incoming messages at port 12000 */
  oscP5 = new OscP5(this,9001);
   println("### ############################################################3.");
  
  /* myRemoteLocation is a NetAddress. a NetAddress takes 2 parameters,
   * an ip address and a port number. myRemoteLocation is used as parameter in
   * oscP5.send() when sending osc packets to another computer, device, 
   * application. usage see below. for testing purposes the listening port
   * and the port of the remote location address are the same, hence you will
   * send messages back to this sketch.
   */

    

     
     //RemoteLocation[1] = new NetAddress("raspi2",port);
     //RemoteLocation[2] = new NetAddress("raspi3",port);
     //RemoteLocation[3] = new NetAddress("raspi4",port);

  
  /* osc plug service
   * osc messages with a specific address pattern can be automatically
   * forwarded to a specific method of an object. in this example 
   * a message with address pattern /test will be forwarded to a method
   * test(). below the method test takes 2 arguments - 2 ints. therefore each
   * message with address pattern /test and typetag ii will be forwarded to
   * the method test(int theA, int theB)
   */
   /*
  oscP5.plug(this,"test","/test");
  oscP5.plug(this,"uhu","/accelerometer");
  */
}
/*
public void uhu(float theA, float theB, float theC) {
  println("### plug event method. received a message /accel.");
  println(" 2 ints received: "+theA+", "+theB);  
}


public void test(int theA, int theB) {
  println("### plug event method. received a message /test.");
  println(" 2 ints received: "+theA+", "+theB);  
}
*/

void draw() {
  background(255);
  if(bang-- > 0){
      fill(255,0,0);
      //textSize(40);text("bang!",150,250);}
      rect(0,0,width,150);
  }
  num=floor(map(mouseX,0,width,0,12));
  raspiNum=floor(map(mouseY,150,height,0,4));
  if(raspiNum<0){raspiNum=0;};
  
  int b=150;
  
  fill(0);
  line(0,150,width,150);
   
  
  fill(0);
  clip=map[num];
  textSize(20);
  //text(hosts[raspiNum]+"-->"+clip,30,30);
  textSize(80);
  text(raspiNum+1+" : "+clip,100,100);
}


void mousePressed() {
  
  bang=5;
  /* createan osc message with address pattern /test */
  OscMessage myMessage = new OscMessage("/video");
  
  myMessage.add(clip); /* add an int to the osc message */
  //myMessage.add(456); /* add a second int to the osc message */

  println(hosts[raspiNum]);

  oscP5.send(myMessage, new NetAddress(hosts[raspiNum],port));

}


/* incoming osc message are forwarded to the oscEvent method. */
void oscEvent(OscMessage theOscMessage) {
  /* with theOscMessage.isPlugged() you check if the osc message has already been
   * forwarded to a plugged method. if theOscMessage.isPlugged()==true, it has already 
   * been forwared to another method in your sketch. theOscMessage.isPlugged() can 
   * be used for double posting but is not required.
  */  
  if(theOscMessage.isPlugged()==false) {
  /* print the address pattern and the typetag of the received OscMessage */
  println("### received an osc message.");
  println("### addrpattern\t"+theOscMessage.addrPattern());
  println("### typetag\t"+theOscMessage.typetag());
  }
}
