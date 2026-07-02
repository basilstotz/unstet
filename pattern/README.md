# unstet class

```
#!/usr/bin/env node                                                                                    
const Unstet = require('./unstet.js');

let teiler = [ 1, 2, 3, 5, 8, 13];
let phase = [ 8000, 13000, 21000, 34000 ];
let addon = [ 0, 0, 0, 0, 800,   1600,  2400,  4000 ]; 

let unstet = new Unstet.Unstet( teiler, phase, addon );

unstet.on( 'bang', () => {
        //...do whatever you want
   });

unstet.play();
```
