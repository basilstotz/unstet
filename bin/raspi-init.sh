#!/bin/sh
if test -d /usr/share/doc/unstet/autostart/; then
   mkdir -p $HOME/.config/autostart
   cp /usr/share/doc/unstet/raspi-autostart/* $HOME.config/autostart/
fi
if test -f /etc/xdg/lxsession/LXDE-pi/autostart; then
    sed -e "s/\(@xscreensaver.*$\)/#\1/g" -i /etc/xdg/lxsession/LXDE-pi/autostart
fi
