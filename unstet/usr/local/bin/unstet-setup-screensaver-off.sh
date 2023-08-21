#!/bin/sh
if test -f /etc/xdg/lxsession/LXDE-pi/autostart; then
    sed -e "s/\(@xscreensaver.*$\)/#\1/g" -i /etc/xdg/lxsession/LXDE-pi/autostart
fi

