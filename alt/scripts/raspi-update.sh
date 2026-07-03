#!/bin/sh
for i in $(seq 4); do
    host="pi@raspi${i}.unstet"
    echo $host
    ssh $host rm /home/pi/*.deb
    scp unstet_*_all.deb ${host}:.
    ssh $host sudo dpkg -i /home/pi/*.deb
    ssh $host sudo systemctl daemon-reload
    ssh $host sudo systemctl restart unstet-aemon.service
done
