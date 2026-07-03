# Unstet-faust

# unstet-faust

unstet-object is a sound only implementation of unstet. It is written in FAUST (https://faust.grame.org), so it can be used in many different environments (MacOS, Linux, Max, rnbo, PureData, csound ...)

Here it's done with 12 sound samples (11,12,13,21,22,23,31,32,33,41,42,43) and and 4 outputs (beamer1,beamer2,beamer3,beamer4). It can do any number of samples and outputs.

It can be controlled by OSC (or GUI). To play sound "31" on "beamer1" do:

```
$ oscsend localhost 5510 /unstet/beamer1/31 i 1   #button down
$ sleep 0.1
$ oscsend localhost 5510 /unstet/beamer1/31 i 0   #button up
```
See https://faustdoc.grame.fr/manual/osc/#discovering-osc-applications for details.
