var rpio = require('rpio');
var kadfe = require('kadfe-client');
var button_pin = 4;
var led_pin = 17;
rpio.init({mapping: 'gpio'});
rpio.open(button_pin, rpio.INPUT, rpio.PULL_DOWN);
rpio.open(led_pin, rpio.OUTPUT, rpio.HIGH);
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
        console.log('Button is Pressed \n');
    } else if(state == 'released' && pressed == true && available == false){
        pressed = false;
        console.log('Button is Released');
        console.log('Coffee has been made: Pressed - ' + pressed + ' Available - ' + available + '\n')
        rpio.write(led_pin, rpio.HIGH);
        kadfe.makeCoffee();
    } else if (state == 'pressed' && pressed == false && available == true){
        pressed = true;
    } else if (state == 'released' && pressed == true && available == true){
        kadfe.clearCoffee();
        console.log('Coffee has been taken: Pressed - ' + pressed + ' Available - ' + available + '\n')
        rpio.write(led_pin, rpio.LOW);
        pressed = false;
    }
}

rpio.poll(button_pin, pollb);
