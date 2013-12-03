//pull in the packages we need.  first time ever, do: npm install serialport
var http = require('http'),
    url = require('url'),
    childProcess = require('child_process'),
    serialport = require("serialport"),
    serialPort = require("serialport").SerialPort,
    connect = require('connect'),
    //the name of the serial port you chose in the arduino menu /Tools/Serial Port
    serialName = '/dev/tty.usbmodem1411',
    //some variables for later
    fxnCall, server, data = [], index=0, i, output, queryData,
    // Create new serialport object, set the baudrate to 9600 for arduino, and define the parser to make sure it knows what a new line is:
    serial = new serialPort(serialName , { baudrate : 9600, parser: serialport.parsers.readline("\n") }),
    //give names to the 6 analog in ports here, in order:
    channelName = [ "'Apollo'",
                    "'Bacchus'",
                    "'Cerberus'",
                    "'Daedalus'",
                    "'Echo'",
                    "'Fury'"
                    ]


//wait for the serial connection to open, then start building the output string:
serial.on("open", function () {
    //whenever we get some data, write it at the command prompt:
    serial.on( "data", function( chunk ) {
        //65535 marks the end of an update; when we get there, build the output string from the stuff we stuck in [data]
        if(parseInt(chunk,10) != 65535){
            data[index] = parseFloat(chunk);  //hold the new piece of data in the array
            index++;                          //step ahead to the next array index
        } else{
            output = '({';                    //build a JSON outpt
            for(i=0; i<data.length; i++){
                output += channelName[i] + ':' + data[i];
                if(i!=data.length-1)
                    output += ',';
            }
            output+='})';                     //JSON complete
            index=0;                          //reset index and data for the next pass
            data = [];
        }
        
    });

    //let us know if something breaks:
    serial.on( "error", function( msg ) {
        output = msg;
    });
});

//start a webserver to post the result to the internet:
server = http.createServer(function (request, response) {
    queryData = url.parse(request.url, true).query;                 //extract the value of 'callback' from the query string

    fxnCall = childProcess.exec('', function(){
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.end(queryData['callback']+output);                 //post the callback name and output to the browser
    });
});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8000);

//post index.html at 8080
connect.createServer(
    connect.static(__dirname)
).listen(8080);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8000/");
