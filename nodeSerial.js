//pull in the packages we need.  first time ever, do: npm install serialport
var http = require('http'),
    url = require('url'),
    childProcess = require('child_process'),
    serialport = require("serialport"),
    serialPort = require("serialport").SerialPort,
    connect = require('connect'),
    fs = require('fs'),
    //the name of the serial port you chose in the arduino menu /Tools/Serial Port OR on rpi wherever the Arduino entry in ls -lsh /dev/serial/by-id/ points
    serialName = '/dev/ttyACM0',
    //some variables for later
    fxnCall, server, data = [], index=0, i, output, queryData, buffer = [null, null, null],
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
    //good data comes as three chunks, "start0" "2.34" "end0" for channel 0; validate this pattern and pass good data along
    serial.on( "data", function( chunk ) {
        if(chunk.slice(0,5) == 'begin')
            buffer[0] = chunk;
        else if( chunk.slice(0,3) == 'end'){
            buffer[2] = chunk;
            validate();
        }
        else 
            buffer[1] = chunk;

        function validate(){
            var index, i; 

            if(buffer[0] && buffer[2] && parseInt(buffer[0][buffer[0].length-2], 10) != parseInt(buffer[2][buffer[2].length-2], 10)){
                //start and end flags don't match, abort
                console.log('Flag mismatch');
                buffer[0] = null;
                buffer[1] = null;
                buffer[2] = null;
                return;
            } else if( isNaN(parseFloat(buffer[1])) || parseFloat(buffer[1]) < 0 || parseFloat(buffer[1] > 5) ){
                //nonsense number in data position, abort
                console.log('Garbage data')
                buffer[0] = null;
                buffer[1] = null;
                buffer[2] = null;
                return;                
            } else{
                index = parseInt(buffer[0][buffer[0].length-2], 10);
                data[index] = parseFloat(buffer[1]);
                //update logs
                fs.appendFile('analog'+index+'.txt', new Date() + ', ' + data[index] + '\n');
                
                //generate JSON
                output = '({';
                for(i=0; i<6; i++){
                    output += channelName[i] + ':' + data[i];
                    if(i!=5)
                        output += ',';
                }
                output +='})';

                //dump the buffer
                buffer[0] = null;
                buffer[1] = null;
                buffer[2] = null;
                return;
            }
        }

        /*
        //65535 marks the end of an update; when we get there, build the output string from the stuff we stuck in [data]
        if(parseInt(chunk,10) != 65535){
            data[index] = parseFloat(chunk);  //hold the new piece of data in the array
            //update logs
            fs.appendFile('analog'+index+'.txt', new Date() + ', ' + data[index] + '\n');

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
        */
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
