#include <WiFi.h>
#include <LiquidCrystal.h>
#include <cstdio>

#define POLL 1000 //1 sec
#define RESIZE 60 //add a minute for resize
#define MIN 10 //minimum # of datapoints for a prediction

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

int size = 180; //180sec == 3 minutes == bowl of ramen
float* temps = new float[size]; //TODO: this should probably be float []
int secs; //how many secs it's been

void connectToWifi(const char *ssid, const char *password) {
    Serial.println("Scanning...");
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.println("Connecting to WiFi..");
    }
    Serial.println("Connected to Wifi Network");
}

// //this works, do not touch unless it's to change types
// //array, approachval, size of array
// int secleft (int t[], int a, int s) {
//   //these all have to be floats so I can do proper linreg on them
//   float sumx, sumy, sumxy, sumxsq, sumysq, bz, bo;
//   sumx = sumy = sumxy = sumxsq = sumysq = bz = bo = 0.0;
//   //I can't check for unintialized values (because UB), so s needs to be how many seconds have passed (i.e, how many polls we have)
//   for (int i = 0; i < s; i++) {
//     sumx += t[i];
//     sumy += i+1;
//     sumxy += t[i]*(i+1);
//     sumxsq += t[i]*t[i];
//     sumysq += (i+1)*(i+1);
//   }
//   bz = ((sumy*sumxsq) - (sumx*sumxy)) / ((s*(sumxsq)) - (sumx*sumx));
//   bo = ((s*sumxy)-(sumx*sumy)) / ((s*sumxsq) - (sumx*sumx));
//   return int((bz + (a*bo)) - float(s)); //gotta subtract number of seconds that have passed
//   //wrapped for arduino's pleasure
//   //maybe we don't need the explicit type conversion, but I'm gonna use it anyway
// }

void setup() {
  // put your setup code here, to run once:
  pinMode(2, OUTPUT); //onboard LED

  pinMode(digitalPin, INPUT); //Digital temp limit detection

  //LCD initialization
  lcd.begin(16, 2);
  lcd.print("Current Temp:");

  //Serial output
  Serial.begin(9600);

  //WiFi connection
  connectToWifi("BLAZEFIRE 5399", "7(4q579K");
  WiFiServer server(15); //port 15 currently not in use for anything
  server.begin();

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
//   if (secs <= MIN) {
//   //do nothing, not enough data
//   temps[secs] = steinhartTemp
// } else {
//   if (secs == size) {
//     size += RESIZE;
//     float* resized = new float[size];
//     memcpy(resized, temps, size * sizeof(float));
//     delete[] temps;
//     temps = resized;
//   }
//   temps[secs] = curr;
//   //left = secleft(temps, a, secs);
// }

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
