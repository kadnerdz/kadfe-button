var rpio = require('rpio');
var kadfe = require('kadfe-client');
rpio.init({mapping: 'gpio'});
rpio.open(14, rpio.INPUT, rpio.PULL_DOWN);
var pressed = false;
var available = false;

var ws;
kadfe.openSocket()
    .then((socket) => {
        ws = socket.on('message', (message) => {
            if (message === 'available'){
                console.log('Available')
                available = true;    
            } 
            if (message === 'unavailable'){
                available = false;     
                console.log('Unavailable')
            }
        })
    }).catch((error) => {
        console.log(`websocket attempt failed: ${error}`)
    });


function pollb(pin){
    var state = rpio.read(pin) ? 'pressed' : 'released';
    if (state == 'pressed' && pressed == false && available == false){
        pressed = true;
    } else if(state == 'released' && pressed == true && available == false){
        pressed = false;
        console.log('Coffee has been made')
        kadfe.makeCoffee();
    } else if (state == 'pressed' && pressed == false && available == true){
        pressed = true;
    } else if (state == 'released' && pressed == true && available == true){
        kadfe.clearCoffee();
        console.log('Coffee has been taken')
        pressed = false;
    }
}

rpio.poll(14, pollb);
