#include <LiquidCrystal.h>

#define POLL 1000 //1 sec

//KY-028 Temperature Sensor pin allocation
int digitalPin = 34;
int analogPin = 35;
float analogVal; //raw analog input from temp sensor

//LCD pins
LiquidCrystal lcd(19, 23, 18, 17, 16, 15);

//constants for Steinhart ohm to celcius conversion
int series_res = 80000;
int nominal_res = 100000;
int nominal_temp = 25;
int bcoefficient = 8000;

int secs; //how many secs it's been

void setup() {
  // put your setup code here, to run once:
  pinMode(2, OUTPUT); //onboard LED

  pinMode(digitalPin, INPUT); //Digital temp limit detection

  //LCD initialization
  lcd.begin(16, 2);
  lcd.print("Current Temp:");

  //Serial output
  Serial.begin(9600);

  //reset on-time
  secs = 0;
}

void loop() {
  // put your main code here, to run repeatedly:'
  //read raw analog value
  analogVal = analogRead(analogPin); 

  //Convert analog value to degrees Celcius
  float res = series_res / ((1023 / analogVal) - 1);
  float steinhartTemp = (1.0 / ((log(res / nominal_res) / bcoefficient) + 1.0 / (nominal_temp + 273.15))) - 273.15;
  
  //increment on-time
  secs++;

  //Serial output
  Serial.print(steinhartTemp);
  Serial.print(",");
  Serial.println(secs);

  // set the cursor to column 0, line 1
  // (note: line 1 is the second row, since counting begins with 0):
  lcd.setCursor(0, 1);
  // print the current temp in degrees Celcius
  lcd.print(steinhartTemp);

  //flash blue LED to show on state
  digitalWrite(2, HIGH);
  delay(POLL / 2);
  digitalWrite(2, LOW);
  delay(POLL / 2);
}
