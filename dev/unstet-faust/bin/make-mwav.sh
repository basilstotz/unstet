#!/usr/bin/sh

LIST="11 12 13 21 22 23 31 32 33 41 42 43"


for F in $LIST; do
    ffmpeg -y -i $F.mp4 -vn  $F.mp3
    sox $F.mp3 $F.wav
    sox $F.wav m{$F}.wav remix 1
done




