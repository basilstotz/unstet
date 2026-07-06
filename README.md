# Unstet

## Outline
```
                                                    +------------+
                                                   /|  client 1  |
                                                  / +------------+
+------------------+         +-----------------+ /
|                  |         |                 |/   +------------+
|    algorithm     | ------->|     daemon      |----|  client 2  |
|                  |         |                 |\   +------------+
+------------------+         +-----------------+ \       ...
                                                  \ +------------+
                                                   \|  client n  |
                                                    +------------+
```
### Algorithm
the Unstet algorithm is a javascript reimplementation of the un-stet algorithm (,written in max/msp by Markus Buser). The algorithm just creates events or bangs, it knows nothing about representation on the screen. The bangs are sent as OSC-messages to `osc://localhost:9000`.  

#### Puredata/Max Integration

<img width="571" height="447" alt="grafik" src="https://github.com/user-attachments/assets/5953c6f4-539a-4d25-a025-b55f637bbb63" />

for details see https://github.com/basilstotz/unstet/tree/main/algorithm/integrations/puredata

### Presenter

#### Daemon
* The daemon listens for http-connections at `http://daemon-host:3000` (daemon-host is the machine the daemon runs on) .
* The demon listens for OSC-messages at `osc://localhost:9000` . On reception of an event it radomly chooses one of the connected clients and the choosen client will randomly select a video to display.


#### Clients
The clients are just any number web-browsers(-tabs) displaying http://daemon-host:3000 . The clients can be dynamically added or removed at any time.

It works on any device/operatingsystem capable running chromium (namely Android-TV, Google-TV ...) and here is no unstet specific installation on the client. 

You also might want to setup things like autologin and autostart for the webbrowser (in fullscreen mode and the correct url).

## Usage

### Installation
The algorithm and the daemon can be installed on any device/operationgsystem capable running nodejs (namely Android, Linux, Windows, macOS). 

First nstall the dpendencies: nodejs, npm (optional), git (optional)

Hint: **macOS:** install [homebrew](https://brew.sh/) and then do `brew install nodejs npm git` 
**| Android:** install [dorynode](https://play.google.com/store/apps/details?id=io.tempage.dorynode) (easy) or [termux](https://play.google.com/store/search?q=termux&c=apps) (complete)
**| Debian:** do`sudo apt install nodejs npm git`.

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




