# Unstet

**Unstet** is a video player based on node, express and p5js (https://p5js.org) running in a web browser. It is controlled by OSC-messages (Open Sound Control https://ccrma.stanford.edu/groups/osc/index.html) sent by a Max/MSP-patch (https://cycling74.com/products/max) or any other OSC-Client.

It's designed for a RaspberryPi, but it work's on any Debian based system.

It listens for OSC-message on **upd port 9000** at the OSC-address **/video**, it exspects one integer parameter which selects the desired video to play. The messages are then passed, unsing websockets, to the p5js-sketch.

## Prepare Raspi
### Switch Off Screensaver and Hide Mouse

Install *unclutter*:
```
sudo apt install unclutter
```

then edit `/etc/xdg/lxsession/LXDE-pi/autostart`:
```
@lxpanel --profile LXDE-pi
@pcmanfm --desktop --profile LXDE-pi
#@xscreensaver -no-splash                                       #<------ add a leading #
@xset s noblanc
@xset s off
@xset s -dpms
@unclutter                                                      #<------ add this line
```
You also might want to increase the GPU-memory to 256 Mb in case the videos are laging. See 
https://www.elektronik-kompendium.de/sites/raspberry-pi/2002121.htm for details

No sound on HDMI? As simple as right click on the speaker and change it to hdmi. 


## Build and Install
Download this repository and install the build dependenies

```bash
sudo apt install git 
git clone https://github.com/basilstotz/unstet
```

then you can build the package

```bash
cd unstet
make
```
Now install the the runtime dependencies and the package
```bash
sudo apt install nodejs chromium-browser
sudo dpkg -i unstet_xxxxxxxxxx_all.deb
```

## Update

```
cd unstet
git pull origin
make
sudo dpkg -i unstet_xxxxxxxxx_all.deb
```

## Run

The package consist of two parts. 

### unstet-daemon

The **unstet-daemon** will be start automatically at boot. It provides all the funtionality 
- to receive OSC-message from the MaxMSP-patch over upd on port 9000
- to host the client software and the videos.
- to bridge/send the OSC-messages to the client software

### unstet-player

The second part is the **unstet-player**. it (dis-)plays the videos requested by the OSC-client. The Player can be started manually with the apps menu or with

```
unstet-player
```
in the terminal. It's possible to start the player automatically at login

```bash
cp /usr/share/applications/unstet-player.desktop ~/.config/autostart/.
```
In order to make all automatic you might add an autologin to your RaspberryPi.


## Run on MacOS

### Install Dependencies

#### Git

https://sourceforge.net/projects/git-osx-installer/files/

#### Nodejs

https://nodejs.org/en/download/

### Download Unstet

```bash
git clone https://github.com/basilstotz/unstet
```
### Run Unstet-Daemon

```bash
cd unstet/unstet/opt/unstet
node server.js
```

### Run Unstet-Player

```bash
chromium --app=http://localhost:3000 --autoplay-policy=no-user-gesture-required --start-fullscreen
```

### Update

```bash
cd unstet
git pull origin
```


