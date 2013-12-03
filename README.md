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


If you hook up some voltage into one of the analog inputs of the Arduino after loading this software, you can open the Serial Monitor in the Arduino software, and you should see some numbers reporting to the window every at every interval (1 second by default).  Specifically, you're seeing the voltages being measured on each of the 6 analog inputs at each interval, then the number '65535' indicating that the update is complete.  Congrats!  Data is making its way onto your computer.

### Setting Up Your Web Server

The node part of nodeuinoSensorArray is a very simple web server meant to take that data you put into your serial port on the last step, and push it up to a post on the Internet.  This is a free alternative to buying an Arduino ethernet shield, but the tradeoff is that we have to set up some free software first:

1.  Install [node.js](http://nodejs.org/).  This is a system for making web servers (and other cool stuff) using simple JavaScript code.  It's great for beginners, since there's lots of open source projects you can grab and use, and it's great for scientists, because it's free :)
2.  Install [npm](https://npmjs.org/).  npm stands for Node Package Manager, and it is a simple tool for grabbing and installing some of the open source software you'll need in your node projects.

Once node and npm are installed, we can use npm to grab some of the code that is going to run behind the scenes on our server, that make working with node so easy.  In whatever directory you want to work in, do the following commands:

    npm install serialport
    npm install connect

This installs the library that lets node talk to the USB connection to the Arduino, and which will help post a page summarizing the results afterwards.  If that goes without any complaints, open nodeSerial.js and look for the line that looks like

    serialName = '/dev/tty.usbmodem1411',

You'll have to change the value between the single quotes to whatever you set the Tools/Serial Port option to in the Arduino software.  Once that's done, just do

    node nodeSerial.js
    
And your web server should be live and online!  Open a web browser and go to

    localhost:8000/?callback=testFunction
    
And you should see the voltages being read by your Arduino's analog inputs, packed in a JSONP object - if you're not familiar with JSONP, it's just a convenient standard for passing information around between websites.  Voila!  You are successfully posting real measurements to the Internet, from where you can use that information to build any sort of monitoring system you like.

#### Options

The node web server has a few things that you can tweak if you like:

-The channel names can be customized to reflect whatever you've plugged into each of your analog inputs.  Look for the lines that look like:

        channelName = [ "'Apollo'",
                        "'Bacchus'",
                        "'Cerberus'",
                        "'Daedalus'",
                        "'Echo'",
                        "'Fury'"
                        ]

and change the names within the single quotes to anything you want.

-The port number that your data is broadcasting on can be modified at will too.  Just look for the line

    server.listen(8000);
    
and change the 8000 to whatever you want.


## Visualization Page
Is what index.html will eventually become!  Right now, it just packs stuff from the JSON post into an ever-lengthening array.


## Future Improvements

nodeuinoSensorArray is a living project!  In the nearish future, I intend to add server-side data logging so you can keep track of your measurements, and some basic visalization of your data in the browser.  Ideas on integrating and calibrating various sensors are also on the menu, but in principle any sensor whose output goes to the Arduino analog inputs should be compatible.
