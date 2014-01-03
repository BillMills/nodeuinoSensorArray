/*
  ReadAnalogVoltage
  Reads an analog input on pins 0-5, converts it to voltage, and prints the result to the serial monitor.
 
 This example code is in the public domain.
 */

// the setup routine runs once when you press reset:
void setup() {
  // initialize serial communication at 9600 bits per second:
  Serial.begin(9600);
}

// the loop routine runs over and over again forever:
void loop() {
  // read the input on analog pin 0:
  int sensorValue0 = analogRead(A0);
  int sensorValue1 = analogRead(A1);
  int sensorValue2 = analogRead(A2);
  int sensorValue3 = analogRead(A3);
  int sensorValue4 = analogRead(A4);
  int sensorValue5 = analogRead(A5);
  // Convert the analog reading (which goes from 0 - 1023) to a voltage (0 - 5V):
  float voltage0 = sensorValue0 / 1023.0 * 5.0;
  float voltage1 = sensorValue1 / 1023.0 * 5.0;
  float voltage2 = sensorValue2 / 1023.0 * 5.0;
  float voltage3 = sensorValue3 / 1023.0 * 5.0;
  float voltage4 = sensorValue4 / 1023.0 * 5.0;
  float voltage5 = sensorValue5 / 1023.0 * 5.0;
  
  unsigned int terminate = 0xFFFF;
  // print out the values:
  Serial.println(voltage0);
  Serial.println(voltage1);
  Serial.println(voltage2);
  Serial.println(voltage3);
  Serial.println(voltage4);
  Serial.println(voltage5);
  Serial.println(terminate);
  //sample every n milliseconds:
  delay(1000);
}
