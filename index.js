var rpio = require('rpio');
rpio.init({mapping: 'gpio'});
rpio.open(14, rpio.INPUT, rpio.PULL_DOWN);
var pressed = false;

function pollb(pin){
    var state = rpio.read(pin) ? 'pressed' : 'released';
    if (state == 'pressed' && pressed == false){
        console.log(Date());
        console.log('Button Event ' + state);
        console.log('');
        pressed = true;
    } else if(state == 'released' && pressed == true){
        console.log('Released');
        pressed = false;
    }
}

rpio.poll(14, pollb);
