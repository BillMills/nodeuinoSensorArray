nodeuinoSensorArray
===================

Welcome!  nodeuinoSensorArray is an open source project assembling some simple, minimal software tools for getting analog voltages out of a circuit and onto your computer using Arduino, and from there onto the Internet using node.js.  Our many thanks to all the open-source Arduino and node examples across the wide web which were 'borrowed' for this project; as always, nodeuinoSensorArray is MIT licensed, for one and all.

As of yet, no actual sensor-relevant software is included here; so far, we just have the bones of going from voltage to serial port to Internet.  Tools for dealing with sensors will be made available here under the same license as I finish them - or patch in things you find anywhere!  nodeuinoSensorArray will work with anything that sends its output back to Ardunio's analog input.

### What You'll Need

nodeuinoSensorArray was developed with an [Arduino Uno](http://arduino.cc/); other than that, all that's required is a breadboard to build a circuit on, and whatever components you want to measure voltages across!  

The dirt cheapest thing we can start with is a [voltage divider](http://en.wikipedia.org/wiki/Voltage_divider), which requires any two resistors and three wires.  Just connect the two resistors in series (ie. end to end, like a daisy chain), then connect one wire from the 5V supply of the Arduino to the start of the resistor chain, and connect the Ardunio's ground to the other end of the chain.  Finally, use the third wire to go from between the two resistors to any of the 6 analog inputs on the Arduino.

### Programming the Arduino

The file simpleReader.ino included with this git repository is the code that will live on your Arduino.  To set it up, make sure you've successfully tried at least one example from the [Arduino Getting Started Page](http://arduino.cc/en/Guide/HomePage), and then follow these 3 steps:

1.  Plug your Arduino into the USB port on your computer.
2.  Open the Arduino software, and make sure the Tools/Board menu is set to Arduino Uno, and Tools/Serial Port is set to something like /dev/tty.usbmodem.somethingwhatever
3.  Open the simpleReader.ino file, and hit the Upload button.  Everthing should load up and your hardware is good to go!


#### Options
The Arduino program has just one thing for you to change, if you'd like.  Look down at the very bottom of the file, for the line that says 
    
    delay(1000);
    
That '1000' is how many milliseconds the Arduino is going to wait between each time it records information from the hardware.  The default is one second, but change it to whatever is appropriate for your project!


If you hook up some voltage into one of the analog inputs of the Arduino after loading this software, you can open the Serial Monitor in the Arduino software, and you should see some numbers reporting to the window every at every interval (1 second by default).  Specifically, you're seeing the voltages being measured on each of the 6 analog inputs at each interval, then the number '65535' indicating that the update is compl

Note, the number '65535' will appear once every update; this is a terminating line telling us that the update is complete.
