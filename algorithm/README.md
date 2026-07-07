
<img width="998" height="826" alt="grafik" src="https://github.com/user-attachments/assets/973f5fa1-d248-4609-868f-15bf433b1ba9" />


<img width="1313" height="969" alt="grafik" src="https://github.com/user-attachments/assets/d280169c-47b6-4663-b455-65cacd98e84b" />


# Unstet Algorithm

[Der un-stet Algorithus](https://github.com/user-attachments/files/29644423/3-un-stet_zeitlauf_corr.pdf)


# Unstet Class

Basic setup:
```javascript
#!/usr/bin/env node                                                                                    
const Unstet = require('./unstet.js').Unstet;

// setup unstet
let teiler = [ 1, 2, 3, 5, 8, 13];
let phase = [ 8000, 13000, 21000, 34000 ];
let addon = [ 0, 0, 0, 0, 800,   1600,  2400,  4000 ]; 
let unstet = new Unstet( teiler, phase, addon );

//add event listener
unstet.on( 'bang', () => {
        //...do whatever you want
   });

unstet.play();
```
This is a fully functional version with OSC-output:

```javascript
#!/usr/bin/env node                                                                                    
const Unstet = require('./unstet.js').Unstet;
const OSC = require('osc-js');

// setup osc
const osc = new OSC({ plugin: new OSC.DatagramPlugin() });

//setup unstet
let teiler = [ 1, 2, 3, 5, 8, 13];
let phase = [ 8000, 13000, 21000, 34000 ];
let addon = [ 0, 0, 0, 0, 800,   1600,  2400,  4000 ]; 
let unstet = new Unstet( teiler, phase, addon );

// add event listener
unstet.on( 'bang', () => {
        osc.send(new OSC.Message('/bang'))
});

// and go ...
unstet.play();
``
