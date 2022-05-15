#!/bin/sh
make
sudo dpkg -i unstet_*_all.deb
unstet-daemon
