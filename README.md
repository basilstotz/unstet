# Unstet

## System Outline
```
                                                    +------------+
                                                   /|  client 1  |
                                                  / +------------+
+------------------+         +-----------------+ /
|                  |   OSC   |                 |/   +------------+
|   unstet-algo    | ------->|  unstet-daemon  |----|  client 2  |
|                  |         |                 |\   +------------+
+------------------+         +-----------------+ \       ...
                                                  \ +------------+
                                                   \|  client n  |
                                                    +------------+
```
### Unstet-Algo
Unstet-algo is a reimplementation of the un-stet algorithm (,orginally written in max/msp by Markus Buser). It outputs bangs as OSC-messages to osc://localhost:9000 .

### Unstet-Daemon
Unstet-daemon is a webserver and a 'chatserver', which enables all participants to communicate with each other.
* It listens for OSC-messages at osc://localhost:9000
* It listens for http-connections at http://daemon-host:3000 (daemon-host is the machine the daemon runs on) .

### Clients
The clients are just any number web-browsers(-tabs) displaying http://daemon-host:3000 . The clients can be dynamically added or removed at any time.

It works on any device/operationgsystem capable running chromium (namely Android-TV, Google-TV ...) and here is no unstet specific installation on the client. 

You also might want to setup autologin and autostart for the webbrowser (in fullscreen mode and the correct url).

## Usage

### Installation
The system can be installed on any device/operationgsystem capable running nodejs (namely Android, Linux, Windows, macOS). 

Install the dpendencies
* nodejs
* npm (optional)
* git (optional)

(Hint: for macOS: install [homebrew](https://brew.sh/) and then do `brew install nodejs npm git` or for Android: install [dorynode](https://play.google.com/store/apps/details?id=io.tempage.dorynode) or for Debian do `sudo apt install nodejs npm git`)

Then install unstet (Note: All following snippets can be used unaltered on macOS, Android and Linux!)
```bash 
git clone https://github.com/basilstotz/unstet
```
### Run

Go to the newly installed unstet folder and start unstet-algo with

```bash
cd unstet
node unstet-algo/unstet-algo.js &
```
then start unstet-deamon with:
```bash
cd unstet
node unstet-daemon/unstet-daemon.js &
```
In production it could be usefull to create the file `unstet`:
```bash
#!/bin/sh
cd /path/to/unstet/
node unstet-algo/unstet-algo.js &
node unstet-daemon/unstet-daemon.js
```
and then do
```
cp unstet ~/bin/
chmod +x ~/bin/unstet
```
now you cat start all together just with
```bash
unstet
```

### Update
To update the package from Github.com do
```bash
cd unstet
git pull origin
```

## Client Specific Hints
### Rasperry PI 

To hide the mouse pointer install *unclutter*:
```
sudo apt install unclutter
```
then remove the screensave from systemwide lxsession-autostart: `/etc/xdg/lxsession/LXDE-pi/autostart`:
```
@lxpanel --profile LXDE-pi
@pcmanfm --desktop --profile LXDE-pi
#@xscreensaver -no-splash                                       #<------ add a leading #
@xset s noblanc
@xset s off
@xset s -dpms
```

You also might want to increase the GPU-memory to 256 Mb in case the videos are laging. See 
https://www.elektronik-kompendium.de/sites/raspberry-pi/2002121.htm for details

No sound on HDMI? As simple as right click on the speaker and change it to hdmi. 




