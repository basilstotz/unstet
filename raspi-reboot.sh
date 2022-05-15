#!/bin/sh
for i in $(seq 4); do
    host="pi@raspi${i}.unstet"
    echo $host
    ssh $host sudo reboot
done
