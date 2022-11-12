//main loop
#define POLL 1000 //1 sec
#define RESIZE 60 //add a minute for resize
#define MIN 10 //minimum # of datapoints for a prediction

#include <WiFi.h>
#include <cstdio> //for sprintf

void loop (int a){
  WiFiServer server(15); //port 15 currently not in use for anything
  int size = 180; //180sec == 3 minutes == bowl of ramen
  int* temps = new int[size]; //TODO: this should probably be float []
  int curr, secs, left; //current temp and how many secs it's been
  curr = secs = left = 0;
  char buf [80];
  server.begin();
  while (1==1) {
    secs++;
    curr = getcurtmp(); //pseudocode
    if (curr >= a) {
      server.write("Temp reached!"); //not pseudocode, but we need a better message than this
      break;
    } else if (secs <= MIN) {
      //do nothing, not enough data
    } else {
      if (secs == size) {
	size += RESIZE;
	int* resized = new int[size];
	memcpy(resized, temps, size * sizeof(int));
	delete [] temps;
	temps = resized;
      }
      temps[secs] = curr;
      left = secleft(temps, a, secs);
      sprintf(buf,"%d seconds left",left); //TODO: possible overflow issue
      //TODO: switch between minutes and seconds depending on how long we have left
      //TODO: idk if cstdio is available on arduino; if not, need a way to send this stuff
      server.write(buf); //not pseudocode, but we need a better message
    }
    delay(POLL);
  }
}

